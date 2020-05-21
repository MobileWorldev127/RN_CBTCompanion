import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  StatusBar,
  TouchableHighlight,
  Platform,
  NativeModules
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import ThemeStyle from "../styles/ThemeStyle";
import Icon from "../common/icons";
import Sharing from "./../components/Share";
import TextStyles from "../common/TextStyles";
import { getEntriesQuery } from "../queries";
import { getMonthRange, isCurrentMonth } from "../utils/DateTimeUtils";
import { withSubscriptionActions } from "../utils/StoreUtils";
import { showMessage } from "react-native-flash-message";
import { setEditEntry, clearState } from "../actions/RecordActions";
let moment = require("moment");
const { UIManager } = NativeModules;
import { Auth } from "aws-amplify";
import { DrawerActions } from "react-navigation-drawer";
import EntryItem from "./entries/EntryItem";
import { ScrollView } from "react-native-gesture-handler";
import { client } from "../App";
import { errorMessage, showApiError } from "../utils";
import { getTimeLineViewQuery } from "../queries/getTimeLineView";
import { timeLineItemTypes, followUpTypes } from "../constants";
import TimeLineItem from "./entries/TimeLineItem";
import DateGroup from "./entries/DateGroup";
import Loader from "../components/Loader";
import { recordScreenEvent, screenNames } from "../utils/AnalyticsUtils";
import FollowUpItem from "./entries/FollowUpItem";
import { performNetworkTask } from "../utils/NetworkUtils";
import { tabRoutes } from "./TabComponents/routes";
import { scheduleDefaultReminder } from "../utils/NotificationUtils";

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);
class EntriesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      extraData: false,
      currentMonth: moment(),
      shareDialogVisible: false
    };
  }

  componentDidMount() {
    this.listener = this.props.navigation.addListener("didFocus", payload => {
      console.log("Focused entries");
      this.props.clearRecordFlow();
      this.fetchEntries(true);
    });
    this.fetchEntries();
    recordScreenEvent(screenNames.entries, {
      month: this.state.currentMonth.format("MMM YY")
    });
    scheduleDefaultReminder();
    entriesComponent = this;
  }

  componentWillUnmount() {
    this.listener.remove();
  }

  fetchEntries = noLoader => {
    !noLoader && this.props.setLoading(true);
    client
      .watchQuery({
        query: getTimeLineViewQuery,
        variables: getMonthRange(this.state.currentMonth),
        fetchPolicy: "cache-and-network"
      })
      .subscribe({
        next: data => {
          console.log(data);
          if (data.loading && !data.data) {
            return;
          }
          this.props.setLoading(false);
          this.setState({
            entries: data.data.getTimeLineView,
            loading: false
          });
          // this.setState({
          //   entries: getEntriesWithDate(data.data)
          // });
        },
        error: err => {
          this.props.setLoading(false);
          // this.setState({
          //   loading: false
          // });
          this.setState({
            entries: []
          });
          console.log(err);
          showApiError(true);
        }
      });
  };

  render() {
    return (
      <View style={ThemeStyle.pageContainer}>
        <StatusBar backgroundColor={"#fff"} barStyle={"dark-content"} />
        <View style={[styles.navBar]}>
          <TouchableHighlight
            underlayColor="#74cc9533"
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
            onPress={() =>
              this.props.navigation.dispatch(DrawerActions.openDrawer())
            }
          >
            <Image source={require("../assets/images/redesign/Menu.png")} />
          </TouchableHighlight>
          <View
            style={{
              flex: 5,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row"
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState(
                  {
                    currentMonth: this.state.currentMonth.subtract(1, "M")
                  },
                  this.fetchEntries
                );
              }}
              style={{
                marginRight: 15,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Icon
                family="Entypo"
                color={ThemeStyle.mainColor}
                size={18}
                name="chevron-thin-left"
              />
            </TouchableOpacity>
            <Text
              style={[
                TextStyles.SubHeaderBold,
                {
                  marginVertical: 3
                }
              ]}
            >
              {this.state.currentMonth.format("MMM YYYY")}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (!isCurrentMonth(this.state.currentMonth)) {
                  this.setState(
                    {
                      currentMonth: this.state.currentMonth.add(1, "M")
                    },
                    this.fetchEntries
                  );
                }
              }}
              style={{
                marginLeft: 15,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Icon
                family="Entypo"
                color={
                  !isCurrentMonth(this.state.currentMonth)
                    ? ThemeStyle.mainColor
                    : "#ccc"
                }
                size={18}
                name="chevron-thin-right"
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly"
            }}
          >
            <TouchableHighlight
              underlayColor={`${ThemeStyle.accentColor}33`}
              style={{
                marginRight: 12
              }}
              onPress={() => this.onSharePress()}
            >
              <Image source={require("../assets/images/redesign/share.png")} />
            </TouchableHighlight>
          </View>
        </View>
        <View style={styles.container}>
          {/* <LinearGradient
            style={{ marginBottom: 12 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            colors={ThemeStyle.gradientColor}
          >
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("ACTMeasuresHistoryScreen", {
                  currentMonth: this.state.currentMonth
                })
              }
            >
              <Text
                style={[
                  TextStyles.SubHeaderBold,
                  {
                    color: "#fff",
                    paddingVertical: 24,
                    paddingHorizontal: 15,
                    textAlign: "center"
                  }
                ]}
              >
                {"View ACT Measures"}
              </Text>
            </TouchableOpacity>
          </LinearGradient> */}
          {this.state.entries && this.state.entries.length > 0 ? (
            <ScrollView>
              {this.state.entries.map((entry, i) => {
                return (
                  <DateGroup
                    dateGroup={entry}
                    navigation={this.props.navigation}
                    setLoading={this.props.setLoading}
                    onDelete={this.fetchEntries}
                    setModeAndData={this.props.setModeAndData}
                    setEditEntry={this.props.setEditEntry}
                    onChangeSelectedTab={this.props.onChangeSelectedTab}
                    index={i}
                    key={i}
                  />
                );
              })}
            </ScrollView>
          ) : (
            <View style={{ flex: 1 }}>
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 0.9, y: 1 }}
                colors={ThemeStyle.gradientColor}
              >
                <TouchableOpacity
                  onPress={() =>
                    this.props.onChangeSelectedTab(tabRoutes.Record.name)
                  }
                >
                  <Text
                    style={[
                      TextStyles.SubHeaderBold,
                      {
                        color: "#fff",
                        paddingVertical: 24,
                        paddingHorizontal: 15,
                        textAlign: "center"
                      }
                    ]}
                  >
                    {" + Add an entry"}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Image
                  source={require("./../src/noData.png")}
                  style={{
                    height: 180,
                    width: 180,
                    tintColor: "#e0dFe5"
                  }}
                />
                <Text
                  style={[
                    TextStyles.GeneralText,
                    {
                      color: "#d0cFd5",
                      fontSize: 16,
                      paddingHorizontal: 24,
                      textAlign: "center"
                    }
                  ]}
                >
                  All your records appear here. Start by adding an entry.
                </Text>
              </View>
            </View>
          )}
        </View>
        {this.getSharing()}
      </View>
    );
  }

  renderItemList = rowData => {
    // console.log(rowData);
    return (
      <EntryItem
        entryItem={rowData}
        isExpanded={rowData.isExpanded}
        onPress={() => {
          rowData.isExpanded = !rowData.isExpanded;
          this.setState({
            extraData: !this.state.extraData
          });
        }}
        navigation={this.props.navigation}
        setLoading={this.props.setLoading}
      />
    );
  };

  getSharing = () => (
    <Sharing
      currentDate={this.state.currentMonth}
      setRef={ref => (this.shareDialog = ref)}
      visible={this.state.shareDialogVisible}
      onShare={this.onShare}
      onClose={() => {
        this.setState({ shareDialogVisible: false });
      }}
      setLoading={this.props.setLoading}
    />
  );
  onSharePress = async () => {
    if (this.props.isSubscribed) {
      performNetworkTask(async () => {
        this.props.setLoading(true);
        let user = await Auth.currentAuthenticatedUser();
        if (user && user.attributes.name && user.attributes.name !== "") {
          // console.log("showing share", this.shareDialog);
          this.props.setLoading(false);
          this.setState({
            shareDialogVisible: true
          });
        } else {
          this.props.setLoading(false);
          console.log("complete profile");
          showMessage({
            type: "warning",
            message: "Please complete your profile."
          });
          setTimeout(() => {
            this.props.navigation.navigate("EditProfileScreen");
          }, 1000);
        }
      });
    } else {
      this.props.showSubscription();
    }
  };
}

