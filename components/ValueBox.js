import React from "react";
import { View, StyleSheet, Text } from "react-native";

export default function ValueBox({ name, value }) {
  return (
    <View style={styles.container}>
      <Text style={styles.top}>{name}</Text>
      <Text style={styles.bottom}>{value}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: 90,

    width: 110,
    backgroundColor: "rgba(0, 100, 0, 0.5)",
    borderColor: "darkgreen",
    borderWidth: 2,
  },
  top: {
    margin: 10,
    fontSize: 18,
    color: "white",
    fontWeight: "900",
  },
  bottom: {
    fontSize: 18,
    color: "white",
    fontWeight: "900",
  },
});
