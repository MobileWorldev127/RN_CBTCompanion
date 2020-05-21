import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Image
} from "react-native";
import PopupDialog, {
  ScaleAnimation,
  DialogContent
} from "react-native-popup-dialog";
import Icon from "react-native-vector-icons/Ionicons";
import Button from "./../components/Button";
import CheckBox from "react-native-check-box";
import { withApollo } from "react-apollo";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import MonthSelectorCalendar from "react-native-month-selector";
import Amplify, { API, graphqlOperation, Auth } from "aws-amplify";
import DeviceUiInfo from "../utils/DeviceUIInfo";
import { ScrollView } from "react-native-gesture-handler";
import ThemeStyle from "../styles/ThemeStyle";
import TextStyles from "../common/TextStyles";
import { getEnvVars, getAmplifyConfig } from "../constants";
import { showMessage } from "react-native-flash-message";
import { errorMessage } from "../utils";
import { client } from "../App";
import { shareByEmailQuery } from "../queries/shareByEmail";

const { screenSize, guidelineBaseWidth, platform } = DeviceUiInfo;
const scaleAnimation = new ScaleAnimation();

class Sharing extends React.Component {
  static defaultProps = {
    onShare: () => {}
  };

  constructor(props) {
    super(props);
    this.input = null;
    this.initialState = {
      emailError: false,
      selectMonth: false,
      startDate: moment()
        .subtract(1, "weeks")
        .startOf("isoWeek")
        .format("MM/DD/YYYY"),
      endDate: moment()
        .subtract(1, "weeks")
        .endOf("isoWeek")
        .format("MM/DD/YYYY"),
      selectedMonth: moment().format("MMMM YYYY"),
      pickerMode: "date",
      isDatePickerVisible: false,
      pickerType: null,
      showPicker: false,
      email: "",
      diaryCard: false,
      meditation: false,
      emotion: true,
      sleep: false,
      exercise: true,
      journal: true,
      practiceidea: false,
      actMeasure: false
    };
    this.state = this.initialState;
    this.resetComponentState = this.resetComponentState.bind(this);
  }
  setRef = ref => {
    this.dialog = ref;
    this.props.setRef(ref);
  };

  show = () => {
    this.setState({
      dialogVisible: true
    });
  };

  resetComponentState = () => {
    this.input.setNativeProps({ text: "" });
    this.setState(this.initialState);
  };

  /* DATE TIME PICKER METHODS */

  _hideDateTimePicker = () => this.setState({ isDatePickerVisible: false });

  _handleDatePicked = datetime => {
    const { pickerType, startDate, endDate } = this.state;
    const date = moment(datetime).format("MM/DD/YYYY");
    if (pickerType === "START") {
      if (endDate && endDate !== "" && moment(endDate) < moment(date)) {
        this.setState({ startDate: null });
      } else {
        this.setState({ startDate: date });
      }
    } else if (pickerType === "END") {
      if (startDate && startDate !== "" && moment(date) < moment(startDate)) {
        this.setState({ endDate: null });
      } else {
        this.setState({ endDate: date });
      }
    }
    this.setState({ isDatePickerVisible: false, pickerType: null });
  };

  _showDateTimePicker = (type, mode = "date") => {
    this.setState({
      isDatePickerVisible: true,
      pickerMode: mode,
      pickerType: type
    });
  };

  /* MONTH PICKER METHODS */

  showPicker = bool => () => {
    this.setState({ showPicker: bool });
  };

  getPicker = () => {
    return (
      <Modal
        animationType="fade"
        visible={this.state.showPicker}
        transparent={true}
        onRequestClose={() => {}}
      >
        <View style={styles.modalContainer}>
          <View style={styles.overlay} />
          <View style={styles.wrapper}>
            <MonthSelectorCalendar
              selectedDate={moment(this.state.selectedMonth)}
              onMonthTapped={date => {
                console.log("selected month");
                const startDate = moment(date).format("MM/DD/YYYY");
                const endDate = moment(date)
                  .endOf("month")
                  .format("MM/DD/YYYY");
                this.setState({
                  selectedMonth: moment(date).format("MMMM YYYY"),
                  showPicker: false,
                  startDate,
                  endDate
                });
              }}
              containerStyle={{ borderRadius: 5 }}
              currentMonthTextStyle={{ color: ThemeStyle.mainColor }}
              selectedBackgroundColor={ThemeStyle.accentColor}
            />
          </View>
        </View>
      </Modal>
    );
  };

  /* OTHER */

