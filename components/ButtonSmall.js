import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";

export default function ButtonSmall(props) {
  const {
    onPress,
    title = "Create Location",
    Textcolor = "white",
    backgroundColor = "green",
    width = "60%",
  } = props;
  const styles = StyleSheet.create({
    button: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 20,
      paddingHorizontal: 42,
      //borderColor: "black",
      //borderWidth: 1,
      //borderRadius: 12,
      //marginTop: 10,
      //borderRadius: 10,
      width: width,
      marginTop: 20,
      marginLeft: 10,
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
