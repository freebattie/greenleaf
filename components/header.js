import React from "react";
import { Platform, Image, View, StyleSheet } from "react-native";

export default function Header() {
  return (
    <View style={styles.header}>
      <Image
        style={styles.headerImage}
        source={require("../assets/logo.png")}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    height: 200,
    width: "100%",

    alignSelf: "flex-start",
  },
  headerImage: {
    alignSelf: "center",
    resizeMode: "contain",
    marginRight: 20,
    height: Platform.OS === "web" ? "50%" : "80%",
    width: Platform.OS === "web" ? "20%" : "80%",
  },
  image: {
    backgroundColor: "white",
    flex: 4,
  },
});
