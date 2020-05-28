import React, { Component } from "react";
import {
  Text,
  Image,
  View,
  TouchableOpacity,
  NativeModules,
  LayoutAnimation,
  Animated
} from "react-native";
import ThemeStyle from "../../styles/ThemeStyle";
import TextStyles from "../../common/TextStyles";
import { followUpTypes, exerciseIcons } from "../../constants";
import Card from "../../components/Card";
import LinearGradient from "react-native-linear-gradient";
let moment = require("moment");
const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export default class FollowUpItem extends Component<{}, {}> {
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

  renderTextType = element => {
    let data = element;
    if (!data.value || !data.value.stringValues) {
      return null;
    }
    return (
      <View style={{ paddingVertical: 8, marginBottom: 8 }}>
        <Text style={[TextStyles.GeneralTextBold]}>
          {data.value.stringValues[0]}
        </Text>
      </View>
    );
  };

  renderMultiSelect = element => {
    let data = element;
    if (!data.value || !data.value.keyValues) return null;
    return (
      <View>
        <View
          style={{
            paddingHorizontal: 20,
            marginLeft: -20,
            paddingVertical: 6,
            backgroundColor: ThemeStyle.mainColor,
            maxWidth: "60%",
            borderTopRightRadius: 4,
            borderBottomRightRadius: 4
          }}
        >
          <Text style={[TextStyles.ContentText, { color: "#fff" }]}>
            Cognitive Distortions
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            marginTop: 8
          }}
        >
          {this.renderChips(data.value.keyValues)}
        </View>
      </View>
    );
  };

  renderChips = (list, isIcon) => {
    console.log(list);
    let elementsList = [];
    if (list.length > 0) {
      list.map(data => {
        elementsList.push(
          <View
            key={data.key.id}
            style={{
              paddingHorizontal: 12,
              borderWidth: 1,
              marginRight: 8,
              marginBottom: 8,
              borderRadius: 25,
              alignItems: "center",
              paddingVertical: 4,
              borderColor: data.key.color,
              flexDirection: "row",
              backgroundColor: data.value ? data.key.color : "#fff"
            }}
          >
            {isIcon && (
              <Image
                source={exerciseIcons[data.key.icon]}
                style={{ width: 18, height: 18, tintColor: data.key.color }}
              />
            )}
            <Text
              style={[
                TextStyles.ContentText,
                {
                  color: data.value ? "#fff" : data.key.color,
                  marginLeft: 4,
                  fontSize: 11
                }
              ]}
            >
              {data.value
                ? data.key.name + " : " + data.value + "%"
                : data.key.name}
            </Text>
          </View>
        );
      });
    }
    return elementsList;
  };

  renderSingleSelect = data => {
    if (!data.value || !data.value.keyValues) return null;
    return (
      <View
        style={{
          backgroundColor: "rgba(243,202,62,0.2)",
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 4,
          borderRadius: 4,
          marginHorizontal: 20,
          marginBottom: 20,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row"
        }}
      >
        <Text
          style={[
            TextStyles.GeneralTextBold,
            { paddingBottom: 8, marginRight: 16, fontSize: 12 }
          ]}
        >
          Follow-Up Result:
        </Text>
        {this.renderChips(data.value.keyValues)}
      </View>
    );
  };

  render() {
    // LayoutAnimation.configureNext(
    //   LayoutAnimation.create(300, "easeIn", "opacity")
    // );
    const { data } = this.state;
    let imagePath = require("../../assets/images/prediction_icon.png");
    let imageTint = "#fff";
    const followupData = data.details[data.details.length - 1];
    let followUpResult;
    let title = "";
    let isPrediction = false;
    // switch (this.state.type) {
    //   case followUpTypes.PREDICTION:
    //     imagePath = require("../../assets/images/redesign/cbt-prediction-graphic.png");
    //     followUpResult = followupData.details[0];
    //     title = "Prediction";
    //     isPrediction = true;
    //     break;
    //   case followUpTypes.THOUGHT:
    //     imagePath = require("../../assets/images/redesign/cbt-automatic-thought-graphic.png");
    //     followUpResult = followupData.details[1];
    //     title = "Challenge Automatic \nThought";
    //     break;
    // }
    LayoutAnimation.easeInEaseOut();
    return (
      <TouchableOpacity
        style={{ elevation: 4 }}
        onPress={() => {
          this.props.navigation.navigate("ExerciseReviewScreen", {
            title: data.title,
            isOverview: false,
            id: data.id,
            exerciseId: data.exerciseId
          });
        }}
      >
        <Card
          style={{
            marginBottom: 12,
            marginHorizontal: 12
          }}
        >
          <View style={{ padding: 20 }}>
            <Image
              source={imagePath}
              style={{
                position: "absolute",
                right: isPrediction ? 12 : -12,
                top: 0,
                height: 96
              }}
              resizeMode="contain"
            />
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <Text
                style={[
                  TextStyles.SubHeaderBold,
                  { color: ThemeStyle.mainColor }
                ]}
              >
                {title}
              </Text>
            </View>
            {this.renderTextType(data.details[0])}
            {this.state.type === followUpTypes.THOUGHT &&
              this.renderMultiSelect(data.details[1], true)}
          </View>
          {data && data.followCompleted ? (
            this.renderSingleSelect(followUpResult)
          ) : (
            <View style={{ height: 12 }}></View>
          )}
        </Card>
        {data &&
          !data.followCompleted &&
          data.followupDate &&
          moment().isSameOrAfter(moment(data.followupDate)) && (
            <TouchableOpacity
              style={{ elevation: 5 }}
              onPress={() => {
                this.props.navigation.navigate("ExerciseReviewScreen", {
                  title: data.title,
                  isOverview: false,
                  id: data.id,
                  exerciseId: data.exerciseId
                });
              }}
            >
              <LinearGradient
                colors={ThemeStyle.gradientColor}
                start={{ x: 1, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={{
                  flexDirection: "row",
                  backgroundColor: ThemeStyle.accentColor + "aa",
                  padding: 12,
                  borderRadius: 24,
                  justifyContent: "center",
                  position: "absolute",
                  bottom: -8,
                  left: 60,
                  right: 60
                }}
              >
                <Image
                  source={require("../../assets/images/redesign/follow-icon.png")}
                  style={{ tintColor: "#fff" }}
                />
                <Text
                  style={[
                    TextStyles.GeneralText,
                    { color: "#fff", fontWeight: "bold", marginLeft: 12 }
                  ]}
                >
                  Follow Up
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        {data &&
          !data.followCompleted &&
          data.followupDate &&
          moment().isSameOrAfter(moment(data.followupDate)) && (
            <View style={{ height: 20 }}></View>
          )}
      </TouchableOpacity>
    );
  }
}
