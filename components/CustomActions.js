import { TouchableOpacity, Text, View, StyleSheet, Alert } from "react-native";
import { useActionSheet } from '@expo/react-native-action-sheet';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';


const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {
    const actionSheet = useActionSheet();

// Creates unique reference string for images so user is able to upload multiple images
const generateReference = (uri) => {
    const timeStamp = (new Date()).getTime();
    const imageName = uri.split("/")[uri.split("/").length - 1];
    // Creates the unique image reference
    return `${userID}-${timeStamp}-${imageName}`;
}

const uploadAndSendImage = async (imageURI) => {
    const uniqueRefString = generateReference(imageURI);
     // Picks file to upload
     const newUploadRef = ref(storage, uniqueRefString);
     const response = await fetch(imageURI);
     const blob = await response.blob();
    // Uploads blob of file you want
    uploadBytes(newUploadRef, blob).then(async(snapshot) => {
    console.log('File has been uploaded');
    const imageURL = await getDownloadURL(snapshot.ref)
    onSend({ image: imageURL})
});
}

// Converts image into a blob
const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissions?.granted) {
        let result = await ImagePicker.launchImageLibraryAsync();
        if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
        else Alert.alert("Permission denied!")            
        }
    }

    const takePhoto = async () => {
        let permissions = await ImagePicker.requestCameraPermissionsAsync();
        if (permissions?.granted) {
            let result = await ImagePicker.launchCameraAsync();
            if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
            else Alert.alert("Permission to take photo not granted")
        }
    }

    const getLocation = async () => {
        let permissions = await Location.requestForegroundPermissionsAsync();
        if (permissions?.granted) {
            const location = await Location.getCurrentPositionAsync({});
            if (location) {
                onSend({
                    location: {
                        longitude: location.coords.longitude,
                        latitude: location.coords.latitude,
                    },
                });
            } else {
                Alert.alert("Error occurred while fetching location");
            }
        } else {
            Alert.alert("Permissions haven't been granted");
        }
    }
    
        const onActionPress = () => {
            // Option in the action sheet
            const options = ['Choose from Library', 'Take Picture', 'Send Location', 'Cancel'];
            const cancelButtonIndex = options.length - 1;
            actionSheet.showActionSheetWithOptions(
                {
                    options,
                    cancelButtonIndex,
                },
                async (buttonIndex) => {
                    switch (buttonIndex) {
                        case 0:
                        pickImage();
                        return;
                    case 1:
                        takePhoto();
                        return;
                    case 2:
                        getLocation();
                        default:
                    }
                },
            );
        };




    return (
        <TouchableOpacity 
        style={StyleSheet.container}
        onPress={onActionPress}>
            <View style={[styles.wrapper, wrapperStyle]}>
                <Text style={[styles.iconText, iconTextStyle]}>+</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 24,
        height: 24,
        marginLeft: 12,
        marginBottom: 12,
    },
    wrapper: {
        borderRadius: 16,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 10,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
});

export default CustomActions;