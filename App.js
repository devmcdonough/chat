import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import Start from './components/Start';
import Chat from './components/Chat';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const App = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyCXNbCuAt68hbHagvS4uKhb11vWMFn3e3k",
    authDomain: "chat-app-715d8.firebaseapp.com",
    projectId: "chat-app-715d8",
    storageBucket: "chat-app-715d8.appspot.com",
    messagingSenderId: "339859179317",
    appId: "1:339859179317:web:6e49893e4fcab511e62e7c"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Start'>
        <Stack.Screen name='Start'>
          {props => <Start {...props} db={db} />}
        </Stack.Screen>
        <Stack.Screen name='Chat'>
          {props => <Chat {...props} db={db} />}
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
