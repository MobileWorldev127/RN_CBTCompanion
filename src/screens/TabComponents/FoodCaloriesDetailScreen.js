/* eslint-disable quotes */
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import LinearGradient from "react-native-linear-gradient";
import Header from "./../../components/Header";
import Icon from "../../common/icons";
import ThemeStyle from "../../styles/ThemeStyle";
import TextStyles from "./../../common/TextStyles";
import { withSafeAreaActions } from "../../utils/StoreUtils";
import { setMood } from "../../actions/RecordActions";
import { Moods, asyncStorageConstants } from "../../constants";
let moment = require("moment");
import DateTimePicker from "react-native-modal-datetime-picker";
import { Auth } from "aws-amplify";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";
import { isOnline } from "../../utils/NetworkUtils";
import * as Animatable from "react-native-animatable";
import CachedImage from "react-native-image-cache-wrapper";
import Card from "../../components/Card";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Circle } from 'react-native-svg'

const screenWidth = Dimensions.get("window").width;

class FoodCaloriesDetailScreen extends Component {
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
      foodList: [
        {
          name: "3 Eggs",
          detail: "Maritime Pride",
          value: "70 cals - 1 eggs(1.9 oz)",
        },
        {
          name: "3 Eggs",
          detail: "Maritime Pride",
          value: "70 cals - 1 eggs(1.9 oz)",
        },
        {
          name: "3 Eggs",
          detail: "Maritime Pride",
          value: "70 cals - 1 eggs(1.9 oz)",
        }
      ],
    };
    Auth.currentUserInfo().then(info => {
      console.log("user info", info);
      this.setState({
        userName: info && info.attributes && info.attributes.name,
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

  render() {
    console.log("Render home", this.state);
    let { params } = this.props.navigation.state;
    let isBack = params && params.isBack;
    let title = params.title;
    return (
      <View style={ThemeStyle.pageContainer}>
        <LinearGradient
          colors={ThemeStyle.gradientColor}
          start={{
            x: 0.2,
            y: 0,
          }}
          end={{ y: 1.4, x: 0.2 }}
          style={styles.headerView}
        >
          <Header
            title={title}
            isDrawer={!isBack}
            openDrawer={() => {
              this.props.navigation.openDrawer();
            }}
            goBack={() => {
              this.props.navigation.goBack("");
            }}
            navBarStyle={{ backgroundColor: "transparent" }}
            isLightContent
          />
          <Text style={{color: 'white', fontSize: 18, width: '100%', textAlign: 'center'}}>
            {this.state.currentDate.format("dddd, DD MMMM")}
          </Text>
        </LinearGradient>
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', margin: 25,}}>
            <TextInput
              style={[TextStyles.SubHeaderBold, styles.input]}
              onChangeText={username => (this.username = username.trim())}
              defaultValue={this.username}
              placeholder="Enter Email"
              placeholderTextColor="#eee"
              autoCapitalize="none"
              underlineColorAndroid="transparent"
            />
            <Text style={[TextStyles.SubHeaderBold, styles.unitInput]}>Regular Glas(fl.oz)</Text>
          </View>
          <TouchableOpacity style={styles.addBtn}>
            <Text style={{color: 'white', fontSize: 16}}>ADD TO LIST</Text>
          </TouchableOpacity>
          
          <View style={styles.calsView}>
            <Text style={{color: ThemeStyle.accentColor, fontSize: 25}}> 243
              <Text style={{fontSize: 25, color:'black'}}> cals
              </Text>
            </Text>
            <CachedImage
              source={require("../../assets/images/redesign/Calories-icon.png")}
              style={{
                width: 60,
                height: 60
              }}
              resizeMode="contain"
            />
          </View>
          <View style={styles.nutritionView}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>Nutrition Information</Text>
            <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
              <View style={{alignItems: 'center'}}>
                <AnimatedCircularProgress
                  size={100}
                  width={10}
                  fill={95}
                  rotation= {0}
                  tintColor={ThemeStyle.accentColor}
                  padding={10}
                  backgroundColor="#C9CFDF">
                  {
                    (fill) => (
                      <Text style={styles.processTxt}>95%</Text>
                    )
                  }
                </AnimatedCircularProgress>
                <Text>Carbs</Text>
              </View>
              <View style={{alignItems: 'center'}}>
                <AnimatedCircularProgress
                  size={100}
                  width={10}
                  fill={35}
                  rotation= {0}
                  tintColor={ThemeStyle.accentColor}

                  padding={10}
                  backgroundColor="#C9CFDF">
                  {
                    (fill) => (
                      <Text style={styles.processTxt}>35%</Text>
                    )
                  }
                </AnimatedCircularProgress>
                <Text>Protein</Text>
              </View>
              <View style={{alignItems: 'center'}}>
                <AnimatedCircularProgress
                  size={100}
                  width={10}
                  fill={45}
                  rotation= {0}
                  tintColor={ThemeStyle.accentColor}

                  padding={10}
                  backgroundColor="#C9CFDF">
                  {
                    (fill) => (
                      <Text style={styles.processTxt}>45%</Text>
                    )
                  }
                </AnimatedCircularProgress>
                <Text>Fat</Text>
              </View>
            </View>

            <View style={styles.viewLine}/>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={TextStyles.SubHeader2}>Protein</Text>
              <Text style={TextStyles.SubHeader2}>10.6g</Text>
            </View>

            <View style={styles.viewLine}/>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={TextStyles.SubHeader2}>Carbs</Text>
              <Text style={TextStyles.SubHeader2}>0.6g</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10,}}>
              <Text style={TextStyles.GeneralText}>Fiber</Text>
              <Text style={TextStyles.GeneralText}>0.4g</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={TextStyles.GeneralText}>Sugar</Text>
              <Text style={TextStyles.GeneralText}>0.2g</Text>
            </View>

            <View style={styles.viewLine}/>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={TextStyles.SubHeader2}>Fat</Text>
              <Text style={TextStyles.SubHeader2}>0.6g</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10,}}>
              <Text style={TextStyles.GeneralText}>Saturated Fat</Text>
              <Text style={TextStyles.GeneralText}>0.4g</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={TextStyles.GeneralText}>Unsaturated Fat</Text>
              <Text style={TextStyles.GeneralText}>0.2g</Text>
            </View>

            <View style={styles.viewLine}/>
          </View>

        </ScrollView>
      </View>
    );
  }
}

