import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  Switch,
  TouchableOpacity,
  StatusBar
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import ThemeStyle from "../styles/ThemeStyle";
import Icon from "../common/icons";
import Header from "./../components/Header";
import { withSubscriptionActions } from "../utils/StoreUtils";
import { showMessage } from "react-native-flash-message";
import { errorMessage } from "../utils";
import { Auth } from "aws-amplify";
import { getPurchases, initializePremiumContent } from "../actions/IAPActions";
import { APP } from "../constants";
import { recordScreenEvent, screenNames } from "../utils/AnalyticsUtils";
import { withSafeAreaActions } from "../utils/StoreUtils";
import { setTopSafeAreaView } from "../actions/AppActions";

const STATUSBAR_HEIGHT = 15;

class SettingScreen extends Component {
  constructor(props) {
    super(props);
    AsyncStorage.getItem("@pin").then(pin => {
      if (pin) {
        let pinStatus = JSON.parse(pin);
        this.setState({
          switch: pinStatus.isPinEnabled,
          storedPin: pinStatus.storedPin
        });
      } else {
        this.setState({
          switch: false
        });
      }
    });
    this.state = {
      visible: false
    };
  }

  onChangeFunction(newState) {
    if (this.state.switch) {
      this.props.navigation.navigate("PINCodeScreen", {
        isReset: true,
        status: "enter",
        storedPin: this.state.storedPin
      });
    } else {
      this.props.navigation.navigate("PINCodeScreen", {
        status: "choose"
      });
    }
  }

  premiumNavigation = (path, params) => {
    if (this.props.isSubscribed) {
      this.props.navigation.push(path, params);
    } else {
      this.props.showSubscription();
    }
  };

  onPressShareSettings = () => {
    // this.props.setLoading(true);
    Auth.currentUserInfo()
      .then(user => {
        Auth.currentSession()
          .then(session => {
            if (
              session.idToken.payload["cognito:groups"] &&
              session.idToken.payload["cognito:groups"].includes(
                APP.usersGroupName
              )
            ) {
              if (user.attributes.name) {
                this.props.navigation.navigate("ShareSettingsList");
              } else {
                showMessage({
                  type: "warning",
                  message: "Please complete your profile"
                });
                setTimeout(() => {
                  this.props.navigation.navigate("EditProfileScreen");
                }, 2000);
              }
            } else {
              Auth.signOut()
                .then(res => {
                  this.props.navigation.navigate("LoginScreen");
                })
                .catch(err => {
                  console.log(err);
                  showMessage(errorMessage("Something went wrong"));
                });
            }
          })
          .catch(e => {
            console.log(e);
          });
      })
      .finally(() => {
        this.props.setLoading(false);
      });
  };

  componentDidMount() {
    this.props.setTopSafeAreaView(ThemeStyle.backgroundColor);
    recordScreenEvent(screenNames.settings);
  }

  componentWillUnmount() {
    this.props.setTopSafeAreaView(ThemeStyle.gradientStart);
  }

