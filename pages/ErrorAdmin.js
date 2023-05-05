import { Text, View, StyleSheet, StatusBar, Platform } from "react-native";
import Button from "../components/Button";

export function ErrorAdmin({ route, navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.warning}>
        <Text style={styles.text}>An error occurred {route.params.error}</Text>
      </View>
      <View>
        <Button
          onPress={() => navigation.navigate("Main")}
          title={"Back"}
          backgroundColor={"red"}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eae7e7",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.height : 0,
  },
  warning: {
    backgroundColor: "pink",
    borderColor: "red",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: "white",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    alignSelf: "stretch",
    fontSize: 14,
  },
  text: {
    color: "black",
    fontSize: 22,
  },
});
