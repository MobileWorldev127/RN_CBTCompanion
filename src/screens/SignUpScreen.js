import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Linking,
  StyleSheet,
  Dimensions,
  NativeModules,
  LayoutAnimation,
  Keyboard
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import Icon from "react-native-vector-icons/Ionicons";
import Amplify, { API, graphqlOperation, Auth } from "aws-amplify";
import sha from "sha.js";
import LinearGradient from "react-native-linear-gradient";
import TextStyles from "./../common/TextStyles";
import ThemeStyle from "../styles/ThemeStyle";
import { Transition } from "react-navigation-fluid-transitions";
import validator from "validator";
import { showMessage } from "react-native-flash-message";
import { errorMessage } from "../utils";
import { withSafeAreaActions } from "../utils/StoreUtils";
import {
  getAmplifyConfig,
  getEnvVars,
  APP,
  asyncStorageConstants
} from "../constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { recordScreenEvent, screenNames } from "../utils/AnalyticsUtils";
import { initializePremiumContent } from "../actions/IAPActions";
const { height } = Dimensions.get("window");
const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);
class SignupScreen extends Component<{}, {}> {
  constructor(props) {
    super(props);
    this._validAuthStates = ["signUp"];
    this.username = "";
    this.signupForm = null;
    this.state = {
      policyModal: false,
      countdown: 0
    };
    this.email = "";
    this.fname = "";
    this.lname = "";
    this.code = "";
    this.password = "";
    let params = props.navigation.state.params;
    if (params && params.showConfirmation) {
      this.username = params.email;
      this.email = params.email;
      this.password = params.password;
      this.state.showVerification = true;
    }
  }

  componentDidMount = () => {
    console.log("signup screen", Auth.configure());
    recordScreenEvent(screenNames.signUp);
  };

  componentWillReceiveProps(props) {
    let params = props.navigation.state.params;
    if (params && params.showConfirmation) {
      this.username = params.email;
      this.email = params.email;
      this.password = params.password;
      this.state.showVerification = true;
    }
  }

  performCountdown = () => {};

  signup = () => {
    const { password, email, fname, lname } = this;
    const upperexp = /[A-Z]/;
    const lowerexp = /[a-z]/;
    const numberexp = /[0-9]/;
    const specialexp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (!(fname && fname !== "")) {
      showMessage(errorMessage("Invalid First Name"));
    } else if (!(lname && lname !== "")) {
      showMessage(errorMessage("Invalid Last Name"));
    } else if (!(email && email !== "" && validator.isEmail(email))) {
      showMessage(errorMessage("Invalid Email"));
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
    } else {
      this.props.setLoading(true);
      this.username = new sha.sha256().update(email).digest("hex");
      Auth.signUp({
        username: this.username,
        password,
        attributes: {
          email,
          name: fname + " " + lname
        }
      })
        .then(user => {
          this.performCountdown();
          this.setState({
            showVerification: true
          });
        })
        .catch(err => {
          showMessage(errorMessage(err.message));
          console.log("Error: ", err);
        })
        .finally(() => {
          this.props.setLoading(false);
        });
    }
  };

  resendConfirmationCode = () => {
    this.props.setLoading(true);
    this.username = new sha.sha256().update(this.email).digest("hex");
    Auth.resendSignUp(this.username)
      .then(response => {
        console.log("success. Response:", response);
        this.performCountdown();
        showMessage({
          type: "success",
          message: "A new code has been sent to your email.",
          title: "Success"
        });
      })
      .catch(error => {
        console.log("error:", error);
        showMessage(errorMessage("Error in sending code. Please try again."));
      })
      .finally(() => this.props.setLoading(false));
  };

  confirmUser = () => {
    console.log("Confirming user");
    const { code, email } = this;
    if (!(email && email !== "" && validator.isEmail(email))) {
      this.setState({ confirmError: "Invalid Email" });
    } else if (!(code && code !== "")) {
      this.setState({ confirmError: "Invalid OTP" });
    } else {
      this.props.setLoading(true);
      this.username = new sha.sha256().update(this.email).digest("hex");
      Auth.confirmSignUp(this.username, code)
        .then(data => {
          console.log("Confirmed user");
          Keyboard.dismiss();
          // this.dropdown.alertWithType('success', 'Your account has been successfully verified.', 'Now you\'ll be able to log in')
          if (this.password) {
            this.signInUser();
          } else {
            this.props.setLoading(false);
            this.navigateToLogin();
          }
        })
        .catch(err => {
          this.props.setLoading(false);
          this.setState({ confirmError: err.message || err });
        });
    }
  };

