import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  Dimensions,
  Image
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import styles from "./styles";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import ThemeStyle from "../../../styles/ThemeStyle";
import {
  getStorageConstant,
  cancelNotif,
  getID,
  scheduleNotif
} from "../../../utils/NotificationUtils";
import TextStyles from "../../../common/TextStyles";
import { recordScreenEvent, screenNames } from "../../../utils/AnalyticsUtils";
import Button from "../../../components/Button";
import Icon from "../../../common/icons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("screen");
const modalHeight = height - 190;
let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

class ReminderModal extends Component {
  constructor(props) {
    super(props);
    this.isAffirmation = this.props.isAffirmation;
  }
  static defaultProps = {
    onCancel: () => console.log("Cancelled"),
    onSave: () => console.log("Saved")
  };
  name = "";
  description = "";
  state = {
    date: moment(),
    pickerMode: "date",
    time: moment(),
    // repeat: true,
    days: ["Mon"],
    nameError: false,
    isEditMode: false,
    editItemIndex: null
  };

  componentWillReceiveProps(nextProps) {
    console.log("SETTING REMINDER MODAL PROPS", nextProps);
    this.isAffirmation = nextProps.isAffirmation;
    if (nextProps.editItem && nextProps.editItem.days) {
      this.name = nextProps.editItem.title;
      this.description = nextProps.editItem.message;
      this.setState({
        days: nextProps.editItem.days,
        time: moment(nextProps.editItem.date),
        date: moment(nextProps.editItem.date),
        isEditMode: true,
        editItemIndex: nextProps.editItemIndex || null
      });
    } else {
      this.name = "";
      this.description = "";
      this.setState({
        ...this.state
      });
    }
  }

  async componentDidMount() {
    // let result = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    // if (Constants.lisDevice && resut.status === "granted") {
    //   console.log("Notification permissions granted.");
    // }
    if (this.props.editItem && this.props.editItem.days) {
      this.name = this.props.editItem.title;
      this.description = this.props.editItem.message;
      this.setState({
        days: this.props.editItem.days,
        time: moment(this.props.editItem.date),
        date: moment(this.props.editItem.date),
        isEditMode: true,
        editItemIndex: this.props.editItemIndex || null
      });
    }
    recordScreenEvent(screenNames.addNotification, {
      type: this.isAffirmation ? "Affirmation" : "Reminder",
      isEditMode: this.props.editItem && this.props.editItem.days
    });
  }

  _showDateTimePicker = (mode = "date") =>
    this.setState({ isDatePickerVisible: true, pickerMode: mode });

  _hideDateTimePicker = () => this.setState({ isDatePickerVisible: false });

  _handleDatePicked = datetime => {
    const { pickerMode } = this.state;
    datetime = pickerMode === "date" ? moment(datetime) : moment(datetime);
    this.setState({ [pickerMode]: datetime, isDatePickerVisible: false });
  };
  handleDaySelect = day => {
    let { days } = this.state;
    let index = days.indexOf(day);
    if (index !== -1) {
      days.splice(index, 1);
    } else {
      days.push(day);
    }
    this.setState({ days });
  };
  selectDaily = () => {
    let { days } = this.state;
    if (days.length !== weekDays.length) {
      days = [...weekDays];
    } else {
      days = [];
    }
    this.setState({ days });
  };

  isDaily = days => days.length === 7;

  removeNotificatoin = async () => {
    this.props.editItem.id.forEach(element => {
      cancelNotif(element);
      console.log("canceling notification id " + element);
    });
    // Notifications.cancelScheduledNotificationAsync(i);

    let reminderString = await AsyncStorage.getItem(
      getStorageConstant(this.isAffirmation)
    );
    let reminders = JSON.parse(reminderString);
    reminders.splice(this.state.editItemIndex, 1);
    AsyncStorage.setItem(
      getStorageConstant(this.isAffirmation),
      JSON.stringify(reminders)
    );
    this.setNotification();
  };

  setNotification = async () => {
    const { time, days, date } = this.state;
    const repeatDaily = this.isDaily(days);
    // if (!this.name.length) {
    //   this.setState({ nameError: true });
    //   return;
    // }
    let notificationTime = moment(date);
    notificationTime.set("h", time.get("h"));
    notificationTime.set("m", time.get("m"));
    console.log("DESCRIPTION", this.description);
    const localNotification = {
      title: this.isAffirmation ? "Affirmation" : "Reminder",
      message:
        this.description && this.description.length
          ? this.description
          : this.isAffirmation
          ? "Here is your daily Affirmation"
          : "A gentle reminder to make your Daily Diary Entry",
      date: new Date(notificationTime.format()),
      days: days,
      id: []
    };

    if (repeatDaily) {
      let notificationId = await getID();
      localNotification.id.push(notificationId);
      scheduleNotif(
        notificationId,
        localNotification.title,
        localNotification.message,
        localNotification.date,
        "day",
        this.isAffirmation
      );
    } else {
      const today = moment(new Date()).weekday();
      const currentTime = new Date(moment(time).format());
      localNotification.id = [];
      for (let day in days) {
        let notificationId = await getID();
        if (weekDays.indexOf(days[day]) < today) {
          let daysDiff = today - weekDays.indexOf(days[day]);
          let adjustedTime = moment(notificationTime)
            .add(7 - daysDiff, "day")
            .format();
          scheduleNotif(
            notificationId,
            localNotification.title,
            localNotification.message,
            new Date(adjustedTime),
            "week",
            this.isAffirmation
          );
          localNotification.id.push(notificationId);
        } else {
          let daysDiff = weekDays.indexOf(days[day]) - today;
          let adjustedTime = moment(notificationTime)
            .add(daysDiff, "day")
            .format();
          scheduleNotif(
            notificationId,
            localNotification.title,
            localNotification.message,
            new Date(adjustedTime),
            "week",
            this.isAffirmation
          );
          localNotification.id.push(notificationId);
        }
      }
    }
    this.setState({ nameError: false });
    let a = localNotification.days.sort(this.sortDays);
    if (this.props.editItemIndex >= 0 || this.props.editItem) {
      this.props.onUpdate(localNotification);
    } else {
      this.props.onSave(localNotification);
    }
  };