onShare = () => {
  showMessage({
    type: "success",
    message: "Success",
    description: "Email has been sent successfully!!"
  });
};

function getEntriesWithDate(entriesData) {
  this.entryList = [];
  entriesData.getTimeLineView.forEach(element => {
    this.entryList.push({
      type: timeLineItemTypes.DATE_GROUP,
      date: element.date
    });
    element.entries &&
      element.entries.length &&
      this.entryList.push(...element.entries);
    element.exercises &&
      element.exercises.length &&
      this.entryList.push({
        type: timeLineItemTypes.EXERCISE,
        items: element.exercises.slice()
      });
    element.meditations &&
      element.meditations.length &&
      this.entryList.push({
        type: timeLineItemTypes.MEDITATION,
        items: element.meditations.slice()
      });
    element.practiceIdeas &&
      element.practiceIdeas.length &&
      this.entryList.push({
        type: timeLineItemTypes.PRACTICE_IDEAS,
        items: element.practiceIdeas.slice()
      });
    element.predictions &&
      element.predictions.forEach(prediction => {
        this.entryList.push({
          type: followUpTypes.PREDICTION,
          data: prediction
        });
      });
    element.challengeExercises &&
      element.challengeExercises.forEach(exercise => {
        this.entryList.push({
          type: followUpTypes.THOUGHT,
          data: exercise
        });
      });
  });
  console.log(entryList);
  return this.entryList;
}

export default withSubscriptionActions(
  EntriesScreen,
  () => {},
  dispatch => ({
    setEditEntry: entry => dispatch(setEditEntry(entry)),
    clearRecordFlow: () => dispatch(clearState())
  })
);

var styles = StyleSheet.create({
  navBar: {
    backgroundColor: ThemeStyle.backgroundColor,
    height: Platform.OS === "ios" ? 64 : 54,
    flexDirection: "row",
    paddingHorizontal: 12
  },
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
  },
  container: {
    flex: 1,
    backgroundColor: ThemeStyle.pageContainer.backgroundColor
  },
  subHeaderItem: { fontSize: 14, paddingVertical: 8, marginLeft: 4 }
});

let entriesComponent = null;

export const getEntriesComponent = () => entriesComponent;