  signInUser = () => {
    this.props.setLoading(true);
    Auth.signIn(this.username, this.password)
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
        Amplify.configure(
          getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
        );
        const addgroup = `mutation addUserToGroup($groupName: String!){
          addUserToGroup(groupName: $groupName){
            msg
          }
        }`;

        const data = {
          groupName: APP.usersGroupName
        };
        return API.graphql(graphqlOperation(addgroup, data));
      })
      .then(() => {
        return Auth.signIn(this.username, this.password);
      })
      .then(res => {
        AsyncStorage.setItem(
          "token",
          res.signInUserSession.accessToken.jwtToken
        );
        console.log("logged in");
        this.props.initializePremiumContent();
        // this.changeState('signedIn', res)
        this.props.navigation.navigate("DrawerRoutes");
        this.props.setTopSafeAreaView(ThemeStyle.backgroundColor);
        this.props.setBottomSafeAreaView("#fff");
      })
      .catch(err => {
        console.log("Error: ", err);
        showMessage(errorMessage(err.errors[0].message || err.message));
      })
      .finally(() => {
        // hideLoader();
        this.props.setLoading(false);
      });
  };

  showPolicy = type => this.setState({ policyModal: type });

  socialLoginAlert = platform => () => {
    alert(
      `Signup with ${platform} will be available soon. In the mean time login via email.`
    );
  };

  navigateToLogin = () => {
    this.props.navigation.navigate("LoginScreen");
    // this.setState({showSignupForm: false});
    // this.changeState('signIn');
  };

  getPolicyModal = () => {
    return (
      <Modal
        visible={this.state.policyModal}
        animationType="fade"
        backgroundColor="#0006"
        onRequestClose={() => this.showPolicy(false)}
        transparent
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#0006",
            justifyContent: "center"
          }}
        >
          <View style={styles.policyWrapper}>
            <TouchableOpacity
              onPress={() => this.showPolicy(false)}
              style={styles.policyOverlay}
            />
            <View style={styles.policyContainer}>
              <View style={styles.policyHeader}>
                <Text style={styles.policyTitle}>Password Policy</Text>
                <TouchableOpacity
                  onPress={() => this.showPolicy(false)}
                  style={styles.policyClose}
                >
                  <Icon
                    name="ios-close-circle-outline"
                    size={28}
                    color="white"
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.policyContent}>
                <View style={styles.policyRow}>
                  <Text style={styles.policy}>
                    Password must be atleast 8 characters.
                  </Text>
                </View>
                <View style={styles.policyRow}>
                  <Text style={styles.policy}>
                    Password must contain a uppercase character.
                  </Text>
                </View>
                <View style={styles.policyRow}>
                  <Text style={styles.policy}>
                    Password must contain a lowercase character.
                  </Text>
                </View>
                <View style={styles.policyRow}>
                  <Text style={styles.policy}>
                    Password must contain a number.
                  </Text>
                </View>
                <View style={styles.policyRow}>
                  <Text style={styles.policy}>
                    Password must contain a special character.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  getSignupForm = () => {
    return this.state.showVerification ? (
      <View>
        <Text style={styles.confirmText}>
          We have sent an email with a confirmation code. Please enter the code
          below.
        </Text>
        {this.state.confirmError !== "" && (
          <Text style={styles.error}>{this.state.confirmError}</Text>
        )}
        <View style={[styles.singleInput]}>
          <Icon name="md-at" size={28} color={"#fff"} style={styles.icon} />
          <TextInput
            style={styles.input}
            onChangeText={code => (this.code = code)}
            placeholder="Enter Code"
            placeholderTextColor="#fff"
            underlineColorAndroid="transparent"
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            this.resendConfirmationCode();
          }}
        >
          <Text
            style={[
              TextStyles.GeneralText,
              { textAlign: "center", marginBottom: 12 }
            ]}
          >
            Did not receive a code? RESEND CODE
          </Text>
        </TouchableOpacity>
      </View>
    ) : (
      <View>
        <View style={styles.singleInput}>
          <Icon name="ios-person" size={24} color="#fff" style={styles.icon} />
          <TextInput
            style={[TextStyles.SubHeaderBold, styles.input]}
            onChangeText={fname => (this.fname = fname.trim())}
            defaultValue={this.fname}
            placeholder="First Name"
            placeholderTextColor="#eee"
            autoCapitalize="none"
            underlineColorAndroid="transparent"
            textProps={{
              onFocus: () => {
                this.setState({ error: null });
              }
            }}
            onFocus={() => {
              this.setState({ error: null });
            }}
          />
        </View>

        <View style={styles.singleInput}>
          <Icon name="ios-person" size={28} color="#fff" style={styles.icon} />
          <TextInput
            style={[TextStyles.SubHeaderBold, styles.input]}
            onChangeText={lname => (this.lname = lname.trim())}
            defaultValue={this.lname}
            placeholder="Last Name"
            placeholderTextColor="#eee"
            autoCapitalize="none"
            underlineColorAndroid="transparent"
            onFocus={() => {
              this.setState({ error: null });
            }}
          />
        </View>

        <View style={styles.singleInput}>
          <Icon name="md-at" size={28} color="#fff" style={styles.icon} />
          <TextInput
            style={[TextStyles.SubHeaderBold, styles.input]}
            onChangeText={email => (this.email = email.trim())}
            defaultValue={this.email}
            placeholder="Email"
            keyboardType="email-address"
            placeholderTextColor="#eee"
            autoCapitalize="none"
            underlineColorAndroid="transparent"
            onFocus={() => {
              this.setState({ error: null });
            }}
          />
        </View>

        <View style={styles.singleInput}>
          <Icon name="ios-lock" size={28} color={"#fff"} style={styles.icon} />
          <TextInput
            style={[TextStyles.SubHeaderBold, styles.input]}
            onChangeText={password => (this.password = password.trim())}
            defaultValue={this.password}
            placeholder="Password"
            placeholderTextColor="#eee"
            secureTextEntry={true}
            autoCapitalize="none"
            underlineColorAndroid="transparent"
            onFocus={() => {
              this.setState({ error: null });
            }}
          />
          <TouchableOpacity
            onPress={() => this.showPolicy(true)}
            style={styles.rightIcon}
          >
            <Icon
              name="ios-help-circle-outline"
              size={28}
              color={"#fff"}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={ThemeStyle.gradientColor}
          style={{ height: height }}
        >
          <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
            <View style={styles.content}>
              <Text style={[TextStyles.HeaderBold, styles.title]}>SIGN UP</Text>
              {/* {this.state.error && (
              <Text style={styles.error}>{this.state.error}</Text>
            )} */}
              <View>
                <Transition appear="scale">
                  <View>
                    {this.getSignupForm()}
                    <TouchableOpacity
                      style={[styles.button, styles.loginButton]}
                      onPress={
                        this.state.showVerification
                          ? this.confirmUser
                          : this.signup
                      }
                    >
                      <Text style={[TextStyles.GeneralText, styles.buttonText]}>
                        Sign Up
                      </Text>
                    </TouchableOpacity>
                    <Text style={[TextStyles.GeneralText, styles.bottomText]}>
                      By signing up you agree to our
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        paddingHorizontal: 24,
                        justifyContent: "center"
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => Linking.openURL(APP.tnc)}
                      >
                        <Text
                          style={[
                            TextStyles.GeneralText,
                            styles.termsPrivacyText
                          ]}
                        >
                          Terms & Conditions
                        </Text>
                      </TouchableOpacity>
                      <Text
                        style={[
                          TextStyles.GeneralText,
                          styles.termsPrivacyText,
                          { color: "#000" }
                        ]}
                      >
                        {" and "}
                      </Text>
                      <TouchableOpacity
                        onPress={() => Linking.openURL(APP.privacyPolicy)}
                      >
                        <Text
                          style={[
                            TextStyles.GeneralText,
                            styles.termsPrivacyText
                          ]}
                        >
                          {" "}
                          Privacy Policy
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Transition>

                {/*<Text style={[TextStyles.GeneralText, styles.orText]}>OR</Text>

              <Transition appear="left">
                <TouchableOpacity
                  style={[styles.button, styles.facebookButton]}
                  onPress={this.socialLoginAlert("Facebook")}
                >
                  <Icon
                    name="logo-facebook"
                    size={25}
                    color="#fff"
                    style={{ marginRight: 10 }}
                  />
                  <Text style={[TextStyles.GeneralText, styles.buttonText]}>
                    Continue with Facebook
                  </Text>
                </TouchableOpacity>
              </Transition>
              <Transition appear="right">
                <TouchableOpacity
                  style={[styles.button, styles.googleButton]}
                  onPress={this.socialLoginAlert("Google")}
                >
                  <Icon
                    name="logo-google"
                    size={22}
                    color="#fff"
                    style={{ marginRight: 10 }}
                  />
                  <Text style={[TextStyles.GeneralText, styles.buttonText]}>
                    Continue with Google
                  </Text>
                </TouchableOpacity>
              </Transition>
            */}

                {/* <TouchableOpacity onPress={() => this.showModal(true)}>
                <Text style={styles.forgotPassword}>
                  Enter Confirmation Code
                </Text>
              </TouchableOpacity> */}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  borderRadius: 24,
                  borderColor: "#fff3",
                  borderWidth: 1
                }}
              >
                <Text
                  style={[
                    TextStyles.SubHeaderBold,
                    {
                      flex: 2,
                      paddingVertical: 12,
                      color: "#fff",
                      paddingHorizontal: 12,
                      fontSize: 15,
                      textAlign: "center"
                    }
                  ]}
                >
                  Have an account?
                </Text>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: ThemeStyle.mainColor,
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    borderRadius: 24,
                    justifyContent: "space-around"
                  }}
                  onPress={() => {
                    this.props.navigation.navigate("LoginScreen");
                  }}
                >
                  <Text
                    style={[
                      TextStyles.SubHeaderBold,
                      {
                        color: "#fff",
                        fontSize: 16,
                        textAlign: "center"
                      }
                    ]}
                  >
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </LinearGradient>
        {/* {this.getConfirmModal()} */}
        {this.getPolicyModal()}
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  initializePremiumContent: () => dispatch(initializePremiumContent())
});

