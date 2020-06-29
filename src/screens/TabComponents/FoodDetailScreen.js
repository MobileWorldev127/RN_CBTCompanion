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
import { getFoodEntries, deleteFoodEntries } from "../../actions/NutritionixActions"
import { setTopSafeAreaView } from "../../actions/AppActions";

const screenWidth = Dimensions.get("window").width;

class FoodDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.moods = Moods;
    this.currentMood = props.isEdit
      ? this.moods[5 - props.editEntry.mood]
      : this.moods[0];
    this.state = {
      isDatePickerVisible: false,
      currentDate: props.navigation.state.params.date ? props.navigation.state.params.date : moment(),
      foodList: [],

      sum_cals: 0,
      sum_protein: 0,
      sum_carbs: 0,
      sum_fiber: 0,
      sum_sugar: 0,
      sum_fat: 0,
      sum_saturated_fat: 0,
      sum_sodium: 0,
      sum_potassium: 0,
      sum_cholesterol: 0
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
    let date = this.state.currentDate.format("YYYY-MM-DD");
    this.getFoodEntries(date);
  }

  componentWillUnmount() {
    this.props.setTopSafeAreaView(ThemeStyle.backgroundColor);
  }

  getFoodEntries(val) {
    let { params } = this.props.navigation.state;
    let title = params.title;
    var sum_cals = 0;
    var sum_protein = 0;
    var sum_carbs = 0;
    var sum_fiber = 0;
    var sum_sugar = 0;
    var sum_fat = 0;
    var sum_saturated_fat = 0;
    var sum_sodium = 0;
    var sum_potassium = 0;
    var sum_cholesterol = 0;
    let date = {
      endDate: val,
      startDate: val
    }
    this.props.getFoodEntries(date, fetchListData => {
      var arr = [];
      fetchListData.map((item, index) => {
        if (item.meal == title) {
          arr.push(item);
          sum_cals += JSON.parse(item.details[0].macroNutrients).calories;
          sum_protein += JSON.parse(item.details[0].macroNutrients).protein;
          sum_carbs += JSON.parse(item.details[0].macroNutrients).total_carbohydrate;
          sum_fiber += JSON.parse(item.details[0].macroNutrients).dietary_fiber;
          sum_sugar += JSON.parse(item.details[0].macroNutrients).sugars;
          sum_fat += JSON.parse(item.details[0].macroNutrients).total_fat;
          sum_saturated_fat += JSON.parse(item.details[0].macroNutrients).saturated_fat;
          sum_sodium += JSON.parse(item.details[0].macroNutrients).sodium;
          sum_potassium += JSON.parse(item.details[0].macroNutrients).potassium;
          sum_cholesterol += JSON.parse(item.details[0].macroNutrients).cholesterol;
        }
      });
      this.setState({
        foodList: arr,
        sum_cals: sum_cals,
        sum_protein: sum_protein,
        sum_carbs: sum_carbs,
        sum_fiber: sum_fiber,
        sum_sugar: sum_sugar,
        sum_fat: sum_fat,
        sum_saturated_fat: sum_saturated_fat,
        sum_sodium: sum_sodium,
        sum_potassium: sum_potassium,
        sum_cholesterol: sum_cholesterol
      });
    });
  }

  onClickAddMoreFood = () => {
    let { params } = this.props.navigation.state;
    let title = params.title;
    this.props.navigation.navigate('FoodAdd', {
      isBack: true,
      title: title,
      dateTime: this.state.currentDate,
      alreadyAddedFoodList: this.state.foodList,
      onGoBack: this.onSelect
    });
  }

  onSelect = () => {
    var date = this.state.currentDate.format("YYYY-MM-DD");
    this.getFoodEntries(date);
  }

  deleteFood = id => {
    this.props.deleteFoodEntries(id, fetchData => {
      let { params } = this.props.navigation.state;
      let date = params.date.format("YYYY-MM-DD");
      this.getFoodEntries(date);
    })
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
              this.props.navigation.state.params.onGoBack();
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
          <TouchableOpacity style={styles.addBtn} onPress = {() => this.onClickAddMoreFood()}>
            <Text style={{color: 'white', fontSize: 16}}>ADD MORE FOOD</Text>
          </TouchableOpacity>
          <View style={styles.tableView}>
            {this.state.foodList.map((item, index) => {
              return (
                <TouchableOpacity>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: 15,
                      borderBottomWidth: 1,
                      borderColor: index == this.state.foodList.length-1 ? 'transparent' : ThemeStyle.disabledLight
                    }}
                  >
                  
                    <View
                      style={{
                        padding: 5,
                        flex: 1
                      }}
                    >
                      <Text style={TextStyles.Header2}>
                        {item.details[0].name}
                      </Text>
                      <Text style={TextStyles.GeneralText}>
                        {JSON.parse(item.details[0].macroNutrients).calories} cals - {item.details[0].qty} {item.details[0].unit}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => this.deleteFood(item._id)}>
                        <Icon
                          family={"MaterialCommunityIcons"}
                          name={"delete"}
                          color="red"
                          size={25}
                        />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.calsView}>
            <Text style={{color: '#f7992a', fontSize: 25}}> {this.state.sum_cals}
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
                      <Text style={styles.processTxt}>{Math.round(this.state.sum_carbs)}g</Text>
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
                      <Text style={styles.processTxt}>{Math.round(this.state.sum_protein)}g</Text>
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
                      <Text style={styles.processTxt}>{Math.round(this.state.sum_fat)}g</Text>
                    )
                  }
                </AnimatedCircularProgress>
                <Text>Fat</Text>
              </View>
            </View>

            <View style={styles.viewLine}/>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={TextStyles.SubHeader2}>Protein</Text>
              <Text style={TextStyles.SubHeader2}>{Math.round(this.state.sum_protein)}g</Text>
            </View>

            <View style={styles.viewLine}/>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={TextStyles.SubHeader2}>Carbs</Text>
              <Text style={TextStyles.SubHeader2}>{Math.round(this.state.sum_carbs)}g</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10,}}>
              <Text style={TextStyles.GeneralText}>Fiber</Text>
              <Text style={TextStyles.GeneralText}>{Math.round(this.state.sum_fiber)}g</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={TextStyles.GeneralText}>Sugar</Text>
              <Text style={TextStyles.GeneralText}>{Math.round(this.state.sum_sugar)}g</Text>
            </View>

            <View style={styles.viewLine}/>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={TextStyles.SubHeader2}>Fat</Text>
              <Text style={TextStyles.SubHeader2}>{Math.round(this.state.sum_fat)}g</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10,}}>
              <Text style={TextStyles.GeneralText}>Saturated Fat</Text>
              <Text style={TextStyles.GeneralText}>{Math.round(this.state.sum_saturated_fat)}g</Text>
            </View>
            
            <View style={styles.viewLine}/>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={TextStyles.SubHeader2}>Others</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10,}}>
              <Text style={TextStyles.GeneralText}>Sodium</Text>
              <Text style={TextStyles.GeneralText}>{Math.round(this.state.sum_sodium)}g</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
              <Text style={TextStyles.GeneralText}>Potassium</Text>
              <Text style={TextStyles.GeneralText}>{Math.round(this.state.sum_potassium)}g</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={TextStyles.GeneralText}>Cholesterol</Text>
              <Text style={TextStyles.GeneralText}>{Math.round(this.state.sum_cholesterol)}g</Text>
            </View>

            <View style={styles.viewLine}/>
          </View>

        </ScrollView>
      </View>
    );
  }
}

export default withSafeAreaActions(
  FoodDetailScreen,
  state => ({
    isEdit: state.record.isEdit,
    editEntry: state.record.editEntry,
  }),
  dispatch => ({
    setTopSafeAreaView: color => dispatch(setTopSafeAreaView(color)),
    setMood: (mood, timestamp, isEdit, entryID) =>
      dispatch(setMood(mood, timestamp, isEdit, entryID)),
    getFoodEntries: (date, fetchListData) =>
      dispatch(getFoodEntries(date, fetchListData)),
    deleteFoodEntries: (entryId, fetchData) =>
      dispatch(deleteFoodEntries(entryId, fetchData)),
      getNutritionixFoodItem: (itemId, data) =>
      dispatch(getNutritionixFoodItem(itemId, data)),
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
    margin: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ThemeStyle.accentColor,
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
  }
});
