import { FontAwesome6 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { SplashScreen, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Chat() {
  const item = useLocalSearchParams();
  const [getchatText, setchatText] = useState(null);
  const [getChatArry, setChatArray] = useState([]);

  const [fontsLoaded, fontsError] = useFonts({
    "SofadiOne-Regular": require("../assets/fonts/SofadiOne-Regular.ttf"),
    "Kanit-Bold": require("../assets/fonts/Kanit-Bold.ttf"),
    "Kanit-Italic": require("../assets/fonts/Kanit-Italic.ttf"),
    "Kanit-Regular": require("../assets/fonts/Kanit-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontsError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontsError]);

  useEffect(() => {
    async function fetchChatArray() {
      try {
        let userJson = await AsyncStorage.getItem("user");
        let user = JSON.parse(userJson);

        console.log(item);

        let response = await fetch(
          process.env.EXPO_PUBLIC_URL +
            "/SmartChat/LoadChat?logged_user_id=" +
            user.id +
            "&other_user_id=" +
            item.other_user_id
        );

        if (response.ok) {
          let chatArray = await response.json();
          setChatArray(chatArray);
        } else {
          console.error("Failed to fetch chat data. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching chat array:", error);
      }
    }

    fetchChatArray();
    const intervalId = setInterval(() => {
      fetchChatArray();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [item.other_user_id]);

  if (!fontsLoaded) {
    return <Text>Loading fonts...</Text>;
  }

  return (
    <LinearGradient colors={["#4c669f", "#192f6a"]} style={styles.view1}>
      <StatusBar hidden={true} />

      <View style={styles.view2}>
        <View style={styles.view3}>
          {item.avater_image_found == "true" ? (
            <Image
              style={styles.image1}
              source={
                process.env.EXPO_PUBLIC_URL +
                "SmartChat/AvatarImages/0763988100.png"
              }
              contentFit="contain"
            />
          ) : (
            <Text style={styles.text1}>{item.other_user_avater_letters}</Text>
          )}
        </View>
        <View style={styles.view4}>
          <Text style={styles.text2}>{item.other_user_name}</Text>
          <Text style={styles.text3}>
            {item.other_user_status == 1 ? "Online" : "Offline"}
          </Text>
        </View>
      </View>

      <View style={styles.center_view}>
        <FlashList
          data={getChatArry}
          renderItem={({ item }) => (
            <View
              style={item.side == "right" ? styles.view5_1 : styles.view5_2}
            >
              <Text style={styles.text3}>{item.message}</Text>
              <View style={styles.view6}>
                <Text style={styles.text4}>{item.date_time}</Text>
                {item.side == "right" ? (
                  <FontAwesome6
                    name={"check"}
                    color={item.status == 1 ? "green" : "red"}
                    size={20}
                  />
                ) : null}
              </View>
            </View>
          )}
          estimatedItemSize={200}
        />
      </View>

      <View style={styles.view7}>
        <TextInput
          value={getchatText}
          style={styles.input1}
          onChangeText={(text) => setchatText(text)}
        />
        <Pressable
          onPress={async () => {
            if (getchatText.length == 0) {
              Alert.alert("Message is empty");
              return;
            } else {
              try {
                let userJson = await AsyncStorage.getItem("user");
                let user = JSON.parse(userJson);
                let response = await fetch(
                  process.env.EXPO_PUBLIC_URL +
                    "/SmartChat/SendChat?logged_user_id=" +
                    user.id +
                    "&other_user_id=" +
                    item.other_user_id +
                    "&message=" +
                    getchatText
                );

                if (response.ok) {
                  let json = await response.json();
                  if (json.success) {
                    console.log("Message sent");
                    setchatText("");
                  }
                } else {
                  console.error("Failed to send message. Status:", response.status);
                }
              } catch (error) {
                console.error("Error sending message:", error);
              }
            }
          }}
          style={styles.pressable1}
        >
          <FontAwesome6 name={"right-to-bracket"} color={"white"} size={20} />
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  view1: {
    flex: 1,
  },
  view2: {
    marginTop: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    columnGap: 10,
  },
  view3: {
    backgroundColor: "#4c669f",
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#192f6a",
  },
  image1: {
    width: 70,
    height: 70,
    borderRadius: 40,
  },
  text1: {
    fontFamily: "Kanit-Bold",
    fontSize: 28,
    color: "white",
  },
  view4: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  text2: {
    fontFamily: "Kanit-Bold",
    fontSize: 23,
    color: "white",
  },
  text3: {
    fontFamily: "Kanit-Regular",
    fontSize: 18,
    color: "white",
  },
  view5_1: {
    backgroundColor: "#dc2430",
    padding: 10,
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  view5_2: {
    backgroundColor: "#4c669f",
    padding: 10,
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  view6: {
    flexDirection: "row",
    columnGap: 10,
  },
  text4: {
    fontFamily: "Kanit-Bold",
    fontSize: 15,
    color: "white",
  },
  view7: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    columnGap: 10,
    paddingHorizontal: 20,
    marginHorizontal: 20,
  },
  input1: {
    height: 40,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#4c669f",
    fontFamily: "Kanit-Regular",
    flex: 1,
    paddingStart: 10,
    fontSize: 20,
    color: "#192f6a",
  },
  pressable1: {
    backgroundColor: "#192f6a",
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    bottom: 5,
  },
  center_view: {
    flex: 1,
    marginVertical: 20,
  },
});