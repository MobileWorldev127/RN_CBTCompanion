import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  Image
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import Amplify, { API, graphqlOperation, Auth } from "aws-amplify";
import * as Animatable from "react-native-animatable";
import ThemeStyle from "../styles/ThemeStyle";
import TextStyles from "../common/TextStyles";
import validator from "validator";
import sha from "sha.js";
import { showMessage } from "react-native-flash-message";
import { errorMessage } from "../utils";
import { withSafeAreaActions } from "./../utils/StoreUtils";
import { NavigationActions, StackActions } from "react-navigation";
import {
  getAmplifyConfig,
  getEnvVars,
  APP,
  asyncStorageConstants
} from "../constants";
import { recordScreenEvent, screenNames } from "../utils/AnalyticsUtils";
import { initializePremiumContent } from "../actions/IAPActions";

const federated_data = {
  google_client_id_android:
    "740167288482-etojmlpgesaodgscismec0se6gri7lr2.apps.googleusercontent.com",
  google_client_id_ios:
    "740167288482-mo5tk4p9e1u2b4amqrqb4a3k2f991rcs.apps.googleusercontent.com",
  facebook_app_id: "991837820941188"
};

const loginWithFacebook = async appId => {
  // const { type, token, expires} = await Facebook.logInWithReadPermissionsAsync(appId, {
  //     permissions: ['public_profile', 'email'],
  //   });
  // let data;
  // if (type === 'success') {
  //   const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&&fields=name,email`);
  //   data = await response.json();
  // } else {
  //   data = []
  // }
  // const date = new Date();
  // const expires_at = expires * 1000 + date.getTime();
  // return {
  //   token, data, expires_at
  // }
};

const loginWithGoogle = async (iosId, androidId) => {
  try {
    // const result = await Expo.Google.logInAsync({
    //   androidClientId: androidId,
    //   iosClientId: iosId,
    //   scopes: ['profile', 'email'],
    // });
    // if (result.type === 'success') {
    //   let userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
    //     headers: { Authorization: `Bearer ${result.accessToken}`},
    //   });
    //   const date = new Date();
    //   let expires = 391205885;
    //   const expires_at =  expires + date.getTime();
    //   const user = await userInfoResponse.json();
    //   return  returningObj =  {
    //     user: user,
    //     token: result.idToken,
    //     expires_at: expires_at
    //   }
    // } else {
    //   return {cancelled: true};
    // }
  } catch (e) {
    return { error: true };
  }
};

class LoginScreen extends Component {
  constructor() {
    super();
    this._validAuthStates = ["signIn", "signedOut", "signedUp"];
    this.state = {
      error: null
    };
  }

  toggleForm = () => {
    this.setState(state => ({
      showLoginForm: !state.showLoginForm,
      formHeight: 160
    }));
    this.loginForm.transitionTo({ height: 160 }, 500, "ease-out-quint");
  };

  componentDidMount = () => {
    console.log("login screen", Auth.configure());
    recordScreenEvent(screenNames.login);
    this.props.setTopSafeAreaView(ThemeStyle.gradientStart);
    this.props.setBottomSafeAreaView(ThemeStyle.gradientEnd);
  };

