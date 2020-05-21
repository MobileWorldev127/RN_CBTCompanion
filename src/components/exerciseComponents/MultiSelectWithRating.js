import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Modal,
  ActivityIndicator
} from "react-native";
import ThemeStyle from "../../styles/ThemeStyle";
import textStyles from "../../common/TextStyles";
import CustomButton from "../Button";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import CustomMarker from "../../screens/CustomMarker";
import { getLookupValuesQuery } from "../../queries/getLookupValues";
import { errorMessage, showApiError } from "../../utils";
import { client } from "../../App";
import ComponentImage from "./Image";
import Title from "./Title";
import * as Animatable from "react-native-animatable";

var _ = require("lodash");

const { width, height } = Dimensions.get("window");

export default class MultiSelectWithRating extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: [],
      modalVisible: false,
      value: 0,
      sliderOneChanging: false,
      sliderOneValue: [5],
      multiSliderValue: [15, 0],
      sliderText: props.placeholder ? "Level of " : "Barely ",
      currentItem: {
        name: "Holder"
      }
    };
  }

  componentDidMount() {
    console.log("OPTIONS", this.props.options);
    this.props.source && this.props.source.length
      ? this.fetchLookupValues()
      : this.setState({
          elements: _.cloneDeep(this.props.options),
          loading: false
        });
  }

  setCurrentItemAndOpenModal = emotion => {
    this.setState({
      modalVisible: true,
      currentItem: emotion
    });
    if (emotion.percentage) {
      this.multiSliderValuesChange([emotion.percentage, 0]);
    }
  };

  closeModal = () => {
    this.setState({
      modalVisible: false,
      multiSliderValue: [15, 0],
      sliderText: this.props.placeholder ? "Level of " : "Barely "
    });
  };

  multiSliderValuesChange = values => {
    let sliderText = "Barely ";
    if (this.props.placeholder) {
      sliderText = "Level of ";
    } else {
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
    }
    // if (this.props.event) {
    // } else {
    // sliderText = values[0] + "%";
    // }
    this.setState({
      multiSliderValue: values,
      sliderText
    });
  };

  fetchLookupValues = () => {
    this.setState({
      loading: true
    });
    client
      .watchQuery({
        query: getLookupValuesQuery,
        variables: {
          keyname: this.props.source
        },
        fetchPolicy: "cache-and-network"
      })
      .subscribe({
        next: response => {
          if (response.loading || !response.data) {
            return;
          }
          console.log("----LOOKUP VALUES---", response);
          this.setState({
            elements: _.cloneDeep(response.data.getLookupValues.value),
            loading: false
          });
        },
        error: err => {
          console.error(err);
          this.setState({
            loading: false
          });
          showApiError(true);
        }
      });
  };

  renderLookupValues = () => {
    let elementsList = [];
    this.state.elements &&
      this.state.elements.length > 0 &&
      this.state.elements.map((data, index) => {
        elementsList.push(
          <Animatable.View animation="zoomIn" delay={index * 50} duration={500}>
            <TouchableOpacity
              key={data.name}
              style={{
                paddingHorizontal: 12,
                borderWidth: 1,
                marginRight: 8,
                marginBottom: 12,
                borderRadius: 25,
                paddingVertical: 6,
                borderColor: data.color,
                backgroundColor: data.percentage ? data.color : "#fff"
              }}
              onPress={() => {
                this.setCurrentItemAndOpenModal(data);
              }}
            >
              <Text
                style={[
                  textStyles.ContentText,
                  {
                    color: data.percentage ? "#fff" : data.color
                  }
                ]}
              >
                {data.percentage
                  ? data.name + ": " + data.percentage + "%"
                  : data.name}
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        );
      });
    return <View style={styles.listEmotions}>{elementsList}</View>;
  };

  render() {
    console.log("OPTIONS", this.props.options);
    console.log("ELEMENTS", this.state.elements);
    return (
      <View style={styles.mainContainer}>
        {this.props.image && <ComponentImage image={this.props.image} />}
        <View style={{ backgroundColor: "#fff", paddingVertical: 24 }}>
          <Title
            showInstructions={this.props.showInstructions}
            title={this.props.question}
            containerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}
          />
          {this.state.loading ? (
            <View style={{ justifyContent: "center", padding: 16 }}>
              <ActivityIndicator />
            </View>
          ) : (
            this.renderLookupValues()
          )}
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
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
                  paddingHorizontal: 24,
                  paddingVertical: 24
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
                    {this.props.placeholder
                      ? this.props.placeholder
                      : "How " +
                        this.state.currentItem.name.toLowerCase() +
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
                    <CustomMarker
                      value={`${this.state.multiSliderValue[0]} %`}
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
                <Text style={[textStyles.GeneralText]}>
                  {this.state.sliderText + this.state.currentItem.name}
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
                      this.state.currentItem.percentage = 0;
                      let selectedValues = [];
                      this.state.elements.forEach(element => {
                        if (element.percentage) {
                          selectedValues.push({
                            key: {
                              name: element.name,
                              color: element.color
                            },
                            value: element.percentage
                          });
                        }
                      });
                      this.props.onValueChange({ keyValues: selectedValues });
                      this.closeModal();
                    }}
                    textStyle={{
                      color: ThemeStyle.accentColor
                    }}
                    name="Clear"
                  />
                  <CustomButton
                    style={{ flex: 1, marginTop: 32, marginLeft: 12 }}
                    onPress={() => {
                      this.state.currentItem.percentage = this.state.multiSliderValue[0];
                      let selectedValues = [];
                      this.state.elements.forEach(element => {
                        if (element.percentage) {
                          selectedValues.push({
                            key: {
                              name: element.name,
                              color: element.color
                            },
                            value: element.percentage
                          });
                        }
                      });
                      this.props.onValueChange({ keyValues: selectedValues });
                      this.closeModal();
                    }}
                    name="Okay"
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    overflow: "hidden"
  },
  listEmotions: {
    paddingHorizontal: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  innerContainer: {
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#fff",
    overflow: "hidden",
    marginVertical: 5,
    borderRadius: 5,
    overflow: "hidden"
  },
  linearGradient: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    width: width - 40,
    overflow: "hidden"
  }
});
