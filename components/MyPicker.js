import { Picker } from "@react-native-picker/picker";
import { View, Text } from "react-native";
import React, { useState } from "react";

const MyPicker = ({ data, name, setData, current }) => {
  const [selectedValue, setSelectedValue] = useState(current?.toUpperCase());

  return (
    <View>
      <Text style={{ color: "white" }}>{name}: </Text>
      <Picker
        style={{
          width: "74%",
          color: "white",
          backgroundColor: "green",
        }}
        selectedValue={selectedValue}
        onValueChange={(itemValue, itemIndex) => {
          setSelectedValue(itemValue.toUpperCase());
          setData(itemValue.toUpperCase());
        }}
      >
        {data.map((option) => (
          <Picker.Item
            style={{
              fontSize: 25,
              color: "black",
            }}
            key={option.location}
            label={option.location}
            value={option.location.toUpperCase()}
          />
        ))}
        {name != "Hours" && (
          <Picker.Item
            style={{ fontSize: 25 }}
            key={0}
            label={"none"}
            value={""}
          />
        )}
      </Picker>
    </View>
  );
};

export default MyPicker;
