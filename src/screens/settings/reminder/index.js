import React, { Component, Fragment } from "react";
import { ScrollView, Modal, Alert, Text, View } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import CardReminder from "./cardReminder";
import ReminderModal from "./reminderModal";
import Icon from "react-native-vector-icons/Ionicons";
import Header from "../../../components/Header";
import {
  getStorageConstant,
  cancelNotif
} from "../../../utils/NotificationUtils";
import { withStore } from "../../../utils/StoreUtils";
import { toggleAffirmationView } from "../../../actions/AppActions";
import { recordScreenEvent, screenNames } from "../../../utils/AnalyticsUtils";
import { NoData } from "../../../components/NoData";
import Button from "../../../components/Button";
import {
  TouchableWithoutFeedback,
  TouchableOpacity
} from "react-native-gesture-handler";
import ThemeStyle from "../../../styles/ThemeStyle";
// import { Notifications} from 'expo';

class ReminderScreen extends Component {
  constructor(props) {
    super(props);
    this.isAffirmation = this.props.navigation.state.params.isAffirmation;
  }
  state = {
    modalVisible: false,
    reminders: [],
    editItem: {}
  };
  hideModal = () =>
    this.setState({ modalVisible: false, editItem: {}, editItemIndex: null });
  showModal = () => this.setState({ modalVisible: true });
  componentDidMount() {
    AsyncStorage.getItem(getStorageConstant(this.isAffirmation)).then(res => {
      let reminders = (res && JSON.parse(res)) || [];
      this.setState({ reminders });
    });
    recordScreenEvent(screenNames.scheduleNotification, {
      type: this.isAffirmation ? "Affirmations" : "Reminders"
    });
  }
  addReminder = reminder => {
    let reminders = [...this.state.reminders];
    reminders.push(reminder);
    AsyncStorage.setItem(
      getStorageConstant(this.isAffirmation),
      JSON.stringify(reminders)
    );
    this.setState({ reminders });
    this.hideModal();
  };
  updateReminder = reminder => {
    AsyncStorage.getItem(getStorageConstant(this.isAffirmation)).then(res => {
      let reminders = (res && JSON.parse(res)) || [];
      reminders.push(reminder);
      AsyncStorage.setItem(
        getStorageConstant(this.isAffirmation),
        JSON.stringify(reminders)
      );
      this.setState({ reminders });
      this.hideModal();
    });
  };
  clearReminders = (id, index) => {
    Alert.alert(
      "Are you sure?",
      "This reminder will be deleted",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => this.deleteReminder(id, index) }
      ],
      { cancelable: false }
    );
  };

  deleteReminder = (id, index) => {
    AsyncStorage.getItem(getStorageConstant(this.isAffirmation)).then(res => {
      let reminders = (res && JSON.parse(res)) || [];
      if (id !== null) {
        id.forEach(element => {
          cancelNotif(element);
          console.log("Cancelling notification " + element);
        });
        reminders.splice(index, 1);
        AsyncStorage.setItem(
          getStorageConstant(this.isAffirmation),
          JSON.stringify(reminders)
        );
        this.setState({ reminders });
      }
    });
  };

  editReminder = async (id, index) => {
    let reminderString = await AsyncStorage.getItem(
      getStorageConstant(this.isAffirmation)
    );
    let reminder = JSON.parse(reminderString)[index];
    this.setState({ editItem: reminder, editItemIndex: index });
    this.showModal();
  };

  render() {
    const { modalVisible, reminders } = this.state;

    return (
      <View style={ThemeStyle.pageContainer}>
        <Header
          title={this.isAffirmation ? "Affirmations" : "Reminders"}
          goBack={() => {
            this.props.navigation.goBack(null);
          }}
          rightIcon={() => <Icon name="ios-add" size={35} />}
          onRightIconClick={this.showModal}
        />
        {reminders.length > 0 ? (
          <ScrollView style={{ flex: 1, marginTop: 10 }}>
            {reminders.map((reminder, index) => (
              <CardReminder
                time={reminder.date}
                title={reminder.title}
                description={reminder.message || ""}
                days={reminder.days}
                key={index}
                repeat={reminder.repeat}
                date={reminder.date}
                id={reminder.id || null}
                editReminder={() => this.editReminder(reminder.id, index)}
                deleteReminder={() => this.clearReminders(reminder.id, index)}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyScreen}>
            <NoData
              style={{ flex: 0 }}
              message={`No ${
                this.isAffirmation ? "affirmations" : "reminders"
              }`}
            />
            <Button
              style={{
                paddingHorizontal: 48,
                marginTop: 24
              }}
              name={`Add ${this.isAffirmation ? "affirmation" : "reminder"}`}
              onPress={this.showModal}
            />
          </View>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={this.hideModal}
        >
          <ReminderModal
            onCancel={this.hideModal}
            onSave={this.addReminder}
            editItem={this.state.editItem}
            editItemIndex={this.state.editItemIndex}
            onUpdate={this.updateReminder}
            showAffirmation={this.props.showAffirmation}
            isAffirmation={this.isAffirmation}
            navigation={this.props.navigation}
          />
        </Modal>
      </View>
    );
  }
}

export default withStore(
  ReminderScreen,
  () => {},
  dispatch => ({
    showAffirmation: () => dispatch(toggleAffirmationView(true))
  })
);
