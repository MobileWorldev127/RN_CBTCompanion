import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from "react";
import {
  BackHandler,
  View,
  Modal,
  ActivityIndicator,
  StatusBar,
  Platform,
  Alert,
  AppState,
  Easing,
  Animated
} from "react-native";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { connect } from "react-redux";
import ThemeStyle from "../styles/ThemeStyle";
import AwesomeAlert from "react-native-awesome-alerts";
import Routes from "./routes";
import {
  SafeAreaView,
  createAppContainer,
  NavigationActions
} from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import FlashMessage from "react-native-flash-message";
import SubscriptionScreen from "../screens/SubscriptionScreen";
import AffirmationModal from "../screens/affirmationView";
import RNIap from "react-native-iap";
import { toggleAffirmationView } from "../actions/AppActions";
import { configure, notificationType } from "../utils/NotificationUtils";
import {
  endIAPConnection,
  prepareIAP,
  getSubscriptionItems,
  getPurchases,
  initializePremiumContent,
  clearListeners
} from "../actions/IAPActions";
import OfflineModal, { setOfflineModal } from "../components/OfflineModal";
import "react-native-gesture-handler";
import UpdateModal from "../screens/UpdateModal";
let moment = require("moment");

let SlideFromRight = (index, position, width) => {
  const inputRange = [index - 1, index, index + 1];
  const translateX = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [width, 0, 0]
  });
  const slideFromRight = { transform: [{ translateX }] };
  return slideFromRight;
};

