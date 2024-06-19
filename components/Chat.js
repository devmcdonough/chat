import { collection, onSnapshot, orderBy, addDoc, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from "react-native";
import { Bubble, GiftedChat } from "react-native-gifted-chat";

const Chat = ({ route, navigation, db }) => {
    const [messages, setMessages] = useState([]);
    const { name, backgroundColor, userID } = route.params;

    useEffect(() => {
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
        const unsubMessages = onSnapshot(q, (snapshot) => {
            let newMessages = [];
            snapshot.forEach(doc => {
                newMessages.push({ 
                    _id: doc.id, 
                    ...doc.data(), 
                    createdAt: new Date(doc.data().createdAt.toMillis()) 
                });
            });
            setMessages(newMessages);
        });
        return () => {
            if (unsubMessages) unsubMessages();
        }
    }, [db]);

    useEffect(() => {
        navigation.setOptions({ title: name });
    }, [name, navigation]);

    const onSend = async (newMessages) => {
        await addDoc(collection(db, "messages"), newMessages[0]);
    }

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
