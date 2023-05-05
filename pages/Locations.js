import {
  StyleSheet,
  View,
  Platform,
  StatusBar,
  Text,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLoader } from "../lib/UseLoading";
import { Appcontext } from "../lib/appcontext";
import { useContext, useState, useEffect } from "react";
import Location from "../components/Location";

import ButtonSmall from "../components/ButtonSmall";

export default function Locations({ navigation, route }) {
  const [isReload, setIsReload] = useState(route.params?.reloadData);
  const { removeLocation } = useContext(Appcontext);
  const { logOutUser, listLocations } = useContext(Appcontext);
  const { loading, error, data, reload } = useLoader(async () => {
    try {
      const res = await listLocations();
      console.log("data ? ", res);
      return res;
    } catch (error) {
      navigation.navigate("Error", { error: error.toString() });
    }
  });
  useEffect(() => {
    try {
      reload();
    } catch (error) {
      navigation.navigate("Error", { error: error.toString() });
    }
  }, [route.params?.reloadData]);
  async function handelRemoveItem(val) {
    try {
      await removeLocation({ _id: val });
      navigation.navigate("Locations");
      reload();
    } catch (error) {
      //setError(e);
      if (error.status === 401) {
        navigation.navigate("Error", { error: "Not Logged in" });
      } else if (error.status === 403) {
        navigation.navigate("ErrorAdmin", { error: "Not Logged in as Admin" });
      } else navigation.navigate("Error", { error: error.toString() });
      console.log("error in remove item  ", error);
      //navigate("/error");
    }
  }
  async function handelEditItem(loc) {
    console.log("reaload stuff", route.params?.reloadData);
    navigation.navigate("LocationEdit", {
      _id: loc._id,
      location: loc.location,
      reloadData: route.params?.reloadData ? false : true,
    });
  }
  async function handelOpen(loc) {
    console.log("stuff", loc.location);
    navigation.navigate("MainDashboard", {
      location: loc.location,
      id: loc._id,
      city: loc.city,
    });
  }

  if (isReload) {
    reload();
  }
  if (error) {
    if (error.status === 401) {
      navigation.navigate("Error", { error: "Not Logged in" });
    } else navigation.navigate("Error", { error: error.toString() });
  }
  if (loading) {
    return <Text>Loading....</Text>;
  }
  return (
    <LinearGradient
      style={styles.gradient}
      colors={["rgba(0, 100, 0, 0.3)", "rgba(0, 100, 0, 0.9)"]}
    >
      <View style={styles.container}>
        <ButtonSmall
          onPress={() =>
            navigation.navigate("CreateLocation", {
              reloadData: route.params?.reloadData ? false : true,
            })
          }
        />

        <View style={styles.card}>
          <ScrollView
            contentOffset={{ x: 0, y: -80 }}
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: 20,
              paddingBottom: 1200,
            }}
            style={styles.scroller}
          >
            {data?.map((loc, i) => {
              return (
                <Location
                  key={loc._id}
                  style={{ height: "50%", backgroundColor: "#eae7e7" }}
                  loc={loc}
                  index={loc._id}
                  handelOpen={handelOpen}
                  handelEditItem={handelEditItem}
                  handelRemoveItem={handelRemoveItem}
                />
              );
            })}
          </ScrollView>
        </View>

        <StatusBar style="auto" />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",

    paddingTop: Platform.OS === "android" ? StatusBar.height : 0,
  },
  card: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    // backgroundColor: "#eae7e7",

    paddingTop: Platform.OS === "android" ? StatusBar.height : 0,
  },
  scroller: {
    width: Dimensions.get("window").width - 10,
    height: 100,
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