export default withSafeAreaActions(
  FoodCaloriesDetailScreen,
  state => ({
    isEdit: state.record.isEdit,
    editEntry: state.record.editEntry,
  }),
  dispatch => ({
    setMood: (mood, timestamp, isEdit, entryID) =>
      dispatch(setMood(mood, timestamp, isEdit, entryID)),
  })
);

const styles = StyleSheet.create({
  headerView: {
    paddingVertical: 20
  },
  headerMainView: {
    transform: [{ scaleX: 1 / 1.8 }, { scaleY: 1 / 0.8 }],
  },
  calorieCircleView: {
    width: screenWidth / 3,
    height: screenWidth / 3,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: screenWidth / 3,
    borderWidth: 2,
    borderColor: "#3992B6",
    borderRadius: screenWidth / 3,
    backgroundColor: "white",
  },
  calorieCircleTxt: {
    fontSize: 24,
    color: "#3992B6",
    fontWeight: "bold",
  },
  nutritionixTabView: {
    width: screenWidth / 3,
    height: 100,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center"
  },
  mainContainerView: {
    flex: 1,
    padding: 15,
    marginTop: -30,
  },
  dateView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 10,
  },
  searchView: {
    flexDirection: "row",
    backgroundColor: "white",
    width: "90%",
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    padding: 10,
    paddingLeft: 20
  },
  inputBox: {
    width: "90%",
    height: 100,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    paddingTop: 24,
    paddingHorizontal: 20,
    margin: 16,
    fontSize: 16,
    textAlignVertical: "top",
    color: "#000",
    borderRadius: 15,
    backgroundColor: "#fff",
  },
  addView: {
    width: "88%",
    height: 50,
    borderRadius: 5,
    backgroundColor: ThemeStyle.lessonColor,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
  },
  addBtn: {
    marginHorizontal: 25,
    marginBottom: 20,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ThemeStyle.lessonColor,
    borderRadius: 12
  },
  tableView: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 25,
  },
  calsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 25,
    height: 60,
    marginVertical: 15
  },
  nutritionView: {
    marginHorizontal: 25,
    paddingBottom: 10,
    // backgroundColor: 'yellow'
  },
  processTxt: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  viewLine: {
    width: screenWidth,
    marginLeft: -25,
    height: 1,
    backgroundColor: ThemeStyle.disabled,
    marginVertical: 20
  },
  input: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: 'gray',
    fontSize: 18,
    alignSelf: "stretch",
    // paddingLeft: 12,
    borderRadius: 5,
    textAlign: 'center',
  },
  unitInput: {
    flex: 0.95,
    borderWidth: 1,
    borderColor: 'gray',
    fontSize: 18,
    alignSelf: "stretch",
    borderRadius: 5,
    padding: 12
  }
});
