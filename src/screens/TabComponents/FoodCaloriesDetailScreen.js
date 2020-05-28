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
import { isOnline } from "../../utils/NetworkUtils";
import * as Animatable from "react-native-animatable";
import CachedImage from "react-native-image-cache-wrapper";
import Card from "../../components/Card";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import {getNutritionixFoodItem} from "../../actions/NutritionixActions"
import {addFoodEntry} from "../../actions/NutritionixActions"

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
      foodNutritinDetail: {},
      isVisiableAdd: true
    };
    Auth.currentUserInfo().then(info => {
      console.log("user info", info);
      this.setState({
        userName: info && info.attributes && info.attributes.name,
      });
    });
  }

  async componentDidMount() {
    let { params } = this.props.navigation.state;
    let itemId = params.itemId;
    this.props.setTopSafeAreaView(ThemeStyle.gradientStart);
    this.props.getNutritionixFoodItem(itemId, data => {
      console.log('success===========+>')
      console.log(data)
      this.setState({
        foodNutritinDetail: data.foods[0],
        isVisiableAdd: true
      })
    });
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

  onClickAddToList = () => {
    if (this.state.isVisiableAdd ){
      let { params } = this.props.navigation.state;
      let title = params.title;
      this.props.addFoodEntry(this.state.foodNutritinDetail, title, onAdded => {
        this.setState({isVisiableAdd: false})
      })
    }
    else {
      alert('You already added to your Food List');    }
    
  }

  render() {
    console.log("Render home", this.state);
    let { params } = this.props.navigation.state;
    let isBack = params && params.isBack;
    let foodName = params.foodName;
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
            title={foodName}
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
            <View style={styles.qtyView}>
              <Text style={TextStyles.SubHeaderBold}>{this.state.foodNutritinDetail.serving_qty}</Text>
            </View>            
            <Text style={[TextStyles.SubHeaderBold, styles.unitInput]}>{this.state.foodNutritinDetail.serving_unit}</Text>
          </View>
          {/* <TouchableOpacity style={styles.addBtn} onPress = {this.onClickAddToList}>
            <Text style={{color: 'white', fontSize: 16}}>ADD</Text>
          </TouchableOpacity> */}
          
          <View style={styles.calsView}>
            <Text style={{color: '#f7992a', fontSize: 25}}> {this.state.foodNutritinDetail.nf_calories}
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
                      <Text style={styles.processTxt}>{this.state.foodNutritinDetail.nf_total_carbohydrate}g</Text>
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
                      <Text style={styles.processTxt}>{this.state.foodNutritinDetail.nf_protein}g</Text>
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
                      <Text style={styles.processTxt}>{this.state.foodNutritinDetail.nf_total_fat}g</Text>
                    )
                  }
                </AnimatedCircularProgress>
                <Text>Fat</Text>
              </View>
            </View>

            <View style={styles.viewLine} />
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={TextStyles.SubHeader2}>Protein</Text>
              <Text style={TextStyles.SubHeader2}>{this.state.foodNutritinDetail.nf_protein}g</Text>
            </View>

            <View style={styles.viewLine} />
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={TextStyles.SubHeader2}>Carbs</Text>
              <Text style={TextStyles.SubHeader2}>{this.state.foodNutritinDetail.nf_total_carbohydrate}g</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10,}}>
              <Text style={TextStyles.GeneralText}>Fiber</Text>
              <Text style={TextStyles.GeneralText}>{this.state.foodNutritinDetail.nf_dietary_fiber}g</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={TextStyles.GeneralText}>Sugar</Text>
              <Text style={TextStyles.GeneralText}>{this.state.foodNutritinDetail.nf_sugars}g</Text>
            </View>

            <View style={styles.viewLine} />
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={TextStyles.SubHeader2}>Fat</Text>
              <Text style={TextStyles.SubHeader2}>{this.state.foodNutritinDetail.nf_total_fat}g</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10,}}>
              <Text style={TextStyles.GeneralText}>Saturated Fat</Text>
              <Text style={TextStyles.GeneralText}>{this.state.foodNutritinDetail.nf_saturated_fat}g</Text>
            </View>

            <View style={styles.viewLine} />
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={TextStyles.SubHeader2}>Others</Text>
            </View>
            
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10,}}>
              <Text style={TextStyles.GeneralText}>Sodium</Text>
              <Text style={TextStyles.GeneralText}>{this.state.foodNutritinDetail.nf_sodium}g</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={TextStyles.GeneralText}>Potassium</Text>
              <Text style={TextStyles.GeneralText}>{this.state.foodNutritinDetail.nf_potassium}g</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10,}}>
              <Text style={TextStyles.GeneralText}>Cholesterol</Text>
              <Text style={TextStyles.GeneralText}>{this.state.foodNutritinDetail.nf_cholesterol}g</Text>
            </View>
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
    getNutritionixFoodItem: (itemId, data) =>
      dispatch(getNutritionixFoodItem(itemId, data)),
    addFoodEntry: (exerciseInput, title, onAdded) =>
      dispatch(addFoodEntry(exerciseInput, title, onAdded))
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
    backgroundColor: '#f7992a',
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
  },
  processTxt: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  viewLine: {
    width: screenWidth,
    marginLeft: -25,
    height: 1,
    backgroundColor: ThemeStyle.text3,
    marginVertical: 20
  },
  qtyView: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'gray',
    fontSize: 18,
    alignItems: 'center',
    justifyContent: 'center',
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
