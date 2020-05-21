import React, { Component, Fragment } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import ThemeStyle from "../../styles/ThemeStyle";
import textStyles from "../../common/TextStyles";
import ComponentImage from "./Image";
import CustomMarker from "../../screens/CustomMarker";
import Title from "./Title";

export default class Rating extends Component {
  constructor(props) {
    super(props);
    let sliderText = "Barely ";
    let startValue = this.props.value ? this.props.value : this.props.start;
    if (this.props.isText) {
      sliderText = sliderText + this.props.placeholder;
    } else {
      sliderText = this.props.placeholder
        ? this.props.placeholder + " : " + startValue
        : `${startValue}`;
      sliderText += "/" + this.props.maxValue;
    }
    this.state = {
      value: 0,
      sliderOneChanging: false,
      sliderOneValue: [1],
      multiSliderValue: [startValue, 0],
      sliderText
    };
    this.props.onValueChange({ intValues: [this.state.multiSliderValue[0]] });
  }

  sliderOneValuesChangeStart = () => {
    this.setState({
      sliderOneChanging: true
    });
  };

  multiSliderValuesChange = values => {
    let sliderText = "Barely ";
    if (values[0] <= 20) {
      sliderText = "Barely ";
    } else if (values[0] > 20 && values[0] <= 40) {
      sliderText = "A Little ";
    } else if (values[0] > 40 && values[0] <= 60) {
      sliderText = "Fairly ";
    } else if (values[0] > 60 && values[0] <= 80) {
      sliderText = "Very ";
    } else {
      sliderText = "Extremely ";
    }
    if (this.props.isText) {
      sliderText = sliderText + this.props.placeholder;
    } else {
      sliderText = this.props.placeholder
        ? this.props.placeholder + " : " + values[0]
        : `${values[0]}`;
      sliderText += "/" + this.props.maxValue;
    }
    console.log(sliderText);
    this.setState({
      multiSliderValue: values,
      sliderText
    });
    this.props.onValueChange({ intValues: [values[0]] });
  };

  render() {
    return (
      <View>
        {this.props.image && <ComponentImage image={this.props.image} />}
        <View style={styles.mainContainer}>
          <Title
            showInstructions={this.props.showInstructions}
            title={this.props.question}
            containerStyle={{
              marginBottom: 16
            }}
          />
          <MultiSlider
            selectedStyle={{
              backgroundColor: ThemeStyle.mainColor
            }}
            unselectedStyle={{ backgroundColor: "#ddddea" }}
            trackStyle={{ height: 22, borderRadius: 20 }}
            values={[this.state.multiSliderValue[0]]}
            onValuesChange={this.multiSliderValuesChange}
            customMarker={() => (
              <CustomMarker
                value={
                  this.props.shouldShowPercentage
                    ? `${this.state.multiSliderValue[0]} %`
                    : this.state.multiSliderValue[0]
                }
              />
            )}
            touchDimensions={{
              height: 32,
              width: 300,
              slipDisplacement: 40
            }}
            min={this.props.minValue ? this.props.minValue : 0}
            max={this.props.maxValue}
            step={this.props.step ? this.props.step : 1}
            sliderLength={300}
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
  mainContainer: {
    flex: 5,
    padding: 16,
    borderRadius: 4,
    overflow: "visible",
    marginBottom: 24
  },
  innerContainer: {
    borderWidth: 1,
    flex: 1,
    marginTop: 15
  }
});
