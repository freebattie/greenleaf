import { useContext, useState } from "react";
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
import Button from "../components/Button";
import Header from "../components/header";
import { LinearGradient } from "expo-linear-gradient";

export default function CreateUser({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { createUser } = useContext(Appcontext);
  //const navigate = useNavigate();
  const onChangePassword = (newPassword) => {
    setPassword(newPassword);
  };
  async function handleSubmit() {
    try {
      await createUser({ username, password });
      navigation.navigate("Main");
    } catch (error) {
      if (error.status === 401) {
        navigation.navigate("ErrorAdmin", {
          error: "missing username or password",
        });
      } else if (error.status === 403) {
        navigation.navigate("ErrorUser", { error: "Not Logged in as Admin" });
      } else if (error.status === 409) {
        navigation.navigate("ErrorAdmin", {
          error: "User name in use ",
        });
      } else navigation.navigate("Error", { error: error.toString() });
      console.log("error in login: ", error);
      //navigate("/error");
    }
  }
  return (
    <LinearGradient
      style={styles.gradient}
      colors={["rgba(0, 100, 0, 0.3)", "rgba(0, 100, 0, 0.9)"]}
    >
      <View style={styles.container}>
        <Header />

        <TextInput
          style={styles.input}
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
          title={"Create"}
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

    justifyContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.height : 0,
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
