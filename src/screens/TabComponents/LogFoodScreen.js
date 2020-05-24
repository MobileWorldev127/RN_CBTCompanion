/* eslint-disable quotes */
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions
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
import CachedImage from 'react-native-image-cache-wrapper';
import Card from '../../components/Card';

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
      currentDate: props.isEdit ? moment(props.editEntry.dateTime) : moment(),
      items: [
        {
          title: 'Breakfast',
          onPress: () =>
            this.props.navigation.navigate('FoodAdd', {
              isBack: true,
              title: 'Breakfast'
            }),
          onPressFoodDetail: () =>
            this.props.navigation.navigate('FoodDetail', {
              isBack: true,
              title: 'Breakfast'
            }),
          image: require('../../assets/images/redesign/Breakfast-icon.png'),
        },
        {
          title: 'Add Lunch',
          onPress: () =>
            this.props.navigation.navigate('FoodAdd', {
              isBack: true,
              title: 'Lunch'
            }),
          onPressFoodDetail: () =>
            this.props.navigation.navigate('FoodDetail', {
              isBack: true,
              title: 'Breakfast'
            }),
          image: require('../../assets/images/redesign/Lunch-icon.png'),
        },
        {
          title: 'Add Dinner',
          onPress: () =>
            this.props.navigation.navigate('FoodAdd', {
              isBack: true,
              title: 'Dinner'
            }),
          onPressFoodDetail: () =>
            this.props.navigation.navigate('FoodDetail', {
              isBack: true,
              title: 'Breakfast'
            }),
          image: require('../../assets/images/redesign/DInner-icon.png'),
        },
      ],
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
          userName: userInfo.attributes.name,
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
    return (
      <View style={[ThemeStyle.pageContainer, { overflow: 'hidden' }]}>
        <LinearGradient
          colors={ThemeStyle.gradientColor}
          start={{
            x: 0.2,
            y: 0
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
                <Text style={styles.calorieCircleTxt}>0</Text>
                <Text>Calories</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.nutritionixTabView}>
                  <Text style={{ color: 'white' }}>CARBS</Text>
                  <View
                    style={{
                      width: screenWidth / 5,
                      height: 5,
                      backgroundColor: '#ccc',
                      marginVertical: 5,
                    }}
                  >
                    <View
                      style={{
                        width: screenWidth / 7,
                        height: 5,
                        backgroundColor: 'white',
                      }}
                    />
                  </View>
                  <Text style={{ color: 'white' }}>100g</Text>
                </View>
                <View style={styles.nutritionixTabView}>
                  <Text style={{ color: 'white' }}>PROTEIN</Text>
                  <View
                    style={{
                      width: screenWidth / 5,
                      height: 5,
                      backgroundColor: '#ccc',
                      marginVertical: 5,
                    }}
                  >
                    <View
                      style={{
                        width: screenWidth / 7,
                        height: 5,
                        backgroundColor: 'white',
                      }}
                    />
                  </View>
                  <Text style={{ color: 'white' }}>100g</Text>
                </View>
                <View style={styles.nutritionixTabView}>
                  <Text style={{ color: 'white' }}>FAT</Text>
                  <View
                    style={{
                      width: screenWidth / 5,
                      height: 5,
                      backgroundColor: '#ccc',
                      marginVertical: 5,
                    }}
                  >
                    <View
                      style={{
                        width: screenWidth / 7,
                        height: 5,
                        backgroundColor: 'white',
                      }}
                    />
                  </View>
                  <Text style={{ color: 'white' }}>100g</Text>
                </View>
              </View>
            </Animatable.View>
          </View>
        </LinearGradient>
        <View style = {styles.mainContainerView}>
          <View style = {styles.dateView}>
            <TouchableOpacity>
              <Icon
                name="ios-arrow-back"
                size={22}
                color="black"
                style={styles.pickerIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={TextStyles.Header2}>
                {this.state.currentDate.format("dddd, DD MMMM")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
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
                    maxHeight: 160,
                    overflow: 'hidden',
                  }}
                >
                  <Card style={{ margin: 5}}>
                    <TouchableOpacity
                      onPress={item.onPressFoodDetail}
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
                          padding: 15
                        }}
                      >
                        <CachedImage
                          source={item.image}
                          style={{
                            width: 80,
                            height: 80,
                          }}
                          resizeMode="contain"
                        />
                        <View
                          style={{
                            flexDirection: 'row',
                            padding: 15,
                            flex: 1,
                          }}
                        >
                          <Text
                            style={[
                              TextStyles.Header2,
                              {
                                color: item.color,
                              },
                            ]}
                          >
                            {item.title}
                          </Text>
                        </View>
                        <TouchableOpacity onPress={item.onPress}>
                          <CachedImage
                            source={require('../../assets/images/redesign/add-food.png')}
                            style={{
                              width: 25,
                              height: 25,
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
              isDatePickerVisible: false,
            });
          }}
          onConfirm={date => {
            console.log(date);
            this.setState({
              isDatePickerVisible: false,
              currentDate: moment(date),
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
    editEntry: state.record.editEntry
  }),
  dispatch => ({
    setMood: (mood, timestamp, isEdit, entryID) =>
      dispatch(setMood(mood, timestamp, isEdit, entryID))
  })
);

const styles = StyleSheet.create({
  headerView: {
    marginTop: -50,
    paddingVertical: 50,
    borderBottomLeftRadius: 220,
    borderBottomRightRadius: 220,
    transform: [{ scaleX: 1.8 }, { scaleY: 0.8 }]
  },
  headerMainView: {
    transform: [{ scaleX: 1 / 1.8 }, { scaleY: 1 / 0.8 }]
  },
  calorieCircleView: {
    width: screenWidth / 3,
    height: screenWidth / 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: screenWidth / 3,
    borderWidth: 2,
    borderColor: '#3992B6',
    borderRadius: screenWidth / 3,
    backgroundColor: 'white'
  },
  calorieCircleTxt: {
    fontSize: 24,
    color: '#3992B6',
    fontWeight: 'bold'
  },
  nutritionixTabView: {
    width: screenWidth / 3,
    height: 100,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainerView: {
    flex: 1,
    padding: 15,
    marginTop: -30
  },
  dateView: {
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'space-between',
    margin: 10
  }
});