  signIn = () => {
    Keyboard.dismiss();
    const { username, password } = this;
    if (!(username && username !== "" && validator.isEmail(username))) {
      showMessage(errorMessage("Invalid Username"));
    } else if (!(password && password !== "")) {
      showMessage(errorMessage("Invalid or Empty password field"));
    } else {
      // showLoader();
      this.props.setLoading(true);
      let usernameSHA = new sha.sha256().update(this.username).digest("hex");
      Auth.signIn(usernameSHA, password)
        .then(res => {
          AsyncStorage.setItem("username", usernameSHA);
          Auth.currentUserInfo().then(userInfo => {
            AsyncStorage.setItem(
              asyncStorageConstants.userInfo,
              JSON.stringify(userInfo)
            );
          });
          if (res.challengeName === "SOFTWARE_TOKEN_MFA") {
            this.setState({ userInfo: res, mfaModal: true });
          } else {
            this.setState({ userInfo: res, mfaModal: false });
            if (
              !res.signInUserSession.idToken.payload["cognito:groups"] ||
              !res.signInUserSession.idToken.payload["cognito:groups"].includes(
                APP.usersGroupName
              )
            ) {
              this.setUserGroup()
                .then(() => Auth.signIn(usernameSHA, password))
                .then(res => {
                  this.props.initializePremiumContent();
                  AsyncStorage.setItem(
                    "token",
                    res.signInUserSession.idToken.jwtToken
                  );
                  this.props.setLoading(false);
                  const resetAction = StackActions.reset({
                    index: 0,
                    actions: [
                      NavigationActions.navigate({ routeName: "DrawerRoutes" })
                    ]
                  });
                  this.props.navigation.dispatch(resetAction);
                  // this.props.navigation.navigate("DrawerRoutes");
                  this.props.setTopSafeAreaView(ThemeStyle.backgroundColor);
                  this.props.setBottomSafeAreaView("#fff");
                })
                .catch(err => {
                  this.props.setLoading(false);
                  console.log("Error", err);
                  showMessage(
                    errorMessage("Failed to sign-in. Please try again")
                  );
                });
            } else {
              AsyncStorage.setItem(
                "token",
                res.signInUserSession.idToken.jwtToken
              );
              this.props.setLoading(false);
              console.log("loged in");
              this.props.initializePremiumContent();
              const resetAction = StackActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({ routeName: "DrawerRoutes" })
                ]
              });
              this.props.navigation.dispatch(resetAction);
              this.props.setTopSafeAreaView(ThemeStyle.backgroundColor);
              this.props.setBottomSafeAreaView("#fff");
            }
          }
        })
        .catch(err => {
          console.log("Error: ", err);
          this.props.setLoading(false);
          if (err.code === "UserNotConfirmedException") {
            this.props.navigation.navigate("SignUpScreen", {
              showConfirmation: true,
              email: username,
              password: password
            });
          } else {
            showMessage(errorMessage(err.message));
          }
          // this.error(err)
        });
    }
    // this.props.navigation.navigate("DrawerRoutes");
  };

  setUserGroup = () => {
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
  };

  socialLoginAlert = platform => () => {
    alert(
      `Login with ${platform} will be available soon. In the mean time login via email.`
    );
  };

  socialLogin = type => async () => {
    if (type === "google") {
      // const info = await loginWithGoogle(
      //   federated_data.google_client_id_ios,
      //   federated_data.google_client_id_android
      // );
      // console.log("Google info: ", info);
      // if (!info.token) return;
      // const user = {
      //   name: info.user.name,
      //   email: info.user.email
      // };
      // const credentials = await Auth.federatedSignIn(
      //   "google",
      //   { token: info.token, expires_at: info.expires_at },
      //   user
      // );
      // console.log("Google Credentials: ", credentials);
      // if (credentials.authenticated) {
      //   let obj = {
      //     identityId: credentials._identityId,
      //     accessToken: info.token
      //   };
      //   this.changeState("signedIn", user);
      // } else {
      //   console.log("Authentication Failed ");
      // }
      // Auth.federatedSignIn('google', { token: info.token, expires_at: info.expires_at }, user).then(response => {
      //   console.log("Federated Response: ", response);
      // }).then(res => console.log("Second Response", res))
      // .catch(err => {
      //   console.log("Error: ", err.message);
      // })
      // } else {
      //   const info = await loginWithFacebook(federated_data.facebook_app_id);
      //   // If Login Failed
      //   if (!info.token) return;
      //   const userObj = info.data;
      // const credentials = await Auth.federatedSignIn(
      //   "facebook",
      //   { token: info.token, expires_at: info.expires_at },
      //   userObj
      // );
      // console.log("Facebook Credentials: ", credentials);
      // if (credentials.authenticated) {
      //   let obj = {
      //     identityId: credentials._identityId,
      //     accessToken: info.token
      //   };
      //   this.changeState("signedIn", info.data);
      // } else {
      //   console.log("Authentication failed with AWS");
      // }
    }
  };

  getLoginForm = () => (
    <Animatable.View ref={ref => (this.loginForm = ref)}>
      <View style={styles.singleInput}>
        <Icon name="md-at" size={24} color="#fff" style={styles.icon} />
        <TextInput
          style={[TextStyles.SubHeaderBold, styles.input]}
          onChangeText={username => (this.username = username.trim())}
          defaultValue={this.username}
          placeholder="Enter Email"
          placeholderTextColor="#eee"
          autoCapitalize="none"
          keyboardType="email-address"
          underlineColorAndroid="transparent"
        />
      </View>

      <View style={styles.singleInput}>
        <Image
          source={require("../src/ios_lock.png")}
          style={{
            width: 24,
            height: 24,
            tintColor: 'white'
          }}
          resizeMode="contain"
        />
        {/* <Icon name="ios-lock-closed-outline" size={24} color={"#fff"} style={styles.icon} /> */}
        <TextInput
          style={[TextStyles.SubHeaderBold, styles.input]}
          onChangeText={password => (this.password = password.trim())}
          defaultValue={this.password}
          placeholder="Enter Password"
          placeholderTextColor="#eee"
          secureTextEntry={true}
          autoCapitalize="none"
          underlineColorAndroid="transparent"
        />
      </View>
    </Animatable.View>
  );

  render() {
    // if (!this._validAuthStates.includes(this.props.authState)) return null;
    return (
      <LinearGradient
        style={styles.container}
        colors={ThemeStyle.gradientColor}
      >
        <KeyboardAvoidingView style={styles.content} behavior="padding">
          <Text style={[TextStyles.HeaderBold, styles.title]}>LOGIN</Text>

          <View>
            {/* <Transition appear="scale"> */}
            <View>
              {this.getLoginForm()}
              <TouchableOpacity
                style={[styles.button, styles.loginButton]}
                onPress={this.signIn}
              >
                <Text style={[TextStyles.GeneralText, styles.buttonText]}>
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("ForgotPasswordScreen");
                }}
              >
                <Text style={[TextStyles.GeneralText, styles.forgotPassword]}>
                  Forgot your password? Click Here
                </Text>
              </TouchableOpacity>
            </View>
            {/* </Transition> */}

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
              </Transition> */}
          </View>
          <View
            style={{
              flexDirection: "row",
              borderRadius: 24,
              borderColor: "#fff3",
              borderWidth: 1,
              alignSelf: "flex-end"
            }}
          >
            <Text
              style={[
                TextStyles.SubHeaderBold,
                {
                  flex: 2,
                  paddingVertical: 12,
                  color: "#fff",
                  paddingHorizontal: 24,
                  fontSize: 15,
                  textAlign: "center"
                }
              ]}
            >
              Not a member?
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
                this.props.navigation.navigate("SignUpScreen");
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
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  initializePremiumContent: () => dispatch(initializePremiumContent())
});

export default withSafeAreaActions(LoginScreen, () => {}, mapDispatchToProps);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    paddingVertical: 48,
    paddingHorizontal: 24,
    justifyContent: "space-between"
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
    alignSelf: "stretch",
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
    marginTop: 10,
    marginBottom: 20
  },
  orText: {
    textAlign: "center",
    marginVertical: 20
  },
  error: {
    color: "red",
    fontSize: 13,
    textAlign: "center",
    marginTop: 1,
    marginBottom: 12,
    fontFamily: TextStyles.GeneralText.fontFamily
  }
});
