import {
  StyleSheet,
  View,
  Platform,
  StatusBar,
  Text,
  Dimensions,
  ScrollView,
} from "react-native";
import Button from "../components/Button";
import Header from "../components/header";
import { Error } from "./Error";
import { useLoader } from "../lib/UseLoading";
import { Appcontext } from "../lib/appcontext";
import { useContext, useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";

import MqttContext from "../lib/mqttContext";
import { Message } from "react-native-paho-mqtt";
import UserHeader from "../components/UserHeader";

export default function Main({ navigation, route }) {
  const { logOutUser, fetchLogin } = useContext(Appcontext);
  const { myStorage } = useContext(MqttContext);
  const { loading, error, data, reload } = useLoader(
    async () => await fetchLogin()
  );
  useEffect(() => {
    try {
      myStorage.setItem("myUser", route.params.user);
      myStorage.setItem("myPass", route.params.pass);
    } catch (error) {
      console.log("====================================");
      console.log("storgae problem in login");
      console.log("====================================");
    }
  }, []);
  const handelLogOut = async () => {
    try {
      const res = await logOutUser({});
      navigation.navigate("Home");
    } catch (error) {}
  };
  if (error) {
    navigation.navigate("Error", { error: error.toString() });
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
        <ScrollView
          contentOffset={{ x: 0, y: -80 }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: 20,
            paddingBottom: 50,
          }}
          style={styles.scroller}
        >
          <Header />
          <UserHeader data={data} />
          <View style={styles.menu}>
            <Button
              title={"Devices"}
              onPress={() => navigation.navigate("Devices")}
              backgroundColor={"green"}
            />
            <Button
              title={"Locations"}
              onPress={() => navigation.navigate("Locations")}
              backgroundColor={"green"}
            />
            {/*  <Button
              title={"logs"}
              onPress={() => navigation.navigate("Home")}
              backgroundColor={"green"}
            /> */}
            <Button
              onPress={() => navigation.navigate("CreateUser")}
              title={"Create User"}
              backgroundColor={"green"}
            />

            <Button
              onPress={() => handelLogOut()}
              title={"Log Out"}
              backgroundColor={"gray"}
            />
          </View>
        </ScrollView>
        <StatusBar style="auto" />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 100, 0, 0.0)",
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
  menu: {
    marginTop: 60,
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
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
  scroller: {
    width: Dimensions.get("window").width - 10,
    height: 100,
  },
});