  toggleSelectMonthCheckbox = () => {
    const { selectMonth } = this.state;
    if (selectMonth) {
      this.setState({
        selectMonth: false,
        startDate: moment()
          .subtract(1, "weeks")
          .startOf("isoWeek")
          .format("MM/DD/YYYY"),
        endDate: moment()
          .subtract(1, "weeks")
          .endOf("isoWeek")
          .format("MM/DD/YYYY"),
        selectedMonth: moment().format("MMMM YYYY")
      });
    } else {
      this.setState({
        selectMonth: true,
        startDate: moment()
          .startOf("month")
          .format("MM/DD/YYYY"),
        endDate: moment()
          .endOf("month")
          .format("MM/DD/YYYY")
      });
    }
  };

  share = () => {
    if (!this.isValidEmail(this.state.email.split(",")[0])) {
      this.setState({ emailError: true });
      showMessage(errorMessage("Please enter a valid email address"));
      return;
    }
    let isItemChecked =
      this.state.diaryCard ||
      this.state.meditation ||
      this.state.emotion ||
      this.state.sleep ||
      this.state.exercise ||
      this.state.journal ||
      this.state.practiceidea ||
      this.state.actMeasure;
    if (!isItemChecked) {
      showMessage(errorMessage("Select at least one item to share!"));
      return;
    }

    const shareByEmailData = {
      startDate: moment(this.state.startDate).format("YYYY-MM-DD"),
      endDate: moment(this.state.endDate).format("YYYY-MM-DD"),
      email: this.state.email,
      fields: {
        // diaryCard: this.state.diaryCard,
        // meditation: this.state.meditation,
        emotion: this.state.emotion,
        sleep: this.state.sleep,
        exercise: this.state.exercise,
        journal: this.state.journal
        // practiceidea: this.state.practiceidea,
        // actMeasure: this.state.actMeasure
      },
      tz: moment().format("Z")
    };
    this.props.setLoading(true);
    console.log("SHARING VIA EMAIL", shareByEmailData);
    client
      .query({
        query: shareByEmailQuery,
        variables: shareByEmailData,
        fetchPolicy: "no-cache"
      })
      .then(response => {
        console.log("SHARE EMAIL SUCCESS", response.data);
        if (response.data.shareByEmail) {
          showMessage({
            type: "success",
            message: "Success",
            description: "Summery shared to " + this.state.email
          });
          this.resetComponentState();
          setTimeout(() => {
            this.props.setLoading(false);
            this.props.onClose();
          }, 1000);
        } else {
          showMessage(errorMessage("No data to share between selected dates!"));
          this.props.setLoading(false);
        }
      })
      .catch(err => {
        showMessage(
          errorMessage("Error on sharing summary to " + this.state.email)
        );
        console.log(err);
        this.props.setLoading(false);
      });
  };
  isValidEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //    this.state.email = email;
    return re.test(String(email));
  };

  render() {
    const { currentDate } = this.props;
    const { selectMonth, startDate, endDate } = this.state;
    const isYearly = this.props.type === "yearly";
    let date = isYearly
      ? currentDate.format("YYYY")
      : currentDate.format("MMM YYYY");
    let isSmallScreen = screenSize.width < guidelineBaseWidth;
    return (
      <Modal
        ref={this.setRef}
        transparent
        visible={this.props.visible}
        animated
        animationType="slide"
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)"
          }}
        />
        <View style={styles.dialogContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 64 }}
          >
            <View>
              <Title
                onClose={() => {
                  this.props.onClose && this.props.onClose();
                  this.resetComponentState();
                }}
              />
              <View style={{ position: "relative", marginTop: 20 }}>
                {selectMonth ? (
                  <TouchableOpacity
                    onPress={this.showPicker(true)}
                    style={[
                      styles.dialogInput,
                      styles.highlightedDialog,
                      { marginBottom: 0 }
                    ]}
                  >
                    <Text style={styles.dateText}>
                      {this.state.selectedMonth}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}
                  >
                    <TouchableOpacity
                      style={styles.datePickerContainer}
                      onPress={() => this._showDateTimePicker("START")}
                    >
                      <Text style={styles.dateText}>
                        {startDate ? startDate : "Start Date"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.datePickerContainer}
                      onPress={() => this._showDateTimePicker("END")}
                    >
                      <Text style={styles.dateText}>
                        {endDate ? endDate : "End Date"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <View style={{ marginVertical: 10, alignItems: "flex-end" }}>
                <CheckBox
                  style={{ minWidth: "40%" }}
                  onClick={() => {
                    this.toggleSelectMonthCheckbox();
                  }}
                  isChecked={selectMonth}
                  rightText="Select Month"
                  rightTextStyle={styles.checkboxText}
                  checkBoxColor={ThemeStyle.mainColor}
                />
              </View>
              <TextInput
                style={
                  !this.state.emailError
                    ? styles.dialogInput
                    : [styles.dialogInput, styles.highlightedDialogInput]
                }
                placeholder="Enter Email Address"
                placeholderTextColor={ThemeStyle.disabledLight}
                underlineColorAndroid="transparent"
                autoCorrect={false}
                onChangeText={email => {
                  email = email.trim();
                  this.setState({ email });
                }}
                autoCapitalize="none"
                value={this.state.email}
                ref={ref => (this.input = ref)}
                onFocus={() => {
                  this.setState({ emailError: null });
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  marginBottom: 10
                }}
              >
                {/* <CheckBox
                  style={{ width: screenSize.width / 3 }}
                  onClick={() => {
                    this.setState({ diaryCard: !this.state.diaryCard });
                  }}
                  isChecked={this.state.diaryCard}
                  value={this.state.diaryCard}
                  rightText="Diary Card"
                  rightTextStyle={[
                    styles.checkboxText,
                    {
                      color: this.state.diaryCard
                        ? ThemeStyle.mainColor
                        : ThemeStyle.text2
                    }
                  ]}
                  checkBoxColor={ThemeStyle.mainColor}
                />
                <CheckBox
                  style={{ width: screenSize.width / 3 }}
                  onClick={() => {
                    this.setState({ meditation: !this.state.meditation });
                  }}
                  isChecked={this.state.meditation}
                  value={this.state.meditation}
                  rightText="Meditation"
                  rightTextStyle={[
                    styles.checkboxText,
                    {
                      color: this.state.meditation
                        ? ThemeStyle.mainColor
                        : ThemeStyle.text2
                    }
                  ]}
                  checkBoxColor={ThemeStyle.mainColor}
                />
                */}
                <CheckBox
                  style={{ width: screenSize.width / 3 }}
                  onClick={() => {
                    this.setState({ emotion: !this.state.emotion });
                  }}
                  isChecked={this.state.emotion}
                  value={this.state.emotion}
                  rightText="Emotions"
                  rightTextStyle={[
                    styles.checkboxText,
                    {
                      color: this.state.emotion
                        ? ThemeStyle.mainColor
                        : ThemeStyle.text2
                    }
                  ]}
                  checkBoxColor={ThemeStyle.mainColor}
                />
                <CheckBox
                  style={{ width: screenSize.width / 3 }}
                  onClick={() => {
                    this.setState({ sleep: !this.state.sleep });
                  }}
                  isChecked={this.state.sleep}
                  value={this.state.sleep}
                  rightText="Sleep"
                  rightTextStyle={[
                    styles.checkboxText,
                    {
                      color: this.state.sleep
                        ? ThemeStyle.mainColor
                        : ThemeStyle.text2
                    }
                  ]}
                  checkBoxColor={ThemeStyle.mainColor}
                />
                <CheckBox
                  style={{ width: screenSize.width / 3 }}
                  onClick={() => {
                    this.setState({ exercise: !this.state.exercise });
                  }}
                  isChecked={this.state.exercise}
                  value={this.state.exercise}
                  rightText="Exercises"
                  rightTextStyle={[
                    styles.checkboxText,
                    {
                      color: this.state.exercise
                        ? ThemeStyle.mainColor
                        : ThemeStyle.text2
                    }
                  ]}
                  checkBoxColor={ThemeStyle.mainColor}
                />
                {/* <CheckBox
                  style={{ width: screenSize.width / 3 }}
                  onClick={() => {
                    this.setState({ actMeasure: !this.state.actMeasure });
                  }}
                  isChecked={this.state.actMeasure}
                  value={this.state.actMeasure}
                  rightText="ACT Measure"
                  rightTextStyle={styles.checkboxText}
                  checkBoxColor={ThemeStyle.accentColor}
                /> */}
                <CheckBox
                  style={{ width: screenSize.width / 3 }}
                  onClick={() => {
                    this.setState({ journal: !this.state.journal });
                  }}
                  isChecked={this.state.journal}
                  value={this.state.journal}
                  rightText="Journal"
                  rightTextStyle={[
                    styles.checkboxText,
                    {
                      color: this.state.journal
                        ? ThemeStyle.mainColor
                        : ThemeStyle.text2
                    }
                  ]}
                  checkBoxColor={ThemeStyle.mainColor}
                />
                {/* <CheckBox
                  style={{ width: screenSize.width / 3 }}
                  onClick={() => {
                    this.setState({ practiceidea: !this.state.practiceidea });
                  }}
                  isChecked={this.state.practiceidea}
                  value={this.state.practiceidea}
                  rightText="Practice Idea"
                  rightTextStyle={[
                    styles.checkboxText,
                    {
                      color: this.state.practiceidea
                        ? ThemeStyle.mainColor
                        : ThemeStyle.text2
                    }
                  ]}
                  checkBoxColor={ThemeStyle.mainColor}
                />
                */}
              </View>
            </View>
            <View style={{ flexDirection: "row", marginTop: 12 }}>
              <Button
                name="Submit"
                onPress={this.share}
                style={{ flex: 1, backgroundColor: ThemeStyle.green }}
                noGradient
              />
            </View>
            <View>
              <Text style={styles.confidential}>
                DISCLAIMER: Please keep in mind that communications via email
                over the internet are not secure. Although it is unlikely, there
                is a possibility that information you include in an email can be
                intercepted and read by other parties besides the person to whom
                it is addressed. Please do not include personal identifying
                information such as your birth date, or personal medical
                information in any emails you send to us. No one can diagnose
                your condition from email or other written communications, and
                communication via our website cannot replace the relationship
                you have with a physician or another healthcare practitioner.
              </Text>
            </View>
            <DateTimePicker
              mode={this.state.pickerMode}
              isVisible={this.state.isDatePickerVisible}
              onConfirm={this._handleDatePicked}
              onCancel={this._hideDateTimePicker}
              date={
                this.state.pickerType === "START"
                  ? new Date(
                      startDate ||
                        moment()
                          .subtract(1, "weeks")
                          .startOf("isoWeek")
                          .format("MM/DD/YYYY")
                    )
                  : new Date(
                      endDate ||
                        moment()
                          .subtract(1, "weeks")
                          .endOf("isoWeek")
                          .format("MM/DD/YYYY")
                    )
              }
            />
          </ScrollView>
        </View>
        {this.getPicker()}
      </Modal>
    );
  }
}

