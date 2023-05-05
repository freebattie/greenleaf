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

import { Appcontext } from "../greenleaf/lib/appcontext";
import { useContext, useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
//import ScrollableTabView from "react-native-scrollable-tab-view";

import { LineChart } from "react-native-chart-kit";
import MyPicker from "../components/MyPicker";
export default function TempDashboard({ navigation, route }) {
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
          return data.humidity;
        });
        const size = tempature.length;
        const step = Math.floor((size - 2) / 4);

        // lag 4 gjevnt sprett index slik eg kan hente veridene
        const indices = Array.from({ length: 5 }, (notUsed, i) =>
          i === 0 ? 0 : i * step
        );
        const values = indices.map((index) => tempature[index]);

        // add last index value
        values.push(tempature[size - 1]);
        const labelsInterval = Math.ceil(tempature.length / 6);

        const tmp = await resData.map((data) => {
          const date = new Date(data.createdAt);

          const hours = date.getHours().toString().padStart(2, "0");
          const minutes = date.getMinutes().toString().padStart(2, "0");
          return `${hours}:${minutes}`;
        });
        const labels = indices.map((index) => tmp[index]);
        labels.push(tmp[size - 1]);
        console.log("array of temp", values, labels);
        setLabels(labels);
        setData(values);
        setLoading(false);
        setError(false);
      } else setError(true);
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
        <View>
          <LineChart
            onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
            onTouchStart={(e) => {
              setOverlay(true);
            }}
            onTouchEnd={(e) => {
              setTop(0);
              setLeft(0);
              setOverlay(!overlay);
            }}
            onDataPointClick={(e) => {
              setOverlay(!overlay);
              setSelectedValue(e.value);
              setTop(e.y - 20);
              setLeft(e.x - styles.selected.width / 2);
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
                  data: [100], //highest graph value
                  withDots: false, //a flage to make it hidden
                },
                {
                  data: [0], //highest graph value
                  withDots: false, //a flage to make it hidden
                },
              ],
              legend: [`Humidity for the last ${interval}h`],
            }}
            width={Dimensions.get("window").width}
            height={300}
            chartConfig={{
              backgroundGradientFromOpacity: 0,
              backgroundGradientFrom: `black`,
              backgroundGradientTo: `black`,
              backgroundGradientToOpacity: 0.0,

              fillShadowGradientFrom: "blue",
              fillShadowGradientTo: "blue",
              propsForLabels: {},

              propsForBackgroundLines: {
                strokeWidth: 0,
              },

              yAxisSuffix: "%",
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
              <Text>{"Humidity"}</Text>
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
        </View>
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