//Transition configurations for createStackNavigator
const TransitionConfiguration = () => {
  return {
    transitionSpec: {
      duration: 750,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: sceneProps => {
      const { layout, position, scene } = sceneProps;
      const width = layout.initWidth;
      const { index } = scene;
      return SlideFromRight(index, position, width);
    }
  };
};

const Stack = createStackNavigator(
  Routes,
  {
    transitionConfig: TransitionConfiguration,
    headerMode: "none"
  }
  // {
  //   navigationOptions: {
  //     headerStyle: {
  //       backgroundColor: '#fff',
  //     },
  //     headerTintColor: '#fff',
  //     headerTitleStyle: {
  //       fontWeight: 'bold',
  //     },
  //   },
  // }
);
export const AppNavigator = createAppContainer(Stack);

// export const appNavigatorMiddleware = createReactNavigationReduxMiddleware(
//   "root",
//   state => state.nav
// );

// const ReduxNav = reduxifyNavigator(AppNavigator, "root");
let App = undefined;
class AppWithNavigationState extends Component {
  constructor(props) {
    super(props);
    this.state = { showAlert: false, appState: AppState.currentState };
    App = this;
  }

  componentWillUnmount() {
    // BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    clearListeners();
    endIAPConnection();
  }

  logout = () => {
    BackHandler.exitApp();
  };

  hideAlert = () => {
    this.setState({ showAlert: false });
  };

  componentDidMount = async() => {
    this.props.initializePremiumContent();
    configure(token => {
      console.log(token);
    }, this.handleNotificationClick);
    AppState.addEventListener("change", nextState => {
      if (this.state.appState === "background" && nextState === "active") {
        console.log("APP HAS COME TO FOREGROUND");
        // this.props.initializePremiumContent();
      } else if (
        this.state.appState.match(/inactive|active/) &&
        nextState === "background"
      ) {
        // try {
        //   console.log("END IAP");
        //   endIAPConnection();
        // } catch (error) {
        //   console.log("ERROR CLOSING IAP", error);
        // }
      }
      this.setState({ appState: nextState });
      console.log("APP HAS COME TO BACKGROUND");
      AsyncStorage.setItem('LAST_BACKGROUND_TIME', moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"));
    });
  }

  handleNotificationClick = notification => {
    console.log("NOTIFICATION CLICKED", notification);
    let alertTitle, alertMessage, onClick;
    const notificationData =
      Platform.OS === "android" ? notification.userInfo : notification.data;
    if (notificationData) {
      switch (notificationData.type) {
        case notificationType.prediction:
          alertTitle = "Your prediction is ready for review";
          alertMessage = "Check if it was an accurate prediction";
          onClick = () =>
            this.navigator.dispatch(
              NavigationActions.navigate({
                routeName: "ExerciseReviewScreen",
                params: {
                  title: "Prediction",
                  isOverview: false,
                  id: notificationData.userExerciseId
                }
              })
            );
          break;
        case notificationType.affirmation:
          alertTitle = "Daily Affirmation";
          alertMessage = "Do you want to view now?";
          onClick = () => this.props.toggleAffirmation(true);
          break;
        case notificationType.reminder:
          alertTitle = "Diary Card Entry";
          alertMessage = "Do you want to start now?";
          onClick = () =>
            this.navigator.dispatch(
              NavigationActions.navigate({
                routeName: "Home",
                params: { isBack: true }
              })
            );
          break;
      }
      if (notification.foreground) {
        Alert.alert(
          alertTitle,
          alertMessage,
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            {
              text: "OK",
              onPress: onClick
            }
          ],
          { cancelable: false }
        );
      }
      if (notification.userInteraction) {
        onClick();
      }
    }
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  };

  render() {
    const { dispatch, nav } = this.props;
    return (
      <React.Fragment>
        <SafeAreaView
          style={{ flex: 0, backgroundColor: this.props.topSafeAreaView }}
        />
        <SafeAreaView
          forceInset={{ top: "never", bottom: "always" }}
          style={{ flex: 1, backgroundColor: this.props.bottomSafeAreaView }}
        >
          <View style={{ flex: 1 }}>
            <Modal
              transparent={true}
              animationType={"none"}
              visible={this.props.loading}
              onRequestClose={() => {
                console.log("close modal");
                // goBackTo();
                // this.props.setLoading(false);
              }}
            >
              <StatusBar translucent={false} backgroundColor={"#000000aa"} />
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  flexDirection: "column",
                  justifyContent: "space-around",
                  backgroundColor: "#000000aa"
                }}
              >
                <ActivityIndicator
                  animating={this.props.loading}
                  size="large"
                />
              </View>
            </Modal>
            <AppNavigator
              ref={navigationRef => {
                this.navigator = navigationRef;
              }}
            />
            <AwesomeAlert
              show={this.state.showAlert}
              showProgress={false}
              title="Confirmation"
              message="Do you want to close EDFONE?"
              closeOnTouchOutside={true}
              closeOnHardwareBackPress={false}
              showCancelButton={true}
              showConfirmButton={true}
              cancelText="No, Stay"
              confirmText="Yes, Exit"
              confirmButtonColor={ThemeStyle.appTheme}
              onCancelPressed={() => {
                this.hideAlert();
              }}
              onConfirmPressed={() => {
                RNIap.endConnection();
                this.logout();
              }}
            />
            <SubscriptionScreen />
            <AffirmationModal
              visible={this.props.affirmationVisible}
              onClose={() => this.props.toggleAffirmation(false)}
            />
            <OfflineModal
              ref={ref => {
                setOfflineModal(ref);
              }}
              onBack={() => {
                this.navigator.dispatch(NavigationActions.back({}));
              }}
            />
            <UpdateModal />
          </View>
        </SafeAreaView>
        <FlashMessage position="top" />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.app.isLoading,
  topSafeAreaView: state.app.topSafeAreaView,
  bottomSafeAreaView: state.app.bottomSafeAreaView,
  affirmationVisible: state.app.affirmationVisible
});

const mapDispatchToProps = dispatch => ({
  toggleAffirmation: shouldShow => dispatch(toggleAffirmationView(shouldShow)),
  initializePremiumContent: () => dispatch(initializePremiumContent())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppWithNavigationState);
