import React, { Component } from "react";
import { Modal, View, Text } from "react-native";
import CustomButton from "./Button";
import CustomMarker from "./../screens/CustomMarker";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import textStyles from "./../common/TextStyles";
import ThemeStyle from "../styles/ThemeStyle";

export default class ModalSlider extends Component<{}, {}> {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      sliderOneChanging: false,
      sliderOneValue: [5],
      multiSliderValue: [15, 0],
      sliderText: "Barely "
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentEmotion.percentage) {
      this.multiSliderValuesChange([nextProps.currentEmotion.percentage, 0]);
    } else {
      this.multiSliderValuesChange([15, 0]);
    }
  }

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
    this.setState({
      multiSliderValue: values,
      sliderText
    });
  };

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.visible}
        onRequestClose={() => {
          alert("Modal has been closed.");
        }}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.42)" }}>
          <View
            style={{
              flex: 1,
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                shadowColor: "grey",
                shadowOffset: { width: 15, height: 5 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
                paddingHorizontal: 24,
                paddingVertical: 32
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <Text
                  style={[
                    textStyles.Header2,
                    {
                      marginBottom: 16
                    }
                  ]}
                >
                  {"How " +
                    this.props.currentEmotion.name.toLowerCase() +
                    " are you feeling?"}
                </Text>
              </View>

              <MultiSlider
                selectedStyle={{
                  backgroundColor: ThemeStyle.mainColor
                }}
                unselectedStyle={{ backgroundColor: "#ddddea" }}
                trackStyle={{ height: 22, borderRadius: 20 }}
                values={[this.state.multiSliderValue[0]]}
                onValuesChange={this.multiSliderValuesChange}
                customMarker={() => (
                  <CustomMarker value={`${this.state.multiSliderValue[0]} %`} />
                )}
                touchDimensions={{
                  height: 32,
                  width: 300,
                  slipDisplacement: 40
                }}
                max={100}
                sliderLength={300}
              />
              <Text
                style={[
                  textStyles.GeneralTextBold,
                ]}
              >
                {this.state.sliderText + this.props.currentEmotion.name}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <CustomButton
                  style={{
                    flex: 1,
                    marginTop: 32,
                    backgroundColor: "#fff",
                    borderColor: ThemeStyle.accentColor,
                    borderWidth: 1,
                    marginRight: 12
                  }}
                  noGradient
                  onPress={() => {
                    this.props.currentEmotion.percentage = 0;
                    this.setState({
                      multiSliderValue: [15, 0],
                      sliderText: "Barely "
                    });
                    this.props.closeModal();
                  }}
                  textStyle={{
                    color: ThemeStyle.accentColor
                  }}
                  name="Clear"
                />
                <CustomButton
                  style={{ flex: 1, marginTop: 32, marginLeft: 12 }}
                  onPress={() => {
                    this.props.currentEmotion.percentage = this.state.multiSliderValue[0];
                    this.props.closeModal();
                  }}
                  name="Okay"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
