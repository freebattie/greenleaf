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

import Button from "../components/Button";
import Header from "../components/header";

import { Appcontext } from "../lib/appcontext";
import { useContext, useState, useEffect } from "react";
import MqttContext from "../lib/mqttContext";
import { Message } from "react-native-paho-mqtt";
import ValueBox from "../components/ValueBox";
import AlarmBox from "../components/AlarmBox";

export default function MainDashboard({ navigation, route }) {
  const { getLatestLocationAlarmLogs, fetchLogin } = useContext(Appcontext);
  const [temp, setTemp] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [lux, setLux] = useState(0);
  const [heater, setHeater] = useState(false);
  const [window, setWindow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [door, setDoor] = useState(false);
  const [refrashLog, setrefrashLog] = useState(false);
  const { mqttClient, myStorage } = useContext(MqttContext);

  const onMessageResived = async (message) => {
    const topic = await message.destinationName;
    console.log("TESING" + topic);
    if (await topic.endsWith("/live")) {
      let data = await JSON.parse(message.payloadString);
      setLux(data.lux.toFixed(2));
      setTemp(data.temp.toFixed(2));
      setHumidity(data.humidity.toFixed(2));
    } else if (topic.endsWith("/alarm")) {
      setrefrashLog((lastState) => !lastState);
      console.log("alawasy here error?? ");
      let data = await JSON.parse(message.payloadString);
      console.log("==============ALARM IS ===================");
      console.log(data);
      console.log("====================================");
      if (data.type.toLowerCase() == "alarm") {
        if (data.name == "door") {
          setDoor(data.status);
        } else if (data.name == "heater") {
          setHeater(data.status);
        } else if (data.name == "window_open") {
          setWindow(data.status);
        }
      }
    }
  };
  const pullData = async () => {
    console.log("====================================");
    console.log("you get called to many times???");
    console.log("====================================");
    try {
      const mqttuser = myStorage.getItem("myUser");
      const mqttpass = myStorage.getItem("myPass");

      if (await mqttClient.isConnected()) {
        console.log("MQTT client is already connected");
        // await mqttClient.disconnect();
      } else {
        //await setMqttClient(client);
        await mqttClient.connect({
          userName: mqttuser,
          password: mqttpass,
          ConnectOptions: { clientId: mqttuser },
        });
      }

      await mqttClient.subscribe(
        `locations/${route.params?.location.toLowerCase()}/alarm`
      );
      await mqttClient.subscribe(
        `locations/${route.params?.location.toLowerCase()}/live`
      );

      mqttClient.on("messageReceived", onMessageResived);
    } catch (error) {}
  };
  const reset = async () => {
    try {
      await mqttClient.unsubscribe(
        `locations/${route.params?.location.toLowerCase()}/live`
      );

      await mqttClient.unsubscribe(
        `locations/${route.params?.location.toLowerCase()}/alarm`
      );

      await mqttClient.removeListener("messageReceived", onMessageResived);

      console.log("==============ALARM IS ===================");
      await mqttClient.disconnect();
      console.log("disconnected");
    } catch (error) {
      navigation.navigate("Error", { error: error.toString() });
    }
  };
  useEffect(() => {
    try {
      setLoading(true);
      console.log("y good?");
      pullData();
      console.log("u sure??");
      setLoading(false);
    } catch (error) {
      navigation.navigate("Error", { error: error.toString() });
    }

    return () => {
      try {
        reset();
      } catch (error) {
        navigation.navigate("Error", { error: error.toString() });
      }
    };
  }, []);
  const getAlarmStatus = async () => {
    try {
      setLoading(true);
      const alarms = await getLatestLocationAlarmLogs(route.params?.location);
      console.log(alarms);
      if (alarms.length > 0) {
        for (const alarm of alarms) {
          if (alarm?.name === "door") {
            setDoor(alarm.status);
          } else if (alarm?.name === "window_open") {
            setWindow(alarm.status);
          } else if (alarm?.name === "heater") {
            setHeater(alarm.status);
          }
        }
        setLoading(false);
      } else throw new Error("no alarms");
    } catch (error) {
      navigation.navigate("Error", { error: error.toString() });
    }
  };
  useEffect(() => {
    getAlarmStatus();
  }, []);

  if (loading) {
    return <Text>Loading....</Text>;
  }
  return (
    <LinearGradient
      style={styles.gradient}
      colors={["rgba(0, 100, 0, 0.3)", "rgba(0, 100, 0, 0.9)"]}
    >
      <ScrollView
        contentInset={{ top: 0, bottom: 20 }}
        contentOffset={{ x: 0, y: -80 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: 20,
          paddingBottom: 20,
        }}
        style={styles.scroller}
      >
        <View style={styles.container}>
          <View
            style={{
              flexDirection: "row",
              marginTop: 40,
              gap: 8,
              justifyContent: "center",
            }}
          >
            <ValueBox name={"temp"} value={temp} />
            <ValueBox name={"Humidity"} value={humidity} />
            <ValueBox name={"Lux"} value={lux} />
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: 18,
              gap: 5,
              justifyContent: "center",
            }}
          >
            <AlarmBox name={"Heater"} value={heater} />
            <AlarmBox name={"Door"} value={door} />
            <AlarmBox name={"Window"} value={window} />
          </View>
          <Button
            title={"Temp Graph"}
            onPress={() =>
              navigation.navigate("TempDashboard", {
                location: route.params?.location,
                id: route.params?.id,
                city: route.params?.city,
              })
            }
            backgroundColor={"green"}
          />
          <Button
            title={"Humidity Graph"}
            onPress={() =>
              navigation.navigate("HumidityDashboard", {
                location: route.params?.location,
                id: route.params?.id,
                city: route.params?.city,
              })
            }
            backgroundColor={"green"}
          />
          <Button
            title={"Sun Graph"}
            onPress={() =>
              navigation.navigate("SunDashboard", {
                location: route.params?.location,
                id: route.params?.id,
                city: route.params?.city,
              })
            }
            backgroundColor={"green"}
          />
          <Button
            onPress={() =>
              navigation.navigate("LuxDashboard", {
                location: route.params?.location,
                id: route.params?.id,
                city: route.params?.city,
              })
            }
            title={"Light Graph"}
            backgroundColor={"green"}
          />
          <Button
            onPress={() =>
              navigation.navigate("Logs", {
                location: route.params?.location,
                refresh: refrashLog,
              })
            }
            title={"Logs"}
            backgroundColor={"green"}
          />
          <Button
            onPress={() => navigation.navigate("Locations")}
            title={"back"}
            backgroundColor={"gray"}
          />
          <StatusBar style="auto" />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.height : 0,
  },

  scroller: {
    width: Dimensions.get("window").width - 1,
    height: 100,
  },
  input: {
    backgroundColor: "white",
    color: "black",
    width: "70%",
    height: 40,
    marginTop: 20,
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
