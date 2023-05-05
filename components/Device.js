import { useContext, useState, useEffect } from "react";
import { Appcontext } from "../greenleaf/lib/appcontext";
import { useLoader } from "../greenleaf/lib/UseLoading";

import {
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  Switch,
  TextInput,
  Pressable,
} from "react-native";
import MyPicker from "./MyPicker";

import FooterButtons from "./FooterButtons";
import MqttContext from "../greenleaf/lib/mqttContext";
import { Client, Message } from "react-native-paho-mqtt";
import Button from "./Button";

export default function Device({ loc, locData, reload }) {
  const [activeDeviceName, setActiveDeviceName] = useState(loc.deviceName);

  const [activeLocation, setActiveLocation] = useState(
    loc.location ? loc.location : ""
  );
  const [activeBuild, setActiveBuild] = useState(
    activeDeviceName.build ? activeDeviceName.build : "DEV"
  );
  const [activeFW, setActiveFW] = useState(
    loc.fw?.toString() ? loc.fw?.toString() : "1"
  );
  const [isEnabled, setIsEnabled] = useState(loc.auto ? loc.auto : false);
  const [isFindMeEnabled, setIsFindMeEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const toggleFindMe = () =>
    setIsFindMeEnabled((previousState) => !previousState);
  const { mqttClient, myStorage } = useContext(MqttContext);
  const { getFW } = useContext(Appcontext);
  const [username, setUsername] = useState(loc.deviceName);
  const [password, setPassword] = useState(loc?.mqttPass ? loc?.mqttPass : "");
  const [load, setLoad] = useState(true);
  const [selectedVal, setSelectedVal] = useState("");
  const [maxFW, setMaxFW] = useState(0);
  const [fwlist, setFwlist] = useState([]);

  const getFWVersions = async () => {
    setLoad(true);
    const fwdatalist = () => {
      const data = [];
      for (let index = 1; index <= maxFW; index++) {
        data.push({ location: `${index}` });
      }
      return data;
    };
    try {
      const data = await getFW();
      console.log("data is ", data);
      if (activeBuild === "DEV") {
        setMaxFW(data.devFW);
      } else if (activeBuild === "PROD") {
        setMaxFW(data.prodFW);
      }

      const list = fwdatalist();
      setFwlist(list);

      setLoad(false);
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  };
  useEffect(() => {
    getFWVersions();
  }, []);
  const handelFindMe = async () => {
    try {
      const mqttuser = await myStorage.getItem("myUser");
      const mqttpass = await myStorage.getItem("myPass");
      toggleFindMe();
      if (mqttClient.isConnected()) {
        console.log("MQTT client is already connected");
      } else {
        //await setMqttClient(client);
        await mqttClient.connect({
          userName: mqttuser,
          password: mqttpass,
          ConnectOptions: { clientId: mqttuser },
        });
        await mqttClient.subscribe(`findMe`);
      }

      console.log("Connected to MQTT broker");

      console.log("it is ==???? ", isFindMeEnabled, loc.deviceName);
      const message = new Message(
        JSON.stringify({
          findMe: isFindMeEnabled,
          deviceName: loc.deviceName,
        })
      );
      message.destinationName = `findMe`;

      message.qos = 1;
      console.log("Sending message...");
      await mqttClient.send(message);
      console.log("Message sent successfully");
    } catch (error) {
      console.log(`An error occurred: ${error}`);
    }
  };
  const handelSaveDevice = async () => {
    try {
      const mqttuser = await myStorage.getItem("myUser");
      const mqttpass = await myStorage.getItem("myPass");

      if (mqttClient.isConnected()) {
        console.log("MQTT client is already connected");
      } else {
        //await setMqttClient(client);
        await mqttClient.connect({
          userName: mqttuser,
          password: mqttpass,
          ConnectOptions: { clientId: mqttuser },
        });
      }

      console.log("Connected to MQTT broker");
      if (activeLocation?.length > 0) {
        await mqttClient.subscribe(`devices/${activeLocation}/profile`);
      }

      console.log('Subscribed to "test" topic');

      let logging = activeLocation ? true : false;
      let location = activeLocation;
      location = location.toString().toLowerCase();
      console.log("shoud i log", logging);
      const message = new Message(`{
                "location":"${activeLocation.toLowerCase()}",
                "mqttPass":"${password}",
                "fw":"${activeFW}",
                "build":"${activeBuild}",
                "auto":${isEnabled},
                "deviceName":"${activeDeviceName}",
                "logging":${logging}
            }`);
      console.log("message is", message);
      message.destinationName = `devices/${activeDeviceName}/profile`;
      message.payloadString;
      message.qos = 1;
      console.log("Sending message...");
      await mqttClient.send(message);
      console.log("Message sent successfully");
      loc.deviceName = username;

      //reload();
    } catch (error) {
      console.log(`An error occurred: ${error}`);
    }
  };
  const buttonClicked = ({ pressed }) => {
    return [
      styles.buttonSave,
      {
        backgroundColor: pressed ? "green" : "darkgreen",
      },
    ];
  };

  const reset = async () => {
    try {
      if (mqttClient.isConnected()) {
        await mqttClient.unsubscribe(`locations/${activeLocation}/profile`);
        await mqttClient.unsubscribe(`locations/${activeLocation}`);
        console.log("==============ALARM IS ===================");
        await mqttClient.disconnect();
        console.log("disconnected");
      }
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  };
  useEffect(() => {
    getFWVersions();
  }, [activeBuild]);

  if (load) {
    return <Text>LOADING</Text>;
  }
  return (
    <View style={styles.card}>
      <View style={styles.Vcontainer}>
        <View style={styles.dataCard}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: 900,
              alignSelf: "center",
              marginBottom: 20,
              color: "white",
            }}
          >
            Name: {loc.deviceName}
          </Text>
          {selectedVal == "location" ? (
            <View>
              <MyPicker
                name="Location"
                current={activeLocation}
                setData={(val) => setActiveLocation(val)}
                data={locData}
              />
              <Button title={"Location"} onPress={() => setSelectedVal("")} />
            </View>
          ) : (
            <Button
              title={"location"}
              onPress={() => setSelectedVal("location")}
            />
          )}
          {selectedVal == "build" ? (
            <View>
              <MyPicker
                name="Build"
                current={activeBuild}
                setData={(val) => setActiveBuild(val)}
                data={[{ location: "DEV" }, { location: "PROD" }]}
              />
              <Button title={"Build"} onPress={() => setSelectedVal("")} />
            </View>
          ) : (
            <Button title={"Build"} onPress={() => setSelectedVal("build")} />
          )}
          {!isEnabled && selectedVal == "fw" ? (
            <View>
              <MyPicker
                name="FW"
                current={activeFW}
                setData={(val) => setActiveFW(val)}
                data={fwlist}
              />
              <Button title={"FW"} onPress={() => setSelectedVal("")} />
            </View>
          ) : (
            !isEnabled && (
              <Button title={"FW"} onPress={() => setSelectedVal("fw")} />
            )
          )}
          <View>
            <Text style={{ color: "white" }}>Auto Update: </Text>
            <Switch
              style={{ width: "20%" }}
              trackColor={{ false: "gray", true: "green" }}
              thumbColor={isEnabled ? "darkgreen" : "gray"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
          {selectedVal == "" && (
            <View>
              <View style={styles.mqttText}>
                <Text style={{ color: "white", alignSelf: "baseline" }}>
                  User:{" "}
                </Text>
                <Text style={{ color: "white", alignSelf: "flex-end" }}>
                  Pass:{" "}
                </Text>
              </View>
              <View style={styles.mqtt}>
                <TextInput
                  style={styles.input}
                  onChangeText={(user) => setUsername(user)}
                  value={username}
                  placeholder="UserName.."
                />

                <TextInput
                  style={styles.input}
                  placeholder="Password.."
                  secureTextEntry={true}
                  onChangeText={(pass) => setPassword(pass)}
                  value={password}
                />
              </View>

              <Text style={{ fontSize: 25, color: "white" }}>
                Logging: {activeLocation?.length > 0 ? "ACTIVE" : "INACTIVE"}
              </Text>
              <View style={styles.mqtt}>
                <Pressable style={buttonClicked} onPress={handelSaveDevice}>
                  <Text style={styles.text}>{"Save"} </Text>
                </Pressable>
                <Pressable style={buttonClicked} onPress={handelFindMe}>
                  <Text style={styles.text}>{"Find"} </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </View>

      {/*   <FooterButtons
          style={{ flex: 2 }}
          titleOne="SAVE"
          titleTwo="RESET"
          titleTree="FIND"
          backgroundColorTree="blue"
          backgroundColorTwo="red"
          onPressTree={handelFindMe}
          onPressTwo={handelRestValues}
          onPressOne={handelSaveDevice}
        /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  textCard: {
    gap: 10,
    color: "white",
    alignSelf: "center",
  },
  buttonSave: {
    marginTop: 10,
    borderRadius: 5,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: "dargreen",
    width: "40%",
    backgroundColor: "green",
  },

  mqttText: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 90,
    justifyContent: "space-between",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  dataCard: {
    gap: 10,
    marginLeft: 1,
    width: "90%",
    color: "white",
  },
  mqtt: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "rgba(0, 100, 0, 0.3)",
    height: 600,
    margin: 20,
    padding: 10,
    width: "90%",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 15,
  },
  Vcontainer: {
    flex: 1,

    justifyContent: "flex-start",
    paddingBottom: 10,
    alignItems: "flex-start",
    width: "100%",

    paddingTop: Platform.OS === "android" ? StatusBar.height : 0,
  },
  input: {
    backgroundColor: "white",
    color: "black",
    width: "44%",
    height: 50,
    marginTop: 10,
  },
});
