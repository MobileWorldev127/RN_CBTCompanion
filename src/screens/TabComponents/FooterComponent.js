import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Image
} from "react-native";
import DeviceUiInfo from "../../utils/DeviceUIInfo";
import ThemeStyle from "../../styles/ThemeStyle";
import TextStyles from "../../common/TextStyles";
import { tabRoutes } from "./routes";
import { setModeAndData } from "../../actions/RecordActions";
import { withStore } from "../../utils/StoreUtils";

const { screenSize, guidelineBaseWidth, platform } = DeviceUiInfo;
const isWidthLessThanGuideline = screenSize.width < guidelineBaseWidth;
const platformIOS = platform === "ios";
const buttonFontSize = platformIOS ? (isWidthLessThanGuideline ? 12 : 13) : 13;
const buttonWidth = platformIOS
  ? isWidthLessThanGuideline
    ? "19.75%"
    : "19.5%"
  : "19.5%";

class FooterContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRoute: tabRoutes.HomeScreen.name
    };
  }
  navigate = url => {};
  // getColor = index => {
  //   const inactive = "white";
  //   // const active = theme.primaryColor;
  //   const active = "white";
  //   return this.isActive(index)?active:inactive;
  // }
  isActive = name => {
    return this.state.currentRoute === name;
  };

  activeOpacity = name => {
    return this.isActive(name) ? 1 : 0.7;
  };

  navigateTo = (name, params) => {
    // if (this.props.mode == "edit") {
    //   this.props.setModeAndData("add", {});
    // }
    const { onChangeSelectedTab } = this.props;
    console.log("NAVIGATION", this.state.currentRoute, name, params);
    if (this.state.currentRoute !== name) {
      onChangeSelectedTab(name);
      this.setState({
        currentRoute: name
      });
    }
  };

  render() {
    const isWidthLessThanGuideline = screenSize.width < guidelineBaseWidth;
    const platformIOS = platform === "ios";
    const centerButtonWidth = platformIOS
      ? isWidthLessThanGuideline
        ? "21%"
        : "22%"
      : "22%";
    const { mode: EntryMode } = this.props;
    return (
      <React.Fragment>
        <View
          style={[
            { backgroundColor: "white" },
            ThemeStyle.shadow({ shadowOffset: { height: -12 } })
          ]}
        >
          <SafeAreaView style={styles.footer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.navigateTo(tabRoutes.HomeScreen.name);
              }}
            >
              <Image
                source={require("../../assets/images/redesign/Entries-tabbar.png")}
                style={{
                  tintColor: this.isActive(tabRoutes.HomeScreen.name)
                    ? ThemeStyle.accentColor
                    : ThemeStyle.disabled,
                  width: 24,
                  height: 24
                }}
                resizeMode="contain"
              />
              <Text
                style={[
                  TextStyles.FooterTextBold,
                  {
                    color: this.isActive(tabRoutes.HomeScreen.name)
                      ? ThemeStyle.accentColor
                      : ThemeStyle.disabled,
                    marginTop: 8
                  }
                ]}
              >
                Entries
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                this.navigateTo(tabRoutes.Exercise.name, {
                  isRecordExercise: true
                })
              }
            >
              <Image
                source={require("../../assets/images/redesign/Exercise-tabbar.png")}
                style={{
                  tintColor: this.isActive(tabRoutes.Exercise.name)
                    ? ThemeStyle.accentColor
                    : ThemeStyle.disabled,
                  height: 24,
                  width: 30
                }}
                resizeMode="contain"
              />
              <Text
                style={[
                  TextStyles.FooterTextBold,
                  {
                    color: this.isActive(tabRoutes.Exercise.name)
                      ? ThemeStyle.accentColor
                      : ThemeStyle.disabled,
                    marginTop: 8
                  }
                ]}
              >
                Exercises
              </Text>
            </TouchableOpacity>

            <View style={[{ width: centerButtonWidth }]}>
              <TouchableOpacity
                style={[
                  styles.addTaskButton,
                  {
                    overflow: "hidden",
                    borderRadius: 30,
                    paddingHorizontal: 5,
                    alignItems: "center",
                    justifyContent: "center"
                  }
                ]}
                onPress={() => this.navigateTo(tabRoutes.Record.name)}
                disabled={EntryMode === "edit"}
              >
                <Image
                  source={require("../../assets/images/redesign/Plus-tabbar.png")}
                  style={{ width: 104 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            {/*<TouchableOpacity style={styles.button} onPress={() => this.navigateTo("Meditation")}>
            <Icon name="ios-person-outline" size={25} color={theme.primaryColor} style={{opacity: this.activeOpacity(3)}}/>
            <Text style={[styles.buttonText, this.isActive(3)?styles.buttonActive:null]}>Meditation</Text>
          </TouchableOpacity>*/}
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.navigateTo(tabRoutes.Lessons.name)}
            >
              <Image
                source={require("../../assets/images/redesign/Lessons.png")}
                style={{
                  tintColor: this.isActive(tabRoutes.Lessons.name)
                    ? ThemeStyle.accentColor
                    : ThemeStyle.disabled,
                  width: 24,
                  height: 24
                }}
                resizeMode="contain"
              />
              <Text
                style={[
                  TextStyles.FooterTextBold,
                  {
                    color: this.isActive(tabRoutes.Lessons.name)
                      ? ThemeStyle.accentColor
                      : ThemeStyle.disabled,
                    marginTop: 8
                  }
                ]}
              >
                Lessons
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.navigateTo(tabRoutes.More.name)}
            >
              <Image
                source={require("../../assets/images/redesign/More-tabbar.png")}
                style={{
                  tintColor: this.isActive(tabRoutes.More.name)
                    ? ThemeStyle.accentColor
                    : ThemeStyle.disabled,
                  width: 24,
                  height: 24
                }}
                resizeMode="contain"
              />
              <Text
                style={[
                  TextStyles.FooterTextBold,
                  {
                    color: this.isActive(tabRoutes.More.name)
                      ? ThemeStyle.accentColor
                      : ThemeStyle.disabled,
                    marginTop: 8
                  }
                ]}
              >
                More
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setModeAndData: (mode, data) => {
    dispatch(setModeAndData(mode, data));
  }
});

export default withStore(FooterContent, undefined, mapDispatchToProps);

const styles = StyleSheet.create({
  footer: {
    // backgroundColor: theme.revPrimaryColor,
    // height: 95,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around"
  },
  button: {
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center",
    width: buttonWidth
  },
  buttonText: {
    // color: "#A3A3A3",
    color: ThemeStyle.mainColor,
    opacity: 0.7,
    fontSize: buttonFontSize,
    // fontWeight: 'bold',
    width: "100%",
    textAlign: "center",
    fontFamily: TextStyles.GeneralText.fontFamily
  },
  buttonActive: {
    opacity: 1,
    color: ThemeStyle.mainColor
  },

  addTaskButton: {
    position: "absolute",
    top: -42,
    left: "35%",
    transform: [{ translateX: -42 }]
    // elevation: 2,
  },
  addTaskButtonAndroid: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: [{ translateX: -42 }],
    elevation: 2
  }
});
