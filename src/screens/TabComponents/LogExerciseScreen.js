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
import { setTopSafeAreaView } from "../../actions/AppActions";
import { getExerciseEntries } from "../../actions/NutritionixActions";

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
      exerciseList: [],
      addedExerciseList: [],
      sum_cals: 0,
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
    this.fetchExerciseList(this.state.currentDate.format("YYYY-MM-DD"));
  }

  componentWillUnmount() {
    this.props.setTopSafeAreaView(ThemeStyle.backgroundColor);
  }

  fetchExerciseList = date => {
    var sum_cals = 0;
    this.props.getExerciseEntries(date, fetchListData => {
      fetchListData.map(item => {
        sum_cals += item.details[0].calories;
      })
      this.setState({ 
        exerciseList: fetchListData,
        sum_cals: sum_cals
       })
    });
  }

  jsUcfirst(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  onClickAddMoreExercuse = () => {
    this.props.navigation.navigate("ExerciseAdd", {
      isBack: true,
      onGoBack: this.onSelect
    });
  }

  onSelect = () => {
    var date = this.state.currentDate.format("YYYY-MM-DD");
    this.fetchExerciseList(date);
  }

  onClickBeforeDay = () => {
    var prev_date = new Date(this.state.currentDate - 864e5);
    this.setState({
      currentDate: moment(prev_date)
    });
    this.fetchExerciseList(moment(prev_date).format("YYYY-MM-DD"));
  }

  onClickAfterDay = () => {
    var after_date = new Date(this.state.currentDate + 864e5);
    this.setState({
      currentDate: moment(after_date)
    });
    this.fetchExerciseList(moment(after_date).format("YYYY-MM-DD"));
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
          <Header
            title={'Log Exercise'}
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
          <View style={styles.dateView}>
            <TouchableOpacity onPress={this.onClickBeforeDay}>
              <Icon
                name="ios-arrow-back"
                size={22}
                color="white"
                style={styles.pickerIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onClickDay}>
              <Text style={[TextStyles.Header2, {color: 'white'}]}>
                {this.state.currentDate.format("dddd, DD MMMM")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onClickAfterDay}>
              <Icon
                name="ios-arrow-forward"
                size={22}
                color="white"
                style={styles.pickerIcon}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          <TouchableOpacity style={styles.addBtn} onPress = {() => this.onClickAddMoreExercuse()}>
            <Text style={{color: 'white', fontSize: 16}}>ADD MORE EXERCISE</Text>
          </TouchableOpacity>
          {this.state.exerciseList.map((item, index) => {
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
                          {this.jsUcfirst(item.details[0].name)}
                        </Text>
                        <Text style={TextStyles.GeneralText}>
                          - {item.details[0].calories} kcal : {item.details[0].duration_min} min
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => this.addExerciseList(item)}>
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
    setTopSafeAreaView: color => dispatch(setTopSafeAreaView(color)),
    setMood: (mood, timestamp, isEdit, entryID) =>
      dispatch(setMood(mood, timestamp, isEdit, entryID)),
    getExerciseEntries: (date, fetchListData) =>
      dispatch(getExerciseEntries(date, fetchListData)),
  })
);

const styles = StyleSheet.create({
  headerView: {
    paddingVertical: 20
  },
  headerMainView: {
    transform: [{ scaleX: 1 / 1.8 }, { scaleY: 1 / 0.8 }],
  },
  dateView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 50,
  },
  addBtn: {
    margin: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ThemeStyle.accentColor,
    borderRadius: 12
  },
  calsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 25,
    height: 60,
    marginVertical: 15
  },
});
