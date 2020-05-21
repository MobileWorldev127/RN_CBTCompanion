import React, { Component } from "react";
import { StyleSheet, Text, Image, View } from "react-native";
import HTML from "react-native-render-html";
import ComponentImage from "./Image";
import Title from "./Title";

export default class Display extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { isTextView, image } = this.props;
    return (
      <View style={styles.mainContainer}>
        {image && <ComponentImage image={image} />}
        {isTextView ? (
          <HTML
            containerStyle={{
              paddingVertical: 16,
              backgroundColor: "#fff"
            }}
            html={this.props.title ? this.props.title : this.props.question}
            baseFontStyle={{ fontSize: 16, lineHeight: 20 }}
          />
        ) : (
          <Title
            title={this.props.title ? this.props.title : this.props.question}
            style={{
              textAlign: "center",
              fontSize: 20,
              lineHeight: 24
            }}
            containerStyle={{
              padding: 16,
              backgroundColor: "#fff"
            }}
            showInstructions={this.props.showInstructions}
          />
        )}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  mainContainer: {
    marginHorizontal: 24,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    justifyContent: "center"
  }
});
