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
import { setTopSafeAreaView } from "../../actions/AppActions";
import { getNutritionixExercise, addExerciseEntry, deleteExerciseEntries, getExerciseEntries } from "../../actions/NutritionixActions"

const screenWidth = Dimensions.get("window").width;

class ExerciseAddScreen extends Component {
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
      exerciseList: [],
      addedExerciseList: props.navigation.state.params.alreadyAddedExerciseList,
    };
    Auth.currentUserInfo().then(info => {
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
    this.props.setTopSafeAreaView(ThemeStyle.gradientStart);
  }

  onClickAdd = () => {
    if (this.state.queryTxt.length > 2) {
      let param = {};
      param.query = this.state.queryTxt;
      this.props.getNutritionixExercise(param, data => {
        if (data.exercises) {
          this.setState({
            exerciseList: data.exercises
          })
        }
        else {
          setTimeout(() => {
            showMessage({
              message:'Something went wrong. Try again. Or use the search function.',
              type: "danger"
            })
          }, 500);
        }
      });
    }
    else {
      this.setState({
        exerciseList: []
      });
    }
  }

  addExerciseList = item => {
    let dateTime = this.state.currentDate.format("YYYY-MM-DD");
    let { params } = this.props.navigation.state;
    let title = params.title;
    var exerciseList = [...this.state.exerciseList];
    var addedExerciseList = this.state.addedExerciseList;
    if (addedExerciseList.indexOf(item) > -1) {
      this.props.getExerciseEntries(dateTime, fetchListData => {
        fetchListData.map(item1 => {
          if (item1.details[0].name == item.name){
            this.props.deleteExerciseEntries(item1._id, fetchData => {
              var index = addedExerciseList.indexOf(item);
              if (index !== -1) {
                addedExerciseList.splice(index, 1);
                this.setState({ addedExerciseList: addedExerciseList });
              } else {
                return;
              }
            });
          }
        })
      })
              
    } else {
      let dateTime = this.state.currentDate.format("YYYY-MM-DD");
      this.props.addExerciseEntry(item, dateTime, onAdded => {
        console.log(item)
        console.log('=+>', onAdded)
        if (onAdded.success) {
          addedExerciseList.push(item);
          var index = exerciseList.indexOf(item);
          if (index !== -1) {
            exerciseList.splice(index, 1);
            this.setState({
              addedExerciseList: addedExerciseList,
              exerciseList: exerciseList,
            });
          };

        }
        else {
          setTimeout(() => {
            showMessage({
              message:'Something went wrong. Try again. Or use the search function.',
              type: "danger"
            });
          }, 500);
        }
      });
    }
  }

  jsUcfirst(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render() {
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
            title={'Add Exercise'}
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
            <View style={styles.inputView}>
              <TextInput
                style={[TextStyles.GeneralText, styles.inputBox]}
                placeholder="I ran miles and did yoga"
                multiline={true}
                placeholderTextColor="lightgrey"
                underlineColorAndroid="transparent"
                defaultValue={this.state.queryTxt}
                onChangeText={queryTxt => this.setState({ queryTxt })}
              />
            </View>
            <TouchableOpacity style={styles.addView} onPress = {this.onClickAdd}>
              <Text style={{ color: "white", fontSize: 18 }}>ADD</Text>
            </TouchableOpacity>
          </Animatable.View>
        </LinearGradient>
        <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
          {this.state.addedExerciseList.length > 0 ? 
            <Text style={styles.listedTitleTxt}>You Just Added</Text> : null}
          {this.state.addedExerciseList.length > 0 && this.state.addedExerciseList.map((item, index) => {
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
                          {item.name ? this.jsUcfirst(item.name) : this.jsUcfirst(item.details[0].name)}
                        </Text>
                        <Text style={TextStyles.GeneralText}>
                          - {item.nf_calories? Math.round(item.nf_calories) : Math.round(item.details[0].calories)} kcal : {item.duration_min? Math.round(item.duration_min) : Math.round(item.details[0].duration_min)} min
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

          {this.state.exerciseList.length > 0 ? 
            <Text style={styles.listedTitleTxt}>Recent</Text> : null}
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
                          {this.jsUcfirst(item.name)}
                        </Text>
                        <Text style={TextStyles.GeneralText}>
                          - {Math.round(item.nf_calories)} kcal : {Math.round(item.duration_min)} min
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => this.addExerciseList(item)}>
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
  ExerciseAddScreen,
  state => ({
    isEdit: state.record.isEdit,
    editEntry: state.record.editEntry,
  }),
  dispatch => ({
    setTopSafeAreaView: color => dispatch(setTopSafeAreaView(color)),
    setMood: (mood, timestamp, isEdit, entryID) =>
      dispatch(setMood(mood, timestamp, isEdit, entryID)),
    getNutritionixExercise: (query, data) =>
      dispatch(getNutritionixExercise(query, data)),
    addExerciseEntry: (query, date, data) =>
      dispatch(addExerciseEntry(query, date, data)),
    deleteExerciseEntries: (entryId, data) =>
      dispatch(deleteExerciseEntries(entryId, data)),
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
    justifyContent: "center"
  },
  listedTitleTxt: {
    fontSize: 20,
    marginLeft: 25,
    marginVertical: 15,
  }
});
