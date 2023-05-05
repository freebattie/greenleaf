import { useContext, useState } from "react";
import { Appcontext } from "../greenleaf/lib/appcontext";
import { useLoader } from "../greenleaf/lib/UseLoading";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  Dimensions,
  TextInput,
  Pressable,
} from "react-native";
import Button from "./Button";
import Header from "./header";
import FooterButtons from "./FooterButtons";

export default function Location({
  handelOpen,
  handelEditItem,
  handelRemoveItem,
  loc,
}) {
  const [isOpenPressed, setIsOpenPressed] = useState(false);
  const [isEditPressed, setIsEditPressed] = useState(false);
  const [isDeletePressed, setIsDeletePressed] = useState(false);
  const [isCreatePressed, setIsCreatePressed] = useState(false);
  const buttonOpenClicked = ({ pressed }) => {
    return [
      styles.save,
      {
        backgroundColor: pressed ? "green" : "darkgreen",
      },
    ];
  };
  const buttonClicked = ({ pressed }) => {
    return [
      styles.button,
      {
        backgroundColor: pressed ? "green" : "darkgreen",
      },
    ];
  };
  const buttonDeleteClicked = ({ pressed }) => {
    return [
      styles.deleteButton,
      {
        backgroundColor: !pressed ? "darkgray" : "gray",
      },
    ];
  };

  console.log("loc in location is", loc.location);
  return (
    <View style={styles.container}>
      <View style={styles.inputs}>
        <Text style={styles.input}>Location: {loc.location}</Text>
        <Text style={styles.input}>City: {loc.city}</Text>
        <Pressable style={buttonOpenClicked} onPress={() => handelOpen(loc)}>
          <Text style={styles.text}>{"Dashboard"}</Text>
        </Pressable>
      </View>
      <View style={styles.buttons}>
        <Pressable style={buttonClicked} onPress={() => handelEditItem(loc)}>
          <Text style={styles.text}>{"edit"}</Text>
        </Pressable>
        <Pressable
          style={buttonDeleteClicked}
          onPress={() => handelRemoveItem(loc._id)}
        >
          <Text style={styles.text}>{"remove"} </Text>
        </Pressable>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0, 100, 0, 0.7)",
    borderColor: "darkgreen",
    borderWidth: 4,
    flexDirection: "row",
    paddingTop: Platform.OS === "android" ? StatusBar.height : 0,
    height: 220,
    borderRadius: 25,
    flex: 1,

    marginBottom: 15,
    padding: 10,
  },
  inputs: {
    backgroundColor: "rgba(0, 100, 0, 0.0)",
  },
  input: {
    alignSelf: "flex-start",
    color: "white",
    marginTop: 10,
    fontSize: 22,
  },
  buttons: {
    marginTop: 90,
    flex: 1,
    gap: 5,
  },
  deleteButton: {
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "darkred",
    borderRadius: 5,
  },
  save: {
    borderRadius: 5,
    paddingVertical: 15,
    borderWidth: 2,
    marginTop: 50,
    borderColor: "dargreen",
    backgroundColor: "darkgreen",
    width: "80%",
  },
  button: {
    borderRadius: 5,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: "dargreen",
    backgroundColor: "darkgreen",
    //borderColor: "black",
    //borderWidth: 1,
    //borderRadius: 12,
    //marginTop: 10,
    //borderRadius: 10
    // marginHorizontal: 10,
  },
  buttonClicked: {
    borderRadius: 14,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: "dargreen",
    backgroundColor: "green",
    //borderColor: "black",
    //borderWidth: 1,
    //borderRadius: 12,
    //marginTop: 10,
    //borderRadius: 10
    // marginHorizontal: 10,
  },
  text: {
    fontSize: 18,

    textAlign: "center",

    fontWeight: "bold",

    letterSpacing: 0.25,
    color: "white",
  },
  footer: {},
});
