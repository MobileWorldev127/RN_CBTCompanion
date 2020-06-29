import React, { Component, Fragment } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Linking,
  Platform
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import styles from "./styles";
import Header from "../../components/Header";
import Icon from "../../common/icons";
import { NavigationActions } from "react-navigation";
import CheckBox from "react-native-check-box";
import Amplify, { API, graphqlOperation, Auth } from "aws-amplify";
import ThemeStyle from "../../styles/ThemeStyle";
import { showMessage } from "react-native-flash-message";
import { getAmplifyConfig, getEnvVars, APP } from "../../constants";
import YouTube from "react-native-youtube";
import LinearGradient from "react-native-linear-gradient";
import Button from "./../../components/Button";
import TextStyles from "../../common/TextStyles";
import { errorMessage } from "../../utils";
import DeviceUiInfo from "../../utils/DeviceUIInfo";
import CachedImage from "react-native-image-cache-wrapper";
import qs from "qs";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";
const { screenSize } = DeviceUiInfo;
var shouldRefresh = false;

export function shouldRefreshShareSettings(refresh) {
  shouldRefresh = refresh;
}
class ShareSettingsListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  deleteProvider = id => {
    Alert.alert(
      "Are you sure?",
      "You want to stop sharing data with this provider?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Confirm",
          onPress: () => {
            showMessage({
              type: "info",
              message: "Processing..."
            });

            Amplify.configure(
              getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
            );
            const deleteShareSettingMutation = `mutation deleteShareSetting($id: String!){
                    deleteShareSetting(id: $id) {
                      id
                    }
                  }`;

            const deleteShareSettingData = {
              id: id
            };
            this.props.setLoading(true);
            API.graphql(
              graphqlOperation(
                deleteShareSettingMutation,
                deleteShareSettingData
              )
            )
              .then(response => {
                showMessage({
                  type: "success",
                  message: "Success",
                  description: "Stop sharing successfully!"
                });
                this.props.getShareSettings();
              })
              .catch(err => {
                showMessage({
                  type: "danger",
                  message: err.message
                });
              })
              .finally(() => {
                this.props.setLoading(false);
              });
          }
        }
      ],
      { cancelable: false }
    );
  };

  goBack = () => this.props.navigation.dispatch(NavigationActions.back());
  premiumNavigation = route => {
    if (this.props.premium) {
      this.props.navigation.navigate(route);
    } else {
      this.props.openSubscription();
    }
  };

  componentDidMount() {
    recordScreenEvent(screenNames.shareSettings);
    const { getShareSettings } = this.props;
    this.listener = this.props.navigation.addListener("didFocus", payload => {
      console.log("Focused peer groups", shouldRefresh);
      if (shouldRefresh) {
        getShareSettings();
        shouldRefresh = false;
      }
    });
    getShareSettings();
  }

  render() {
    const navigate = this.props.navigation.navigate;
    const { providerList } = this.props;
    console.log('=======>', providerList)
    return (
      <Fragment>
        <Header
          title={"Sharing Settings"}
          goBack={() => {
            this.props.navigation.goBack(null);
          }}
        />
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingVertical: 16 }}
        >
          {providerList &&
            !!providerList.length &&
            providerList.map((provider, index) => (
              <ListItem
                key={index}
                provider={provider}
                navigate={navigate}
                deleteProvider={this.deleteProvider}
              />
            ))}
          {this.renderVideoContent()}
        </ScrollView>
        <View
          style={{
            padding: 16,
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderColor: ThemeStyle.pageContainer.backgroundColor
          }}
        >
          <Text
            style={[
              TextStyles.Header2,
              {
                textAlign: "center",
                marginBottom: 16
              }
            ]}
          >
            Got an invitation code from your therapist?
          </Text>
          <Button
            name="Enter Invitation Code"
            onPress={() =>
              this.props.isSubscribed
                ? this.props.navigation.navigate("ShareSettingsVerification")
                : this.props.showSubscription()
            }
          />
        </View>
      </Fragment>
    );
  }

  renderVideoContent = () => {
    return (
      <Fragment>
        <LinearGradient
          colors={ThemeStyle.gradientColor}
          style={{ overflow: "hidden", margin: 12, borderRadius: 4 }}
        >
          <View>
            <YouTube
              apiKey={APP.youtubeAPIKey}
              controls={1}
              onReady={e => console.log("OnReady", e)}
              onChangeState={e => console.log(e)}
              videoId={"O99CHCfcGN4"} // The YouTube video ID
              // play={true} // control playback of video with true/false
              play={false} // control playback of video with true/false
              fullscreen={true} // control whether the video should play in fullscreen or inline
              loop={false} // control whether the video should loop when ended
              onError={e => showMessage(errorMessage())}
              style={{
                height: 240,
                marginBottom: 12,
                backgroundColor: "#fff"
              }}
              showFullscreenButton={true}
            />
            <Text
              style={[
                TextStyles.SubHeaderBold,
                { color: "#fff", paddingHorizontal: 16 }
              ]}
            >
              {`Invite your therapist to clinician app`}
            </Text>
            <Text
              style={[
                TextStyles.GeneralText,
                { color: "#fff", paddingTop: 8, paddingHorizontal: 16 }
              ]}
            >
              {`Using the clinician app, your therapist can view your diary card entries, exercises etc. based on what you decide to share with them. Further, can assign homework, assessments etc. and you can submit them right from the app.`}
            </Text>
            <Button
              style={{
                backgroundColor: ThemeStyle.mainColor,
                marginTop: 16,
                borderRadius: 4
              }}
              name="Share Now!"
              onPress={() => {
                let formattedBody =
                  "Hello, \n\nWelcome to our clinician app. Using the app you can engage with your CBT Client more effectively. You can see their diary card entries, assign home work, practice ideas, meditations, assessments etc. \n\nFor more info click here. https://provider.swasth.co \n\nRegards,\nSwasth Clinician App Team";
                let url = `mailto:?subject=${encodeURIComponent(
                  "Invitation to try the Clinician app for CBT Companion"
                )}&body=${encodeURIComponent(formattedBody)}`;
                console.log("URL", url);
                Linking.canOpenURL(url)
                  .then(res => {
                    if (res) {
                      Linking.openURL(url);
                    } else {
                      showMessage(errorMessage("Failed to send mail"));
                    }
                  })
                  .catch(err => console.log(err));
              }}
            />
          </View>
        </LinearGradient>
      </Fragment>
    );
  };
}

