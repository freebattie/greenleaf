import React, { useEffect, useState } from "react";

import { Client, Message } from "react-native-paho-mqtt";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./pages/Home";
import CreateUser from "./pages/CreateUser";
import Login from "./pages/login";
import Main from "./pages/Main";
import Locations from "./pages/Locations";
import CreateLocation from "./pages/CreateLocation";
import { Error } from "./pages/Error";
import LocationEdit from "./pages/LocationEdit";
import Devices from "./pages/Devices";
import { ErrorAdmin } from "./pages/ErrorAdmin";
import { ErrorUser } from "./pages/ErrorUser";
import MqttContext from "./lib/mqttContext";
import MainDashboard from "./pages/MainDashboard";
import TempDashboard from "./pages/TempDashboard";
import LuxDashboard from "./pages/LuxDashboard";
import HumidityDashboard from "./pages/HumidityDashboard";
import SunDashboard from "./pages/SunDashboard";

import Logs from "./pages/Logs";

const Stack = createNativeStackNavigator();

export const IP = "192.168.0.106";
export default function App() {
  const [mqttClient, setMqttClient] = useState(null);

  const options = {
    headerStyle: {
      backgroundColor: "darkgreen",
      color: "white",
    },
    headerTitleStyle: {
      color: "#fff",
    },
    headerTintColor: "#fff", // set the back button arrow color to white
  };
  const myStorage = {
    setItem: (key, item) => {
      myStorage[key] = item;
    },
    getItem: (key) => myStorage[key],
    removeItem: (key) => {
      delete myStorage[key];
    },
  };

  useEffect(() => {
    try {
      const url = "ws://192.168.0.106:4001/ws";

      myStorage.setItem("myUrl", url);
      myStorage.setItem("myIP", IP);
      console.log("i am called when? ");

      const client = new Client({
        uri: url,
        clientId: "clientID",
        storage: myStorage,
      });
      if (client.isConnected()) {
        console.log("yep ");
      }

      setMqttClient(client);
      return () => {
        try {
        } catch (error) {
          console.log("APP JS TRUBEL");
        }
      };
    } catch (error) {
      console.log("TRUBBLES");
    }
  }, []);
  // Create a client instance

  // set event handlers

  // connect the client
  const contextValue = {
    mqttClient,
    setMqttClient,
    myStorage,
  };

  return (
    <NavigationContainer>
      <MqttContext.Provider value={contextValue}>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} options={options} />

          <Stack.Screen name="Login" component={Login} options={options} />

          <Stack.Screen
            name="CreateUser"
            component={CreateUser}
            options={options}
          />
          <Stack.Screen name="Main" component={Main} options={options} />
          <Stack.Screen
            name="Locations"
            component={Locations}
            options={options}
          />
          <Stack.Screen
            name="LocationEdit"
            component={LocationEdit}
            options={options}
          />
          <Stack.Screen name="Logs" component={Logs} options={options} />

          <Stack.Screen
            name="CreateLocation"
            component={CreateLocation}
            options={options}
          />
          <Stack.Screen name="Devices" component={Devices} options={options} />
          <Stack.Screen name="Error" component={Error} />
          <Stack.Screen
            name="ErrorAdmin"
            component={ErrorAdmin}
            options={options}
          />
          <Stack.Screen
            name="ErrorUser"
            component={ErrorUser}
            options={options}
          />
          <Stack.Screen
            name="MainDashboard"
            component={MainDashboard}
            options={options}
          />
          <Stack.Screen
            name="TempDashboard"
            component={TempDashboard}
            options={options}
          />

          <Stack.Screen
            name="SunDashboard"
            component={SunDashboard}
            options={options}
          />

          <Stack.Screen
            name="LuxDashboard"
            component={LuxDashboard}
            options={options}
          />
          <Stack.Screen
            name="HumidityDashboard"
            component={HumidityDashboard}
            options={options}
          />
        </Stack.Navigator>
      </MqttContext.Provider>
    </NavigationContainer>
  );
}
