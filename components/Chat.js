import { collection, onSnapshot, orderBy, addDoc, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

// Main chat component
const Chat = ({ route, navigation, db, isConnected, storage }) => {
    const [messages, setMessages] = useState([]);
    const { name, backgroundColor, userID } = route.params;

    // Saves messages for offline use
    const cacheMessages = async (messagesToCache) => {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
        } catch (error) {
            console.error("Failed to cache messages:", error);
        }
    }

    // Loads saved messages for offline use
    const loadCachedMessages = async () => {
        try {
            const cachedMessages = await AsyncStorage.getItem('messages');
            if (cachedMessages) {
                setMessages(JSON.parse(cachedMessages));
            } else {
                setMessages([]);
            }
        } catch (error) {
            console.error("Failed to load cached messages:", error);
        }
    }

    // Allows for real-time updates if online and loads cached messages when offline
    useEffect(() => {
        let unsubMessages;
        if (isConnected) {
            if (unsubMessages) {
                unsubMessages();
            }
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
                cacheMessages(newMessages);
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

    // Makes input toolbar invisble if network is not connected
    const renderInputToolbar = (props) => {
        if (isConnected) return <InputToolbar {...props} />
        else return null;
    }

    // Changes the title at top when changing pages or adding a different name
    useEffect(() => {
        navigation.setOptions({ title: name });
    }, [name, navigation]);

    // Adds messages to db
    const onSend = async (newMessages) => {
        await addDoc(collection(db, "messages"), newMessages[0]);
    }

    // React tool to render text bubbles and assign colors to sender and receiver
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

    // Allows action sheet actions to appear in input toolbar
    const renderCustomActions = (props) => {
        return <CustomActions storage={storage} {...props} />;
    };

    // Renders location sharing messages
    const renderCustomView = (props) => {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    }

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                onSend={messages => onSend(messages)}
                renderActions={renderCustomActions}
                renderCustomView={renderCustomView}
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
