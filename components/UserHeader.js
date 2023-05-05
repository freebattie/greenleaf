import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";

export default function UserHeader({ data }) {
  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",

          marginLeft: 20,
        }}
      >
        <View>
          <Image
            style={styles.headerImage}
            source={require("../assets/profile.jpg")}
          />
        </View>
        <View>
          <Text style={styles.text}>
            User name: {data?.name ? data.name : "missing"}
          </Text>
          <Text style={styles.text2}>
            Role: {data?.role ? data.role : "missing"}
          </Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",

    marginLeft: 20,
    marginTop: 1,
    fontSize: 20,
    height: 100,
    width: 300,
    fontWeight: "900",
    borderWidth: 2,
    backgroundColor: "rgba(0, 100, 0, 0.7)",

    borderRadius: 5,
    borderColor: "darkgreen",
  },
  text: {
    fontSize: 20,
    fontWeight: "900",
    color: "white",
    marginBottom: 5,
  },
  text2: {
    fontSize: 15,
    fontWeight: "900",
    color: "white",
    marginBottom: 5,
  },
  headerImage: {
    resizeMode: "stretch",
    borderRadius: 50,
    backgroundColor: "red",
    marginRight: 30,
    height: 60,
    width: 60,
  },
});
