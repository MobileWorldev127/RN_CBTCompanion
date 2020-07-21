import React, { Component } from "react";
import { ScrollView, View } from "react-native";
import Header from "../components/Header";
import HTML from "react-native-render-html";
import { APP } from "../constants";
import ThemeStyle from "../styles/ThemeStyle";
import { withSafeAreaActions } from '../utils/StoreUtils';
import { setTopSafeAreaView } from '../actions/AppActions';

class FaqScreen extends Component {
  componentDidMount() {
    this.props.setTopSafeAreaView(ThemeStyle.backgroundColor);
  }

  componentWillUnmount() {
    this.props.setTopSafeAreaView(ThemeStyle.gradientStart);
  }
  
  render() {
    return (
      <View style={ThemeStyle.pageContainer}>
        <Header
          title="FAQs"
          goBack={() => {
            this.props.navigation.goBack(null);
          }}
        />
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <HTML
            html={APP.faqContent}
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

export default withSafeAreaActions(FaqScreen, dispatch => ({
  setTopSafeAreaView: color => dispatch(setTopSafeAreaView(color))
}));