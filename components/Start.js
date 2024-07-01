import { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { getAuth, signInAnonymously } from "firebase/auth";
import { ImageBackground } from 'react-native';
import backgroundImage from '../assets/Background_Image.png';

// Main start page component
const Start = ({ navigation, db }) => {
  const [name, setName] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');
  const colors = ['#128c7e', '#25d366', '#dcf8c6', '#ece5dd'];

  // Firebase authentication
  const auth = getAuth();

  // Allows anonymous sign-in
  const signInUser = () => {
    signInAnonymously(auth)
      .then(res => {
        navigation.navigate("Chat", {
          // Pass user info to chat.js
          name,
          backgroundColor,
          userID: res.user.uid,
        });
        // Notification for signing in successfully
        Alert.alert("Signed in successfully!");
      })
      // Notification for when user is unable to sign in
      .catch((error) => {
        Alert.alert("Unable to sign in, we're very sorry!");
        console.error(error);
      });
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.background}>
        <View  style={styles.overlay}>
        <Text style={styles.text}>Welcome!</Text>
        <TextInput
          style={styles.textInput}
          value={name}
          onChangeText={setName}
          placeholder="Enter your username"
        />
        <Text style={styles.text}>Choose Background color</Text>
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
          onPress={signInUser}
        >
          <Text style={styles.buttonText}>Go to Chat</Text>
        </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    width: '88%',
    padding: 16,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9'
  },
  text: {
    color: '#ffffff',
    fontSize: 16
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
    color: '#ffffff',
    fontSize: 16
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
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%'
  }
});

export default Start;
