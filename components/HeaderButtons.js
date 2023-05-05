import { Text, View, StyleSheet, Pressable } from "react-native";
import { Appcontext } from "../greenleaf/lib/appcontext";
import { useContext } from "react";
export default function HeaderButtons(props) {
  const { logOutUser } = useContext(Appcontext);
  const {
    onPressFirst,
    onPressSec,
    titleOne = "Create",
    titleTwo = "Log Out",
    Textcolor = "white",
    backgroundColorOne = "green",
    backgroundColorTwo = "green",
  } = props;
  const styles = StyleSheet.create({
    container: {
      gap: 15,
      justifyContent: "center",
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      height: 80,
      backgroundColor: "#eae7e7",
      borderBottomWidth: 2,
      borderColor: "black",
    },
    button: {
      alignItems: "center",

      paddingVertical: 10,
      paddingHorizontal: 22,

      //borderColor: "black",
      //borderWidth: 1,
      //borderRadius: 12,
      //marginTop: 10,
      //borderRadius: 10,
      width: "33%",
      borderRadius: 14,
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
  const buttonOneClicked = ({ pressed }) => {
    return [
      styles.button,
      {
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
  const handelLogOut = async () => {
    const res = await logOutUser({});
    navigation.navigate("Home");
  };
  return (
    <View style={styles.container}>
      <Pressable style={buttonOneClicked} onPress={onPressFirst}>
        <Text style={styles.text}>{titleOne}</Text>
      </Pressable>
      <Pressable style={buttonTwoClicked} onPress={onPressSec}>
        <Text style={styles.text}>{titleTwo}</Text>
      </Pressable>
    </View>
  );
}
