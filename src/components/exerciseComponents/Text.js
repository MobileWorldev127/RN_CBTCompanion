import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import ThemeStyle from "../../styles/ThemeStyle";
import textStyles from "../../common/TextStyles";
import TextStyles from "../../common/TextStyles";
import ComponentImage from "./Image";
import Title from "./Title";
import * as Animatable from "react-native-animatable";

export default class TextType extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      description: props.value,
      isChallenged: false
    };
  }

  render() {
    return (
      <View>
        {this.props.image && <ComponentImage image={this.props.image} />}
        <View style={styles.mainContainer}>
          <Title
            title={this.props.question}
            showInstructions={this.props.showInstructions}
          />
          {this.props.isChallengeType && !this.state.isChallenged && (
            <TouchableOpacity
              style={{
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 24,
                borderWidth: 1,
                marginTop: 16,
                borderColor: ThemeStyle.accentColor
              }}
              onPress={() => {
                this.setState({
                  isChallenged: true
                });
              }}
            >
              <Text
                style={[
                  TextStyles.GeneralText,
                  { color: ThemeStyle.accentColor, textAlign: "center" }
                ]}
              >
                CHALLENGE
              </Text>
            </TouchableOpacity>
          )}
          {(!this.props.isChallengeType || this.state.isChallenged) && (
            <Animatable.View style={styles.innerContainer} animation="fadeInUp">
              <TextInput
                style={[
                  textStyles.GeneralText,
                  {
                    borderColor: "#fff",
                    borderWidth: 1,
                    minHeight: 48,
                    textAlignVertical: "top",
                    color: "#000"
                  }
                ]}
                placeholder={this.props.placeholder}
                multiline={true}
                placeholderTextColor="lightgrey"
                underlineColorAndroid="transparent"
                value={this.state.description}
                onChangeText={description => {
                  this.setState({ description });
                  this.props.onValueChange(
                    description && description.length > 0
                      ? {
                          stringValues: [description]
                        }
                      : undefined
                  );
                }}
              />
            </Animatable.View>
          )}
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
    marginTop: 15
  }
});
