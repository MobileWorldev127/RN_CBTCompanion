import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  Switch,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
  TouchableHighlight,
  FlatList,
  Modal,
  TextInput,
  Platform
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import ThemeStyle from "../styles/ThemeStyle";
import Icon from "../common/icons";
import DatePicker from "react-native-datepicker";
import Header from "./../components/Header";
import TextStyles from "../common/TextStyles";

const { width, height } = Dimensions.get("window");

const STATUSBAR_HEIGHT = 15;
const NAVBAR_HEIGHT = 64 - STATUSBAR_HEIGHT;

export default class SetReminderScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      switch: false,
      time: ""
    };
  }

  onChangeFunction(newState) {
    this.setState({ switch: newState });
  }

  onSaveButtonPress = () => {
    alert("Reminders Saved");
  };

  render() {
    var tabSwitch =
      this.state.switch == true
        ? { backgroundColor: "#DEFDEC" }
        : { backgroundColor: "lightgrey" };
    return (
      <View style={ThemeStyle.pageContainer}>
        <StatusBar
          translucent={true}
          backgroundColor={"transparent"}
          barStyle={"light-content"}
          hidden={false}
        />
        <Header
          title="Set Reminder"
          goBack={() => {
            this.props.navigation.goBack(null);
          }}
        />
        <ScrollView>
          <View style={styles.outerContainer}>
            <View style={styles.innerContainer}>
              <View style={{ flex: 1, alignItems: "flex-start" }}>
                <Text style={[TextStyles.GeneralText, styles.textContent]}>
                  Name
                </Text>
              </View>
              <View>
                <TextInput
                  style={[TextStyles.SubHeaderBold, styles.textInput]}
                  onChangeText={text => this.setState({ text })}
                  //value={this.state.name}
                  multiline={false}
                  underlineColorAndroid="transparent"
                  placeholder="Eg : Meditation"
                  placeholderTextColor="lightgrey"
                />
              </View>
            </View>
          </View>

          <View style={styles.innerContainer}>
            <Text style={[TextStyles.GeneralText, styles.textContent]}>
              Description
            </Text>
            <TextInput
              style={[TextStyles.SubHeaderBold, styles.inputBox]}
              placeholder="Enter here"
              multiline={true}
              placeholderTextColor="lightgrey"
              underlineColorAndroid="transparent"
              //value={this.state.description}
              onChangeText={description => this.setState({ description })}
            />
          </View>

          <View style={styles.outerContainer}>
            <View style={styles.innerContainer}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <Text style={[TextStyles.GeneralText, styles.textContent]}>
                  Set time
                </Text>
                <TouchableOpacity
                  style={{
                    alignContent: "flex-end",
                    justifyContent: "flex-end"
                  }}
                >
                  <DatePicker
                    customStyles={{
                      dateInput: { borderWidth: 0, paddingLeft: 0 },
                      dateText: [TextStyles.SubHeaderBold, styles.textContent],
                      placeholderText: {
                        color: "lightgrey",
                        fontWeight: "bold"
                      }
                    }}
                    confirmBtnText="Done"
                    cancelBtnText="Cancel"
                    placeholder="Time"
                    date={this.state.time}
                    mode="time"
                    format="LT"
                    showIcon={false}
                    onDateChange={time => {
                      this.setState({ time });
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={[styles.innerContainer, { marginTop: 12 }]}>
            <Text style={[TextStyles.GeneralText, styles.textContent]}>
              Repeat
            </Text>
            <View
              style={[
                {
                  justifyContent: "space-between",
                  flexDirection: "row",
                  paddingTop: 12
                }
              ]}
            >
              <TouchableOpacity style={styles.weekContainer}>
                <Text style={styles.textWeek}>MON</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.weekContainer}>
                <Text style={styles.textWeek}>TUE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.weekContainer}>
                <Text style={styles.textWeek}>WED</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.weekContainer}>
                <Text style={styles.textWeek}>THU</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.weekContainer}>
                <Text style={styles.textWeek}>FRI</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.weekContainer}>
                <Text style={styles.textWeek}>SAT</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.weekContainer}>
                <Text style={styles.textWeek}>SUN</Text>
              </TouchableOpacity>
            </View>
            <View
              style={[
                {
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingTop: 16
                }
              ]}
            >
              <Text style={[TextStyles.GeneralText, styles.textContent]}>
                Daily
              </Text>
              <TouchableOpacity style={[styles.switchContainer, tabSwitch]}>
                <Switch
                  value={this.state.switch}
                  disabled={false}
                  onTintColor={"#DEFDEC"}
                  tintColor={"transparent"}
                  thumbTintColor={"#7FD5A1"}
                  onValueChange={value => this.onChangeFunction(value)}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {}}
          style={{
            position: "absolute",
            bottom: 0,
            backgroundColor: "#38CB89",
            flexDirection: "row",
            width: width,
            justifyContent: "center",
            padding: 16
          }}
        >
          <Text
            style={[TextStyles.HeaderBold, { color: "#fff", fontSize: 14 }]}
          >
            {"Save"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  outerContainer: {
    marginTop: 12,
    backgroundColor: "#fff"
  },
  innerContainer: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#fff"
  },
  textInput: {
    height: 32,
    width: "100%",
    fontSize: 14
  },
  inputBox: {
    height: 48,
    fontSize: 14,
    backgroundColor: "#fff"
  },
  textContent: {
    color: "#000",
    fontSize: 16
  },
  switchContainer: {
    borderWidth: 1,
    borderColor: "#7FD5A1",
    borderRadius: 30,
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }]
  },
  textWeek: {
    color: "#000",
    fontSize: 12,
    padding: 3,
    textAlign: "center"
  },
  weekContainer: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    backgroundColor: "lightgrey",
    alignItems: "center",
    justifyContent: "center"
  }
});
