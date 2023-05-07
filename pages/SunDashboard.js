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

import { Appcontext } from "../lib/appcontext";
import { useContext, useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
//import ScrollableTabView from "react-native-scrollable-tab-view";

import { StackedBarChart } from "react-native-chart-kit";
import MyPicker from "../components/MyPicker";
export default function TempDashboard({ navigation, route }) {
  const [data, setData] = useState();
  const [labels, setLabels] = useState();
  const [interval, setInterval] = useState("7");
  const { getLocationSunLightInterVal } = useContext(Appcontext);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  const getTempData = async () => {
    setLoading(true);
    try {
      let resData = await getLocationSunLightInterVal(
        route.params?.location,
        interval
      );

      // add last index value
      if (resData.length > 0) {
        let sunShine = await resData.map((data) => {
          return [data.sunLight, data.lampLight];
        });
        const tmp = await resData.map((data) => {
          const date = new Date(data.createdAt);
          console.log("====================================");
          console.log(date);
          console.log("====================================");
          const day = date.toLocaleDateString("no");
          const month = date.getMonth();
          return `${day}`;
        });
        console.log("====================================");
        console.log(tmp);
        console.log("====================================");
        console.log("array of temp", sunShine);
        setLabels(tmp);
        setData(sunShine);
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
        <ScrollView horizontal={true}>
          <View
            style={{
              flex: 2,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <StackedBarChart
              style={{
                borderRadius: 1,
                flex: 1,
                flexDirection: "row",
                marginTop: 122,
                marginLeft: 2,
                justifyContent: "flex-start",
              }}
              bezier
              yAxisInterval={1}
              yLabelsOffset={1}
              data={{
                legend: ["Sun", "Lamp"],
                labels: labels,
                data: data,
                barColors: ["wheat", "lightgray"],
              }}
              width={Dimensions.get("screen").width * 2}
              height={400}
              chartConfig={{
                backgroundColor: "green",
                backgroundGradientFromOpacity: 0,
                backgroundGradientFrom: `green`,
                backgroundGradientTo: `green`,
                backgroundGradientToOpacity: 0.0,
                useShadowColorFromDataset: false, // optional
                barPercentage: 1.5,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelStyle: {
                  textAlign: "center",
                },

                style: {
                  borderRadius: 1,
                },
              }}
            />
          </View>
        </ScrollView>
        <StatusBar style={{ backgroundColor: "green" }} />
      </View>
    </LinearGradient>
  );
}
