import PINCode, { PinResultStatus } from "@haskkor/react-native-pincode";
import React, { Component, Fragment } from "react";
import AsyncStorage from '@react-native-community/async-storage';
import Header from "../components/Header";
import LinearGradient from "react-native-linear-gradient";
import ThemeStyle from "../styles/ThemeStyle";
import { StackActions, NavigationActions } from "react-navigation";
import { withSafeAreaActions } from "../utils/StoreUtils";
import { recordScreenEvent, screenNames } from "../utils/AnalyticsUtils";

class PINCodeScreen extends Component {
  constructor(props) {
    super(props);
    let params = props.navigation.state.params;
    this.state = {
      status: params.status,
      pinStatus: PinResultStatus.initial
    };
    if (params.status == "enter") {
      this.state.storedPin = params.storedPin;
      this.state.isReset = params.isReset;
    }
  }

  componentWillReceiveProps(props) {
    let params = props.navigation.state.params;
    if (params.status == "enter") {
      this.setState({
        status: params.status,
        storedPin: params.storedPin,
        isReset: params.isReset,
        pinStatus: PinResultStatus.initial
      });
    } else {
      this.setState({
        status: params.status,
        storedPin: undefined,
        isReset: false,
        pinStatus: PinResultStatus.initial
      });
    }
  }

  componentDidMount() {
    recordScreenEvent(screenNames.pin, {
      type: this.state.isReset ? "reset" : this.state.status
    });
  }

  render() {
    this.props.setTopSafeAreaView(ThemeStyle.gradientStart);
    this.props.setBottomSafeAreaView(ThemeStyle.gradientEnd);
    return (
      <LinearGradient style={{ flex: 1 }} colors={ThemeStyle.gradientColor}>
        {(this.state.status === "choose" ||
          (this.state.status === "enter" && this.state.isReset)) && (
          <Header
            isClose={true}
            isLightContent={true}
            title={this.state.isReset ? "Remove PIN" : "Set PIN"}
            onClose={() => {
              this.props.setTopSafeAreaView("#fff");
              this.props.setBottomSafeAreaView("#fff");
              this.props.navigation.goBack(null);
            }}
            navBarStyle={{ backgroundColor: "#0000" }}
          />
        )}
        <PINCode
          status={this.state.status}
          storedPin={this.state.storedPin}
          colorPassword="#fff"
          stylePinCodeColorTitle="#fff"
          stylePinCodeColorSubtitle="#fff"
          stylePinCodeDeleteButtonText={{
            color: "#fff"
          }}
          stylePinCodeDeleteButtonColorShowUnderlay="#fff"
          stylePinCodeDeleteButtonColorHideUnderlay="#fff"
          pinStatus={
            this.state.shouldRefresh
              ? this.state.pinStatus
              : this.state.pinStatus
          }
          storePin={pincode => {
            console.log(pincode);
            if (this.state.status === "choose") {
              AsyncStorage.setItem(
                "@pin",
                JSON.stringify({
                  storedPin: pincode,
                  isPinEnabled: true
                })
              );
              this.resetToHome();
            }
          }}
          endProcessFunction={pincode => {
            console.log(pincode);
            if (this.state.status === "choose") {
              console.log("SEtting pin");
              AsyncStorage.setItem(
                "@pin",
                JSON.stringify({
                  storedPin: pincode,
                  isPinEnabled: true
                })
              );
              this.resetToHome();
            } else {
              if (pincode === this.state.storedPin) {
                if (this.state.isReset) {
                  console.log("removing pin");
                  AsyncStorage.setItem(
                    "@pin",
                    JSON.stringify({
                      storedPin: pincode,
                      isPinEnabled: false
                    })
                  );
                  this.resetToHome();
                } else {
                  console.log("correct pin");
                  this.resetToHome();
                }
              } else {
                this.setState(
                  {
                    pinStatus: PinResultStatus.failure
                  },
                  () => {
                    this.setState({
                      pinStatus: PinResultStatus.initial
                    });
                  }
                );
              }
            }
          }}
        />
      </LinearGradient>
    );
  }

  resetToHome = () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "DrawerRoutes" })]
    });
    this.props.navigation.dispatch(resetAction);
    this.props.setTopSafeAreaView("#fff");
    this.props.setBottomSafeAreaView("#fff");
  };
}

export default withSafeAreaActions(PINCodeScreen);
