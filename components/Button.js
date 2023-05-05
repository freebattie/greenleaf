import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";

export default function Button(props) {
  const {
    onPress,
    title = "ok",
    Textcolor = "white",
    backgroundColor = "green",
  } = props;
  const styles = StyleSheet.create({
    button: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 42,
      //borderColor: "black",
      //borderWidth: 1,
      //borderRadius: 12,
      //marginTop: 10,
      //borderRadius: 10,
      width: "70%",
      marginTop: 20,
      borderRadius: 5,
      elevation: 3,
      // marginHorizontal: 10,
      backgroundColor: "black",
    },
    text: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: "bold",
      letterSpacing: 0.25,
      color: Textcolor,
    },
  });
  const buttonClicked = ({ pressed }) => {
    return [
      styles.button,
      { backgroundColor: pressed ? backgroundColor : "dark" + backgroundColor },
    ];
  };
  return (
    <Pressable style={buttonClicked} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}
