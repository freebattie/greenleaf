import {
  StyleSheet,
  View,
  Platform,
  StatusBar,
  Text,
  ScrollView,
  Dimensions,
  Switch,
} from "react-native";

import { useLoader } from "../greenleaf/lib/UseLoading";
import { Appcontext } from "../greenleaf/lib/appcontext";
import { useContext, useState, useEffect } from "react";

import Device from "../components/Device";
import { LinearGradient } from "expo-linear-gradient";
export default function Devices({ navigation }) {
  const [locData, setLocData] = useState();
  const [locLoading, setLocLoading] = useState(true);
  const [locError, setLocError] = useState();

  const { listDevices, listLocations } = useContext(Appcontext);

  const { loading, error, data, reload } = useLoader(async () => {
    try {
      const val = await listDevices();

      return val;
    } catch (error) {
      navigation.navigate("Error", { error: error.toString() });
    }
  });
  const loadLoc = async () => {
    setLocError(undefined);
    setLocLoading(true);
    try {
      const val = await listLocations();

      setLocData(val);
      setLocLoading(false);
    } catch (e) {
      setLocError("Missing cookie", e);
      navigation.navigate("Error", { error: error.toString() });
    } finally {
    }
  };
  useEffect(() => {
    loadLoc().catch((error) =>
      navigation.navigate("Error", { error: error.toString() })
    );
  }, []);

  if (error || locError) {
    if (error?.status === 401) {
      navigation.navigate("Error", { error: "bad user name or password" });
    } else navigation.navigate("Error", { error: locError });
  }
  if (loading || locLoading) {
    return <Text>Loading....</Text>;
  }

  return (
    <LinearGradient
      style={styles.gradient}
      colors={["rgba(0, 100, 0, 0.3)", "rgba(0, 100, 0, 0.9)"]}
    >
      <View style={styles.container}>
        <ScrollView
          contentInset={{ top: 0, bottom: 100 }}
          contentOffset={{ x: 0, y: -80 }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: 20,
            paddingBottom: 400,
          }}
          style={styles.scroller}
        >
          {data?.map((loc, i) => {
            return (
              <Device key={i} loc={loc} reload={reload} locData={locData} />
            );
          })}
        </ScrollView>

        <StatusBar style="auto" />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingTop: Platform.OS === "android" ? StatusBar.height : 0,
  },
  textCard: {
    gap: 10,
  },
  dataCard: {
    gap: 10,
    marginLeft: 1,
    width: "90%",
  },
  card: {
    height: "100%",
    margin: 20,
    padding: 10,
    width: "90%",

    borderRadius: 15,
  },
  Vcontainer: {
    flex: 1,

    justifyContent: "flex-start",
    paddingBottom: 10,
    alignItems: "flex-start",
    width: "100%",
    flexDirection: "row",
    paddingTop: Platform.OS === "android" ? StatusBar.height : 0,
  },
  scroller: {
    width: Dimensions.get("window").width - 10,
    height: "100%",
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
