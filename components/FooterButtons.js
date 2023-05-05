import { Text, View, StyleSheet, Pressable } from "react-native";
import { Appcontext } from "../greenleaf/lib/appcontext";
import { useContext, useState } from "react";
export default function FooterButtons(props) {
  const { logOutUser } = useContext(Appcontext);

  const {
    onPressOne,
    onPressTwo,
    onPressTree,
    titleOne = "Open",
    titleTwo = "Edit",
    titleTree = "Delete",
    id,
    Textcolor = "white",
    backgroundColorOne = "green",
    backgroundColorTwo = "blue",
    backgroundColorTree = "red",
  } = props;
  const styles = StyleSheet.create({
    container: {
      Button: 0,

      alignItems: "flex-end",
      flexDirection: "row",
    },
    button: {
      paddingVertical: 8,

      //borderColor: "black",
      //borderWidth: 1,
      //borderRadius: 12,
      //marginTop: 10,
      //borderRadius: 10,
      width: "33.33%",

      // marginHorizontal: 10,
      backgroundColor: "black",
    },
    text: {
      fontSize: 10,
      textAlign: "center",
      alignSelf: "center",
      fontWeight: "bold",

      letterSpacing: 0.25,
      color: Textcolor,
    },
  });
  const buttonOneClicked = ({ pressed }) => {
    return [
      styles.button,
      {
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        backgroundColor: pressed
          ? backgroundColorOne
          : "dark" + backgroundColorOne,
      },
    ];
  };
  const buttonTwoClicked = ({ pressed }) => {
    return [
      styles.button,
      {
        backgroundColor: pressed
          ? backgroundColorTwo
          : "dark" + backgroundColorTwo,
      },
    ];
  };
  const buttonTreeClicked = ({ pressed }) => {
    return [
      styles.button,
      {
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: pressed
          ? backgroundColorTree
          : "dark" + backgroundColorTree,
      },
    ];
  };

  return (
    <View style={styles.container}>
      <Pressable style={buttonOneClicked} onPress={onPressOne}>
        <Text style={styles.text}>{titleOne}</Text>
      </Pressable>
      <Pressable style={buttonTwoClicked} onPress={onPressTwo}>
        <Text style={styles.text}>{titleTwo}</Text>
      </Pressable>
      <Pressable style={buttonTreeClicked} onPress={onPressTree}>
        <Text style={styles.text}>{titleTree}</Text>
      </Pressable>
    </View>
  );
}
