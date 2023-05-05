import { useContext, useState } from "react";
import { Appcontext } from "../lib/appcontext";
import { useLoader } from "../lib/UseLoading";

import {
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  TextInput,
} from "react-native";
import Button from "../components/Button";
import Header from "../components/header";
import { LinearGradient } from "expo-linear-gradient";
export default function LocationEdit({ navigation, route }) {
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");

  const { updateLocation, getLocation } = useContext(Appcontext);

  async function handleSubmit() {
    try {
      await updateLocation({ _id: route.params?._id, location, city });

      console.log("what", route.params?.reloadData);
      navigation.navigate("Locations", {
        reloadData: route.params?.reloadData,
      });
    } catch (error) {
      if (error.status === 401) {
        navigation.navigate("Error", { error: "Not Logged in" });
      } else if (error.status === 403) {
        navigation.navigate("ErrorAdmin", { error: "Not Logged in as Admin" });
      } else navigation.navigate("Error", { error: error.toString() });
      console.log("error in crete location: ", error);
      //navigate("/error");
    }
  }

  const { loading, error, data, reload } = useLoader(async () => {
    let tmp;
    try {
      tmp = await getLocation(route.params?._id);
      setCity(tmp.city);
      setLocation(tmp.location);
    } catch (error) {
      console.log(error);
    }

    return tmp;
  });
  if (error) {
    if (error.status === 401) {
      navigation.navigate("Error", { error: "bad user name or password" });
    } else navigation.navigate("Error", { error: error.toString() });
  }
  if (loading) {
    return <Text>Loading....</Text>;
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
          onChangeText={(loc) => setLocation(loc)}
          value={location}
          placeholder="Location.."
        />
        <TextInput
          style={styles.input}
          placeholder="City.."
          onChangeText={(city) => setCity(city)}
          value={city}
        />
        <Button
          title={"Save"}
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
