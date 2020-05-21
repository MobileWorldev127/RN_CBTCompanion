import React, { Component } from "react";
import {
  View,
  TouchableHighlight,
  ScrollView,
  Text,
  Image
} from "react-native";
import * as Animatable from "react-native-animatable";
import Icon from "./../common/icons";
import Header from "../components/Header";
import ThemeStyle from "../styles/ThemeStyle";
import { withSubscriptionActions } from "../utils/StoreUtils";
import TextStyles from "../common/TextStyles";
import CachedImage from "react-native-image-cache-wrapper";
import { screenNames, recordScreenEvent } from "../utils/AnalyticsUtils";
import Card from "../components/Card";

class MoreScreen extends Component {
  constructor(props) {
    super(props);
    this.items = [
      {
        title: "Community",
        onPress: () =>
          this.props.navigation.navigate("CommunityScreen", {
            isBack: true
          }),
        color: ThemeStyle.communityColor,
        iconName: "chart-arc",
        iconFamily: "MaterialCommunityIcons",
        isIcon: true,
        image: require("../assets/images/redesign/community-graphic.png")
      },
      {
        title: "Summary",
        onPress: () =>
          this.props.navigation.navigate("Summary", {
            isBack: true
          }),
        color: ThemeStyle.summaryColor,
        iconName: "chart-arc",
        iconFamily: "MaterialCommunityIcons",
        isIcon: true,
        image: require("../assets/images/redesign/Summary-graphic.png")
      },
      {
        title: "Homework",
        onPress: () =>
          this.props.isSubscribed
            ? this.props.navigation.navigate("HomeworkScreen")
            : this.props.showSubscription(),
        color: ThemeStyle.homeworkColor,
        iconName: "book",
        iconFamily: "MaterialIcons",
        isIcon: true,
        image: require("../assets/images/redesign/Homework-graphic.png")
      },
      {
        title: "Assessments",
        onPress: () =>
          this.props.isSubscribed
            ? this.props.navigation.navigate("AssessmentsScreen")
            : this.props.showSubscription(),
        iconName: "format-list-bulleted",
        iconFamily: "MaterialIcons",
        isIcon: true,
        color: ThemeStyle.assessmentsColor,
        image: require("../assets/images/redesign/assessments-graphic.png")
      },
      {
        title: "Quiz",
        onPress: () =>
          this.props.isSubscribed
            ? this.props.navigation.navigate("QuizScreen")
            : this.props.showSubscription(),
        iconName: "question",
        iconFamily: "SimpleLineIcons",
        isIcon: true,
        color: ThemeStyle.quizColor,
        image: require("../assets/images/redesign/quiz-graphic.png")
      },
      {
        title: "Meditation",
        onPress: () =>
          this.props.navigation.navigate("MeditationScreen", {
            isBack: true
          }),
        color: ThemeStyle.meditationColor,
        iconName: "chart-arc",
        iconFamily: "MaterialCommunityIcons",
        isIcon: true,
        image: require("../assets/images/redesign/Meditation.png")
      },
      {
        title: "Favorites",
        onPress: () =>
          this.props.isSubscribed
            ? this.props.navigation.navigate("FavoritesScreen", {
                isBack: true
              })
            : this.props.showSubscription(),
        color: ThemeStyle.favoriteColor,
        iconName: "chart-arc",
        iconFamily: "MaterialCommunityIcons",
        isIcon: true,
        image: require("../assets/images/redesign/Favorites-graphic.png")
      }
    ];
  }

  componentDidMount() {
    recordScreenEvent(screenNames.more);
  }

  render() {
    return (
      <View style={ThemeStyle.pageContainer}>
        <Header
          isDrawer={true}
          openDrawer={() => {
            this.props.navigation.openDrawer();
          }}
          title={"More Items"}
        />
        <ScrollView contentContainerStyle={{ paddingVertical: 24 }}>
          {this.items.map((item, index) => (
            <Animatable.View
              animation="pulse"
              delay={index * 200}
              style={{
                marginHorizontal: 16,
                marginBottom: 16,
                borderRadius: 8
              }}
            >
              <Card style={{ width: "100%", height: 96 }}>
                <TouchableHighlight
                  onPress={item.onPress}
                  underlayColor={item.color + "aa"}
                  style={{
                    backgroundColor: item.color
                  }}
                >
                  <View
                    style={{
                      height: "100%",
                      flexDirection: "row",
                      paddingHorizontal: 24,
                      justifyContent: "space-between",
                      alignItems: "center",
                      overflow: "hidden"
                    }}
                  >
                    {/* <Icon
                    family={item.iconFamily}
                    name={item.iconName}
                    size={32}
                    color="#fff"
                  /> */}
                    <Text
                      style={[
                        TextStyles.SubHeader2,
                        {
                          color: "#fff",
                          textAlign: "center",
                          marginHorizontal: 12
                        }
                      ]}
                    >
                      {item.title.toUpperCase()}
                    </Text>
                    <Image
                      source={item.image}
                      resizeMode="contain"
                      style={{ height: 96 }}
                    />
                  </View>
                </TouchableHighlight>
              </Card>
            </Animatable.View>
          ))}
        </ScrollView>
      </View>
    );
  }
}

export default withSubscriptionActions(MoreScreen);