const ListItem = props => {
  const { navigate, provider, deleteProvider } = props;
  const metaData = provider.meta;
  return (
    <TouchableOpacity
      style={[styles.list, props.style]}
      disabled={true}
      onPress={props.onPress}
      activeOpacity={props.onPress ? 0.3 : 1}
      key={provider.id}
    >
      <View style={{ flexDirection: "column", marginVertical: 5, flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 5,
            alignItems: "center"
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{`${provider.therapistName}`}</Text>
          </View>

          <TouchableOpacity
            style={{
              paddingHorizontal: 10,
              marginHorizontal: 5
            }}
            onPress={() => {
              navigate("ShareSettingsPreferences", {
                mode: "EDIT",
                therapistId: provider.therapistId,
                therapistName: provider.therapistName,
                id: provider.id,
                meta: metaData,
                shareWithOrg: provider.shareWithOrg
              });
            }}
          >
            <Icon
              family={"MaterialCommunityIcons"}
              name={"pencil-circle"}
              color="blue"
              size={35}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingHorizontal: 10,
              marginHorizontal: 5
            }}
            onPress={() => {
              deleteProvider(provider.id);
            }}
          >
            <CachedImage
              source={
                require("../../assets/images/redesign/delete.png")
              }
              resizeMode="contain"
              style={{width: 32, height: 32}}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 8,
            flex: 1,
            flexWrap: "wrap",
            borderWidth: 1,
            borderColor: 'darkgray',
            padding: 15,
            paddingBottom: 20,
            borderRadius: 10,
          }}
        >
          <CheckBox
            style={{ width: screenSize.width / 3, marginTop: 5 }}
            onClick={() => {}}
            isChecked={metaData.diaryCard}
            rightText="Diary Card"
            rightTextStyle={styles.checkboxText}
            checkBoxColor={metaData.diaryCard? "#f7992a" : "#C9CFDF"}
            leftTextStyle={{width: 40, height:10}}
            disabled={true}
          />
          <CheckBox
            style={{ width: screenSize.width / 3, marginTop: 5 }}
            onClick={() => {}}
            isChecked={metaData.meditation}
            rightText="Meditation"
            rightTextStyle={styles.checkboxText}
            checkBoxColor={metaData.meditation? "#f7992a" : "#C9CFDF"}
            disabled={true}
          />
          <CheckBox
            style={{ width: screenSize.width / 3, marginTop: 5 }}
            onClick={() => {}}
            isChecked={metaData.exercise}
            rightText="Exercise"
            rightTextStyle={styles.checkboxText}
            checkBoxColor={metaData.exercise? "#f7992a" : "#C9CFDF"}
            disabled={true}
          />
          <CheckBox
            style={{ width: screenSize.width / 3, marginTop: 5 }}
            onClick={() => {}}
            isChecked={metaData.journal}
            rightText="Journal"
            rightTextStyle={styles.checkboxText}
            checkBoxColor={metaData.journal? "#f7992a" : "#C9CFDF"}
            disabled={true}
          />
          <CheckBox
            style={{ width: screenSize.width / 3, marginTop: 5 }}
            onClick={() => {}}
            isChecked={metaData.practiceidea}
            rightText="Practice Idea"
            rightTextStyle={styles.checkboxText}
            checkBoxColor={metaData.practiceidea? "#f7992a" : "#C9CFDF"}
            disabled={true}
          />
          <CheckBox
            style={{ width: screenSize.width / 3, marginTop: 5 }}
            onClick={() => {}}
            isChecked={metaData.emotion}
            rightText="Emotion"
            rightTextStyle={styles.checkboxText}
            checkBoxColor={metaData.emotion? "#f7992a" : "#C9CFDF"}
            disabled={true}
          />
        </View>

        <View 
          style={{
            marginTop: 15,
            flex: 1,
            borderWidth: 1,
            borderColor: 'darkgray',
            padding: 15,
            paddingBottom: 20,
            borderRadius: 10,
          }}>

          <Text style={styles.label2}>Health Data</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 8,
              flex: 1,
              flexWrap: "wrap",
            }}
          >
            <CheckBox
              style={{ width: screenSize.width / 3, marginTop: 5 }}
              onClick={() => {}}
              isChecked={metaData.activity}
              rightText="Activity"
              rightTextStyle={styles.checkboxText}
              checkBoxColor={metaData.activity? "#f7992a" : "#C9CFDF"}
              leftTextStyle={{width: 40, height:10}}
              disabled={true}
            />
            <CheckBox
              style={{ width: screenSize.width / 3, marginTop: 5 }}
              onClick={() => {}}
              isChecked={metaData.sleep}
              rightText="Sleep"
              rightTextStyle={styles.checkboxText}
              checkBoxColor={metaData.sleep? "#f7992a" : "#C9CFDF"}
              disabled={true}
            />
            <CheckBox
              style={{ width: screenSize.width / 3, marginTop: 5 }}
              onClick={() => {}}
              isChecked={metaData.nutrition}
              rightText="Nutrition"
              rightTextStyle={styles.checkboxText}
              checkBoxColor={metaData.nutrition? "#f7992a" : "#C9CFDF"}
              disabled={true}
            />
            <CheckBox
              style={{ width: screenSize.width / 3, marginTop: 5 }}
              onClick={() => {}}
              isChecked={metaData.heartRate}
              rightText="Heart Rate"
              rightTextStyle={styles.checkboxText}
              checkBoxColor={metaData.heartRate? "#f7992a" : "#C9CFDF"}
              disabled={true}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

ListItem.defaultProps = {
  rightIcon: <Icon name="angle-right" size={26} color="#52575B" />
};

export default ShareSettingsListComponent;
