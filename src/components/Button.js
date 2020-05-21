import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Platform
} from "react-native";
import textStyle from "./../common/TextStyles";
import ThemeStyle from "../styles/ThemeStyle";
import LinearGradient from "react-native-linear-gradient";

// import Fonts 	from '../assets/Fonts';
// import ThemeColor from './ThemeColor';

const Button = props => {
  const Component = props.noGradient ? View : LinearGradient;
  return (
    <Component
      colors={ThemeStyle.gradientColor}
      start={props.noGradient ? undefined : { x: 0.8, y: 0 }}
      end={props.noGradient ? undefined : { x: 0, y: 1 }}
      style={[styles.touches, props.style]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        underlayColor={ThemeStyle.accentColor + "66"}
        onPress={props.onPress}
        style={{
          paddingVertical: Platform.OS === "ios" ? 15 : 15,
          paddingHorizontal: 24
        }}
      >
        <Text style={[textStyle.GeneralText, styles.text, props.textStyle]}>
          {props.name}
        </Text>
      </TouchableOpacity>
    </Component>
  );
};

export default Button;

const styles = StyleSheet.create({
  touches: {
    // marginHorizontal: 30,
    borderRadius: 32,
    minWidth: 128
  },
  text: {
    textAlign: "center",
    color: "white",
    fontSize: Platform.OS === "ios" ? 15 : 14,
    fontWeight: "bold",
    fontSize: 14
    // fontFamily: Fonts.Poppins,
  }
});
