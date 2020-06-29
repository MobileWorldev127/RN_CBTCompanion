import React, { Component, Fragment } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import styles from "./styles";
import Header from "../../components/Header";
import DeviceUiInfo from "../../utils/DeviceUIInfo";
import CheckBox from "react-native-check-box";
import Amplify, { API, graphqlOperation, Auth } from "aws-amplify";
import { getAmplifyConfig, getEnvVars } from "../../constants";
import { editShareMutation } from "../../queries/editShareSetting";
import { shouldRefreshShareSettings } from "../shareSettingsList/ShareSettingsListComponent";
import ThemeStyle from "../../styles/ThemeStyle";
import { showMessage } from "react-native-flash-message";
import { errorMessage } from "../../utils";
import Card from "../../components/Card";
import Button from "../../components/Button";
import TextStyles from "../../common/TextStyles";
import { NavigationActions } from "react-navigation";
const { screenSize } = DeviceUiInfo;

class ShareSettingsPreferences extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headerHeight: 0,
      mode: "ADD",
      id: "",
      invitationCode: "",
      therapistId: "",
      therapistName: "",
      shareWithOrg: false,
      meta: {
        diaryCard: false,
        meditation: false,
        emotion: false,
        sleep: false,
        journal: false,
        exercise: false,
        practiceidea: false,
        actMeasure: false
      },
      errorText: null
    };
  }

  clearErrorText = () =>
    this.state.errorText && this.setState({ errorText: null });

  saveData = () => {
    const navigate = this.props.navigation.navigate;
    const { therapistId, therapistName, meta, mode, id, shareWithOrg } = this.state;
    let isItemChecked =
      meta.diaryCard ||
      meta.meditation ||
      meta.emotion ||
      meta.journal ||
      meta.sleep ||
      meta.exercise ||
      meta.practiceidea ||
      meta.actMeasure;
    if (!isItemChecked) {
      showMessage(errorMessage("Select at least one item to share"));
      return;
    }
    shouldRefreshShareSettings(true);
    this.props.setLoading(true);
    Amplify.configure(
      getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
    );
    const shareData = {
      id: id,
      meta: meta,
      shareWithOrg: shareWithOrg
    };
    console.log("SETTING SHARE PREFERENCES", shareData);
    API.graphql(graphqlOperation(editShareMutation, shareData))
      .then(response => {
        const result = response.data.editShareSetting;
        if (result.id) {
          // this.props.getShareSettings();
          // this.props.navigation.pop(2);
          if (mode === `ADD`) {
            this.props.navigation.pop(2);
          } else {
            this.props.navigation.dispatch(NavigationActions.back());
          }
        } else {
          this.setState({ errorText: "Edit Share Setting Error." });
        }
      })
      .catch(e => showMessage(errorMessage(e.message)))
      .finally(() => {
        this.props.setLoading(false);
      });
  };

  goBack = () => {
    this.props.getShareSettings();
    this.props.navigation.pop(2);
    // this.props.navigation.dispatch(NavigationActions.back())
  };

  componentDidMount() {
    this.setState({ errorText: null });

    const { navigation } = this.props;
    const mode = navigation.getParam("mode", "ADD");
    const therapistId = navigation.getParam("therapistId", "");
    const therapistName = navigation.getParam("therapistName", "");
    const shareWithOrg = navigation.getParam("shareWithOrg", false);

    if (mode === "EDIT") {
      const meta = navigation.getParam("meta", []);
      const id = navigation.getParam("id", "");
      this.setState({ meta, therapistId, therapistName, mode, id, shareWithOrg });
    } else {
      const invitationCode = navigation.getParam("invitationCode", "");
      const id = navigation.getParam("id", "");
      this.setState({ invitationCode, therapistId, therapistName, mode, id, shareWithOrg });
    }
  }

  render() {
    const navigate = this.props.navigation.navigate;
    const { navigation } = this.props;
    const { errorText, therapistName, meta, mode, shareWithOrg } = this.state;
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
          style={[
            styles.container,
            { backgroundColor: ThemeStyle.backgroundColor }
          ]}
        >
          <Card style={{ margin: 20 }}>
            <View style={{ padding: 16, width: "100%" }}>
              <Text style={styles.therapistIdHeading}>Provider Name:</Text>
              <Text style={styles.therapistIdText}>{therapistName}</Text>
            </View>
            <View style={styles.prefContainer}>
              {/* <View style={styles.prefHeaderContainer}>
                <Text style={styles.prefHeader}>
                  Diary Card Items to share:
                </Text>
              </View> */}
              <View style={styles.checkboxContainer}>
                <CheckBox
                  style={{ width: screenSize.width / 3, marginTop: 5 }}
                  onClick={() => {
                    this.setState({
                      meta: {
                        ...this.state.meta,
                        diaryCard: !this.state.meta.diaryCard
                      }
                    });
                  }}
                  value={this.state.meta.diaryCard}
                  isChecked={meta.diaryCard}
                  rightText="Diary Card"
                  rightTextStyle={styles.checkboxText}
                  checkBoxColor={meta.diaryCard? "#f7992a" : "#C9CFDF"}
                />
                <CheckBox
                  style={{ width: screenSize.width / 3, marginTop: 5 }}
                  onClick={() => {
                    this.setState({
                      meta: {
                        ...this.state.meta,
                        meditation: !this.state.meta.meditation
                      }
                    });
                  }}
                  value={this.state.meta.meditation}
                  isChecked={meta.meditation}
                  rightText="Meditation"
                  rightTextStyle={styles.checkboxText}
                  checkBoxColor={meta.meditation? "#f7992a" : "#C9CFDF"}
                />
                <CheckBox
                  style={{ width: screenSize.width / 3, marginTop: 5 }}
                  onClick={() => {
                    this.setState({
                      meta: {
                        ...this.state.meta,
                        exercise: !this.state.meta.exercise
                      }
                    });
                  }}
                  value={this.state.meta.exercise}
                  isChecked={meta.exercise}
                  rightText="Exercise"
                  rightTextStyle={styles.checkboxText}
                  checkBoxColor={meta.exercise? "#f7992a" : "#C9CFDF"}
                />
                <CheckBox
                  style={{ width: screenSize.width / 3, marginTop: 5 }}
                  onClick={() => {
                    this.setState({
                      meta: {
                        ...this.state.meta,
                        journal: !this.state.meta.journal
                      }
                    });
                  }}
                  value={this.state.meta.journal}
                  isChecked={meta.journal}
                  rightText="Journal"
                  rightTextStyle={styles.checkboxText}
                  checkBoxColor={meta.journal? "#f7992a" : "#C9CFDF"}
                />
                <CheckBox
                  style={{ width: screenSize.width / 3, marginTop: 5 }}
                  onClick={() => {
                    this.setState({
                      meta: {
                        ...this.state.meta,
                        practiceidea: !this.state.meta.practiceidea
                      }
                    });
                  }}
                  value={this.state.meta.practiceidea}
                  isChecked={meta.practiceidea}
                  rightText="Practice Idea"
                  rightTextStyle={styles.checkboxText}
                  checkBoxColor={meta.practiceidea? "#f7992a" : "#C9CFDF"}
                />
                <CheckBox
                  style={{ width: screenSize.width / 3, marginTop: 5 }}
                  onClick={() => {
                    this.setState({
                      meta: {
                        ...this.state.meta,
                        emotion: !this.state.meta.emotion
                      }
                    });
                  }}
                  value={this.state.meta.emotion}
                  isChecked={meta.emotion}
                  rightText="Emotion"
                  rightTextStyle={styles.checkboxText}
                  checkBoxColor={meta.emotion? "#f7992a" : "#C9CFDF"}
                />
              </View>
              <View style={[styles.checkboxContainer, {marginTop: 16}]}>
                <CheckBox
                  style={{ width: screenSize.width / 3, marginTop: 5 }}
                  onClick={() => {
                    this.setState({
                      meta: {
                        ...this.state.meta,
                        activity: !this.state.meta.activity
                      }
                    });
                  }}
                  value={this.state.meta.activity}
                  isChecked={meta.activity}
                  rightText="Activity"
                  rightTextStyle={styles.checkboxText}
                  checkBoxColor={meta.activity? "#f7992a" : "#C9CFDF"}
                />
                <CheckBox
                  style={{ width: screenSize.width / 3, marginTop: 5 }}
                  onClick={() => {
                    this.setState({
                      meta: {
                        ...this.state.meta,
                        sleep: !this.state.meta.sleep
                      }
                    });
                  }}
                  value={this.state.meta.sleep}
                  isChecked={meta.sleep}
                  rightText="Sleep"
                  rightTextStyle={styles.checkboxText}
                  checkBoxColor={meta.sleep? "#f7992a" : "#C9CFDF"}
                />
                <CheckBox
                  style={{ width: screenSize.width / 3, marginTop: 5 }}
                  onClick={() => {
                    this.setState({
                      meta: {
                        ...this.state.meta,
                        nutrition: !this.state.meta.nutrition
                      }
                    });
                  }}
                  value={this.state.meta.nutrition}
                  isChecked={meta.nutrition}
                  rightText="Nutrition"
                  rightTextStyle={styles.checkboxText}
                  checkBoxColor={meta.nutrition? "#f7992a" : "#C9CFDF"}
                />
                <CheckBox
                  style={{ width: screenSize.width / 3, marginTop: 5 }}
                  onClick={() => {
                    this.setState({
                      meta: {
                        ...this.state.meta,
                        heartRate: !this.state.meta.heartRate
                      }
                    });
                  }}
                  value={this.state.meta.heartRate}
                  isChecked={meta.heartRate}
                  rightText="Heart Rate"
                  rightTextStyle={styles.checkboxText}
                  checkBoxColor={meta.heartRate? "#f7992a" : "#C9CFDF"}
                />
              </View>
              <View
                style={{
                  borderRadius: 32,
                  borderWidth: 1,
                  marginTop: 12,
                  borderColor: ThemeStyle.disabledLight,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 6,
                  paddingHorizontal: 16
                }}
              >
                <CheckBox
                  style={{ width: screenSize.width / 1.5 }}
                  onClick={() => {
                    this.setState({
                        shareWithOrg: !this.state.shareWithOrg
                    });
                  }}
                  value={this.state.shareWithOrg}
                  isChecked={shareWithOrg}
                  rightText="Share with all clinicians who are part of this clinician's organization"
                  rightTextStyle={[styles.checkboxText, TextStyles.ContentText]}
                  checkBoxColor={shareWithOrg? "#f7992a" : "#C9CFDF"}
                />
              </View>
              <View style={styles.errorTextContainer}>
                {errorText && (
                  <Text style={styles.errorText}>{`*${errorText}`}</Text>
                )}
              </View>
            </View>
          </Card>
          <Button
            name="Save"
            style={{ marginHorizontal: 20 }}
            onPress={this.saveData}
          />
        </ScrollView>
      </Fragment>
    );
  }
}

export default ShareSettingsPreferences;
