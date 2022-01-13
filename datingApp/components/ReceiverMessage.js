import React from "react";
import { View, Text, Image } from "react-native";
import tw from "tailwind-rn";

const ReceiverMessage = ({ message }) => {
  return (
    <View
      style={[
        tw("bg-purple-600 rounded-lg rounded-tr-none px-5 py-3 mx-3 my-2"),
        {
          alignSelf: "flex-start",
          marginLeft: "auto",
        },
      ]}
    >
      {/* the image of the matched User's photoURL */}
      <Image style={tw("h-12 w-12 rounded-full absolute top-0 -left-14")} />
      <Text style={tw("text-white")}></Text>
    </View>
  );
};

export default ReceiverMessage;
