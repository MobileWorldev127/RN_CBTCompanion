import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, Platform } from "react-native";

// import Fonts from '../assets/Fonts';
// import ThemeColor from './ThemeColor';
import Icon from "../common/icons";

const SearchField = props => {
  return (
    <View style={styles.mainInput}>
      <View style={styles.inputIcon}>
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
export default SearchField;

const styles = StyleSheet.create({
  mainInput: {
    flexDirection: "row",
    height: 50,
    width: '90%',
    borderRadius: 25,
    backgroundColor: 'white',
    alignItems: 'center'
  },
  inputField: {
    borderBottomColor: "black",
    fontSize: 18,
    color: "black",
  },
  menuIcons: {
    color: "gray"
  },
  inputIcon: {
    flex: 0.15,
    alignItems: "center",
    justifyContent: "center"
  },
  InputName: {
    flex: 0.8,
  }
});
