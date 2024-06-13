import { useState } from "react";
import { ImageBackground, StyleSheet, View, Text, Button, TextInput, TouchableOpacity } from "react-native";
import backgroundImage from '../assets/Background_Image.png';

const Screen1 = ({ navigation }) => {
    const [name, setName] = useState('');
    const [backgroundColor, setBackgroundColor] = useState('');
    const colors = ['#128c7e', '#25d366', '#dcf8c6', '#ece5dd'];

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
            <Text>Choose Background color</Text>
            <View style={styles.colorOptions}>
                {colors.map((color, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.colorButton, { backgroundColor: color }]}
                        onPress={() => setBackgroundColor(color)}
                        />
                ))}
            </View>
            <TouchableOpacity 
                style={styles.button}
                title="Go to Screen 2"
                onPress={() => navigation.navigate('Screen2', { name, backgroundColor })}
            >
                <Text style={styles.buttonText}>Go to Chat</Text>
            </TouchableOpacity>
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
    },
    button: {
        backgroundColor: '#128c7e',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    buttonText: {
        color: '#ffffff'
    },
    colorButton: {
        width: 48,
        height: 48,
        borderRadius: 32,
        marginBottom: 24,
        marginTop: 8,
        marginHorizontal: 8
    },
    colorOptions: {
        flexDirection: 'row'
    }
});

export default Screen1;