import React, { Component } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import Animation from "lottie-react-native";
import CONTENT_PATH_HTTP, { CONTENT_PATH } from "../constants";

export default class LottieLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src: ""
    };
  }

  componentDidMount() {
    console.log("Lottie component mounted", this.props.src);
    fetch(CONTENT_PATH + "animations/" + this.props.src)
      .then(res => res.json())
      // .then(res=>alert(JSON.stringify(res)))
      .then(res => {
        console.log(res);
        this.setState({ src: res }, () => {
          this.animation.play();
        });
      })
      .catch(err => {
        console.log("lottiefetch", err);
      });
    // .then(()=>this.animation.play())
  }

  render() {
    console.log("RENDERING LOTTIE", this.state.src);
    if (this.state.src !== "") {
      return (
        <View
          style={[
            {
              width: "100%",
              height: 340,
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center"
            },
            this.props.style,
            this.props.dimensions
          ]}
        >
          <Animation
            ref={animation => {
              this.animation = animation;
            }}
            style={[
              {
                width: "100%",
                height: 340
              },
              this.props.dimensions
            ]}
            loop={true}
            delay={1000}
            autoPlay={true}
            source={this.state.src}
          />
        </View>
      );
    }
    return (
      <View
        style={[
          {
            width: "100%",
            height: 340,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center"
          },
          this.props.style,
          this.props.dimensions
        ]}
      >
        <ActivityIndicator />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
    color: "#ffffff"
  }
});
