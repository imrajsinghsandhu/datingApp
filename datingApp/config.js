// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyDGJk6xS1NEFTCAouGehE66f9td_7uidRE",
  authDomain: "datingapp-502fd.firebaseapp.com",
  projectId: "datingapp-502fd",
  storageBucket: "datingapp-502fd.appspot.com",
  messagingSenderId: "466754145458",
  appId: "1:466754145458:web:24d18767c7a67635b1cdab",
  measurementId: "G-R70DLNG30S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth();

// firebase database that goes on to help us in our features of this build
const db = getFirestore();

const androidClientId =
  "466754145458-akavsh5bdpglo8r0udeoqt2ffdt737b9.apps.googleusercontent.com";
// ios client id taken from google info p-list

const iosClientId =
  "466754145458-cu7sr6cvh44oeohl5eehiakkn96a8v96.apps.googleusercontent.com";

// now export the details you need for use elsewhere in the project
// auth allows me to log in
// and db allows me to post data to my database
export { auth, db, androidClientId, iosClientId };
