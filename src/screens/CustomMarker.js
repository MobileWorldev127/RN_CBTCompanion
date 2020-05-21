import React, { Component } from "react";
import { StyleSheet, Image, View, Text } from "react-native";
import ThemeStyle from "../styles/ThemeStyle";

export default class CustomMarker extends Component {
  render() {
    var value = this.props.value || "0";
    return (
      // <Image
      //   style={styles.image}
      //   source={require('../src/rectangle.png')}
      //   resizeMode='cover'
      // />
      <View
        style={{
          height: 24,
          width: 48,
          borderRadius: 25,
          backgroundColor: ThemeStyle.accentColor,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#fff",
            fontWeight: "bold"
          }}
        >
          {value}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    height: 30,
    width: 60
  }
});
