import {
  StyleSheet,
  View,
  Platform,
  StatusBar,
  Text,
  ScrollView,
  Dimensions,
  PixelRatio,
} from "react-native";
import Button from "../components/Button";
import Header from "../components/header";
import { Error } from "./Error";
import { useLoader } from "../lib/UseLoading";
import { Appcontext } from "../lib/appcontext";
import { useContext, useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
//import ScrollableTabView from "react-native-scrollable-tab-view";

import { LineChart } from "react-native-chart-kit";
import MyPicker from "../components/MyPicker";
export default function TempDashboard({ navigation, route }) {
  // const { ,  } = useContext(Appcontext);
  //const { mqttClient, myStorage } = useContext(MqttContext);
  const [loc, setLoc] = useState(route.params?.location);
  const [data, setData] = useState();
  const [labels, setLabels] = useState();
  const [interval, setInterval] = useState("1");
  const { getLocationDataInterVal } = useContext(Appcontext);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [selectedValue, setSelectedValue] = useState(0);
  const [width, setWidth] = useState(0);
  const [overlay, setOverlay] = useState(false);
  const getTempData = async () => {
    setLoading(true);
    try {
      let resData = await getLocationDataInterVal(
        route.params?.location,
        interval
      );
      if (resData.length > 0) {
        let tempature = await resData.map((data) => {
          return data.temp;
        });

        const size = tempature.length;
        const step = Math.floor(
          (size - 2) / (interval != 1 ? interval - 2 : 4)
        );
        const stepLabel = Math.floor((size - 2) / 4);

        const indices = Array.from(
          { length: interval != 1 ? interval - 1 : 5 },
          (notUsed, i) => (i === 0 ? 0 : i * step)
        );
        const indicesLabels = Array.from({ length: 5 }, (notUsed, i) =>
          i === 0 ? 0 : i * stepLabel
        );
        const values = indices.map((index) => tempature[index]);

        // add last index value
        values.push(tempature[size - 1]);

        const tmp = await resData.map((data) => {
          const date = new Date(data.createdAt);

          const hours = date.getHours().toString().padStart(2, "0");
          const minutes = date.getMinutes().toString().padStart(2, "0");
          return `${hours}:${minutes}`;
        });
        const newlabels = indices.map((index) => tmp[index]);
        newlabels.push(tmp[size - 1]);
        console.log("array of temp", values, newlabels);

        setLabels(newlabels);
        setData(values);
        setLoading(false);
        setError(false);
      } else {
        setError(true);
      }
    } catch (error) {
      navigation.navigate("Error", { error: error.toString() });
    }
  };
  useEffect(() => {
    try {
      getTempData();
    } catch (error) {
      navigation.navigate("Error", { error: error.toString() });
    }
  }, [interval]);
  if (error) {
    navigation.navigate("Error", {
      error: `Missing datapoints wait ${interval}h`,
    });
  }
  if (loading) {
    return <Text>Loading....</Text>;
  }
  const styles = StyleSheet.create({
    selected: {
      position: "absolute",
      top: top,

      backgroundColor: "rgba(0, 100, 0, 0.3)",
      height: 40,
      width: 100,
      left: left,
      textAlign: "center",
      alignItems: "center",

      zIndex: 2,
    },
    container: {
      width: "100%",

      paddingTop: Platform.OS === "android" ? StatusBar.height : 0,
    },

    gradient: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      zIndex: 0,
    },
  });

  return (
    <LinearGradient
      style={styles.gradient}
      colors={["rgba(0, 100, 0, 0.3)", "rgba(0, 100, 0, 0.9)"]}
    >
      <View style={styles.container}>
        <View
          onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
          style={{
            position: "absolute",
            top: 0,
            left: 6,
            right: 0,
            bottom: 0,
            width: Dimensions.get("window").width - 14,
            height: 100,
            alignSelf: "center",
            flex: 1,
            backgroundColor: "rgba(0, 100, 0, 0.0)",
            display: "flex",
            zIndex: 2,
          }}
        ></View>
        <ScrollView horizontal={true}>
          <LineChart
            verticalLabelRotation={80} //Degree to rotate
            onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
            onTouchStart={(e) => {
              setOverlay(true);
              console.log("touchMove", top);
            }}
            onTouchEnd={(e) => {
              setTop(0);
              setLeft(0);
              setOverlay(false);
            }}
            onDataPointClick={(e) => {
              console.log("masoud", e);
              setSelectedValue(e.value);
              setTop(e.y - 20);
              setLeft(e.x - styles.selected.width / 2);
              setOverlay(!overlay);
            }}
            bezier
            data={{
              labels: labels.map((label) => {
                return label;
              }),
              datasets: [
                {
                  data: data,
                  strokeWidth: 2,
                },
                {
                  data: [40], //highest graph value
                  withDots: false, //a flage to make it hidden
                },
                {
                  data: [15], //highest graph value
                  withDots: false, //a flage to make it hidden
                },
              ],
              legend: [`Temp for the last ${interval}h`],
            }}
            width={Dimensions.get("window").width * (interval != 24 ? 1 : 1.3)}
            height={300}
            chartConfig={{
              backgroundGradientFromOpacity: 0,
              backgroundGradientFrom: `black`,
              backgroundGradientTo: `black`,
              backgroundGradientToOpacity: 0.0,

              fillShadowGradientFrom: "blue",
              fillShadowGradientTo: "blue", // setter fargen under linjen

              propsForLabels: {},

              propsForBackgroundLines: {
                strokeWidth: 0,
              },

              yAxisSuffix: "c",
              decimalPlaces: 0,

              color: (opacity = 1) => `black`, //setter fargen på linjen og x/y
              style: {
                borderRadius: 0,
              },
            }}
            style={{
              borderRadius: 10,
              alignSelf: "center",
            }}
          />
          {overlay != 0 && (
            <View style={styles.selected}>
              <Text>{"Temp"}</Text>
              <Text>{selectedValue}</Text>
              <View
                style={{
                  width: 0,
                  height: 0,
                  backgroundColor: "transparent",
                  borderStyle: "solid",
                  borderLeftWidth: 12,
                  borderRightWidth: 12,
                  borderBottomWidth: 22,
                  borderLeftColor: "transparent",
                  borderRightColor: "transparent",
                  borderBottomColor: "rgba(0, 100, 0, 0.3)",
                  transform: [{ rotate: "180deg" }],
                  zIndex: 0,
                }}
              ></View>
            </View>
          )}
        </ScrollView>
        <View style={{ margin: 22 }}>
          <MyPicker
            data={[{ location: "1" }, { location: "6" }, { location: "24" }]}
            name={"Hours"}
            setData={(val) => setInterval(val)}
            current={interval}
          />
        </View>

        <StatusBar style={{ backgroundColor: "green" }} />
      </View>
    </LinearGradient>
  );
}
