import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput, Pressable, ScrollView, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome6 } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";



SplashScreen.preventAutoHideAsync();

export default function SignUp() {
  const logoPath = require("../assets/weChat.png");
  const [getImage, setImage] = useState(null);
  const [getMobile, setMobile] = useState("");
  const [getFirstName, setFirstName] = useState("");
  const [getLastName, setLastName] = useState("");
  const [getPassword, setPassword] = useState("");

  // Font loading
  const [loaded, error] = useFonts({
    "Kanit-Bold": require("../assets/fonts/Kanit-Bold.ttf"),
    "Kanit-Regular": require("../assets/fonts/Kanit-Regular.ttf"),
  });

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
          <Text style={styles.title}>Create a we Chat Account</Text>

          <Pressable
            onPress={async () => {
              let result = await ImagePicker.launchImageLibraryAsync({});
              if (!result.canceled) {
                setImage(result.assets[0].uri);
              }
            }}
            style={styles.avatar1}
          >
            {getImage == null?<Text style={{alignSelf:"center", fontSize:50, justifyContent:"center"}}>+</Text>:<Image source={getImage} style={styles.image2} contentFit={"contain"}/>}
          </Pressable>


          {/* First Name */}
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#ccc"
            onChangeText={(text) => setFirstName(text)}
          />

          {/* Last Name */}
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#ccc"
            onChangeText={(text) => setLastName(text)}
          />

          {/* Mobile Number */}
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            placeholderTextColor="#ccc"
            keyboardType="phone-pad"
            maxLength={10}
            onChangeText={(text) => setMobile(text)}
          />

          {/* Password */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#ccc"
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />
          
          {/* Sign Up Button */}
          <Pressable style={styles.signUpButton} onPress={
              async () => {

                let formData = new FormData();
                formData.append("mobile",getMobile);
                formData.append("firstName",getFirstName);
                formData.append("lastName",getLastName);
                formData.append("password",getPassword);

                if (getImage != null) {
                  formData.append("avatarImage",
                    {
                      name:"avatar.png",
                      type:"image/*",
                      uri:getImage
                    }
                  );
  
                }

                
              let response = await fetch(
                process.env.EXPO_PUBLIC_URL + "/SmartChat/SignUp",
                {
                  method:"POST",
                  body:formData
                }
              );

              if (response.ok) {
                let json = await response.json();
                
                if (json.success) {
                  //user registed

                  router.replace("/");

                }else{
                  //not registed

                  Alert.alert("Error",json.message)

                }
                
              }
            }}>
            <FontAwesome6 name={"right-to-bracket"} color={"white"} size={20} style={{ marginRight: 10 }} />
            <Text style={styles.buttonText} >Sign Up</Text>
          </Pressable>

          {/* Already have an account? */}
          <Pressable style={styles.signInLink} onPress={() => router.replace("/")}>
            <Text style={styles.signInText}>Already have an account? Sign In</Text>
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
  },
  view2: {
    paddingHorizontal: 30,
    paddingVertical: 40,
    alignItems: "center",
  },
  title: {
    fontFamily: "Kanit-Bold",
    fontSize: 25,
    color: "#fff",
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
  signUpButton: {
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
  signInLink: {
    marginTop: 10,
  },
  signInText: {
    color: "#fff",
    fontFamily: "Kanit-Regular",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  logo: {
    width: 150,
    height: 100,
    marginBottom: 20,
  },
  image2: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: "white",
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
    marginBottom:25,
    borderStyle: "solid",
    borderWidth: 3,
  },
});