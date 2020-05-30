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
import Header from "../../components/Header";
import Icon from "../../common/icons";
import ThemeStyle from "../../styles/ThemeStyle";
import TextStyles from "../../common/TextStyles";
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
import {getNutritionixExercise} from "../../actions/NutritionixActions"

const screenWidth = Dimensions.get("window").width;

class LogExercise extends Component {
  constructor(props) {
    super(props);
    this.moods = Moods;
    this.currentMood = props.isEdit
      ? this.moods[5 - props.editEntry.mood]
      : this.moods[0];
    console.log("HOME SCREEN MOUNT", props);
    this.state = {
      isDatePickerVisible: false,
      currentDate: props.navigation.state.params.dateTime ? props.navigation.state.params.dateTime : moment(),
      query: '',
      queryTxt: '',
      foodList: [],
      addedFoodList: [],
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

  onChangeQuery = text => {
    if (text.length > 2) {
      let param = {};
      param.query = text;
      this.props.getNutritionixExercise(param, data => {
        console.log('@@@@---', data)
        this.setState({
          foodList: data.exercises
        })
      });
    }
    else {
      this.setState({
        foodList: []
      });
    }
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
              title={'Log Exercise'}
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
                placeholder="Search Exercise" 
                onChangeText={query => this.onChangeQuery(query)}
              />
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
                        foodName: item.food_name ? item.food_name : item.details[0].name,
                        title: title,
                        itemId: item.nix_item_id ? item.nix_item_id : 0,
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
                          {item.name}
                        </Text>
                        <Text style={TextStyles.GeneralText}>
                          - {item.nf_calories} kcal : {item.duration_min} min
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
                          {item.name}
                        </Text>
                        <Text style={TextStyles.GeneralText}>
                        - {item.nf_calories} kcal : {item.duration_min} min
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
  LogExercise,
  state => ({
    isEdit: state.record.isEdit,
    editEntry: state.record.editEntry,
  }),
  dispatch => ({
    setMood: (mood, timestamp, isEdit, entryID) =>
      dispatch(setMood(mood, timestamp, isEdit, entryID)),
    getNutritionixExercise: (query, data) =>
      dispatch(getNutritionixExercise(query, data)),
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
