import { useNavigation } from "@react-navigation/core";
import React from "react";
import {
  View,
  Text,
  Button,
  ImageBackground,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import tailwind from "tailwind-rn";
import useAuth from "../hooks/useAuth";

const LogInScreen = () => {
  const { signInWithGoogle, loading } = useAuth();
  const navigation = useNavigation();

  return (
    // <SafeAreaView>
    //   <Button title="Login " onPress={signInWithGoogle} />
    // </SafeAreaView>

    <View style={tailwind("flex-1")}>
      <ImageBackground
        resizeMode="cover"
        style={tailwind("flex-1")}
        source={{
          uri: "https://tinder.com/static/tinder.png",
        }}
      >
        <TouchableOpacity
          style={[
            tailwind("absolute bottom-40 w-52 bg-white p-4 rounded-2xl"),
            { marginHorizontal: "25%" },
          ]}
          onPress={signInWithGoogle}
        >
          <Text style={tailwind("font-semibold text-center")}>
            Sign in & get swiping
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default LogInScreen;
