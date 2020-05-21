import React from "react";
import { Image, Platform } from "react-native";
import { createBottomTabNavigator } from "react-navigation-tabs";
import HomeScreen from "./AddScreen";
import EntriesScreen from "../EntriesScreen";
import Summary from "./Summary";
import Lessons from "./../lessons/LessonsScreen";
import Record from "./Record";
import MoreScreen from "./../MoreScreen";
import ExerciseModules from "./../exercise/ExerciseListScreen";

import ThemeStyle from "../../styles/ThemeStyle";
import { FONT_FAMILY } from "../../common/TextStyles";
import FooterContent from "./FooterComponent";
import CommunityScreen from "../community/CommunityScreen";

export const tabRoutes = {
  HomeScreen: {
    name: "HomeScreen",
    screen: EntriesScreen
  },

  // Summary: {
  //   screen: Summary,
  //   navigationOptions: {
  //     tabBarLabel: "Summary",
  //     tabBarIcon: ({ focused }) => {
  //       if (focused) {
  //         return (
  //           <Image
  //             source={require("../../src/pie-chart1.png")}
  //             style={{
  //               width: 26,
  //               height: 26,
  //               resizeMode: "contain",
  //               tintColor: ThemeStyle.mainColor
  //             }}
  //           />
  //         );
  //       } else {
  //         return (
  //           <Image
  //             source={require("../../src/pie-chart.png")}
  //             style={{
  //               width: 20,
  //               height: 20,
  //               resizeMode: "contain"
  //             }}
  //           />
  //         );
  //       }
  //     }
  //   }
  // },

  // ExerciseModules: {
  //   name: "ExerciseModules",
  //   screen: ExerciseModules,
  //   params: {
  //     isEdit: false
  //   }
  // },

  Exercise: {
    name: "Exercise",
    screen: ExerciseModules,
    params: {
      parent: "-1"
    }
  },

  Record: {
    name: "Record",
    screen: HomeScreen,
    params: {
      parent: "-1"
    }
  },

  // Meditation: {
  //   screen: Meditation,
  //   navigationOptions: {
  //     tabBarLabel: "Meditation",
  //     tabBarIcon: ({ focused }) => {
  //       if (focused) {
  //         return (
  //           <Image
  //             source={require("../../src/meditations1.png")}
  //             style={{
  //               width: 26,
  //               height: 26,
  //               resizeMode: "contain",
  //               tintColor: ThemeStyle.mainColor
  //             }}
  //           />
  //         );
  //       } else {
  //         return (
  //           <Image
  //             source={require("../../src/meditations.png")}
  //             style={{ width: 20, height: 20, resizeMode: "contain" }}
  //           />
  //         );
  //       }
  //     }
  //   }
  // },

  Lessons: {
    name: "Lessons",
    screen: Lessons
  },
  More: {
    name: "More",
    screen: MoreScreen
  }
};

const TabNav = createBottomTabNavigator(tabRoutes, {
  tabBarComponent: FooterContent,
  tabBarPosition: "bottom",
  swipeEnabled: true,
  animationEnabled: true,
  lazy: true,
  initialRouteName: "HomeScreen",
  tabBarOptions: {
    upperCaseLabel: false,
    pressColor: "#f9e500",
    pressOpacity: 0.6,
    activeTintColor: ThemeStyle.mainColor,
    inactiveTintColor: "#777",
    // tabKeyToHideLabel:'Record',
    style: {
      padding: 2,
      backgroundColor: "#FFF",
      height: Platform.OS === "ios" ? 58 : 64,
      borderTopWidth: 1,
      borderColor: "lightgrey"
    },
    tabStyle: {
      //flex:0,
    },
    labelStyle: {
      fontFamily: FONT_FAMILY,
      fontSize: 12
      //margin:0
    },
    iconStyle: {}
  }
});

export default TabNav;
