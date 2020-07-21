import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  NativeModules,
  LayoutAnimation,
  Platform,
} from 'react-native';
import { Mutation } from 'react-apollo';
import ThemeStyle from '../../styles/ThemeStyle';
import TextStyles from '../../common/TextStyles';
import {
  deleteEntryQuery,
} from '../../queries';
import { showMessage } from 'react-native-flash-message';
import moment from 'moment';
import Card from '../../components/Card';
import { AnimatedCircularProgress } from "react-native-circular-progress";
const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export default class HealthEntryItem extends Component<{}, {}> {
  constructor(props) {
    super(props);
    this.state = props;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.isExpanded != this.state.isExpanded ||
      // nextState.entryItem.id !== this.state.entryItem.id ||
      // nextState.entryItem.type !== this.state.entryItem.type ||
      nextState.entryItem !== this.state.entryItem
    );
  }

  showNutririon(nutrition) {
    return (
      <View
        style={{
          flexDirection: "row",
          marginTop: 8,
          justifyContent: "space-around"
        }}
      >
        <View style={{ alignItems: "center" }}>
          <AnimatedCircularProgress
            size={60}
            width={5}
            fill={60}
            rotation={0}
            tintColor={ThemeStyle.accentColor}
            padding={10}
            backgroundColor="#C9CFDF"
          >
            {() => (
              <Text style={{ fontSize: 14 }}>
                {Math.round(nutrition.carbs.value)}g
              </Text>
            )}
          </AnimatedCircularProgress>
          <Text>Carbs</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <AnimatedCircularProgress
            size={60}
            width={5}
            fill={60}
            rotation={0}
            tintColor={ThemeStyle.accentColor}
            padding={10}
            backgroundColor="#C9CFDF"
          >
            {() => (
              <Text style={{ fontSize: 14 }}>
                {Math.round(nutrition.protein.value)}g
              </Text>
            )}
          </AnimatedCircularProgress>
          <Text>Protein</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <AnimatedCircularProgress
            size={60}
            width={5}
            fill={60}
            rotation={0}
            tintColor={ThemeStyle.accentColor}
            padding={10}
            backgroundColor="#C9CFDF"
          >
            {() => (
              <Text style={{ fontSize: 14 }}>
                {Math.round(nutrition.fat.value)}g
              </Text>
            )}
          </AnimatedCircularProgress>
          <Text>Fat</Text>
        </View>
      </View>
    );;
  }

  showExercise(exercise) {
    return (
      <View
        style={{
          flexDirection: "row",
          marginTop: 8,
          justifyContent: "space-around"
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "#ff6a63" }}>Calories</Text>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              marginTop: 5,
              color: "#2F4858"
            }}
          >
            {exercise.calories.value}
          </Text>
        </View>
        <View style={{ marginLeft: 15 }}>
          <Text style={{ color: "#f1ce50" }}>Time</Text>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              marginTop: 5,
              color: "#2F4858"
            }}
          >
            {exercise.duration.value}
            <Text style={{ fontSize: 12, fontWeight: "300" }}>Min</Text>
          </Text>
        </View>
        <View style={{ marginLeft: 15 }}>
          <Text style={{ color: "#4191fb" }}>Distance</Text>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              marginTop: 5,
              color: "#2F4858"
            }}
          >
            {exercise.distance.value}
            <Text style={{ fontSize: 12, fontWeight: "300" }}>Miile</Text>
          </Text>
        </View>
      </View>
    );;
  }

  showHeartRate(heartRate) {
    return (
      <View
        style={{
          flexDirection: "row",
          marginTop: 8,
          justifyContent: "space-around"
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "#ff6a63" }}>Heart Rate</Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginTop: 5,
              color: "#2F4858"
            }}
          >
            {heartRate.value? heartRate.value : 0}
            <Text style={{ fontSize: 12, fontWeight: "300" }}> BPM</Text>
          </Text>
        </View>
        <View style={{ marginLeft: 15 }}>
          <Text style={{ color: "#ff6a63" }}>Resting</Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginTop: 5,
              color: "#2F4858"
            }}
          >
            {heartRate.valueAtRest? heartRate.valueAtRest : 0}
            <Text style={{ fontSize: 12, fontWeight: "300" }}> BPM</Text>
          </Text>
        </View>
        <View style={{ marginLeft: 15 }}>
          <Text style={{ color: "#ff6a63" }}>Variaility</Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginTop: 5,
              color: "#2F4858"
            }}
          >
            {heartRate.variabilty? heartRate.variabilty : 0}
            <Text style={{ fontSize: 12, fontWeight: "300" }}> BPM</Text>
          </Text>
        </View>
      </View>
    );;
  }

  calculateDuration(totalMinutes) {
    let hours = totalMinutes / 60;
    if (hours < 0) {
      hours = 0;
    }
    const durationHours = Math.floor(hours);
    const minutes = hours - durationHours;
    let durationMins = Math.floor(minutes * 60);
    if (durationMins < 10) {
      durationMins = "0" + durationMins;
    }
    return durationHours + ":" + durationMins;
  }

  showSleep(sleep) {
    return (
      <View
        style={{
          flexDirection: "row",
          marginTop: 8,
          justifyContent: "space-around"
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "#ff6a63" }}>Duration</Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              marginTop: 5,
              color: "#2F4858"
            }}
          >
            {this.calculateDuration(sleep.totalMinutes)}
          </Text>
        </View>
        <View style={{ marginLeft: 15 }}>
          <Text style={{ color: "#00cc51" }}>Bedtime</Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              marginTop: 5,
              color: "#2F4858"
            }}
          >
            {moment(sleep.sleep[0].bedTime).format("hh:mm A")}
          </Text>
        </View>
        <View style={{ marginLeft: 15 }}>
          <Text style={{ color: "#4191fb" }}>Wakeup</Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              marginTop: 5,
              color: "#2F4858"
            }}
          >
            {moment(sleep.sleep[0].wakeTime).format("hh:mm A")}
          </Text>
        </View>
      </View>
    );;
  }

  render() {
    let rowData = this.state.entryItem;
    let type = this.state.entryType;
    return (
      <View>
        <Mutation
          mutation={deleteEntryQuery}
          onCompleted={() => {
            this.props.setLoading(false);
            this.props.onDelete();
          }}
          onError={err => {
            this.props.setLoading(false);
            console.log(err);
            showMessage({
              type: 'danger',
              message: 'Something went wrong',
            });
          }}
        >
          {() => (
            <Card
              style={{
                marginBottom: 12,
                marginHorizontal: 12,
                paddingVertical: 12,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  if (Platform.OS === 'ios') {
                    LayoutAnimation.easeInEaseOut();
                  }
                  this.setState({ isExpanded: !this.state.isExpanded });
                }}
              >
                <View style={{ padding: 20 }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    {
                      <Image
                        source={
                          type == "Nutrition"
                            ? require("../../assets/images/redesign/timeline_nutrition.png")
                            : type == "Exercise"
                            ? require("../../assets/images/redesign/timeline_exercise.png")
                            : type == "Heart Rate"
                            ? require("../../assets/images/redesign/timeline_heart_rate.png")
                            : type == "Sleep"
                            ? require("../../assets/images/redesign/timeline_sleep.png")
  : null
                        }
                        style={{ height: 60, width: 60, resizeMode: 'contain' }}
                      />
                    }
                    {
                      <Image
                        source={
                          type == "Nutrition"
                            ? require("../../assets/images/redesign/timeline_nutrition_background.png")
                            : type == "Exercise"
                            ? require("../../assets/images/redesign/timeline_exercise_background.png")
                            : type == "Heart Rate"
                            ? require("../../assets/images/redesign/timeline_heart_rate_background.png")
                            : type == "Sleep"
                            ? require("../../assets/images/redesign/timeline_sleep_background.png")
                            : null
                        }
                        style={{
                          position: "absolute",
                          right: -12,
                          top: 0,
                          width: 100,
                          height: 80
                        }}
                      />
                    }
                    <View
                      style={{
                        flex: 1,
                        marginLeft: 24,
                      }}
                    >
                      <Text style={[TextStyles.SubHeaderBold]}>
                        {type == "Nutrition"
                          ? "Nutrition"
                          : type == "Exercise"
                          ? "Exercise"
                          : type == "Heart Rate"
                          ? "Heart Rate"
                          : type == "Sleep"
                          ? "Sleep"
                          : null}
                      </Text>
                      {type == "Nutrition"
                        ? this.showNutririon(rowData.nutrition)
                        : type == "Exercise"
                        ? this.showExercise(rowData.healthExercise)
                        : type == "Heart Rate"
                        ? this.showHeartRate(rowData.heartRate)
                        : type == "Sleep"
                        ? this.showSleep(rowData.sleep)
: null}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </Card>
          )}
        </Mutation>
      </View>
    );
  }
}


