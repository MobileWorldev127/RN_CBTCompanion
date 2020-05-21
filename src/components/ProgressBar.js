import React, { Component } from "react";
import { View, Dimensions, Text, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";

const DeviceWidth = Dimensions.get("screen").width;

export default class ProgressBar extends Component {
  state = {
    value: 0
  };
  transition = value => {
    this.bar.transitionTo({ width: value });
  };
  start = () => {
    this.barInterval = setInterval(() => {
      const value = this.state.value;
      if (value >= DeviceWidth) {
        this.resetInterval();
      }
      this.setState({ value: value + 10 });
      this.transition(value);
    }, 1000);
  };
  resetInterval = () => {
    clearInterval(this.barInterval);
  };
  render() {
    return (
      <View style={styles.progressbar}>
        <Animatable.View style={styles.bar} ref={ref => (this.bar = ref)} />
        <TouchableOpacity onPress={this.start}>
          {/* <Text>Start{this.state.value}</Text> */}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = {
  bar: {
    width: Dimensions.get("window").width,
    backgroundColor: "white",
    height: 3
  }
};
