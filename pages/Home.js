import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../components/Button";
import Header from "../components/header";

export default function Login({ navigation }) {
  return (
    <LinearGradient
      style={styles.gradient}
      colors={["rgba(0, 100, 0, 0.3)", "rgba(0, 100, 0, 0.9)"]}
    >
      <View style={styles.container}>
        <Header />

        <Button
          onPress={() => navigation.navigate("Login")}
          title={"Login"}
          backgroundColor={"green"}
        />

        <StatusBar style="auto" />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0, 100, 0, 0.0)",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.height : 0,
    image: {
      width: 100,
      height: 100,
    },
  },
  image: {
    backgroundColor: "rgba(0, 100, 200, 00)",
    flex: 4,
  },
  gradient: {
    flex: 1,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 0,
  },
});
