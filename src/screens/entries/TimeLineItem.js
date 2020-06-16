import React, { Component } from "react";
import {
  Text,
  Image,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  NativeModules,
  LayoutAnimation,
  Animated
} from "react-native";
import ThemeStyle from "../../styles/ThemeStyle";
import Icon from "../../common/icons";
import TextStyles from "../../common/TextStyles";
import { showMessage } from "react-native-flash-message";
import { timeLineItemTypes } from "../../constants";
let moment = require("moment");
import * as Animatable from "react-native-animatable";
import { pluralString } from "../../utils";
import Card from "../../components/Card";
const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export default class TimeLineItem extends Component<{}, {}> {
  constructor(props) {
    super(props);
    this.state = props;
    this.animation = new Animated.Value();
  }

  componentWillReceiveProps(nextProps) {
    // console.log("will receive props", nextProps);
    this.setState({
      ...nextProps
    });
  }

  renderChips() {
    let elementsList = [];
    let title = "";
    let borderColor = TextStyles.GeneralText.color;
    let textColor = TextStyles.GeneralText.color;
    let backgroundColor = "#fff";



    this.state.items.map(data => {
      switch (this.state.type) {
        case timeLineItemTypes.EXERCISE:
          title = data.title;
          borderColor = data.color;
          textColor = data.color;
          break;
        case timeLineItemTypes.MEDITATION:
          let minutes =
            Math.floor(data.totalMinutes) > 0
              ? Math.floor(data.totalMinutes) +
                pluralString(Math.floor(data.totalMinutes), "minute") +
                " "
              : "";
          minutes +=
            data.totalMinutes % 1 > 0
              ? Math.floor((data.totalMinutes % 1) * 60) +
                pluralString(Math.floor((data.totalMinutes % 1) * 60), "second")
              : "";
          title = `${data.title} : ${minutes}`;
          break;
        case timeLineItemTypes.PRACTICE_IDEAS:
          title = `${data.title}`;
          textColor = ThemeStyle.mainColor;
          borderColor = ThemeStyle.mainColor;
      }
      elementsList.push(
        <TouchableOpacity
          key={data.id}
          style={{
            paddingHorizontal: 12,
            borderWidth: 1,
            marginRight: 8,
            marginBottom: 8,
            borderRadius: 25,
            paddingVertical: 4,
            borderColor: borderColor,
            backgroundColor: backgroundColor
          }}
          onPress={() => {
            switch (this.state.type) {
              case timeLineItemTypes.EXERCISE:
                console.log(data.id);
                this.props.navigation.navigate("ExerciseReviewScreen", {
                  title: data.title,
                  isOverview: false,
                  id: data.id,
                  exerciseId: data.exerciseId
                });
                break;
              case timeLineItemTypes.PRACTICE_IDEAS:
                console.log("PRACTICE IDEA ID", data.id);
                this.props.navigation.navigate("PracticeIdeaReviewScreen", {
                  practiceIdeaId: data.id
                });
                break;
            }
          }}
        >
          <Text
            style={[
              TextStyles.ContentText,
              { color: textColor, textAlign: "center" }
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </TouchableOpacity>
      );
    });
    return (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center"
        }}
      >
        {elementsList}
      </View>
    );
  }

  render() {
    let imagePath = require("../../assets/images/redesign/exercise-graphic-bg.png");
    let imageBackground = ThemeStyle.pageContainer.backgroundColor;
    let color = ThemeStyle.textColor;
    let imageTint = "#fff";
    switch (this.state.type) {
      case timeLineItemTypes.EXERCISE:
        imagePath = require("../../assets/images/redesign/exercise-graphic-bg.png");
        imageBackground = ThemeStyle.exerciseColor;
        break;
      case timeLineItemTypes.MEDITATION:
        imagePath = require("../../assets/images/redesign/Meditations-graphic.png");
        imageBackground = ThemeStyle.meditationColor;
        color = ThemeStyle.mainColor;
        break;
      case timeLineItemTypes.PRACTICE_IDEAS:
        imagePath = require("../../assets/images/redesign/Practice-ideas.png");
        imageBackground = ThemeStyle.practiceIdeasColor;
        color = ThemeStyle.accentColor;
    }
    LayoutAnimation.easeInEaseOut();
    return (
      <View>
        <TouchableWithoutFeedback
          onPress={() => {
            this.state.onPress();
          }}
        >
          <Card
            style={{
              marginBottom: 12,
              marginHorizontal: 12,
              backgroundColor: "#FFFFFF",
              minHeight: 120
            }}
          >
            <View style={{ padding: 20 }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8
                }}
              >
                <Text style={[TextStyles.SubHeaderBold, { color: color }]}>
                  {this.state.type}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "flex-start",
                  flex: 1
                }}
              >
                {this.renderChips()}
              </View>
              <Image
                source={imagePath}
                style={{ position: "absolute", top: 16, right: 4 }}
              />
            </View>
          </Card>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderImage = () => {};
}
