import React, { Component } from "react";
import { StyleSheet, Image, View, Dimensions, StatusBar } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import LinearGradient from "react-native-linear-gradient";
import ThemeStyle from "../styles/ThemeStyle";
import { Transition } from "react-navigation-fluid-transitions";
import { withSafeAreaActions } from "../utils/StoreUtils";
import { Auth } from "aws-amplify";
import SplashScreen from "react-native-splash-screen";
import {
  prepareIAP,
  getSubscriptionItems,
  getPurchases
} from "../actions/IAPActions";
import { StackActions, NavigationActions } from "react-navigation";
import { client } from "../App";
import { userPreferenceQuery } from "../queries";
import {
  preferenceTypes,
  setScreens,
  asyncStorageConstants
} from "../constants";
import Orientation from "react-native-orientation-locker";
import {
  getUserAffirmations,
  getUserReminders,
  getStorageConstant
} from "../utils/NotificationUtils";

const { width, height } = Dimensions.get("window");

class NewScreen extends Component {
  constructor(props) {
    super(props);
    this.props.setTopSafeAreaView("#fff");
    this.props.setBottomSafeAreaView("#fff");
  }

  navigateToHome = () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "DrawerRoutes" })]
    });
    this.props.navigation.dispatch(resetAction);
    this.props.setTopSafeAreaView(ThemeStyle.backgroundColor);
    this.props.setBottomSafeAreaView("#fff");
  };

  navigateToLogin = () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "LoginScreen" })]
    });
    this.props.navigation.dispatch(resetAction);
  };

  componentDidMount = async () => {
    Orientation.lockToPortrait();
    const clearStorage = await AsyncStorage.getItem(
      asyncStorageConstants.clearLocalStorage
    );
    if (!clearStorage || JSON.parse(clearStorage) !== true) {
      const notifID = await AsyncStorage.getItem("@notifID");
      const defaultReminder = await AsyncStorage.getItem("@defaultReminder");
      const reminders = await AsyncStorage.getItem(getStorageConstant(false));
      const affirmations = await AsyncStorage.getItem(getStorageConstant(true));
      AsyncStorage.clear();
      AsyncStorage.setItem(
        asyncStorageConstants.clearLocalStorage,
        JSON.stringify(true)
      );
      notifID && (await AsyncStorage.setItem("@notifID", notifID));
      defaultReminder &&
        (await AsyncStorage.setItem("@defaultReminder", defaultReminder));
      affirmations &&
        (await AsyncStorage.setItem(getStorageConstant(true), affirmations));
      reminders &&
        (await AsyncStorage.setItem(getStorageConstant(false), reminders));
    }
    AsyncStorage.getItem("token")
      .then(user => {
        if (user) {
          console.log("USER TOKEN", user);
          // client
          //   .query({
          //     query: userPreferenceQuery,
          //     fetchPolicy: "no-cache",
          //     variables: {
          //       type: preferenceTypes.TYPE_ENTRY_FLOW
          //     }
          //   })
          //   .then(res => {
          //     console.log("ENTRY_FLOW_PREFERENCES", res.data);
          //     if (res.data.getPreference && res.data.getPreference.data) {
          //       setScreens(JSON.parse(res.data.getPreference.data));
          //     }
          //   })
          //   .catch(err => {
          //     console.log(err);
          //     this.props.setLoading(false);
          //   });
          AsyncStorage.getItem("@pin").then(pin => {
            if (pin) {
              let pinStatus = JSON.parse(pin);
              if (pinStatus.isPinEnabled) {
                this.props.navigation.navigate("PINCodeScreen", {
                  status: "enter",
                  storedPin: pinStatus.storedPin
                });
              } else {
                this.navigateToHome();
              }
            } else {
              this.navigateToHome();
            }
          });
        } else {
          this.navigateToLogin();
        }
        SplashScreen.hide();
      })
      .catch(err => {
        this.navigateToLogin();
        // this.props.navigation.navigate("LoginScreen");
        SplashScreen.hide();
        console.log("error: ", err);
      });
  };

  render() {
    return (
      <View style={ThemeStyle.pageContainer}>
        <StatusBar
          backgroundColor={ThemeStyle.mainColor}
          barStyle={"light-content"}
          hidden={false}
        />
        <LinearGradient colors={["#fff", "#fff"]} style={styles.linearGradient}>
          <Transition appear="scale">
            <Image
              style={{ width: width / 2.0, height: width / 2.0 }}
              source={require("./../src/logo_transparent.png")}
              resizeMode="cover"
            />
          </Transition>
        </LinearGradient>
      </View>
    );
  }
}

export default withSafeAreaActions(NewScreen, undefined, dispatch => ({
  prepareIAP: cb => dispatch(prepareIAP(cb)),
  getSubscriptionItems: () => dispatch(getSubscriptionItems()),
  getPurchases: cb => dispatch(getPurchases(cb))
}));

var styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Gill Sans",
    textAlign: "center",
    margin: 10,
    color: "#ffffff",
    backgroundColor: "transparent"
  }
});
