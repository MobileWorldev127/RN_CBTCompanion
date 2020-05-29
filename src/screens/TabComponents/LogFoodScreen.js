/* eslint-disable quotes */
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
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
import { getFoodEntries } from "../../actions/NutritionixActions"

const screenWidth = Dimensions.get("window").width;

class LogFoodScreen extends Component {
  constructor(props) {
    super(props);
    this.moods = Moods;
    this.currentMood = props.isEdit
      ? this.moods[5 - props.editEntry.mood]
      : this.moods[0];
    console.log("HOME SCREEN MOUNT", props);
    this.state = {
      isDatePickerVisible: false,
      currentDate: moment(),
      items: [
        {
          title: "Breakfast",
          image: require("../../assets/images/redesign/Breakfast-icon.png")
        },
        {
          title: "Lunch",
          image: require("../../assets/images/redesign/Lunch-icon.png")
        },
        {
          title: "Dinner",
          image: require("../../assets/images/redesign/DInner-icon.png")
        },
        {
          title: "Snack",
          image: require("../../assets/images/redesign/DInner-icon.png")
        }
      ],
      sum_total_cals: 0,
      sum_carbs: 0,
      sum_protein: 0,
      sum_fat: 0,
      sum_snack: 0,
      cals_breakfast: null,
      cals_lunch: null,
      cals_dinner: null,
      cals_snack: null,
      food_breakfast_list: [],
      food_lunch_list: [],
      food_dinner_list: [],
      food_snack_list: [],
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
    var date = this.state.currentDate.format("YYYY-MM-DD");
    this.getFoodList(date);
  }

  componentWillUnmount() {
    this.props.setTopSafeAreaView(ThemeStyle.backgroundColor);
  }

  onPressFoodDetail = title => {
    this.props.navigation.navigate("FoodDetail", {
      isBack: true,
      title: title,
      date: this.state.currentDate,
      onGoBack: this.onSelect
    });
  };

  onPressAddFood = title => {
    this.props.navigation.navigate("FoodAdd", {
      isBack: true,
      title: title,
      dateTime: this.state.currentDate,
      alreadyAddedFoodList: [],
      onGoBack: this.onSelect
    });
  }

  onSelect = () => {
    var date = this.state.currentDate.format("YYYY-MM-DD");
    this.getFoodList(date);
  }

  showFoodCaloriesList = meal => {
    switch (meal) {
      case "Breakfast":
        return <Text>{this.state.cals_breakfast}</Text>;
      case "Lunch":
        return <Text>{this.state.cals_lunch}</Text>;
      case "Dinner":
        return <Text>{this.state.cals_dinner}</Text>;
      case "Snack":
        return <Text>{this.state.cals_snack}</Text>;
    }
  }

  showFoodNamesList = meal => {
    switch (meal) {
      case "Breakfast":
        return this.state.food_breakfast_list.map((item1, index) => {
          if (index < 3) {
            return <Text>{item1.details[0].name}</Text>;
          }
        });
      case "Lunch":
        return this.state.food_lunch_list.map((item1, index) => {
          if (index < 3) {
            return <Text>{item1.details[0].name}</Text>;
          }
        });
      case "Dinner":
        return this.state.food_dinner_list.map((item1, index) => {
          if (index < 3) {
            return <Text>{item1.details[0].name}</Text>;
          }
        });
      case "Snack":
        return this.state.food_snack_list.map((item1, index) => {
          if (index < 3) {
            return <Text>{item1.details[0].name}</Text>;
          }
        });
    }
  }

  onClickBeforeDay = () => {
    var prev_date = new Date(this.state.currentDate - 864e5);
    this.setState({
      currentDate: moment(prev_date)
    });
    this.getFoodList(moment(prev_date).format("YYYY-MM-DD"));
  }

  onClickAfterDay = () => {
    var after_date = new Date(this.state.currentDate + 864e5);
    this.setState({
      currentDate: moment(after_date)
    });
    this.getFoodList(moment(after_date).format("YYYY-MM-DD"));
  }

  getFoodList(date) {
    this.props.getFoodEntries(date, fetchListData => {
      var sum_total_cals = 0;
      var sum_protein = 0;
      var sum_carbs = 0;
      var sum_fat = 0;
      var cals_breakfast = 0;
      var cals_lunch = 0;
      var cals_dinner = 0;
      var cals_snack = 0;
      var food_breakfast_list = [];
      var food_lunch_list = [];
      var food_dinner_list = [];
      var food_snack_list = [];

        fetchListData.map(item => {
        sum_total_cals += JSON.parse(item.details[0].macroNutrients).calories;
        sum_protein += JSON.parse(item.details[0].macroNutrients).protein;
        sum_carbs += JSON.parse(item.details[0].macroNutrients)
          .total_carbohydrate;
        sum_fat += JSON.parse(item.details[0].macroNutrients).total_fat;
        if (item.meal === "Breakfast") {
          cals_breakfast += JSON.parse(item.details[0].macroNutrients).calories;
          food_breakfast_list.push(item);
        }
        if (item.meal === "Lunch") {
          cals_lunch += JSON.parse(item.details[0].macroNutrients).calories;
          food_lunch_list.push(item);
        }
        if (item.meal === "Dinner") {
          cals_dinner += JSON.parse(item.details[0].macroNutrients).calories;
          food_dinner_list.push(item);
        }
        if (item.meal === "Snack") {
          cals_snack += JSON.parse(item.details[0].macroNutrients).calories;
          food_snack_list.push(item);
        }
      });
      this.setState({
        sum_total_cals: sum_total_cals,
        sum_protein: sum_protein,
        sum_carbs: sum_carbs,
        sum_fat: sum_fat,
        cals_breakfast: cals_breakfast + ' cals',
        cals_lunch: cals_lunch + ' cals',
        cals_dinner: cals_dinner + ' cals',
        cals_snack: cals_snack + ' cals',
        food_breakfast_list: food_breakfast_list,
        food_lunch_list: food_lunch_list,
        food_dinner_list: food_dinner_list,
        food_snack_list: food_snack_list
      });
    });
  }

  render() {
    console.log("Render home", this.state);
    let { params } = this.props.navigation.state;
    let isBack = params && params.isBack;
    return (
      <View style={[ThemeStyle.pageContainer, { overflow: "hidden" }]}>
        <LinearGradient
          colors={ThemeStyle.gradientColor}
          start={{
            x: 0.2,
            y: 0,
          }}
          end={{ y: 1.4, x: 0.2 }}
          style={styles.headerView}
        >
          <View style={styles.headerMainView}>
            <Header
              title={"LOG FOOD"}
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
            <Animatable.View animation="fadeInDown">
              <View style={styles.calorieCircleView}>
                <Text style={styles.calorieCircleTxt}>
                  {this.state.sum_total_cals}
                </Text>
                <Text>Calories</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.nutritionixTabView}>
                  <Text style={{ color: "white" }}>CARBS</Text>
                  <View
                    style={{
                      width: screenWidth / 5,
                      height: 5,
                      backgroundColor: "#ccc",
                      marginVertical: 5
                    }}
                  >
                    <View
                      style={{
                        width: screenWidth / 7,
                        height: 5,
                        backgroundColor: "white"
                      }}
                    />
                  </View>
                  <Text style={{ color: "white" }}>
                    {this.state.sum_carbs}g
                  </Text>
                </View>
                <View style={styles.nutritionixTabView}>
                  <Text style={{ color: "white" }}>PROTEIN</Text>
                  <View
                    style={{
                      width: screenWidth / 5,
                      height: 5,
                      backgroundColor: "#ccc",
                      marginVertical: 5
                    }}
                  >
                    <View
                      style={{
                        width: screenWidth / 7,
                        height: 5,
                        backgroundColor: "white"
                      }}
                    />
                  </View>
                  <Text style={{ color: "white" }}>
                    {this.state.sum_protein}g
                  </Text>
                </View>
                <View style={styles.nutritionixTabView}>
                  <Text style={{ color: "white" }}>FAT</Text>
                  <View
                    style={{
                      width: screenWidth / 5,
                      height: 5,
                      backgroundColor: "#ccc",
                      marginVertical: 5
                    }}
                  >
                    <View
                      style={{
                        width: screenWidth / 7,
                        height: 5,
                        backgroundColor: "white"
                      }}
                    />
                  </View>
                  <Text style={{ color: "white" }}>{this.state.sum_fat}g</Text>
                </View>
              </View>
            </Animatable.View>
          </View>
        </LinearGradient>
        <View style={styles.mainContainerView}>
          <View style={styles.dateView}>
            <TouchableOpacity onPress={this.onClickBeforeDay}>
              <Icon
                name="ios-arrow-back"
                size={22}
                color="black"
                style={styles.pickerIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onClickDay}>
              <Text style={TextStyles.Header2}>
                {this.state.currentDate.format("dddd, DD MMMM")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onClickAfterDay}>
              <Icon
                name="ios-arrow-forward"
                size={22}
                color="black"
                style={styles.pickerIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            {this.state.items.map((item, index) => {
              return (
                <Animatable.View
                  animation="pulse"
                  delay={index * 200}
                  style={{
                    flex: 1,
                    maxHeight: 140,
                    overflow: "hidden"
                  }}
                >
                  <Card style={{ margin: 5 }}>
                    <TouchableOpacity
                      onPress={() => this.onPressFoodDetail(item.title)}
                      underlayColor={item.color + "aa"}
                      style={{
                        backgroundColor: item.color,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingHorizontal: 20,
                          paddingVertical: 15,
                        }}
                      >
                        <CachedImage
                          source={item.image}
                          style={{
                            width: 60,
                            height: 60
                          }}
                          resizeMode="contain"
                        />
                        <View
                          style={{
                            paddingHorizontal: 15,
                            flex: 1,
                          }}
                        >
                          <Text
                            style={[
                              TextStyles.Header2,
                              {
                                color: item.color
                              }
                            ]}
                          >
                            {item.title}
                          </Text>
                          {this.showFoodCaloriesList(item.title)}
                          {this.showFoodNamesList(item.title)}
                        </View>
                        <TouchableOpacity onPress={() => this.onPressAddFood(item.title)}>
                          <CachedImage
                            source={require("../../assets/images/redesign/add-food.png")}
                            style={{
                              width: 25,
                              height: 25
                            }}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  </Card>
                </Animatable.View>
              );
            })}
          </View>
        </View>
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
  LogFoodScreen,
  state => ({
    isEdit: state.record.isEdit,
    editEntry: state.record.editEntry,
  }),
  dispatch => ({
    setMood: (mood, timestamp, isEdit, entryID) =>
      dispatch(setMood(mood, timestamp, isEdit, entryID)),
    getFoodEntries: (date, fetchListData) =>
      dispatch(getFoodEntries(date, fetchListData))
  })
);

const styles = StyleSheet.create({
  headerView: {
    marginTop: -50,
    paddingTop: 50,
    paddingBottom: 60,
    borderBottomLeftRadius: 220,
    borderBottomRightRadius: 220,
    transform: [{ scaleX: 1.8 }, { scaleY: 0.8 }],
  },
  headerMainView: {
    transform: [{ scaleX: 1 / 1.8 }, { scaleY: 1 / 0.8 }],
  },
  calorieCircleView: {
    width: screenWidth * 0.3,
    height: screenWidth * 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: screenWidth * 0.35,
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
    height: 70,
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
});
