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
import SearchField from "../../components/SearchField";
import { showMessage } from "react-native-flash-message";
import { setTopSafeAreaView } from "../../actions/AppActions";
import {getNutritionixInstantFoodList, getNutritionixNutrientsFoodList, addFoodEntry, getNutritionixFoodItem, deleteFoodEntries, getFoodEntries} from "../../actions/NutritionixActions"

const screenWidth = Dimensions.get("window").width;

class FoodAddScreen extends Component {
  constructor(props) {
    super(props);
    this.moods = Moods;
    this.currentMood = props.isEdit
      ? this.moods[5 - props.editEntry.mood]
      : this.moods[0];
    this.state = {
      isDatePickerVisible: false,
      currentDate: props.navigation.state.params.dateTime ? props.navigation.state.params.dateTime : moment(),
      query: '',
      queryTxt: '',
      foodList: [],
      addedFoodList: props.navigation.state.params.alreadyAddedFoodList,
      isSpeaking: false,
      foodNutritinDetail: {},
      addedFoodKeyList: []
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

  onChangeQuery = query => {
    if (query) {
      this.props.getNutritionixInstantFoodList(query, data => {
        this.setState({
          foodList: data.branded
        })
      });
    }
    else {
      this.setState({
        foodList: []
      });
    }
  }

  addFoodList = item => {
    let { params } = this.props.navigation.state;
    let title = params.title;
    var addedFoodList = this.state.addedFoodList;
    var foodList = [...this.state.foodList];
    if (addedFoodList.indexOf(item) > -1) {
      let date = {
        endDate: this.state.currentDate.format("YYYY-MM-DD"), 
        startDate: this.state.currentDate.format("YYYY-MM-DD")
      }
      this.props.getFoodEntries(date, fetchListData => {
        fetchListData.map(item1 => {
          if (item1.details[0].name == (item.food_name? item.food_name : item.details[0].name)){
            this.props.deleteFoodEntries(item1._id, fetchData => {
              var index = addedFoodList.indexOf(item);
              if (index !== -1) {
                addedFoodList.splice(index, 1);
                this.setState({ addedFoodList: addedFoodList });
              }
              else {
                return;
              }
            })
          }
        });
      });
    }
    else {
      if (item.nix_item_id) {
        this.props.getNutritionixFoodItem(item.nix_item_id, data => {
          if (!data.foods) {
            setTimeout(() => {
              showMessage({
                message:'Something went wrong. Try again. Or use the search function.',
                type: "danger"
              })
            }, 500)
          }
          else {
            let dateTime = this.state.currentDate.format("YYYY-MM-DD");
            this.props.addFoodEntry(data.foods[0], title, dateTime, onAdded => {
              addedFoodList.push(item);
              var index = foodList.indexOf(item);
              if (index !== -1) {
                foodList.splice(index, 1);
                this.setState({
                  addedFoodList: addedFoodList,
                  foodList: foodList,
                });
              };
            });
          }
        });
      }
      else {
        let dateTime = this.state.currentDate.format("YYYY-MM-DD");
        this.props.addFoodEntry(item, title, dateTime, onAdded => {
          addedFoodList.push(item);
          var index = foodList.indexOf(item);
          if (index !== -1) {
            foodList.splice(index, 1);
            this.setState({
              addedFoodList: addedFoodList,
              foodList: foodList,
            });
          };
        });
      }
    }
  }

  onClickAdd = () => {
    this.props.getNutritionixNutrientsFoodList(this.state.queryTxt, data => {
      if (data.foods) {
        this.setState({ foodList: data.foods })
      }
      else {
        this.setState({ foodList: [] })
      }
    });
  }

  jsUcfirst(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render() {
    console.log("Render home", this.state);
    let { params } = this.props.navigation.state;
    let isBack = params && params.isBack;
    let title = params.title;
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
            <Animatable.View
              animation="fadeInDown"
              style={{ alignItems: "center" }}
            >
              <SearchField 
                iconName="ios-search" 
                placeholder="Search food or brand" 
                onChangeText={query => this.onChangeQuery(query)}
              />
              <View style={styles.inputView}>
                <TextInput
                  style={[TextStyles.GeneralText, styles.inputBox]}
                  placeholder="I ate 3 eggs and bacon for breakfast"
                  multiline={true}
                  placeholderTextColor="lightgrey"
                  underlineColorAndroid="transparent"
                  defaultValue={this.state.queryTxt}
                  onChangeText={queryTxt => this.setState({ queryTxt })}
                />
                {/* <TouchableOpacity 
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                  }}
                  onPress = {() => this.setState({isSpeaking: !this.state.isSpeaking})}>
                  <CachedImage
                    source={
                      this.state.isSpeaking?
                      require("../../assets/images/redesign/Finish-icon-active.png") :
                      require("../../assets/images/redesign/Talk-icon.png")
                    }
                    resizeMode="contain"
                  />
                </TouchableOpacity> */}
              </View>
              {
                this.state.queryTxt ?
                <TouchableOpacity style={styles.addView} onPress = {this.onClickAdd}>
                  <Text style={{ color: "white", fontSize: 20 }}>ADD</Text>
                </TouchableOpacity> : null
              }              
            </Animatable.View>
          </View>
        </LinearGradient>
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          {this.state.addedFoodList.length > 0 ? 
            <Text style={styles.listedTitleTxt}>You Just Added</Text> : null}
          {this.state.addedFoodList.map((item, index) => {
            return (
              <Animatable.View
                animation="pulse"
                delay={index * 200}
                style={{
                  marginHorizontal: 20,
                  marginBottom: 10,
                  borderRadius: 10,
                }}
              >
                <Card style={{ margin: 5 }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('FoodCaloriesDetail', {
                        isBack: true,
                        foodName: item.food_name,
                        title: title,
                        itemId: item.nix_item_id ? item.nix_item_id : 1,
                        itemEntry: item
                      })
                    }
                    underlayColor={item.color + "aa"}
                    style={{
                      backgroundColor: item.color
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: 15,
                      }}
                    >
                      <View
                        style={{
                          padding: 5,
                          flex: 1
                        }}
                      >
                        <Text style={TextStyles.Header2}>
                          {item.food_name ? this.jsUcfirst(item.food_name) : this.jsUcfirst(item.details[0].name)}
                        </Text>
                        <Text style={TextStyles.GeneralText}>
                          {item.nf_calories ? Math.round(item.nf_calories) : JSON.parse(item.details[0].macroNutrients).calories} cals - {item.serving_qty? item.serving_qty : item.details[0].qty} {item.serving_unit?item.serving_unit : item.details[0].unit}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => this.addFoodList(item)}>
                        <Icon
                          family={"MaterialCommunityIcons"}
                          name={"delete"}
                          color="red"
                          size={25}
                        />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </Card>
              </Animatable.View>
            );
          })}
          {this.state.foodList.length > 0 ? 
            <Text style={styles.listedTitleTxt}>Recent</Text> : null}
          {this.state.foodList.map((item, index) => {
            return (
              <Animatable.View
                animation="pulse"
                delay={index * 200}
                style={{
                  marginHorizontal: 20,
                  marginBottom: 10,
                  borderRadius: 10,
                }}
              >
                <Card style={{ margin: 5 }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('FoodCaloriesDetail', {
                        isBack: true,
                        foodName: item.food_name,
                        title: title,
                        itemId: item.nix_item_id ? item.nix_item_id : 1,
                        itemEntry: item
                      })
                    }
                    underlayColor={item.color + "aa"}
                    style={{
                      backgroundColor: item.color
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: 15,
                      }}
                    >
                      <View
                        style={{
                          padding: 5,
                          flex: 1
                        }}
                      >
                        <Text style={TextStyles.Header2}>
                          {this.jsUcfirst(item.food_name)}
                        </Text>
                        <Text style={TextStyles.GeneralText}>
                          {item.nf_calories > -1 ? Math.round(item.nf_calories) : JSON.parse(item.details[0].macroNutrients).calories} cals - {item.serving_qty? item.serving_qty : item.details[0].qty} {item.serving_unit?item.serving_unit : item.details[0].unit}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => this.addFoodList(item)}>
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
    );
  }
}

export default withSafeAreaActions(
  FoodAddScreen,
  state => ({
    isEdit: state.record.isEdit,
    editEntry: state.record.editEntry,
  }),
  dispatch => ({
    setTopSafeAreaView: color => dispatch(setTopSafeAreaView(color)),
    setMood: (mood, timestamp, isEdit, entryID) =>
      dispatch(setMood(mood, timestamp, isEdit, entryID)),
    getNutritionixInstantFoodList: (query, data) =>
      dispatch(getNutritionixInstantFoodList(query, data)),
    getNutritionixNutrientsFoodList: (formdata, data) => 
      dispatch(getNutritionixNutrientsFoodList(formdata, data)),
    addFoodEntry: (exerciseInput, title, dateTime, onAdded) =>
      dispatch(addFoodEntry(exerciseInput, title, dateTime, onAdded)),
    getNutritionixFoodItem: (itemId, data) =>
      dispatch(getNutritionixFoodItem(itemId, data)),
    deleteFoodEntries: (entryId, fetchData) =>
      dispatch(deleteFoodEntries(entryId, fetchData)),
    getFoodEntries: (date, fetchListData) =>
      dispatch(getFoodEntries(date, fetchListData)),
  })
);

const styles = StyleSheet.create({
  headerView: {
    marginTop: -50,
    paddingTop: 50,
    paddingBottom: 80,
    borderBottomLeftRadius: 220,
    borderBottomRightRadius: 220,
    transform: [{ scaleX: 1.8 }, { scaleY: 0.8 }],
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
  inputView: {
    width: "90%",
    height: 100,
    marginVertical: 16,
    borderRadius: 15,
    backgroundColor: "white",
    padding: 20,
  },
  inputBox: {
    flex: 1,
    fontSize: 16,
    textAlignVertical: "center",
    color: "#000",
  },
  addView: {
    width: "88%",
    height: 50,
    borderRadius: 5,
    backgroundColor: '#f7992a',
    alignItems: "center",
    justifyContent: "center",
    marginBottom:20,
  },
  listedTitleTxt: {
    fontSize: 20,
    marginLeft: 25,
    marginVertical: 15,
  }
});