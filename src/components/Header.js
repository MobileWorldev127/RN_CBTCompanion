import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Platform,
  StatusBar,
  Image
} from "react-native";
import Icon from "../common/icons";
import ThemeStyle from "./../styles/ThemeStyle";
import textStyles from "./../common/TextStyles";

// import Fonts 	from '../assets/Fonts';
// import ThemeColor from './ThemeColor';

const Header = props => {
  let onIconClick = props.goBack;
  let iconName = require("../assets/images/redesign/Back.png");
  let iconFamily = "MaterialIcons";
  if (props.isDrawer) {
    onIconClick = props.openDrawer;
    iconFamily = "SimpleLineIcons";
    iconName = require("../assets/images/redesign/Menu.png");
  }
  if (props.isClose) {
    onIconClick = props.onClose;
    iconName = require("../assets/images/redesign/cross.png");
    iconFamily = "MaterialIcons";
  }
  return (
    <View style={[styles.navBar, props.navBarStyle]}>
      <StatusBar
        translucent={false}
        backgroundColor={ThemeStyle.backgroundColor}
        barStyle={"dark-content"}
        hidden={false}
      />
      <View
        style={{
          flex: 1,
          alignItems: "flex-start",
          marginLeft: 12,
          justifyContent: "center"
        }}
      >
        <TouchableHighlight
          style={{ flex: 1, justifyContent: "center", padding: 8 }}
          underlayColor={ThemeStyle.accentColor + "33"}
          onPress={onIconClick}
        >
          <Image source={iconName} style={{tintColor: props.isLightContent ? "#fff" : undefined }}/>
        </TouchableHighlight>
      </View>
      <View style={{ flex: 3, alignItems: "center", justifyContent: "center" }}>
        <Text
          style={[
            textStyles.SubHeaderBold,
            {
              color: props.isLightContent ? "#fff" : "black",
              textAlign: "center"
            }
          ]}
        >
          {props.title}
        </Text>
      </View>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {props.rightIcon && (
          <TouchableHighlight
            underlayColor="#fff"
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
            onPress={props.onRightIconClick}
          >
            {props.rightIcon()}
          </TouchableHighlight>
        )}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: ThemeStyle.backgroundColor,
    height: Platform.OS === "ios" ? 64 : 54,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  text: {
    textAlign: "center",
    color: "white",
    fontSize: Platform.OS === "ios" ? 15 : 14,
    fontWeight: "bold",
    fontSize: 12
    // fontFamily: Fonts.Poppins,
  }
});
