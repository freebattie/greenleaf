import React from "react";
import { View, StyleSheet, Text } from "react-native";

export default function AlarmBox({ name, value }) {
  const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      height: 90,
      margin: 1,
      width: 115,
      backgroundColor: "rgba(0, 100, 0, 0.5)",

      borderColor: value ? "darkred" : "darkgreen",
      borderWidth: 2,
    },
    top: {
      margin: 1,
      fontSize: 18,
      color: value ? "darkred" : "white",
      fontWeight: "900",
    },
    bottom: {
      fontSize: 18,
      color: value ? "darkred" : "white",
      fontWeight: "900",
    },
  });
  return (
    <View style={styles.container}>
      <Text style={styles.top}>{name}</Text>
      <Text style={styles.bottom}>{value ? "ALARM" : "OK"}</Text>
    </View>
  );
}
