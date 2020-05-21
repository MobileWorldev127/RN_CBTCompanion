import React, { Component } from "react";
import { StyleSheet, Image, View, Text } from "react-native";
import Button from "./../components/Button";
import ThemeStyle from "../styles/ThemeStyle";
import TextStyles from "../common/TextStyles";

export default class PremiumView extends Component {
  constructor(props) {
    super(props);
    this.state = this.props;
    console.log(this.state);
  }

  componentWillReceiveProps(nextProps) {
    this.state = nextProps;
  }

  render() {
    return (
      <View style={[localStyles.containerStyle, this.state.style]}>
        {/* <Text
          style={[
            TextStyles.SubHeaderBold,
            { textAlign: "center", paddingHorizontal: 16, fontSize: 16 }
          ]}
        >
          Available only to premium subscriptions
        </Text> */}
        <Image
          style={[localStyles.imageStyle, this.state.imageStyle]}
          source={require("./../src/premium.png")}
          resizeMode={"contain"}
        />
        <Button
          onPress={() => {
            this.state.showSubscription();
          }}
          name={"Go Premium"}
          style={{ width: "80%" }}
        />
      </View>
    );
  }
}

const localStyles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ThemeStyle.pageContainer.backgroundColor
  },
  buttonStyle: {
    alignSelf: "stretch",
    justifyContent: "center",
    margin: 20
  },
  imageStyle: {
    width: "80%"
  }
});
