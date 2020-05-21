import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import ThemeStyle from "../../styles/ThemeStyle";
import textStyles from "../../common/TextStyles";
import ComponentImage from "./Image";
import Title from "./Title";

const { width, height } = Dimensions.get("window");

export default class DiscreteRating extends Component {
  constructor(props) {
    super(props);
    this.discreteValues = props.options;
    this.state = {
      value: 0,
      sliderOneChanging: false,
      sliderOneValue: [1],
      multiSliderValue: [
        this.discreteValues[this.props.start ? this.props.start : 0].value,
        0
      ],
      sliderText: this.discreteValues[this.props.start ? this.props.start : 0]
        .name
    };
  }

  sliderOneValuesChangeStart = () => {
    this.setState({
      sliderOneChanging: true
    });
  };

  multiSliderValuesChange = values => {
    let sliderText;
    this.discreteValues.forEach(element => {
      console.log(element, values[0]);
      if (element.value == values[0]) {
        sliderText = element.name;
      }
    });
    this.setState({
      multiSliderValue: values,
      sliderText
    });
    this.props.onValueChange({ stringValues: [sliderText] });
  };

  render() {
    return (
      <View>
        {this.props.image && <ComponentImage image={this.props.image} />}
        <View style={styles.mainContainer}>
          <Title
            title={this.props.question}
            style={{
              marginBottom: 16
            }}
            showInstructions={this.props.showInstructions}
          />
          <MultiSlider
            selectedStyle={{
              backgroundColor: ThemeStyle.mainColor
            }}
            unselectedStyle={{ backgroundColor: "#ddddea" }}
            trackStyle={{
              height: 22,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center"
            }}
            values={[this.state.multiSliderValue[0]]}
            onValuesChange={this.multiSliderValuesChange}
            customMarker={() => (
              <View
                style={{
                  height: 20,
                  width: 12,
                  borderRadius: 25,
                  backgroundColor: ThemeStyle.accentColor
                }}
              />
            )}
            touchDimensions={{
              height: 22,
              width: 300,
              slipDisplacement: 40
            }}
            min={this.props.minValue ? this.props.minValue : 0}
            max={this.props.maxValue}
            sliderLength={300}
            snapped={true}
            step={this.props.step ? this.props.step : 1}
          />
          <Text style={[textStyles.GeneralTextBold]}>
            {this.state.sliderText}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sliderValue: {
    fontSize: 14,
    textAlign: "center",
    color: "red"
  },
  appHeader: {
    height: Platform.OS === "ios" ? 64 : 54,
    width: null,
    backgroundColor: "#fff",
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderColor: "lightgrey"
  },
  mainContainer: {
    flex: 5,
    elevation: 2,
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 4,
    overflow: "visible",
    marginBottom: 24,
    marginTop: 8
  },
  innerContainer: {
    borderWidth: 1,
    flex: 1,
    borderColor: "#fff",
    backgroundColor: "#fff",
    marginVertical: 15
  }
});
