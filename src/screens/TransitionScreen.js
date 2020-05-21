import React, { Component } from "react";

export default class TransitionScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.didBlurSubscription = this.props.navigation.addListener(
      "didFocus",
      payload => {
        console.log("Going to home");
        this.props.navigation.navigate("Home");
      }
    );
  }

  componentWillUnmount() {
    this.didBlurSubscription.remove();
  }

  render() {
    return null;
  }
}
