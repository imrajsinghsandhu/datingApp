import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import ChatList from "../components/ChatList";

const ChatScreen = () => {
  return (
    <SafeAreaView>
      {/* <Header/> */}
      <ChatList />
    </SafeAreaView>
  );
};

export default ChatScreen;
