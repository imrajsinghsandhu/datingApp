import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import useAuth from "../hooks/useAuth";
import tw from "tailwind-rn";
import { Ionicons, Entypo, AntDesign } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import { useRef } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  where,
} from "@firebase/firestore";
import { db } from "../config";
// geenrateId dont need { } cos we exported it as a "default" function
import generateId from "../lib/generateId";

// const DUMMY_DATA = [
//   {
//     id: 1,
//     firstName: "Imraj",
//     lastName: "Sangha",
//     job: "Software Developer",
//     photoURL: "",
//     age: 27,
//   },
// ];

const HomeScreen = () => {
  const navigation = useNavigation();

  // getting the logOut function and user attribute from calling useAuth()
  // higher order function
  const { user, logOut } = useAuth();
  // ref is a pointer, allows me to point at any object on the screen
  // will pass this ref in Swiper below, so we may call on this ref
  // if we implement another button to use this function
  const swipeRef = useRef(null);
  const [profiles, setProfiles] = useState([]);

  // when the whole screen component mounts, i want to trigger off some code
  /**
   * When the user doesnt exist, i want to force open the sign up page
   */
  useLayoutEffect(
    () =>
      onSnapshot(doc(db, "users", user.uid), (snapshot) => {
        // a snapshot will be returned if the user exists
        // according to its user.uid
        if (!snapshot.exists()) {
          // will forcefully navigate to the modal screen sign up page
          // can redirect to the switchNavigator for signing up
          // navigation.navigate("Modal");
        }
      }),
    []
  );

  // the useEffect that is responsible for fetching the profiles
  useEffect(() => {
    let unsub;

    const fetchCards = async () => {
      const passes = await getDocs(
        collection(db, "users", user.uid, "passes")
      ).then(
        (snapshot) => snapshot.doc.map((doc) => doc.id)
        // now your passes will contain the id of all the users you have passed on
        // passes is of type array
      );

      const swipes = await getDocs(
        collection(db, "users", user.uid, "swipes")
      ).then(
        (snapshot) => snapshot.doc.map((doc) => doc.id)
        // now your swipes will contain the id of all the users you have swiped right on
        // swipes is of type array
      );

      // because i cannot pass into the backend an empty query array
      const passedUserIds = passes.length > 0 ? passes : ["test"];
      const swipedUserIds = swipes.length > 0 ? swipes : ["test"];

      /**
       * Querying the documents where the id is NOT present.
       * Dont really know why we use [...passedUserIds].
       * Apparently its just to spread the passedUserIds data here
       * considering that we need to do the swipedRight queries as well.....
       */
      unsub = onSnapshot(
        query(
          collection(db, "users"),
          // so we only return the users we have NOT SWIPED LEFT/RIGHT on
          where("id", "not-in", [...passedUserIds, ...swipedUserIds])
        ),
        (snapshot) => {
          setProfiles(
            snapshot.docs
              // filter through and return all docs whos id is not your profile's!
              .filter((doc) => doc.id !== user.uid)
              // then map this result docs
              .map((doc) => ({
                // reshaping every single doc that comes
                id: doc.id,
                // NOT SURE WHAT THIS DOES ...DOC.DATA()
                ...doc.data(),
              }))
          );
        }
      );
    };

    fetchCards();
    return unsub;
  }, [db]);

  // the swipeLeft function
  const swipeLeft = (cardIndex) => {
    if (!profiles[cardIndex]) {
      return;
    }

    const userSwiped = profiles[cardIndex];
    console.log(`You swiped PASS on ${userSwiped.displayName}`);

    // in the database db, get the users collection of the user.uid
    // then check that user's "passes" collection, and retreive userSwiped.id
    // and throw in the userSwiped in there
    // this will update the user's firebase database, with the data of the
    // user that he/she has swiped on
    setDoc(doc(db, "users", user.uid, "passes", userSwiped.id), userSwiped);
  };

  // swipeRight function
  const swipeRight = (cardIndex) => {
    if (!profiles[cardIndex]) {
      return;
    }

    // the user we swiped right on
    const userSwiped = profiles[cardIndex];

    // do we need to do this function?
    // it seems pretty costly and i could just store this value
    // in a memoised variable outside? FIND OUT!
    const loggedInProfile = getDoc(doc(db, "users", user.uid)).data();

    // Check if the user swiped on you
    getDoc(doc(db, "users", userSwiped, "swipes", user.uid)).then(
      (documentSnapshot) => {
        if (documentSnapshot.exists()) {
          // user has swiped on you before you have swiped on them
          console.log(`Hooray you MATCHED with ${userSwiped.displayName}`);

          // record the swipe first
          setDoc(
            doc(db, "users", user.uid, "swipes", userSwiped.id),
            userSwiped
          );

          // CREATE A MATCH
          // need to firstly create a function where one id always goes before
          // the other user's id
          setDoc(doc(db, "matches", generateId(user.uid, userSwiped.id)), {
            // VERY IMPORTANT
            users: {
              [user.uid]: loggedInProfile,
              [userSwiped.id]: userSwiped,
            },
            usersMatched: [user.uid, userSwiped.id],
            timestamp: serverTimestamp(),
          });

          // now just navigate to the matched screen
          // and send in the user props
          navigation.navigate("Match", {
            loggedInProfile,
            userSwiped,
          });
        } else {
          // other user didnt swipe on you, so just create the first interaction
          console.log(`You swiped RIGHT on ${userSwiped.displayName}`);
          setDoc(
            doc(db, "users", user.uid, "swipes", userSwiped.id),
            userSwiped
          );
        }
      }
    );
  };

  return (
    <SafeAreaView style={tw("flex-1")}>
      {/* Header */}
      <View style={tw("flex-row items-center justify-between px-5")}>
        <TouchableOpacity onPress={logOut}>
          <Image
            style={tw("h-10 w-10 rounded-full")}
            source={{ uri: user.photoURL }}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image style={tw("h-14 w-14")} source={require("../logo.png")} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity>
        <Ionicons name="chatbubble-sharp" size={30} color="#FF5864" />
      </TouchableOpacity>
      {/* End of Header */}

      {/* Cards */}
      <View style={tw("flex-1 -mt-6")}>
        <Swiper
          // stackSize is the number of cards that are stacked on each other at one point
          stackSize={5}
          containerStyle={{ backgroundColor: "transparent" }}
          cards={profiles}
          cardIndex={0}
          verticalSwipe={false}
          animateCardOpacity
          ref={swipeRef}
          // on swipe<dir> gives us the index of the card
          // we have performed the action on
          onSwipedLeft={(cardIndex) => {
            console.log("Swipe PASS");
            swipeLeft(cardIndex);
          }}
          onSwipedRight={(cardIndex) => {
            console.log("Swipe MATCH");
            swipeRight(cardIndex);
          }}
          backgroundColor={"#4FD0E9"}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "MATCH",
              style: {
                label: {
                  color: "#4DED30",
                },
              },
            },
          }}
          // there are times where we either swipe to the end of the deck
          // or we are loading the cards to be displayed
          // so we need to firstly check if the card exists
          renderCard={(card) =>
            card ? (
              <View
                key={card.id}
                style={tw("relative bg-white h-3/4 rounded-xl")}
              >
                <Image
                  style={tw("absolute top-0 h-full w-full rounded-xl")}
                  source={{ uri: card.photoURL }}
                />

                <View
                  style={[
                    tw(
                      "absolute bg-white bottom-0 bg-white w-full justify-between items-center h-20 flex-row px-6 py-2 rounded-b-xl"
                    ),
                    // this is how we add 2 different styling conventions together, by the use of arrays
                    styles.cardShadow,
                  ]}
                >
                  <View>
                    <Text style={tw("text-xl font-bold")}>
                      {card.displayName}
                    </Text>
                    <Text>{card.job}</Text>
                  </View>

                  <Text style={tw("text-2xl font-bold")}>{card.age}</Text>
                </View>
              </View>
            ) : (
              // when there is no card to render
              <View
                style={[
                  tw(
                    "relative bg-white h-3/4 rounded-xl justify-center items-center"
                  ),
                  styles.cardShadow,
                ]}
              >
                <Text style={tw("font-bold pb-5")}>No more profiles</Text>
                <Image
                  style={tw("h-20 w-full")}
                  height={100}
                  width={100}
                  source={{ uri: "https://links.papareact.com/6gb" }}
                />
              </View>
            )
          }
        />
      </View>

      {/* holds the like and dislike button */}
      <View style={tw("flex flex-row justify-evenly")}>
        <TouchableOpacity
          onPress={() => {
            // not sure what this means, where does the swipeLeft() function come from?
            // comes from the documentation, which informs us on the methods available
            // for use on the useRef functionality
            swipeRef.current.swipeLeft();
          }}
          size={tw(
            "items-center justify-center rounded-full w-16 h-16 bg-red-200"
          )}
        >
          <Entypo name="cross" size={24} color="red" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            swipeRef.current.swipeRight();
          }}
          size={tw(
            "items-center justify-center rounded-full w-16 h-16 bg-green-200"
          )}
        >
          <AntDesign name="heart" size={24} color="green" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
