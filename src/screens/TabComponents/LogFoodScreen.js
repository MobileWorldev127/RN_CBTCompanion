/* eslint-disable quotes */
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Modal,
  Button,
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
import { addFoodEntry, getFoodEntries } from "../../actions/NutritionixActions"
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { setTopSafeAreaView } from "../../actions/AppActions";

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
      isWaterModal: false,
      waterMeasuresList: ['8', '16', '24', '32'],
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
          image: require("../../assets/images/redesign/snack.png")
        },
        {
          title: "Water",
          image: require("../../assets/images/redesign/bottle.png")
        }
      ],
      sum_total_cals: 0,
      sum_carbs: 0,
      sum_protein: 0,
      sum_fat: 0,
      sum_snack: 0,
      sum_water: 0,
      cals_breakfast: null,
      cals_lunch: null,
      cals_dinner: null,
      cals_snack: null,
      food_breakfast_list: [],
      food_lunch_list: [],
      food_dinner_list: [],
      food_snack_list: [],
      water_custome_measure: 0,
      water_total_consumed: 0,
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
    if (title === 'Water') {
      this.setState({ isWaterModal: true });
    }
    else {
      this.props.navigation.navigate("FoodDetail", {
        isBack: true,
        title: title,
        date: this.state.currentDate,
        onGoBack: this.onSelect
      });
    }
  };

  onPressAddFood = title => {
    if (title === 'Water') {
      this.setState({ isWaterModal: true });
    }
    else {
      this.props.navigation.navigate("FoodAdd", {
        isBack: true,
        title: title,
        dateTime: this.state.currentDate,
        alreadyAddedFoodList: [],
        onGoBack: this.onSelect
      });
    }
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
      case "Water":
        return <Text>{this.state.water_total_consumed} oz</Text>;
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
      var sum_water = 0;
      fetchListData.map(item => {
        if (item.meal === "Water") {
          sum_water = item.details[0].microNutrients[0].value;
        }
        else {
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
        food_snack_list: food_snack_list,
        water_total_consumed: sum_water
      });
    });
  }

  onWaterMeasureItem = item => {
    this.setState({ water_custome_measure: item });
  }

  onWaterAdd = () => {
    var sum = parseInt(this.state.water_custome_measure) + parseInt(this.state.water_total_consumed);
    this.setState({water_total_consumed: sum.toString()})
  }

  onWaterUpdate = () => {
    var data = {};
    data.name = 'Water';
    data.qty = 1;
    data.unit = 'cup';
    data.total_water = parseInt(this.state.water_total_consumed);
    let dateTime = this.state.currentDate.format("YYYY-MM-DD");

    this.props.addFoodEntry(data, 'Water', dateTime, onAdded => {
      this.setState({isWaterModal: false})
      
    });
  }

  getWaterModal = () => {
    return(
      <Modal
        visible={this.state.isWaterModal}
        animationType="fade"
        backgroundColor="#0006"
        transparent
      >
        <View style={styles.modalView}>
          <View style={styles.centeredView}>
            <View style={styles.modalTitleView}>
              <Icon
                family="Ionicons"
                name="ios-water"
                size={22}
                color="#4191fb"
                style={styles.pickerIcon}
              />
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>  Log Water</Text>
            </View>
            <View style={styles.commonMeasureView}>
              <Text style={styles.measureTxt}>Common Measures (tap to add instantl):</Text>
              <View style={styles.measureView}>
                {
                  this.state.waterMeasuresList.map(item => {
                    return (
                      <TouchableOpacity onPress={() => this.onWaterMeasureItem(item)}>
                        <View style={styles.itemMeasureView}>
                          <Text>{item} oz</Text>
                        </View>
                      </TouchableOpacity>
                    )
                  })
                }
              </View>
              <Text style={styles.measureTxt}>Custome Measure:</Text>
              <View style={styles.customMeasureView}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TextInput
                    style={styles.inputBox}
                    keyboardType="number-pad"
                    placeholderTextColor="lightgrey"
                    underlineColorAndroid="transparent"
                    value={this.state.water_custome_measure}
                    // onChangeText={value => this.setState({ water_custome_measure: value })}
                  />
                  <Text> oz</Text>
                </View>
                <TouchableOpacity style={styles.addWaterBtn} onPress={this.onWaterAdd}>
                  <Text style={styles.addWaterTxt}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.totalMeasureView}>
              <Text style={styles.measureTxt}>Total water consumed today:</Text>
              <View style={styles.customMeasureView}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TextInput
                    style={styles.inputBox}
                    keyboardType="number-pad"
                    placeholderTextColor="lightgrey"
                    underlineColorAndroid="transparent"
                    value={this.state.water_total_consumed}
                    onChangeText={value => this.setState({ water_total_consumed: value })}
                  />
                  <Text> oz</Text>
                </View>
                <TouchableOpacity style={styles.addWaterBtn} onPress={this.onWaterUpdate}>
                  <Text style={styles.addWaterTxt}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Button title="Cancel" onPress={this.toggleModal}/>
          </View>
        </View>
      </Modal>
    )
  }

  toggleModal = () => {
    this.setState({ isWaterModal: false })
  };
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
                    {Math.round(this.state.sum_carbs)}g
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
                    {Math.round(this.state.sum_protein)}g
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
                  <Text style={{ color: "white" }}>{Math.round(this.state.sum_fat)}g</Text>
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
          <ScrollView style={{ flex: 1 }}>
            {this.state.items.map((item, index) => {
              return (
                <Animatable.View
                  animation="pulse"
                  delay={index * 200}
                  style={{
                    // flex: 1,
                    // maxHeight: 140,
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
          </ScrollView>
        </View>
        {this.getWaterModal()}
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
    setTopSafeAreaView: color => dispatch(setTopSafeAreaView(color)),
    setMood: (mood, timestamp, isEdit, entryID) =>
      dispatch(setMood(mood, timestamp, isEdit, entryID)),
    addFoodEntry: (exerciseInput, title, dateTime, onAdded) =>
      dispatch(addFoodEntry(exerciseInput, title, dateTime, onAdded)),
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
  modalView: {
    flex: 1, 
    backgroundColor: "rgba(0,0,0,0.42)", 
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    width: '80%',
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 150
  },
  modalTitleView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  measureTxt: {
    fontWeight: 'bold', 
    marginTop: 20
  },
  commonMeasureView: {
    alignItems: 'flex-start', 
    width: '100%',
    borderBottomWidth: 1,
    borderColor: ThemeStyle.disabledLight
  },
  measureView: {
    width: '100%', 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginTop: 15,
  },
  itemMeasureView: {
    width: 65,
    height: 24,
    borderRadius: 12,
    backgroundColor: ThemeStyle.backgroundColor,
    alignItems: 'center',
    justifyContent: 'center'
  },
  customMeasureView: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  inputBox: {
    width: 120,
    fontSize: 16,
    textAlignVertical: "center",
    color: "#000",
    backgroundColor: ThemeStyle.backgroundColor,
    padding: 10,
    textAlign:'center'
  },
  addWaterBtn: {
    flex: 1,
    height: 35,
    marginLeft: 15,
    backgroundColor: '#4191fb',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  addWaterTxt: {
    fontSize: 18,
    color: 'white'
  },
  totalMeasureView: {
    alignItems: 'flex-start', 
    width: '100%',
    marginBottom: 15,
  }
});
