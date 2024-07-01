import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, LogBox, Text, View } from 'react-native';
import { initializeApp } from 'firebase/app';
import { disableNetwork, enableNetwork, getFirestore } from 'firebase/firestore';
import Start from './components/Start';
import Chat from './components/Chat';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { getStorage } from "firebase/storage";

LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

const Stack = createNativeStackNavigator();

// Unique code from firebase that allows access to a specific db
                          const App = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyCXNbCuAt68hbHagvS4uKhb11vWMFn3e3k",
    authDomain: "chat-app-715d8.firebaseapp.com",
    projectId: "chat-app-715d8",
    storageBucket: "chat-app-715d8.appspot.com",
    messagingSenderId: "339859179317",
    appId: "1:339859179317:web:6e49893e4fcab511e62e7c"
  };

  // Needed to connect to firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Prepares storage location in Firebase Storage Cloud so a blob can be uploaded
  const storage = getStorage(app);

  const connectionStatus = useNetInfo();

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection lost");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Start'>
        <Stack.Screen name='Start'>
          {props => <Start {...props} db={db} />}
        </Stack.Screen>
        <Stack.Screen name='Chat'>
          {props => <Chat 
          isConnected={connectionStatus.isConnected} 
          {...props} 
          db={db} 
          storage={storage} 
          />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
