import { useState } from "react";
import { ImageBackground, StyleSheet, View, Text, Button, TextInput } from "react-native";
import backgroundImage from '../assets/Background_Image.png';

const Screen1 = ({ navigation }) => {
    const [name, setName] = useState('');

    return (
        <View style={styles.container}>
            <ImageBackground source={backgroundImage} style={styles.background}>
            <Text>Hello Screen1!</Text>
            <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Enter your username"
            />
            <Button
                title="Go to Screen 2"
                onPress={() => navigation.navigate('Screen2', { name: name })}
            />
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 2
    },
    textInput: {
        width: '88%',
        padding: 15,
        borderWidth: 1,
        marginTop: 15,
        marginBottom: 15,
        backgroundColor: '#f9f9f9'
    },
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    }
});

export default Screen1;