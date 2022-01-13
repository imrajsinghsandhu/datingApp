import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as Google from "expo-google-app-auth";
import { iosClientId, androidClientId, auth, db } from "../config";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from "@firebase/auth";

const AuthContext = createContext({
  // initial state .... empty
});

/**
 * Creating a config variable to tell google,
 * what are are data points we need from the user
 * that has just logged in via google.
 */
const config = {
  // android client id taken from google json file
  androidClientId: androidClientId,
  // ios client id taken from google info p-list
  iosClientId: iosClientId,
  scopes: ["profile", "email"],
  permissions: ["public_profile", "email", "gender", "location"],
};

/**
 * Children is anything that sits underneath the parent
 * wrapper, in this case parent is AuthProvider...
 * and children will be the StackNavigator etc like so
 * <AuthProvider>
 *   <StackNavigator/>
 * </AuthProvider>
 *
 * Doing so provides every child component with a global state
 * from its parent class. In this case we will need the
 * userLoggedIn state for our children components.
 * @param {children} param
 * @returns
 */
export const AuthProvider = ({ children }) => {
  // having a state for your error, initialised to null
  const [error, setError] = useState(null);
  // user initially set to null
  const [user, setUser] = useState(null);
  // can use loadingInitial to block the UI
  // if we are not loading, then we can show the children.
  // logic is down below
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);

  // having a useEffect state
  useEffect(
    () =>
      /**
       * onAuthStateChanged is a listener that is always
       * listening to whether the user is signed in or not.
       * Used as a tracking mechanisam if the user is logged in or not.
       */
      onAuthStateChanged(auth, (user) => {
        // you will get back the user argument everytime.
        if (user) {
          // logged in
          setUser(user);
        } else {
          // user is not logged in
          setUser(null);
        }

        // now we set the loading initial to false
        setLoadingInitial(false);
      }),
    []
  );
  // if we put something in the array above, then it will update only when
  // that value changes. otherwise it will constantly call this, if without something.

  // async function, will have to wait
  // for the callBack
  const signInWithGoogle = async () => {
    console.log("we are in");
    setLoading(true);

    await Google.logInAsync(config)
      .then(async (logInResult) => {
        if (logInResult.type === "success") {
          // get the id token and accessToken from logInResult
          const { idToken, accessToken } = logInResult;

          /**
           * We get the user's credentials from google.
           */
          const credential = GoogleAuthProvider.credential(
            idToken,
            accessToken
          );

          /**
           * using the credentials we got from google,
           * we will now use it to sign into firebase, so we can store
           * user data. This function signInWithCredential is a
           * firebase function.
           */
          await signInWithCredential(auth, credential);
        }

        // if it comes here it means the log in procedure was a failure
        // return a Promise reject
        return Promise.reject();
      })
      .catch((e) => {
        setError(e);
        console.error(e);
      })
      // finally gets called no matter what the
      // result of your promise is
      .finally(() => setLoading(false));
  };

  // logOut function
  const logOut = () => {
    setLoading(true);
    signOut(auth)
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };

  // important optimisation strategy
  /**
   * Using useMemo() allows us to be more optimized in our approach to
   * passing variables on to our children. The problem is that whenever any
   * one of the values changes, it causes a whole re rendering of all the other values
   * and this may be very costly. So the solution is to cache our already calculated values
   * much like Lazy. only if any one of them changes, then we recalculate that and return
   * the already memoised values of the others without having to re-render everything.
   */

  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      signInWithGoogle,
      logOut,
    }),
    [user, loading, error]
  );

  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};

/**
 * useContext takes in an AuthContext, that has a provider function
 * which takes in the values of user, loading, error, signInWithGoogle, logOut
 * and then passes on these values to its children...HomeScreen etc.
 */
export default function useAuth() {
  return useContext(AuthContext);
}
