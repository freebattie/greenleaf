import { useContext, useEffect, useRef, useState } from "react";
import { Appcontext } from "../lib/appcontext";
//import { useNavigate } from "react-router-dom";
//import { useNavigate } from "react-router-dom";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  Dimensions,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Button from "../components/Button";
import Header from "../components/header";

export default function Login({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { logInUser } = useContext(Appcontext);
  //const navigate = useNavigate();
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const { createNotification } = useContext(Appcontext);
  // This listener is fired whenever a notification is received while the app is foregrounded
  notificationListener.current = Notifications.addNotificationReceivedListener(
    (notification) => {
      setNotification(notification);
    }
  );
  // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
  responseListener.current =
    Notifications.addNotificationResponseReceivedListener(async (response) => {
      const {
        notification: {
          request: {
            content: {
              body,

              data: { screen, location },
            },
          },
        },
      } = response;

      // When the user taps on the notification, this line checks if they //are suppose to be taken to a particular screen
      if (screen) {
        await Notifications.setBadgeCountAsync(0);
        navigation.navigate(screen, { location });
      }
    });
  useEffect(() => {
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [[]]);
  async function registerForPushNotificationsAsync() {
    let token;

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        console.log("existingStatus", existingStatus);
      }

      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        console.log("finalStatus", finalStatus);
        return;
      }

      // Project ID can be found in app.json | app.config.js; extra > eas > projectId
      // token = (await Notifications.getExpoPushTokenAsync({ projectId: "YOUR_PROJECT_ID" })).data;
      token = (await Notifications.getExpoPushTokenAsync()).data;

      console.log(token);
      await createNotification({ token, username });
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        showBadge: true,
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FE9018",
      });
    }

    return token;
  }
  async function handleSubmit() {
    try {
      await logInUser({ username, password });
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });
      // navigate("/");
      const token = await registerForPushNotificationsAsync();

      setExpoPushToken(token);

      navigation.navigate("Main", { pass: password, user: username });
    } catch (error) {
      //setError(e);
      console.log("error in login: ", error);
      if (error.status === 401) {
        navigation.navigate("Error", { error: "bad user name or password" });
      } else navigation.navigate("Error", { error: error.toString() });
    }
  }
  return (
    <LinearGradient
      style={styles.gradient}
      colors={["rgba(0, 100, 0, 0.3)", "rgba(0, 100, 0, 0.9)"]}
    >
      <Header />
      <View style={styles.container}>
        <TextInput
          style={styles.inputTop}
          onChangeText={(user) => setUsername(user)}
          value={username}
          placeholder="UserName.."
        />
        <TextInput
          style={styles.input}
          placeholder="Password.."
          secureTextEntry={true}
          onChangeText={(pass) => setPassword(pass)}
          value={password}
        />
        <Button
          title={"Login"}
          onPress={handleSubmit}
          backgroundColor={"green"}
        />
        <Button
          onPress={() => navigation.navigate("Home")}
          title={"back"}
          backgroundColor={"gray"}
        />
        <StatusBar style="auto" />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 100,
    backgroundColor: "rgba(0, 100, 0, 0.0)",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.height : 0,
  },
  inputTop: {
    backgroundColor: "white",
    color: "black",
    width: "70%",
    height: 40,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "white",
    color: "black",
    width: "70%",
    height: 40,
    marginTop: 20,
  },
  gradient: {
    flex: 1,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 0,
  },
});