export default withSafeAreaActions(SignupScreen, undefined, mapDispatchToProps);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingVertical: 48,
    paddingHorizontal: 24,
    justifyContent: "space-around"
  },
  title: {
    color: "#fff",
    fontSize: 30,
    textAlign: "center",
    letterSpacing: 3
  },
  singleInput: {
    padding: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#fff3",
    borderRadius: 24,
    marginBottom: 12
  },
  input: {
    fontSize: 15,
    color: "#fff",
    flex: 1,
    paddingLeft: 12
  },
  button: {
    paddingVertical: 15,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 24
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    letterSpacing: 1,
    flex: 1,
    textAlign: "center"
  },
  rightIcon: {
    position: "absolute",
    right: 25
  },
  loginButton: {
    backgroundColor: ThemeStyle.mainColor
  },
  facebookButton: {
    backgroundColor: "#465EA9",
    marginBottom: 20
  },
  googleButton: {
    backgroundColor: "#CD5542"
  },
  forgotPassword: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10
  },
  orText: {
    color: "#000",
    textAlign: "center",
    marginVertical: 10
  },
  bottomText: {
    color: "#000",
    textAlign: "center",
    fontSize: 13,
    marginTop: 16,
    marginBottom: 10
  },
  termsPrivacyText: {
    color: "blue",
    textAlign: "center",
    fontSize: 13
  },
  confirmText: {
    fontSize: 18,
    textAlign: "center",
    color: "#fff",
    marginVertical: 16,
    fontFamily: TextStyles.GeneralText.fontFamily
  },
  error: {
    color: "red",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 10
  },
  policyWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginHorizontal: 20,
    borderRadius: 8
  },
  policyContainer: {
    backgroundColor: "#fff",
    borderRadius: 8
  },
  policyHeader: {
    backgroundColor: ThemeStyle.accentColor,
    paddingVertical: 12,
    paddingHorizontal: 16,
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  policy: {
    fontFamily: TextStyles.GeneralText.fontFamily,
    fontSize: 16
  },
  policyTitle: {
    textAlign: "center",
    color: "white",
    fontSize: 18,
    fontFamily: TextStyles.SubHeaderBold.fontFamily
  },
  policyRow: {
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
    paddingHorizontal: 16,
    paddingVertical: 12
  }
});
