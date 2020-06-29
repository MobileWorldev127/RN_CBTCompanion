import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Switch,
  ScrollView,
  Image
} from "react-native";
import textStyles from "./../../common/TextStyles";
import ThemeStyle from "../../styles/ThemeStyle";
import Header from "./../../components/Header";
import { Transition } from "react-navigation-fluid-transitions";
import LinearGradient from "react-native-linear-gradient";
import CustomButton from "./../../components/Button";
import { withStore } from "../../utils/StoreUtils";
import { setSleepData } from "../../actions/RecordActions";
import { asyncStorageConstants, getScreens } from "../../constants";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import Icon from "../../common/icons";
import Card from "../../components/Card";
import * as Animatable from "react-native-animatable";
import { addSleepEntry, deleteSleepEntries, getSleepEntries } from "../../actions/NutritionixActions"
import { showMessage } from "react-native-flash-message";

const { width, height } = Dimensions.get("window");

class SleepAddScreen extends Component {
  constructor(props) {
    super(props);
    this.defaultSleepTime = moment();
    this.defaultSleepTime.hours(
      props.isEdit && props.editEntry.bedTime
        ? moment(props.editEntry.bedTime).get("hours")
        : 22
    );
    this.defaultSleepTime.minutes(
      props.isEdit && props.editEntry.bedTime
        ? moment(props.editEntry.bedTime).get("minutes")
        : 15
    );
    this.defaultWakeTime = moment();
    this.defaultWakeTime.hours(
      props.isEdit && props.editEntry.wakeTime
        ? moment(props.editEntry.wakeTime).get("hours")
        : 6
    );
    this.defaultWakeTime.minutes(
      props.isEdit && props.editEntry.wakeTime
        ? moment(props.editEntry.wakeTime).get("minutes")
        : 15
    );
    this.state = {
      currentDate: props.isEdit ? moment(props.editEntry.dateTime) : moment(),
      sleepTime: this.defaultSleepTime,
      wakeTime: this.defaultWakeTime,
      switch: props.isEdit ? props.editEntry.medication : false,
      duration: this.calculateDuration(
        this.defaultSleepTime,
        this.defaultWakeTime
      ),
      duration_min: this.calculateDurationMin(
        this.defaultSleepTime,
        this.defaultWakeTime
      )
    };
  }

  componentDidMount() {
    recordScreenEvent(screenNames.medication);
  }

  calculateDuration(sleepTime, wakeTime) {
    let hours = wakeTime.diff(sleepTime, "hours", true);
    if (hours < 0) {
      hours = 24 + hours;
    }
    const durationHours = Math.floor(hours);
    const minutes = hours - durationHours;
    const durationMins = Math.floor(minutes * 60);
    return durationHours + ":" + durationMins;
  }

  calculateDurationMin(sleepTime, wakeTime) {
    let hours = wakeTime.diff(sleepTime, "hours", true);
    if (hours < 0) {
      hours = 24 + hours;
    }
    const durationHours = Math.floor(hours);
    const minutes = hours - durationHours;
    const durationMins = Math.floor(minutes * 60);
    return durationHours * 60 + durationMins;
  }

  onClickAddSleep = () => {
    var params = {
      bed_time: this.state.sleepTime.toISOString(),
      wake_time: this.state.wakeTime.toISOString(),
      duration: this.state.duration,
      duration_min: this.state.duration_min
    }
    let dateTime = this.state.currentDate.format("YYYY-MM-DD");
    this.props.addSleepEntry(params, dateTime, onAdded => {
      console.log("Success to upload sleep", onAdded)
      showMessage({
        message:'Sleep have been saved sucessfully.',
        type: "success"
      });
      this.props.navigation.goBack(null);
    })
  }

