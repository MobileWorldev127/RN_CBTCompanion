import React, { Component } from "react";
import { StyleSheet, Text, Image, View } from "react-native";
import { Transition } from "react-navigation-fluid-transitions";
import textStyles from "../../common/TextStyles";
import ComponentImage from "./Image";
import Title from "./Title";
import ThemeStyle from "../../styles/ThemeStyle";

export default class Lookup extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Transition appear="scale">
        <View style={styles.mainContainer}>
          {this.props.image && <ComponentImage image={this.props.image} />}
          <View style={{ padding: 24 }}>
            <Title
              title={
                this.props.score
                  ? "Your score is " + this.props.score
                  : "Please select your answers to get a result."
              }
              style={{
                textAlign: "center"
              }}
              containerStyle={{
                justifyContent: "center",
                backgroundColor: "#fff"
              }}
              showInstructions={this.props.showInstructions}
            />
            {this.props.details.map(lookup => {
              if (parseInt(lookup.placeholder) === this.props.score) {
                return (
                  <Text
                    style={[
                      textStyles.SubHeaderBold,
                      {
                        textAlign: "center",
                        color: ThemeStyle.accentColor,
                        paddingTop: 8,
                        backgroundColor: "#fff"
                      }
                    ]}
                  >
                    {lookup.question}
                  </Text>
                );
              } else return null;
            })}
          </View>
        </View>
      </Transition>
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
