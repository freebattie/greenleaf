import { useContext, useState } from "react";
import { Appcontext } from "../greenleaf/lib/appcontext";
import { useLoader } from "../greenleaf/lib/UseLoading";
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
export default function CreateLocation({ navigation, route }) {
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const { createLocation } = useContext(Appcontext);
  const [reload, setReload] = useState(false);

  async function handleSubmit() {
    try {
      await createLocation({ location, city });

      navigation.navigate("Locations", {
        reloadData: route.params?.reloadData,
      });
    } catch (error) {
      console.log("status??", error.status);
      if (error.status === 401) {
        navigation.navigate("Error", { error: "Not Logged in" });
      } else if (error.status === 403) {
        navigation.navigate("ErrorAdmin", { error: "Not Logged in as Admin" });
      } else navigation.navigate("Error", { error: error.toString() });
      console.log("error in crete location: ", error);
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
          onChangeText={(user) => setLocation(user)}
          value={location}
          placeholder="Location.."
        />
        <TextInput
          style={styles.input}
          placeholder="City.."
          onChangeText={(pass) => setCity(pass)}
          value={city}
        />
        <Button
          title={"Add"}
          onPress={handleSubmit}
          backgroundColor={"green"}
        />
        <Button
          onPress={() => navigation.navigate("Locations")}
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
