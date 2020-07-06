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
import textStyles from "./../common/TextStyles";
import ThemeStyle from "../styles/ThemeStyle";
import Header from "./../components/Header";
import { Transition } from "react-navigation-fluid-transitions";
import LinearGradient from "react-native-linear-gradient";
import CustomButton from "./../components/Button";
import { withStore } from "../utils/StoreUtils";
import { setSleepData } from "../actions/RecordActions";
import { asyncStorageConstants, getScreens } from "../constants";
import { recordScreenEvent, screenNames } from "../utils/AnalyticsUtils";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import Icon from "../common/icons";
import Card from "../components/Card";
import * as Animatable from "react-native-animatable";

const { width, height } = Dimensions.get("window");

class MedicationScreen extends Component {
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
      sleepTime: this.defaultSleepTime,
      wakeTime: this.defaultWakeTime,
      switch: props.isEdit ? props.editEntry.medication : false,
      duration: this.calculateDuration(
        this.defaultSleepTime,
        this.defaultWakeTime
      )
    };
  }

  componentDidMount() {
    recordScreenEvent(screenNames.medication);
  }

  componentWillUnmount() {
    this.props.setTopSafeAreaView(ThemeStyle.gradientStart);
  }
  
  calculateDuration(sleepTime, wakeTime) {
    let hours = wakeTime.diff(sleepTime, "hours", true);
    if (hours < 0) {
      hours = 24 + hours;
    }
    const durationHours = Math.floor(hours);
    const minutes = hours - durationHours;
    const durationMins = Math.floor(minutes * 60);
    return durationHours + " Hours " + durationMins + " Mins";
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
        <Animatable.View animation="slideInLeft">
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 24,
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: 10,
              ...ThemeStyle.shadow()
            }}
          >
            <Text style={[textStyles.GeneralTextBold, { marginRight: 12 }]}>
              {"Did you take your \n medications?"}
            </Text>
            <TouchableOpacity style={[]}>
              <Switch
                value={this.state.switch}
                disabled={false}
                onValueChange={value => {
                  this.setState({
                    switch: !this.state.switch
                  });
                }}
              />
            </TouchableOpacity>
          </View>
        </Animatable.View>
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
                  source={require("../assets/images/redesign/Night-icon.png")}
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
                  source={require("../assets/images/redesign/Day-graphic.png")}
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
            source={require("../assets/images/redesign/Sleep_Duration-graphic.png")}
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
                )
              });
            }
          }}
        />
        <CustomButton
          style={{
            position: "absolute",
            bottom: 0,
            right: 24,
            marginBottom: 24,
            alignSelf: "flex-end"
          }}
          name={"Next"}
          onPress={async () => {
            this.props.setLoading(true);
            this.props.setSleepData(this.getSleepData());
            if (getScreens().indexOf("measures") != -1 && !this.props.isEdit) {
              const isWeeklyAdded = JSON.parse(
                await AsyncStorage.getItem(
                  asyncStorageConstants.weeklyMeasures()
                )
              );
              const isDailyAdded = JSON.parse(
                await AsyncStorage.getItem(
                  asyncStorageConstants.dailyMeasures()
                )
              );
              console.log(
                `---ACT WEEKLY AND DAILY-- ${isDailyAdded} ${isWeeklyAdded}`
              );
              if (isWeeklyAdded && isDailyAdded) {
                this.props.navigation.navigate("JournalScreen");
              } else {
                this.props.navigation.navigate("ACTMeasuresScreen");
              }
            } else {
              this.props.navigation.navigate("JournalScreen");
            }
            this.props.setLoading(false);
          }}
        />
      </View>
    );
  }

  getSleepData = () => {
    return {
      medication: !!this.state.switch,
      bedTime: this.state.sleepTime.toISOString(),
      wakeTime: this.state.wakeTime.toISOString(),
      sleepTime: this.state.duration
    };
  };
}

export default withStore(
  MedicationScreen,
  state => ({
    isEdit: state.record.isEdit,
    editEntry: state.record.editEntry
  }),
  dispatch => ({
    setSleepData: data => dispatch(setSleepData(data))
  })
);

var styles = StyleSheet.create({
  inputBox: {
    //flex:3,
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
  addMedia: {
    paddingTop: 20,
    paddingHorizontal: 24,
    backgroundColor: "#fff",
    flexDirection: "row"
  },
  listContainer: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "lightgrey",
    height: width / 4
  },
  modalContainer: {
    backgroundColor: "#fff",
    height: null,
    width: width - 40,
    borderRadius: 10,
    overflow: "hidden"
  },
  modalHeader: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 0.5,
    borderColor: "lightgrey"
  }
});
