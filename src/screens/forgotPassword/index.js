import React, { Component } from "react";
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Modal,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import Icon from "react-native-vector-icons/Ionicons";
import { Auth } from "aws-amplify";
import { AuthPiece } from "aws-amplify-react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from "./styles";
import sha from "sha.js";
import validator from "validator";
import ThemeStyle from "../../styles/ThemeStyle";
import { showMessage } from "react-native-flash-message";
import { errorMessage } from "../../utils";
import LinearGradient from "react-native-linear-gradient";
import TextStyles from "../../common/TextStyles";
import { withStore, withSafeAreaActions } from "../../utils/StoreUtils";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";
import { asyncStorageConstants } from "../../constants";

class ForgotPasswordScreen extends Component {
  constructor() {
    super();
    this._validAuthStates = ["forgotPassword"];
    this.username = "";
    this.state = {
      email: "",
      confirmModal: false,
      confirmError: "",
      code: "",
      password: "",
      errorText: null,
      countdown: 0
    };
  }
  renderHeader = (show, onPress) => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.headerLeftButton}
        onPress={onPress ? onPress : () => this.props.navigation.goBack(null)}
      >
        <Icon name="ios-arrow-round-back" size={40} color={"#fff"} />
      </TouchableOpacity>
    </View>
  );

  componentDidMount() {
    recordScreenEvent(screenNames.forgotPassword);
  }

  forgotPassword = () => {
    const { email } = this.state;
    if (!(email && email !== "" && validator.isEmail(email))) {
      showMessage(errorMessage("Invalid emailID"));
    } else {
      this.username = new sha.sha256().update(email).digest("hex");
      this.props.setLoading(true);
      Auth.forgotPassword(this.username)
        .then(data => {
          this.showModal(true);
        })
        .catch(err => {
          console.log("Error: ", err);
          showMessage(errorMessage(err.message));
        })
        .finally(() => {
          this.props.setLoading(false);
        });
    }
  };

  confirmPassword = () => {
    const { code, password } = this.state;
    const upperexp = /[A-Z]/;
    const lowerexp = /[a-z]/;
    const numberexp = /[0-9]/;
    const specialexp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

    if (!(code && code !== "" && code.length)) {
      showMessage(errorMessage("Invalid verification code"));
    } else if (!(password && password !== "" && password.length >= 8)) {
      showMessage(errorMessage("Password should contain atleast 8 letters"));
    } else if (!upperexp.test(password)) {
      showMessage(
        errorMessage("Password should contain atleast one uppercase letter")
      );
    } else if (!lowerexp.test(password)) {
      showMessage(
        errorMessage("Password should contain atleast one lowercase letter")
      );
    } else if (!numberexp.test(password)) {
      showMessage(errorMessage("Password should contain atleast one number"));
    } else if (!specialexp.test(password)) {
      showMessage(
        errorMessage("Password should contain atleast one special character")
      );
    } else if (code.trim() !== "" && password.trim !== "") {
      this.props.setLoading(true);
      Auth.forgotPasswordSubmit(this.username, code, password)
        .then(data => {
          showMessage({
            type: "success",
            title: "Success",
            message: "Your password has been successfully changed!"
          });
          this.signInUser();
        })
        .catch(err => {
          showMessage(errorMessage(err.msg));
        })
        .finally(() => {
          this.props.setLoading(false);
        });
    }
  };

  signInUser = () => {
    this.props.setLoading(true);
    Auth.signIn(this.username, this.state.password)
      .then(res => {
        AsyncStorage.setItem("username", this.username);
        AsyncStorage.setItem(
          "token",
          res.signInUserSession.accessToken.jwtToken
        );
        Auth.currentUserInfo().then(userInfo => {
          AsyncStorage.setItem(
            asyncStorageConstants.userInfo,
            JSON.stringify(userInfo)
          );
        });
        this.props.setTopSafeAreaView("#fff");
        this.props.setBottomSafeAreaView("#fff");
        this.props.navigation.navigate("DrawerRoutes");
      })
      .catch(err => {
        console.log("Error: ", err);
        showMessage(errorMessage(err.msg));
      })
      .finally(() => {
        this.props.setLoading(false);
      });
  };

  showModal = type => this.setState({ showVerification: true });

  performCountdown = () => {
    this.setState({ countdown: 30 });
    let timer = setInterval(() => {
      if (this.state.countdown === 1) {
        this.setState({ countdown: 0 });
        clearInterval(timer);
      } else {
        this.setState({ countdown: this.state.countdown - 1 });
      }
    }, 1000);
  };
  resendConfirmationCode = () => {
    this.props.setLoading(false);
    Auth.forgotPassword(this.username)
      .then(response => {
        console.log("success. Response:", response);
        this.performCountdown();
        showMessage({
          type: "success",
          title: "Success",
          message: "A new code has been sent to your email."
        });
      })
      .catch(error => {
        console.log("error:", error);
        showMessage(
          errorMessage(
            error.message
              ? error.message
              : "Error in resending code. Please try again later."
          )
        );
      })
      .finally(() => {
        this.props.setLoading(false);
      });
  };

  render() {
    // if (!this._validAuthStates.includes(this.props.authState)) return null;
    const { errorText } = this.state;
    return (
      <LinearGradient
        colors={ThemeStyle.gradientColor}
        style={styles.container}
      >
        <KeyboardAwareScrollView style={styles.container}>
          {this.renderHeader()}
          <View style={styles.content}>
            <Text style={[TextStyles.HeaderBold, styles.title]}>
              FORGOT PASSWORD
            </Text>
            <View>
              {/* {this.state.error && (
              <Text style={styles.error}>{this.state.error}</Text>
            )} */}
              {!this.state.showVerification && (
                <View style={styles.singleInput}>
                  <Icon
                    name="ios-mail"
                    size={28}
                    color={"#fff"}
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.input}
                    autoCorrect={false}
                    onChangeText={email => {
                      email = email.trim();
                      this.setState({ email });
                    }}
                    value={this.state.email}
                    placeholder="Email Address"
                    placeholderTextColor="#fff"
                    autoCapitalize="none"
                    underlineColorAndroid="transparent"
                    onFocus={() => {
                      this.setState({ errorText: null });
                    }}
                  />
                </View>
              )}
              {/* <View style={styles.errorTextContainer}>
              {errorText ? (
                <Text style={styles.error}>{`*${errorText}`}</Text>
              ) : null}
            </View> */}
              {this.state.showVerification && (
                <View>
                  <Text style={styles.confirmText}>
                    We have sent an email with a verification code. Please enter
                    the details below.
                  </Text>
                  {/* <View style={[styles.singleInput, { marginTop: 45 }]}>
              <Icon name="ios-person-outline" size={28} color={theme.primaryColor} style={styles.icon} />
              <TextInput
                style={styles.input}
                onChangeText={(username) => this.setState({username})}
                value={this.state.username}
                placeholder="Username"
                placeholderTextColor="#aaa"
                underlineColorAndroid="transparent"
              />
            </View> */}
                  <View style={[styles.singleInput, { marginTop: 45 }]}>
                    <Icon
                      name="ios-mail"
                      size={28}
                      color={"#fff"}
                      style={styles.icon}
                    />
                    <TextInput
                      style={styles.input}
                      onChangeText={code => this.setState({ code })}
                      value={this.state.code}
                      placeholder="Verification Code"
                      placeholderTextColor="#fff"
                      underlineColorAndroid="transparent"
                    />
                  </View>
                  <View style={styles.singleInput}>
                    <Icon
                      name="ios-lock"
                      size={28}
                      color={"#fff"}
                      style={styles.icon}
                    />
                    <TextInput
                      style={styles.input}
                      onChangeText={password => this.setState({ password })}
                      value={this.state.password}
                      placeholder="New Password"
                      placeholderTextColor="#fff"
                      underlineColorAndroid="transparent"
                      secureTextEntry
                    />
                  </View>
                  <View
                    style={styles.resendCodeContainer}
                    onLayout={() => {
                      this.performCountdown();
                    }}
                  >
                    <TouchableOpacity
                      onPress={this.resendConfirmationCode}
                      style={styles.resendCodeButton}
                      disabled={this.state.countdown > 0}
                    >
                      <Text style={styles.resendCode}>{`Resend Code${
                        this.state.countdown > 0
                          ? `(${this.state.countdown})`
                          : ""
                      }`}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              <TouchableOpacity
                style={[styles.button, styles.loginButton]}
                onPress={
                  this.state.showVerification
                    ? this.confirmPassword
                    : this.forgotPassword
                }
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <View />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </LinearGradient>
    );
  }
}

export default withSafeAreaActions(ForgotPasswordScreen);