  sortDays = (a, b) => {
    a = weekDays.indexOf(a);
    b = weekDays.indexOf(b);
    return a < b ? 0 : 1;
  };

  render() {
    const { onCancel, onSave, editItem } = this.props;
    const {
      modalVisible,
      date,
      pickerMode,
      days,
      nameError,
      isEditMode
    } = this.state;
    let time = this.state.time;
    let amPm = time.format("A");
    time = time.format("hh : mm");
    return (
      <View
        style={{
          height: "100%",
          justifyContent: "flex-end",
          backgroundColor: "#0008"
        }}
      >
        <View
          style={{
            width: "100%",
            position: "absolute"
          }}
        >
          <TouchableWithoutFeedback
            onPress={onCancel}
            style={{ height: 150 }}
          />
          <View
            style={{
              backgroundColor: "#fff",
              height: this.state.keyboardVisible
                ? modalHeight - this.keyboardHeight
                : modalHeight,
              justifyContent: "space-between",
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              padding: 24
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: 24
              }}
            >
              {isEditMode ? (
                <Text style={TextStyles.Header2}>{`Edit ${
                  this.isAffirmation ? "Affirmation" : "Reminder"
                }`}</Text>
              ) : (
                <Text style={TextStyles.Header2}>{`Set ${
                  this.isAffirmation ? "Affirmation" : "Reminder"
                }`}</Text>
              )}
              <TouchableOpacity onPress={onCancel}>
                <Image
                  source={require("../../../assets/images/redesign/cross.png")}
                />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.modalContent}
              contentContainerStyle={{ paddingBottom: 48 }}
            >
              <TextInput
                onChangeText={description => (this.description = description)}
                underlineColorAndroid="transparent"
                placeholder="Enter description"
                placeholderTextColor="#aaa"
                defaultValue={this.description}
                style={[styles.list, TextStyles.GeneralText]}
              />

              <ListButton
                title="Time"
                subtitle={`${time} ${amPm}`}
                onPress={() => this._showDateTimePicker("time")}
                rightIcon={
                  <Icon
                    name="md-time"
                    size={24}
                    color={"#ddd"}
                    family="Ionicons"
                  />
                }
              />

              <View style={styles.daySelector}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 12
                  }}
                >
                  <Text style={styles.remindMe}>Repeat</Text>
                  <TouchableOpacity
                    style={[
                      styles.dailyButton,
                      days.length === 7 ? styles.activeDayButton : {}
                    ]}
                    onPress={this.selectDaily}
                  >
                    <Text
                      style={[
                        styles.dailyButtonText,
                        days.length === 7 ? styles.activeDayButtonText : {}
                      ]}
                    >
                      Daily
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.selectorDays}>
                  {weekDays.map(day => (
                    <DayButton
                      key={day}
                      name={day}
                      onPress={this.handleDaySelect}
                      active={days.indexOf(day) !== -1}
                    />
                  ))}
                </View>
              </View>
              <Button
                style={{ marginTop: 48 }}
                name="Save"
                onPress={
                  isEditMode ? this.removeNotificatoin : this.setNotification
                }
              />
            </ScrollView>
          </View>
        </View>

        <DateTimePicker
          mode={pickerMode}
          isVisible={this.state.isDatePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
        />
      </View>
    );
  }
}

export const ListButton = props => {
  return (
    <TouchableOpacity
      style={[styles.list, props.style]}
      onPress={props.onPress}
      activeOpacity={props.onPress ? 0.3 : 1}
    >
      <View>
        {props.onPress && (
          <Text style={TextStyles.GeneralTextBold}>{props.subtitle}</Text>
        )}
      </View>
      {props.rightIcon}
    </TouchableOpacity>
  );
};

const DayButton = props => (
  <TouchableOpacity
    style={[styles.daySelectButton, props.active ? styles.activeDayButton : {}]}
    onPress={() => props.onPress(props.name)}
  >
    <Text
      style={[
        styles.dayButtonText,
        props.active ? styles.activeDayButtonText : {}
      ]}
    >
      {props.name.toUpperCase()}
    </Text>
  </TouchableOpacity>
);

export default ReminderModal;
