import React from "react";
import StackNavigator from "./StackNavigator";

// we import this NavigationContainer because we need to wrap it
// around the stack navigator
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./hooks/useAuth";

/**
 * Navigation container goes into StackNavigator and then accesses
 * the first screen available. The StackNavigator is the screen we have
 * created earlier, that has the screens in them
 */
export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}

// the older way of doing component styling
// const styles = StyleSheet.create({
//   head={
//     flexDirection="column",
//   },
// })
