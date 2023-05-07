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
import MqttContext from "../lib/mqttContext";
import Button from "../components/Button";

export default function Locations({ navigation, route }) {
  const [isReload, setIsReload] = useState(false);
  const { mqttClient, myStorage } = useContext(MqttContext);

  const { getLocationAlarmLogs } = useContext(Appcontext);
  const { loading, error, data, reload } = useLoader(async () => {
    try {
      console.log("sending this to it ", route.params?.location);
      const res = await getLocationAlarmLogs(route.params?.location);
      console.log("data ? ", res);
      return res;
    } catch (error) {
      navigation.navigate("Error", { error: error.toString() });
    }
  });
  const onMessageResived = async (message) => {
    const topic = message.destinationName;

    if (topic.endsWith("/alarm")) {
      let data = await JSON.parse(message.payloadString);
      console.log("WHY U NOT HERE??");
      if (data.status == "ALARM") {
        setIsReload((lastState) => !lastState);
      }
    }
  };
  const pullData = async () => {
    try {
      const mqttuser = myStorage.getItem("myUser");
      const mqttpass = myStorage.getItem("myPass");

      if (await mqttClient.isConnected()) {
        console.log("MQTT client is already connected");
      } else {
        //await setMqttClient(client);
        await mqttClient.connect({
          userName: mqttuser,
          password: mqttpass,
          ConnectOptions: { clientId: mqttuser },
        });
        await mqttClient.subscribe(
          `locations/${route.params?.location.toLowerCase()}/alarm`
        );
      }
      mqttClient.on("messageReceived", onMessageResived);
    } catch (error) {
      console.log("bad ide");
    }
  };
  const reset = async () => {
    try {
      if (mqttClient.isConnected()) {
        await mqttClient.removeListener("messageReceived", onMessageResived);
      }
    } catch (error) {
      navigation.navigate("Error", { error: error.toString() });
    }
  };
  useEffect(() => {
    pullData();

    return () => {
      reset();
    };
  }, []);
  useEffect(() => {
    try {
      reload();
    } catch (error) {
      navigation.navigate("Error", { error: error.toString() });
    }
  }, [isReload]);

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
        <ButtonSmall title="refresh" width={"40%"} onPress={() => reload()} />
        <ScrollView
          contentOffset={{ x: 0, y: -80 }}
          contentContainerStyle={{
            flexGrow: 1,

            paddingBottom: 1220,
          }}
          style={styles.scroller}
        >
          <View style={styles.card}>
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "rgba(0, 100, 0, 0.6)",
                alignItems: "stretch",
                flex: 1,
                justifyContent: "space-around",
                height: 40,
              }}
            >
              <Text style={{ flex: 1, fontSize: 20, fontWeight: 900 }}>
                TIME
              </Text>
              <Text style={{ flex: 1, fontSize: 20, fontWeight: 900 }}>
                {" "}
                TYPE
              </Text>
              <Text style={{ flex: 1, fontSize: 20, fontWeight: 900 }}>
                NAME
              </Text>
              <Text style={{ flex: 1, fontSize: 20, fontWeight: 900 }}>
                STATUS
              </Text>
            </View>

            {data?.map((loc, i) => {
              const date = new Date(loc.createdAt);
              const day = date.getDay();
              const month = date.getMonth() + 1;
              const hours = date.getHours();
              const min = date.getMinutes();
              return (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "darkgray",
                    flex: 1,
                    height: 60,
                    backgroundColor:
                      i % 2 == 0
                        ? "rgba(0, 100, 0, 0.8)"
                        : "rgba(0, 100, 0, 0.2)",
                    justifyContent: "space-around",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 900,
                      flex: 1,
                    }}
                  >{`[${day}/${month}]- ${hours}:${min}`}</Text>
                  <Text
                    style={{
                      flex: 1,
                      fontWeight: 900,
                      fontSize: 16,
                    }}
                  >
                    {loc.type}
                  </Text>
                  <Text
                    style={{
                      flex: 1.2,
                      fontWeight: 900,
                      fontSize: 16,
                    }}
                  >
                    {loc.name}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      width: 80,
                      fontWeight: 900,
                      color: loc.status ? "darkred" : "black",
                      fontSize: 16,
                    }}
                  >
                    {loc.status ? "ON" : "OFF"}
                  </Text>
                </View>
              );
            })}
          </View>
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
  card: {
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "Yellow",
    // backgroundColor: "#eae7e7",

    paddingTop: Platform.OS === "android" ? StatusBar.height : 0,
  },
  scroller: {
    width: Dimensions.get("window").width - 10,
  },
  gradient: {
    flex: 1,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
