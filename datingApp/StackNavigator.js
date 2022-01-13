import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import useAuth from "./hooks/useAuth";
import ChatScreen from "./screens/ChatScreen";
import HomeScreen from "./screens/HomeScreen";
import LogInScreen from "./screens/LogInScreen";
import MatchedScreen from "./screens/MatchedScreen";
import MessageScreen from "./screens/MessageScreen";
import ModalScreen from "./screens/ModalScreen";

/**
 * This function createNativeStackNavigator gives us all the react native
 * routing capabilities of a stackNavigator. Assiging this to a variable
 * allows us to firstly instantiate the stacknavigator + call it easily
 * through the use of "Stack". Native cos it allows for better functionality
 * to the native ios/android platform you are building on.
 */
const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  // the value state which will determine
  // if we show the user the login screen or not
  // is not necessarily boolean, but will either be null
  // or hold any type of value
  const { user } = useAuth();

  return (
    // this is the stack
    // and in this stack lie the screens.
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {user ? (
        <>
          <Stack.Group>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen name="Message" component={MessageScreen} />
          </Stack.Group>
          {/* <Stack.Group screenOptions={{ presentation: "modal" }}> */}
          {/* <Stack.Screen name="Modal" component={ModalScreen} /> */}
          {/* </Stack.Group> */}
          <Stack.Group screenOptions={{ presentation: "transparentModal" }}>
            <Stack.Screen name="Match" component={MatchedScreen} />
          </Stack.Group>
        </>
      ) : (
        <Stack.Screen name="LogInScreen" component={LogInScreen} />
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
