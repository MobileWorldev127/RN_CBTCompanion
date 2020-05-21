import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, Platform } from "react-native";

// import Fonts from '../assets/Fonts';
// import ThemeColor from './ThemeColor';
import Icon from "../common/icons";

const InputField = props => {
  return (
    <View style={styles.mainInput}>
      <View style={styles.inputIcon}>
        {/* <Icon name='md-person' color='lightgrey' size={22} /> */}
        <Icon
          name={props.iconName}
          family={props.iconFamily}
          style={styles.menuIcons}
          size={22}
        />
      </View>
      <View style={styles.InputName}>
        <TextInput
          placeholderTextColor={props.placeholderTextColor}
          placeholder={props.placeholder}
          onChangeText={props.onChangeText}
          value={props.value}
          underlineColorAndroid="transparent"
          style={styles.inputField}
          secureTextEntry={props.boolean}
        />
      </View>
    </View>
  );
};
export default InputField;

const styles = StyleSheet.create({
  inputField: {
    marginVertical: 8,
    // borderBottomWidth:1.5,
    borderBottomColor: "black",
    marginBottom: 10,
    fontSize: Platform.OS === "ios" ? 15 : 15,
    color: "black",
    // // fontFamily: Fonts.Poppins,
    // marginHorizontal: 30,
    paddingVertical: 12
  },
  menuIcons: {
    color: "black"
  },
  mainInput: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey"
  },
  inputIcon: {
    flex: 0.15,
    alignItems: "center",
    justifyContent: "center"
  },
  InputName: {
    flex: 0.85,
    marginLeft: 10
    // fontFamily: ThemeStyle.ubuntu,
  }
});
