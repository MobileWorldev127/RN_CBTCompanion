import React, { Component } from "react";
import { ScrollView, View } from "react-native";
import Header from "./../components/Header";
import HTML from "react-native-render-html";
import { APP } from "../constants";
import ThemeStyle from "../styles/ThemeStyle";
import TextStyles from "../common/TextStyles";

export default class AboutScreen extends Component {
  render() {
    return (
      <View style={ThemeStyle.pageContainer}>
        <Header
          title="About"
          goBack={() => {
            this.props.navigation.goBack(null);
          }}
        />
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <HTML
            html={APP.aboutContent}
            baseFontStyle={{
              color: "#4F4F4F",
              fontSize: 14,
              lineHeight: 17
            }}
          />
        </ScrollView>
      </View>
    );
  }
}
