import { addDoc, doc, serverTimestamp, setDoc } from "@firebase/firestore";
import { useNavigation } from "@react-navigation/core";
import React from "react";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { db } from "../config";
import useAuth from "../hooks/useAuth";

const ModalScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [job, setJob] = useState(null);
  const [age, setAge] = useState(null);

  const incompleteForm = !image || !job || !age;

  /**
   * in setDoc, we are passing in the data collected from the created modal,
   * into the firebase, for storing of data purposes.
   * The data we send in is the suff in the key, value pair.
   *
   * Call this function in an onPress(), after user has filled all fields.
   */
  const updateUserProfile = () => {
    // setDoc is a firebase function allowing us to set a document using
    // the details of the user signing up
    // addDoc() gives the user an ID, but since we already have an ID
    // for each user, we will use setDoc()
    setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      displayName: user.displayName,
      photoURL: image,
      job: job,
      age: age,
      timestamp: serverTimestamp,
    })
      .then(() => {
        // doing this allows us to close the modal screen
        navigation.navigate("Home");
      })
      .catch((error) => {
        alert(error.message);
      });
  };
};