  render() {
    return (
      <View style={[ThemeStyle.pageContainer, { paddingHorizontal: 20 }]}>
        <Header
          title="Sleep"
          goBack={() => {
            this.props.navigation.goBack(null);
          }}
        />
        <Animatable.View animation="fadeInUp">
          <LinearGradient
            style={{ marginTop: 12, borderRadius: 10 }}
            start={{ x: 0.8, y: 0.2 }}
            end={{ x: 0.2, y: 1 }}
            colors={ThemeStyle.gradientColor}
          >
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{ flex: 1, padding: 24, alignItems: "center" }}
                onPress={() => {
                  this.setState({
                    isDatePickerVisible: true,
                    dateType: "sleep"
                  });
                }}
              >
                <Image
                  source={require("../../assets/images/redesign/Night-icon.png")}
                  style={{ height: 72, marginVertical: 16 }}
                  resizeMode="contain"
                />
                <Text
                  style={[
                    textStyles.GeneralTextBold,
                    { textAlign: "center", color: "#333" }
                  ]}
                >
                  Slept at
                </Text>
                <Text
                  style={[
                    textStyles.SubHeaderBold,
                    { textAlign: "center", color: "#fff" }
                  ]}
                >
                  {this.state.sleepTime.format("hh : mm A")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, padding: 24, alignItems: "center" }}
                onPress={() => {
                  this.setState({
                    isDatePickerVisible: true,
                    dateType: "wake"
                  });
                }}
              >
                <Image
                  source={require("../../assets/images/redesign/Day-graphic.png")}
                  style={{ height: 72, marginVertical: 16 }}
                  resizeMode="contain"
                />
                <Text
                  style={[
                    textStyles.GeneralTextBold,
                    { textAlign: "center", color: "#333" }
                  ]}
                >
                  Wokeup at
                </Text>
                <Text
                  style={[
                    textStyles.SubHeaderBold,
                    { textAlign: "center", color: "#fff" }
                  ]}
                >
                  {this.state.wakeTime.format("hh : mm A")}
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animatable.View>
        <Animatable.View
          animation="fadeInUp"
          style={{
            borderRadius: 10,
            ...ThemeStyle.shadow(),
            backgroundColor: "#fff",
            borderWidth: 2,
            marginTop: 16,
            borderColor: ThemeStyle.mainColor,
            flexDirection: "row",
            padding: 16,
            alignItems: "center"
          }}
        >
          <Image
            source={require("../../assets/images/redesign/Sleep_Duration-graphic.png")}
            style={{ height: 72 }}
            resizeMode="contain"
          />
          <View style={{ flexDirection: "column", marginLeft: 24 }}>
            <Text style={[textStyles.GeneralTextBold]}>{"Sleep Duration"}</Text>
            <Text
              style={[
                textStyles.SubHeaderBold,
                { color: ThemeStyle.mainColor }
              ]}
            >
              {this.state.duration}
            </Text>
          </View>
        </Animatable.View>
        <DateTimePicker
          isVisible={this.state.isDatePickerVisible}
          date={
            this.state.dateType === "sleep"
              ? new Date(this.state.sleepTime.toISOString())
              : new Date(this.state.wakeTime.toISOString())
          }
          mode="time"
          onCancel={() => {
            this.setState({
              isDatePickerVisible: false
            });
          }}
          onConfirm={date => {
            console.log(date);
            const selectedDate = moment(date);
            if (this.state.dateType === "sleep") {
              this.setState({
                isDatePickerVisible: false,
                sleepTime: selectedDate,
                duration: this.calculateDuration(
                  selectedDate,
                  this.state.wakeTime
                ),
                duration_min: this.calculateDurationMin(
                  selectedDate,
                  this.state.wakeTime
                )
              });
            }
            if (this.state.dateType === "wake") {
              this.setState({
                isDatePickerVisible: false,
                wakeTime: selectedDate,
                duration: this.calculateDuration(
                  this.state.sleepTime,
                  selectedDate
                ),
                duration_min: this.calculateDurationMin(
                  this.state.sleepTime, 
                  selectedDate
                )
              });
            }
          }}
        />
        <CustomButton
          style={{
            position: "absolute",
            bottom: 0,
            marginBottom: 50,
            alignSelf: "center"
          }}
          name={"Log Sleep"}
          onPress={this.onClickAddSleep}
        />
      </View>
    );
  }
}

export default withStore(
  SleepAddScreen,
  state => ({
    isEdit: state.record.isEdit,
    editEntry: state.record.editEntry
  }),
  dispatch => ({
    setSleepData: data => dispatch(setSleepData(data)),
    addSleepEntry: (query, date, data) =>
      dispatch(addSleepEntry(query, date, data)),
    deleteSleepEntries: (entryId, data) =>
      dispatch(deleteSleepEntries(entryId, data)),
    getSleepEntries: (date, fetchListData) =>
      dispatch(getSleepEntries(date, fetchListData)),
  })
);

var styles = StyleSheet.create({
  inputBox: {
    height: 300,
    borderColor: "#fff",
    borderWidth: 1,
    paddingHorizontal: 24,
    marginVertical: 24,
    fontSize: 16,
    textAlignVertical: "top",
    color: "#000",
    backgroundColor: "#fff"
  },
});