  render() {
    var tabSwitch =
      this.state.switch == true
        ? { backgroundColor: ThemeStyle.accentColor + "33" }
        : { backgroundColor: "lightgrey" };
    return (
      <View style={ThemeStyle.pageContainer}>
        <StatusBar
          translucent={true}
          backgroundColor={"transparent"}
          barStyle={"light-content"}
          hidden={false}
        />
        {/* Top Nav Bar*/}
        <Header
          title="Settings"
          goBack={() => {
            this.props.navigation.goBack(null);
          }}
        />

        <ScrollView>
          <View style={styles.mainContainer}>
            <View style={styles.borderContainer}>
              <TouchableOpacity
                onPress={() =>
                  this.premiumNavigation("ReminderScreen", {
                    isAffirmation: false
                  })
                }
                style={styles.inerContainer}
              >
                <Text style={styles.textContent}>Reminders</Text>
                <Icon
                  name="arrow-right"
                  family="SimpleLineIcons"
                  style={styles.iconStyle}
                  size={14}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.borderContainer}>
              <TouchableOpacity
                onPress={() =>
                  this.premiumNavigation("ReminderScreen", {
                    isAffirmation: true
                  })
                }
                style={styles.inerContainer}
              >
                <Text style={styles.textContent}>Affirmations</Text>
                <Icon
                  name="arrow-right"
                  family="SimpleLineIcons"
                  style={styles.iconStyle}
                  size={14}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.inerContainer}>
              <Text style={styles.textContent}>Pin Lock</Text>
              <TouchableOpacity style={[styles.switchContainer, tabSwitch]}>
                <Switch
                  style={{}}
                  value={this.state.switch}
                  disabled={false}
                  onTintColor={ThemeStyle.accentColor + "33"}
                  tintColor={"transparent"}
                  thumbTintColor={ThemeStyle.accentColor}
                  onValueChange={value => this.onChangeFunction(value)}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.mainContainer}>
            <View style={styles.borderContainer}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("EditProfileScreen")
                }
                style={styles.inerContainer}
              >
                <Text style={styles.textContent}>Edit Profile</Text>
                <Icon
                  name="arrow-right"
                  family="SimpleLineIcons"
                  style={styles.iconStyle}
                  size={14}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.borderContainer}>
              <TouchableOpacity
                style={styles.inerContainer}
                onPress={this.onPressShareSettings}
              >
                <Text style={styles.textContent}>Sharing Settings</Text>
                <Icon
                  name="arrow-right"
                  family="SimpleLineIcons"
                  style={styles.iconStyle}
                  size={14}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.borderContainer}>
              <TouchableOpacity
                style={styles.inerContainer}
                onPress={() =>
                  this.premiumNavigation('DeviceList', {
                    isAffirmation: false,
                  })
                }
              >
                <Text style={styles.textContent}>Devices</Text>
                <Icon
                  name="arrow-right"
                  family="SimpleLineIcons"
                  style={styles.iconStyle}
                  size={14}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.borderContainer}>
              <TouchableOpacity
                style={styles.inerContainer}
                onPress={() =>
                  this.premiumNavigation('SourceSettings', {
                    isAffirmation: false,
                  })
                }
              >
                <Text style={styles.textContent}>Source Settings</Text>
                <Icon
                  name="arrow-right"
                  family="SimpleLineIcons"
                  style={styles.iconStyle}
                  size={14}
                />
              </TouchableOpacity>
            </View>
            {/* <View style={styles.borderContainer}>
              <TouchableOpacity
                style={styles.inerContainer}
                onPress={() => {
                  console.log(this.props.isSubscribed);
                  this.premiumNavigation("EntryPreferencesScreen");
                }}
              >
                <Text style={styles.textContent}>Entry Preferences</Text>
                <Icon
                  name="arrow-right"
                  family="SimpleLineIcons"
                  style={styles.iconStyle}
                  size={14}
                />
              </TouchableOpacity>
            </View> */}
            {/* <View style={styles.borderContainer}>
              <TouchableOpacity
                style={styles.inerContainer}
                onPress={() => {
                  console.log(this.props.isSubscribed);
                  this.premiumNavigation("ExerciseSettings");
                }}
              >
                <Text style={styles.textContent}>Exercise Settings</Text>
                <Icon
                  name="arrow-right"
                  family="SimpleLineIcons"
                  style={styles.iconStyle}
                  size={14}
                />
              </TouchableOpacity>
            </View> */}
          </View>

          <View style={styles.mainContainer}>
            <TouchableOpacity
              style={styles.inerContainer}
              onPress={() => {
                this.props.setLoading(true);
                this.props.initializePremiumContent(isPremium => {
                  this.props.setLoading(false);
                  showMessage({
                    type: isPremium ? "success" : "danger",
                    message: isPremium
                      ? "Your subscription has been restored successfully!"
                      : "We could not find any subscriptions to restore. If you think this is an error, please contact us"
                  });
                });
              }}
            >
              <Text style={styles.textContent}>Restore Purchase</Text>
              <Icon
                name="arrow-right"
                family="SimpleLineIcons"
                style={styles.iconStyle}
                size={14}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}
export default withSubscriptionActions(
  SettingScreen,
  () => {},
  dispatch => ({
    clearRecordFlow: () => dispatch(clearState()),
    setTopSafeAreaView: color => dispatch(setTopSafeAreaView(color)),
    initializePremiumContent: cb => dispatch(initializePremiumContent(cb)),
    getPurchases: cb => dispatch(getPurchases(cb))
  })
);

var styles = StyleSheet.create({
  linearGradient: {
    flex: 1
  },
  mainContainer: {
    marginTop: 12,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    ...ThemeStyle.shadow(),
    marginBottom: 6
  },
  borderContainer: {
    borderBottomWidth: 0.5,
    borderColor: "lightgrey"
  },
  inerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "space-between"
  },
  textContent: {
    color: ThemeStyle.mainColor,
    fontSize: 16,
    paddingVertical: 24,
    fontFamily: "AirbnbCerealApp-Medium"
  },
  iconStyle: {
    color: "#000"
  },
  switchContainer: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    borderWidth: 1,
    borderColor: ThemeStyle.accentColor,
    borderRadius: 30
  }
});
