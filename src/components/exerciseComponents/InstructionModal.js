import React, { Component } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from "react-native";
import textStyles from "../../common/TextStyles";
import HTML from "react-native-render-html";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default class InstructionModal extends Component<{}, {}> {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.instructions !=) {
    //   this.multiSliderValuesChange([nextProps.currentEmotion.percentage, 0]);
    // } else {
    //   this.multiSliderValuesChange([15, 0]);
    // }
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.visible}
        onRequestClose={() => {
          console.log("Modal has been closed.");
        }}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.42)" }}>
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0
            }}
          >
            <TouchableWithoutFeedback
              style={{ height: 480 }}
              onPress={this.props.closeInstructions}
            />
            <View
              style={{
                backgroundColor: "#fff",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                shadowColor: "grey",
                shadowOffset: { width: 15, height: 5 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                paddingHorizontal: 24,
                paddingTop: 24,
                paddingBottom: 48
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16
                }}
              >
                <Text style={[textStyles.Header2]}>{"Instructions"}</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.props.closeInstructions();
                  }}
                >
                  <Image
                    source={require("../../assets/images/redesign/cross.png")}
                    style={{ width: 48 }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <ScrollView
                style={{ maxHeight: Dimensions.get("window").height - 240 }}
                contentContainerStyle={{ paddingBottom: 64 }}
              >
                <HTML
                  html={this.props.instructions}
                  style={[textStyles.GeneralText]}
                />
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
