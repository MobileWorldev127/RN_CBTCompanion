import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Animated,
  TouchableOpacity,
  Image
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import LinearGradient from "react-native-linear-gradient";
import Header from "./../../components/Header";
import Icon from "../../common/icons";
import ThemeStyle from "../../styles/ThemeStyle";
import Coverflow from "react-native-coverflow";
import TextStyles from "./../../common/TextStyles";
import { Transition } from "react-navigation-fluid-transitions";
import { withStore, withSafeAreaActions } from "../../utils/StoreUtils";
import { setMood } from "../../actions/RecordActions";
import { Moods, moodImages, asyncStorageConstants } from "../../constants";
let moment = require("moment");
import DateTimePicker from "react-native-modal-datetime-picker";
import { Auth } from "aws-amplify";
import CircularSlider from "../../components/CircularSliderGradient";
import CustomButton from "../../components/Button";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";
import { showMessage } from "react-native-flash-message";
import { errorMessage } from "../../utils";
import { isOnline } from "../../utils/NetworkUtils";
import * as Animatable from "react-native-animatable";

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.moods = Moods;
    this.currentMood = props.isEdit
      ? this.moods[5 - props.editEntry.mood]
      : this.moods[0];
    console.log("HOME SCREEN MOUNT", props);
    this.state = {
      isDatePickerVisible: false,
      currentDate: props.isEdit ? moment(props.editEntry.dateTime) : moment(),
      mood: props.isEdit
        ? this.moods[5 - props.editEntry.mood].name
        : this.moods[0].name,
      circleValue: 0,
      moodImage: props.isEdit
        ? moodImages[6 - props.editEntry.mood]
        : moodImages[1],
      moodIndex: props.isEdit ? 5 - props.editEntry.mood : 0
    };
    Auth.currentUserInfo().then(info => {
      console.log("user info", info);
      this.setState({
        userName: info && info.attributes && info.attributes.name
      });
    });
  }

  async componentDidMount() {
    this.props.setTopSafeAreaView(ThemeStyle.gradientStart);
    recordScreenEvent(screenNames.record);
    if (!isOnline()) {
      userInfo = JSON.parse(
        await AsyncStorage.getItem(asyncStorageConstants.userInfo)
      );
      if (userInfo && userInfo.attributes) {
        this.setState({
          userName: userInfo.attributes.name
        });
      }
    }
  }

  componentWillUnmount() {
    this.props.setTopSafeAreaView(ThemeStyle.backgroundColor);
  }

  componentWillReceiveProps(nextProps, nextState) {
    console.log("NEXT PROPS", nextProps);
    this.setState(
      {
        isDatePickerVisible: false,
        currentDate: nextProps.isEdit
          ? moment(nextProps.editEntry.dateTime)
          : moment(),
        mood: nextProps.isEdit
          ? this.moods[5 - nextProps.editEntry.mood].name
          : this.moods[0].name,
        circleValue: 0,
        moodImage: nextProps.isEdit
          ? moodImages[6 - nextProps.editEntry.mood]
          : moodImages[1],
        moodIndex: nextProps.isEdit ? 5 - nextProps.editEntry.mood : 0
      },
      () => this.circularSlider.handleChangeEvent(this.getValueForSlider())
    );
  }

  getValueForSlider = () => {
    let angle = 0;
    switch (this.state.moodIndex) {
      case 0:
        angle = 36;
        break;
      case 1:
        angle = 108;
        break;
      case 2:
        angle = 180;
        break;
      case 3:
        angle = 252;
        break;
      case 4:
        angle = 324;
        break;
    }
    return angle;
  };

  selectMood = mood => {
    let currentDate = this.props.isEdit
      ? moment(this.props.editEntry.dateTime)
      : this.state.currentDate;
    console.log("SETTING MOOD", {
      mood,
      date: currentDate.toISOString(),
      isEdit: this.isEdit,
      id: this.entryID
    });
    this.props.setMood(
      mood,
      currentDate.toISOString(),
      this.isEdit,
      this.entryID
    );
    this.props.setTopSafeAreaView(ThemeStyle.backgroundColor);
    this.props.navigation.navigate("Emotions", {
      mood: mood
    });
  };

  onCircleMove(value, moodname, index) {
    // console.log("onCircleMove", value);
    // console.log("onCircleMove1", moodname);

    var oldValue = this.state.moodIndex;
    if (oldValue != index - 1) {
      this.setState({
        circleValue: value,
        mood: moodname,
        moodImage: moodImages[index],
        moodIndex: index - 1
      });
    }
  }

  render() {
    console.log("Render home", this.state);
    let { params } = this.props.navigation.state;
    let isBack = params && params.isBack;
    return (
      <View style={ThemeStyle.pageContainer}>
        <LinearGradient
          colors={ThemeStyle.gradientColor}
          start={{
            x: 0.2,
            y: 0
          }}
          end={{ y: 1.4, x: 0.2 }}
          style={{ borderBottomLeftRadius: 70, borderBottomRightRadius: 20 }}
        >
          <Header
            title={"Mood"}
            isDrawer={!isBack}
            openDrawer={() => {
              this.props.navigation.openDrawer();
            }}
            goBack={() => {
              this.props.navigation.goBack("");
            }}
            navBarStyle={{ backgroundColor: "transparent" }}
            isLightContent
            // rightIcon={() => (
            //   <TouchableOpacity
            //     style={{ position: "relative", top: 1 }}
            //     onPress={() => this.props.navigation.navigate("skillsList")}
            //   >
            //     <Icon name="md-bulb" size={25} color={ThemeStyle.accentColor} />
            //   </TouchableOpacity>
            // )}
          />
          <Animatable.View animation="fadeInDown">
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                marginHorizontal: 24,
                marginVertical: 12,
                fontFamily: TextStyles.HeaderBold.fontFamily
              }}
            >
              {`Hi, ${
                this.state.userName ? this.state.userName : ""
              }\nHow are you?`}
            </Text>
            <TouchableOpacity
              onPress={() => {
                console.log("select date");
                if (!this.props.isEdit) {
                  this.setState({
                    isDatePickerVisible: true
                  });
                } else {
                  showMessage(
                    errorMessage("You cannot edit the time of this entry")
                  );
                }
              }}
              style={{
                flexDirection: "row",
                marginBottom: 16,
                marginTop: 12,
                paddingVertical: 8,
                marginHorizontal: 32,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "#fff",
                borderRadius: 24
              }}
            >
              <Icon
                name="md-calendar"
                size={22}
                color="#fff"
                style={styles.pickerIcon}
              />
              <Text
                style={[styles.pickerText, { color: "#fff", fontSize: 12 }]}
              >
                {this.state.currentDate.format("dddd, DD MMMM")}
              </Text>
              <View
                style={{
                  width: 1,
                  backgroundColor: "#fff",
                  height: "80%",
                  marginHorizontal: 8
                }}
              />
              <Text
                style={[styles.pickerText, { color: "#fff", fontSize: 12 }]}
              >
                {this.state.currentDate.format("hh:mm A")}
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        </LinearGradient>
        <View style={styles.moodCircleContainer}>
          <View
            style={{
              flex: 1,
              position: "absolute",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Image
              source={this.state.moodImage}
              style={{ width: 100, height: 100 }}
            />
          </View>

          <CircularSlider
            ref={ref => {
              this.circularSlider = ref;
            }}
            value={this.getValueForSlider()}
            dialWidth={20}
            dialRadius={100}
            meterColor={ThemeStyle.mainColor}
            bgColor="red"
            backgroundColor={ThemeStyle.pageContainer.backgroundColor}
            textColor="transparent"
            onValueChange={(value, moodname, index) =>
              this.onCircleMove(value, moodname, index)
            }
          />

          {/* <CircularSlider /> */}
        </View>
        <Text
          style={{
            fontSize: 24,
            fontFamily: TextStyles.SubHeaderBold.fontFamily,
            paddingBottom: 120,
            textAlign: "center",
            alignSelf: "center"
          }}
        >
          {this.state.mood}
        </Text>
        {/* </PanGestureHandler> */}
        <CustomButton
          style={{
            position: "absolute",
            bottom: 0,
            right: 24,
            marginBottom: 24,
            alignSelf: "flex-end"
          }}
          name={"Next"}
          onPress={() => this.selectMood(Moods[this.state.moodIndex])}
        />

        <DateTimePicker
          isVisible={this.state.isDatePickerVisible}
          date={new Date(this.state.currentDate.toISOString())}
          mode="datetime"
          onCancel={() => {
            this.setState({
              isDatePickerVisible: false
            });
          }}
          onConfirm={date => {
            console.log(date);
            this.setState({
              isDatePickerVisible: false,
              currentDate: moment(date)
            });
          }}
          maximumDate={new Date()}
        />
      </View>
    );
  }
}

