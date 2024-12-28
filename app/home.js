import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView, Pressable, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome6 } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import * as SplashScreen from "expo-splash-screen";
import { FlashList } from "@shopify/flash-list";

SplashScreen.preventAutoHideAsync();

export default function Home() {
  // const [userName, setUserName] = useState("");
  const [getchatArray, setChatArray] = useState([]);
  const [getname, setname] = useState();

  // Font loading
  const [loaded, error] = useFonts({
    "Kanit-Bold": require("../assets/fonts/Kanit-Bold.ttf"),
    "Kanit-Regular": require("../assets/fonts/Kanit-Regular.ttf"),
  });

  useEffect(() => {
    async function fetchData() {
      let userJson = await AsyncStorage.getItem("user");
      let user = JSON.parse(userJson);

      setname(user.first_name);

      let response = await fetch(
        process.env.EXPO_PUBLIC_URL + "/SmartChat/LoadHomeData?id=" +
          user.id
      );

      if (response.ok) {
        let json = await response.json();
        if (json.success) {


          let chatArray = json.jsonChatArray;
          // console.log(chatArray);
          setChatArray(chatArray);
        }
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }


  return (
    <LinearGradient colors={["#2c3e50", "#3498db"]} style={styles.container}>
      <StatusBar hidden={true} />

      {/* Welcome Message */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome  {getname}!</Text>
        <Pressable onPress={() => router.push("/profile")} style={styles.profileIcon}>
          <FontAwesome6 name="user-circle" size={40} color="#fff" />
        </Pressable>
      </View>

      {/* Recent Chats */}
      <ScrollView style={styles.chatContainer}>
        <FlashList
        data={getchatArray}
        renderItem={({ item }) => 
            <Pressable
              style={styles.chatItem}
              onPress={

                () => {
                  router.push({ pathname: "/chat", params: item });
    
                }
              }
            >
              <View style={item.other_user_status == 1? styles.view6_2:styles.view6_1}>
              {
                item.avatar_image_found ?
                  <Image source={process.env.EXPO_PUBLIC_URL + "/SmartChat/AvatarImages/"+item.other_user_mobile+".png"}
                  contentFit="contain"
                  style={styles.image1}/>
                :
                <Text style={styles.text6}>{item.other_user_avatar_letters}</Text>
              }
              
              
              </View>
            <View style={styles.view4}>
              <Text style={styles.text1}>{item.other_user_name}</Text>
              <Text style={styles.text4} numberOfLines={1}>{item.message}</Text>

              <View style={styles.view7}>
                <Text style={styles.text5}>{item.datetime}</Text>
                <FontAwesome6 name={"check-double"} color={item.chat_status_id == 1 ? "green":"red"} size={18} />
              </View>
            </View>
            </Pressable>
            }
            estimatedItemSize={200}
            />
      </ScrollView>

      {/* New Chat Button */}
      <Pressable style={styles.newChatButton} onPress={() => router.push("/new-chat")}>
        <FontAwesome6 name="plus-circle" size={40} color="#fff" />
        <Text style={styles.newChatText}>New Chat</Text>
      </Pressable>
      
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  text1: {
    fontFamily: "Kanit-Bold",
    fontSize: 18,
    marginHorizontal:10,
  },
  text4: {
    fontFamily: "Kanit-Regular",
    fontSize: 15,
    marginHorizontal:10,
  },
  text5: {
    fontFamily: "Kanit-Regular",
    fontSize: 14,
  }, 
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeText: {
    fontFamily: "Kanit-Bold",
    fontSize: 24,
    color: "#fff",
  },
  profileIcon: {
    padding: 10,
  },
  chatContainer: {
    flex: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: "Kanit-Bold",
    fontSize: 22,
    color: "#fff",
    marginBottom: 10,
  },
  noChatsText: {
    fontFamily: "Kanit-Regular",
    fontSize: 18,
    color: "#ccc",
    textAlign: "center",
    marginTop: 20,
  },
  view7: {
    flexDirection: "row",
    columnGap: 10,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  view4: {
    flex: 1,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatInfo: {
    backgroundColor:"blue",
    flex: 1,
    width:"100%",
  },
  chatName: {
    marginHorizontal:10  ,
    fontFamily: "Kanit-Bold",
    fontSize: 18,
    color: "#fff",
  },
  chatMessage: {
    fontFamily: "Kanit-Regular",
    fontSize: 16,
    color: "#ccc",
  },
  chatTime: {
    fontFamily: "Kanit-Regular",
    fontSize: 14,
    color: "#ccc",
  },
  newChatButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2980b9",
    paddingVertical: 15,
    borderRadius: 30,
    alignSelf: "center",
    width: "80%",
  },
  newChatText: {
    fontFamily: "Kanit-Bold",
    fontSize: 18,
    color: "#fff",
    marginLeft: 10,
  },
  image1:{
    width: 65,
    height: 65,
    borderRadius: 50,
    backgroundColor: "white",
    justifyContent: "center",
    alignSelf: "center",
  },
  view6_1: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "white",
    borderStyle: "dotted",
    borderWidth: 3,
    borderColor: "red",
    justifyContent:"center",
    alignItems:"center",
  },
  view6_2: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "white",
    borderStyle: "dotted",
    borderWidth: 3,
    borderColor: "green",
    justifyContent:"center",
    alignItems:"center",
  },
  text6:{
    fontFamily: "Kanit-Bold",
    fontSize: 28,
  },
});