export const Title = ({ onClose, title = "Share Summary" }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 20
    }}
  >
    <Text style={[TextStyles.Header2]}>{title}</Text>
    <TouchableOpacity onPress={onClose}>
      <Image source={require("../assets/images/redesign/cross.png")} />
    </TouchableOpacity>
  </View>
);

export default Sharing;

const styles = {
  dialogContainer: {
    padding: 24,
    backgroundColor: "#fff",
    height: "70%",
    position: "absolute",
    bottom: 0,
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  dialogInput: {
    borderWidth: 1,
    height: 45,
    borderColor: ThemeStyle.disabledLight,
    paddingHorizontal: 10,
    borderRadius: 4,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: TextStyles.GeneralText.fontFamily
  },
  datePickerContainer: {
    borderWidth: 1,
    height: 45,
    borderColor: ThemeStyle.disabledLight,
    borderRadius: 4,
    paddingHorizontal: 10,
    // paddingVertical: 10,
    justifyContent: "center",
    width: "48%"
  },
  dateText: {
    // paddingVertical: 10,
    fontSize: 14,
    textAlign: "center",
    color: ThemeStyle.mainColor,
    fontFamily: TextStyles.HeaderBold.fontFamily
  },
  highlightedDialogInput: {
    borderColor: "red"
  },
  highlightedDialog: {
    borderWidth: 1,
    borderColor: ThemeStyle.disabledLight,
    color: ThemeStyle.mainColor,
    fontFamily: TextStyles.HeaderBold.fontFamily
  },
  inputIcon: {
    position: "absolute",
    right: 10,
    top: 6
  },
  dialogHeading: {
    color: ThemeStyle.mainColor,
    fontFamily: TextStyles.SubHeaderBold.fontFamily,
    fontSize: 19,
    letterSpacing: 0.5,
    marginBottom: 15
  },
  checkboxText: {
    // fontSize: screenSize.width < guidelineBaseWidth ? 13 : 14,
    ...TextStyles.GeneralTextBold,
    // color: ThemeStyle.mainColor,
    marginLeft: 8,
    position: "relative"
  },
  confidential: {
    textAlign: "justify",
    opacity: 0.8,
    marginTop: 15,
    ...TextStyles.ContentText,
    lineHeight: 16
  },
  wrapper: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    // backgroundColor: 'white',
    zIndex: 2
  },
  modalContainer: {
    position: "relative",
    flex: 1
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1
  }
};