export default withSafeAreaActions(
  HomeScreen,
  state => ({
    isEdit: state.record.isEdit,
    editEntry: state.record.editEntry
  }),
  dispatch => ({
    setMood: (mood, timestamp, isEdit, entryID) =>
      dispatch(setMood(mood, timestamp, isEdit, entryID))
  })
);

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: "#fff",
    height: Platform.OS === "ios" ? 64 : 54,
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderColor: "lightgrey"
  },
  listContainer: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginVertical: 5,
    backgroundColor: "#BDBDBD"
  },
  imageContainer: {
    alignItems: "center",
    padding: 10
  },
  imageStyle: {
    width: 180,
    height: 180,
    resizeMode: "contain"
  },
  textStyle: {
    fontSize: 24,
    color: "#333",
    paddingVertical: 16,
    fontFamily: "AirbnbCerealApp-Medium"
  },
  moodCircleContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
    // padding: 15,
  },
  picker: {
    marginTop: 10,
    marginBottom: 50,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center"
  },
  pickerText: {
    color: ThemeStyle.mainColor,
    fontFamily: TextStyles.SubHeaderBold.fontFamily,
    fontSize: 15,
    marginHorizontal: 10,
    marginTop: 0
  },
  pickerIcon: {
    marginLeft: 10
  }
});
