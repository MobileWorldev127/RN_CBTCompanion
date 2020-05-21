import React, { Component } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import ThemeStyle from "../../styles/ThemeStyle";
import TextStyles from "../../common/TextStyles";
import CheckBox from "react-native-check-box";
import ComponentImage from "./Image";
import Title from "./Title";
import * as Animatable from "react-native-animatable";

export default class CheckList extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        {this.props.image && <ComponentImage image={this.props.image} />}
        <View style={styles.mainContainer}>
          <Title
            showInstructions={this.props.showInstructions}
            title={this.props.question}
          />
          {this.props.details.map((detail, index) => {
            return (
              <Animatable.View
                style={{ paddingTop: 16 }}
                animation="fadeInUp"
                delay={index * 100}
              >
                <CheckBox
                  style={{ flex: 1 }}
                  uncheckedCheckBoxColor={ThemeStyle.disabled}
                  checkedCheckBoxColor={ThemeStyle.accentColor}
                  onClick={() => {
                    detail.isSelected = !detail.isSelected;
                    let selectedValues = [];
                    this.props.details.forEach(item => {
                      if (item.isSelected) {
                        selectedValues.push(item.question);
                      }
                    });
                    console.log("SELECTED VALUES " + selectedValues);
                    this.props.onValueChange({
                      stringValues: selectedValues
                    });
                    this.setState({
                      shouldRefresh: !this.state.shouldRefresh
                    });
                  }}
                  isChecked={detail.isSelected}
                  rightTextView={
                    <Text
                      style={[
                        TextStyles.GeneralText,
                        {
                          color: detail.isSelected
                            ? ThemeStyle.accentColor
                            : ThemeStyle.disabled,
                          paddingLeft: 12,
                          marginRight: 16
                        }
                      ]}
                    >
                      {detail.question}
                    </Text>
                  }
                />
              </Animatable.View>
            );
          })}
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
    marginTop: 8
  },
  innerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 12,
    backgroundColor: "#fff",
    marginVertical: 15
  }
});
