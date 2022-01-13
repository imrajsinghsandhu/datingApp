import { useRoute } from "@react-navigation/core";
import Header from "../components/Header";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from "react-native";
import useAuth from "../hooks/useAuth";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";
import tw from "tailwind-rn";
import SenderMessage from "../components/SenderMessage";
import ReceiverMessage from "../components/ReceiverMessage";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  serverTimestamp,
} from "@firebase/firestore";
import { db } from "../config";

const MessageScreen = () => {
  const { user } = useAuth();
  const { params } = useRoute();
  const { matchDetails } = params;

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "matches", matchDetails.id, "messages"),
          // ordering the items
          orderBy("timestamp", "desc")
        ),
        // find out what this really does
        (snapshot) =>
          setMessages(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          )
      ),
    [matchDetails, db]
  );

  /**
   * The sendMessage function which will update the messages collection
   * of the matched user.
   */
  const sendMessage = () => {
    addDoc(collection(db, "matches", matchDetails.id, "messages"), {
      // these is the data you are sending to the server for storage
      timestamp: serverTimestamp(),
      userId: user.id,
      displayName: user.displayName,
      photoURL: matchDetails.users[user.id].photoURL,
      message: input,
    });

    setInput("");
  };

  return (
    <SafeAreaView style={tw("flex-1")}>
      <Header // Header is actually a component that we have to make
        title={getMatchedUserInfo(matchDetails.users, user.uid).displayName}
        callEnabled
      />

      {/* This component allows us to have a component that we can avoid 
      the overlap of the keyboard with */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw("flex-1")}
        keyboardVerticalOffset={10}
      >
        {/* 
          Everytime we touch inside the list, 
          we will dismiss the keyboard. Which is why use TouchableWithoutFeedback.
        */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList
            data={messages}
            style={tw("pl-4")}
            keyExtractor={(item) => item.id}
            // final piece, to invert the messages order
            inverted={-1}
            // destructuring item, and renaming it to message
            renderItem={({ item: message }) =>
              message.userid === user.id ? (
                <SenderMessage key={message.id} message={message} />
              ) : (
                <ReceiverMessage key={message.id} message={message} />
              )
            }
          />
        </TouchableWithoutFeedback>

        <View
          style={tw(
            "flex-row justify-between items-center border-t border-gray-200 px-5 py-2"
          )}
        >
          <TextInput
            style={tw("h-10 text-lg")}
            placeholder="Send Message..."
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            value={input}
          />

          <Button onPress={sendMessage} title="Send" color="#FF5864" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessageScreen;
