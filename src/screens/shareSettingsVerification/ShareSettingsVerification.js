import React, { Component, Fragment } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput
} from "react-native";
import styles from "./styles";
import Header from "../../components/Header";
import { NavigationActions } from "react-navigation";
import DeviceUiInfo from "../../utils/DeviceUIInfo";
import Amplify, { API, graphqlOperation, Auth } from "aws-amplify";
import sha from "sha.js";
import { addShareMutation } from "../../queries/addShareSetting";
import { showMessage } from "react-native-flash-message";
import { errorMessage } from "../../utils";
import { getAmplifyConfig, getEnvVars } from "../../constants";
import { withStore } from "../../utils/StoreUtils";
import ThemeStyle from "../../styles/ThemeStyle";
import bugsnagClient from "../../utils/Bugsnag";

const { screenSize } = DeviceUiInfo;

class ShareSettingsVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headerHeight: 0,
      invitationCode: "",
      therapistId: "",
      errorText: null
    };
  }

  clearErrorText = () =>
    this.state.errorText && this.setState({ errorText: null });

  verifyInvitation = (invitationCode, therapistId) => {
    Amplify.configure(
      getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
    );
    const verifyInvitationMutation = `mutation verifyInvitation($code: String!, $therapistId: String!, $appId: String!){
                verifyInvitation(code: $code, therapistId: $therapistId, appId: $appId){
                    success
                    message
                    therapistName
                }
            }`;

    const verifyInvitationData = {
      code: invitationCode,
      therapistId: new sha.sha256().update(therapistId).digest("hex"),
      appId: getEnvVars().appId
    };
    console.log("---VERIFYING CODE---", verifyInvitationData);
    this.props.setLoading(true);
    API.graphql(
      graphqlOperation(verifyInvitationMutation, verifyInvitationData)
    )
      .then(response => {
        console.log("--ADDING SHARE---", response);
        const result = response.data.verifyInvitation;
        if (result.success) {
          this.addDefaultShareSettings(result, invitationCode, therapistId);
        } else {
          this.props.setLoading(false);
          this.setState({ errorText: result.message });
        }
      })
      .catch(err => {
        this.props.setLoading(false);
        console.log(err);
        let message =
          err.errors && err.errors.length > 0 && err.errors[0].message
            ? err.errors[0].message
            : "Something went wrong, please try again later.";
        showMessage(errorMessage(message));
      });
  };

  addDefaultShareSettings = (result, invitationCode, therapistId) => {
    const navigate = this.props.navigation.navigate;
    Amplify.configure(
      getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
    );
    Auth.currentUserInfo()
      .then(user => {
        const addShareData = {
          shareSetting: {
            meta: {
              diaryCard: false,
              meditation: false,
              emotion: true,
              journal: true,
              exercise: true,
              sleep: false,
              practiceidea: false,
              actMeasure: false
            },
            therapistId: new sha.sha256().update(therapistId).digest("hex"),
            therapistName: result.therapistName,
            userFullName: user.attributes.name,
            appId: getEnvVars().appId,
            identityId: user.id
          }
        };
        if (user.attributes.picture) {
          addShareData.shareSetting.profileUrl = user.attributes.picture;
        }

        API.graphql(graphqlOperation(addShareMutation, addShareData))
          .then(response => {
            console.log("--ADDING DEFAULT SETTINGS---", response);
            const res = response.data.addShareSetting;
            if (res.id) {
              this.props.setLoading(false);
              navigate("ShareSettingsPreferences", {
                invitationCode: invitationCode,
                therapistId: therapistId,
                therapistName: result.therapistName,
                id: res.id
              });
            } else {
              this.setState({ errorText: "Add Share Setting Error." });
            }
          })
          .catch(e => showMessage(errorMessage(e.message)))
          .finally(() => {
            this.props.setLoading(false);
          });
      })
      .catch(e => {
        console.log(e);
        bugsnagClient.leaveBreadcrumb("Add Default Share Setting Failed ");
        bugsnagClient.notify(e);
        showMessage(errorMessage(e.message));
      });
  };
  goBack = () => this.props.navigation.dispatch(NavigationActions.back());

  componentDidMount() {
    this.setState({ errorText: null });
  }

  render() {
    const navigate = this.props.navigation.navigate;
    const { errorText, invitationCode, therapistId } = this.state;
    return (
      <Fragment>
        <View
          onLayout={e => {
            this.setState({ headerHeight: e.nativeEvent.layout.height });
          }}
        >
          <Header
            title={"Sharing Settings"}
            goBack={() => {
              this.props.navigation.goBack(null);
            }}
          />
        </View>
        <ScrollView
          style={[ThemeStyle.pageContainer, styles.container]}
          contentContainerStyle={{
            height: screenSize.height - this.state.headerHeight - 40
          }}
          scrollEnabled={false}
        >
          <View>
            <Text style={{ fontSize: 18, textAlign: "justify", opacity: 0.8 }}>
              Please enter the invitation code and email address of the provider
              that you received in your invitation email.
            </Text>
          </View>
          <View style={{ marginVertical: 10 }}>
            <View style={styles.errorTextContainer}>
              {errorText && (
                <Text style={styles.errorText}>{`*${errorText}`}</Text>
              )}
            </View>
            <View style={styles.singleInput}>
              <TextInput
                onChangeText={code => this.setState({ invitationCode: code })}
                autoFocus={true}
                autoCapitalize="characters"
                underlineColorAndroid="transparent"
                placeholder="Enter invitation code"
                placeholderTextColor="#aaa"
                value={invitationCode}
                style={styles.input}
                onFocus={this.clearErrorText}
              />
            </View>
            <View style={styles.singleInput}>
              <TextInput
                onChangeText={name => {
                  name = name.toLowerCase().trim();
                  this.setState({ therapistId: name });
                }}
                autoCorrect={false}
                underlineColorAndroid="transparent"
                placeholder="Enter Provider's email"
                placeholderTextColor="#aaa"
                autoCapitalize="none"
                value={therapistId}
                style={styles.input}
                onFocus={this.clearErrorText}
              />
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.verifyInvitation(invitationCode, therapistId)}
            >
              <Text style={styles.buttonText}>SUBMIT</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Fragment>
    );
  }
}

export default withStore(ShareSettingsVerification);
