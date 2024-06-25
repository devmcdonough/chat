import { collection, onSnapshot, orderBy, addDoc, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from "react-native";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ route, navigation, db, isConnected }) => {
    const [messages, setMessages] = useState([]);
    const { name, backgroundColor, userID } = route.params;

    const loadCachedMessages = async () => {
        const cachedMessages = (await AsyncStorage.getItem('messages')) || [];
        setMessages(JSON.parse(cachedMessages));
    }

    let unsubMessages;

    // Queries firebase for real-time updates on the messages db
    useEffect(() => {
        if (isConnected === true) {
            // Unsubscribes current onSnapshot() listener to avoid registering multiple users if useEffect runs again
            if (unsubMessages) {
                unsubMessages();
            }
            unsubMessages = null;
            const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
            unsubMessages = onSnapshot(q, (snapshot) => {
                let newMessages = [];
                snapshot.forEach(doc => {
                    newMessages.push({ 
                        _id: doc.id, 
                        ...doc.data(), 
                        createdAt: new Date(doc.data().createdAt.toMillis()) 
                    });
                });
                setMessages(newMessages);
                AsyncStorage.setItem('messages', JSON.stringify(newMessages));
            });
        } else {
            loadCachedMessages();
        }
    
        return () => {
            if (unsubMessages) {
                unsubMessages(); 
            }
        }
    }, [isConnected]);
    
    const showInputToolbar = (props) => {
        if (isConnected) return <InputToolbar {...props} />
        else return null;
    }


    // Updates username on chat page
    useEffect(() => {
        navigation.setOptions({ title: name });
    }, [name, navigation]);

    const onSend = async (newMessages) => {
        await addDoc(collection(db, "messages"), newMessages[0]);
    }

    // Renders text bubbles and colors
    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: "#000"
                    },
                    left: {
                        backgroundColor: "#FFF"
                    }
                }}
            />
        );
    }

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                showInputToolbar={showInputToolbar}
                onSend={messages => onSend(messages)}
                user={{ _id: userID, name }}
            />
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

export default Chat;
