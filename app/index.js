import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
// import { Image } from "expo-image";
// import * as ImagePicker from "expo-image-picker";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function index() {
  const logoPath = require("../assets/weChat.png");

  const [getMobile, setMobile] = useState("");
  const [getPassword, setPassword] = useState("");
  const [getName, setName] = useState("+");
  // Font loading
  const [loaded, error] = useFonts({
    "SofadiOne-Regular": require("../assets/fonts/SofadiOne-Regular.ttf"),
    "Kanit-Bold": require("../assets/fonts/Kanit-Bold.ttf"),
    "Kanit-Italic": require("../assets/fonts/Kanit-Italic.ttf"),
    "Kanit-Regular": require("../assets/fonts/Kanit-Regular.ttf"),
  });

  //   useEffect(
  //     () => {
  //       async function checkUserInAsyncStorage(){
  //       try {
  //         let userJson = await AsyncStorage.getItem("user");
  //         if (userJson != null) {
  //           router.replace("/home");
  //         }
  //       } catch (e) {
  //         console.log(e);
  //       }
  //     }
  //     checkUserInAsyncStorage();
  //     },[]

  // );

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <LinearGradient colors={["#2c3e50", "#3498db"]} style={styles.view1}>
      <StatusBar hidden={true} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.view2}>
          <Image style={styles.logo} source={logoPath} contentFit={"cover"} />

          <Text style={styles.title}>Welcome to We Chat</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>

          <View style={styles.avatar1}>
            <Text style={styles.text6}>{getName}</Text>
          </View>


          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            placeholderTextColor="#ccc"
            inputMode={"tel"}
            maxLength={10}
            onChangeText={(text) => setMobile(text)}
            onEndEditing = {
              async () => {
  
                if (getMobile.length==10) {
                  let response = await fetch(process.env.EXPO_PUBLIC_URL +"/SmartChat/GetLetters?mobile="+getMobile);
  
                  if (response.ok) {
                      
                      let json = await response.json();
                      setName(json.letters);
  
                  }
  
                }
              }
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#ccc"
            secureTextEntry={true}
            maxLength={25}
            onChangeText={(text) => setPassword(text)}
          />

          <Pressable
            style={styles.signInButton}
            onPress={async () => {
              // let response = await fetch(
              //
              Alert.alert("Error", "Unable to process your request");
              let response = await fetch(
                process.env.EXPO_PUBLIC_URL + "/SmartChat/SignIn",
                {
                  method: "POST",
                  body: JSON.stringify({
                    mobile: getMobile,
                    password: getPassword,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

              if (response.ok) {
                let json = await response.json();
                
                if (json.success) {
                  //user Sign in success
                  let user = json.user;
                  // Alert.alert("Success"," Hi "+user.first_name+", "+json.message)

                  try {
                    await AsyncStorage.setItem("user", JSON.stringify(user));
                    router.replace("/home");
                  } catch (e) {
                    Alert.alert("Error", "Unable to process your request");
                  }
                } else {
                  //not sign in

                  Alert.alert("Error", json.message);
                }
              }
            }}
          >
            <FontAwesome6
              name={"right-to-bracket"}
              color={"white"}
              size={20}
              style={{ marginRight: 10 }}
            />
            <Text style={styles.buttonText}>Sign In</Text>
          </Pressable>

          <Pressable
            style={styles.signupButton}
            onPress={() => {
              router.replace("/signup");
            }}
          >
            <Text style={styles.signupText}>
              Don't have an account? Sign Up
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  view1: {
    flex: 1,
    justifyContent: "center",
  },
  
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    minHeight: '100%' // Ensure it occupies full screen height
  },
  
  view2: {
    paddingHorizontal: 30,
    paddingVertical: 40,
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontFamily: "Kanit-Bold",
    fontSize: 28,
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: "Kanit-Regular",
    fontSize: 18,
    color: "#ccc",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingLeft: 20,
    marginBottom: 20,
    fontSize: 16,
    fontFamily: "Kanit-Regular",
  },
  signInButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#2980b9",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Kanit-Bold",
    fontSize: 18,
  },
  signupButton: {
    marginTop: 10,
  },
  signupText: {
    color: "#fff",
    fontFamily: "Kanit-Regular",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  image2: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar1: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: "white",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 30,
    borderStyle: "solid",
    borderWidth: 3,
  },
  text6: {
    fontSize: 40,
    fontFamily: "Kanit-Bold",
    color: "#A04747",
    alignSelf:"center",
  },
});
