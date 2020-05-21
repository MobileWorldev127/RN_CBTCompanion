import TextStyles from "../common/TextStyles";
import { View, Text, Image } from "react-native";
import Icon from "../common/icons";
import React, { Component } from "react";
import ThemeStyle from "../styles/ThemeStyle";

export const NoData = props => (
  <View
    style={[{
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 16
    }, props.style]}
  >
    <Image
      source={require("../assets/images/redesign/nothing_found-icon.png")}
    />
    
    <Text
      style={[
        TextStyles.GeneralText,
        {
          color: ThemeStyle.text3
        }
      ]}
    >
      {props.message ? props.message : "No data found"}
    </Text>
  </View>
);
