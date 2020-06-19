import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  NativeModules,
  LayoutAnimation,
  Linking,
  ImageBackground,
  Platform
} from "react-native";
import { Mutation, Query } from "react-apollo";
import LinearGradient from "react-native-linear-gradient";
import ThemeStyle from "../../styles/ThemeStyle";
import Icon from "../../common/icons";
import TextStyles from "../../common/TextStyles";
import {
  getEntriesQuery,
  deleteEntryQuery,
  deleteEntryQueryByDate
} from "../../queries";
import { getMonthRange, formatDateString } from "../../utils/DateTimeUtils";
import { showMessage } from "react-native-flash-message";
import moment from "moment";
import { Storage } from "aws-amplify";
import { Moods, timeLineItemTypes, IconList } from "../../constants";
import { getTimeLineViewQuery } from "../../queries/getTimeLineView";
import { pluralString } from "../../utils";
import { performNetworkTask } from "../../utils/NetworkUtils";
import { tabRoutes } from "../TabComponents/routes";
import Card from "../../components/Card";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
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
      ...nextProps
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

  renderChips(data, type, id) {
    let elementsList = [];
    data &&
      data.map(data => {
        elementsList.push(
          <TouchableOpacity
            key={data.id}
            style={{
              paddingHorizontal: 12,
              borderWidth: 1,
              marginRight: 8,
              marginBottom: 12,
              borderRadius: 25,
              paddingVertical: 4,
              borderColor: type == "exercise" ? data.color : data.emotion.color,
              backgroundColor: type == "exercise" ? "#fff" : data.emotion.color
            }}
            onPress={
              type == "exercise"
                ? () => {
                    console.log(data.id);
                    this.props.navigation.navigate("ExerciseReviewScreen", {
                      title: data.title,
                      isOverview: false,
                      id: id,
                      exerciseId: data.id
                    });
                  }
                : () => {}
            }
          >
            <Text
              style={[
                TextStyles.ContentText,
                {
                  color: type == "exercise" ? data.color : "#fff"
                }
              ]}
            >
              {type == "exercise"
                ? data.title
                : data.emotion.name + ": " + data.intensity + "%"}
            </Text>
          </TouchableOpacity>
        );
      });
    return (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center"
        }}
      >
        {elementsList}
      </View>
    );
  }

  renderAttachment = (title, assets) => {
    let source = require("../../assets/images/redesign/image-icon.png");
    if (title === "Audios") {
      source = require("../../assets/images/redesign/music-icon.png");
    }
    return (
      <View>
        <Text style={[TextStyles.SubHeaderBold, styles.subHeaderItem]}>
          {title}
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center"
          }}
        >
          {assets.map(item => (
            <TouchableOpacity
              key={item}
              style={{
                paddingHorizontal: 12,
                borderWidth: 1,
                marginHorizontal: 4,
                marginBottom: 8,
                borderRadius: 25,
                paddingVertical: 4,
                borderColor: "#333",
                backgroundColor: "#fff",
                flexDirection: "row",
                alignItems: "center"
              }}
              onPress={() => {
                this.props.setLoading(true);
                Storage.get(item, {
                  level: "private"
                })
                  .then(res => {
                    if (title === "Images") {
                      this.props.navigation.navigate("ImageViewer", {
                        uri: res
                      });
                    } else {
                      console.log(res);
                      Linking.openURL(res);
                    }
                  })
                  .catch(err => console.log(err))
                  .finally(() => {
                    this.props.setLoading(false);
                  });
              }}
            >
              <Image
                source={source}
                style={{ height: 16 }}
                resizeMode="contain"
              />
              <Text
                style={[
                  { fontSize: 14, maxWidth: "85%" },
                  TextStyles.GeneralText
                ]}
                numberOfLines={1}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  renderIconWithBadge(image, count) {
    return (
      <View style={{ marginRight: 12 }}>
        <Image
          style={{ height: 26, width: 26 }}
          source={image}
          resizeMode="contain"
        />
        <Text
          style={[
            TextStyles.FooterText,
            {
              backgroundColor: ThemeStyle.red,
              borderRadius: 7,
              width: 14,
              height: 14,
              color: "#fff",
              position: "absolute",
              top: -2,
              right: -4,
              overflow: "hidden",
              textAlign: "center"
            }
          ]}
        >
          {count}
        </Text>
      </View>
    );
  }

  renderSectionIcon(image, imageStyle) {
    return (
      <View
        style={{
          height: 40,
          width: 40,
          backgroundColor: "#F2F2F2",
          borderRadius: 20,
          marginTop: 16,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Image
          source={image}
          style={[{ width: 32, height: 32 }, imageStyle]}
          resizeMode="contain"
        />
      </View>
    );
  }

  showNutririon(nutrition) {
    return (
      <View style={{ flexDirection: "row", marginTop: 8, justifyContent: 'space-around'  }}>
        <View style={{alignItems: 'center'}}>
          <AnimatedCircularProgress
                  size={60}
                  width={5}
                  fill={60}
                  rotation= {0}
                  tintColor={ThemeStyle.accentColor}
                  padding={10}
            backgroundColor="#C9CFDF">
            {
              (fill) => (
                <Text style={{fontSize: 14}}>{Math.floor(nutrition.carbs.value)}g</Text>
              )
            }
          </AnimatedCircularProgress>
          <Text>Carbs</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <AnimatedCircularProgress
                  size={60}
                  width={5}
                  fill={60}
                  rotation= {0}
                  tintColor={ThemeStyle.accentColor}
                  padding={10}
            backgroundColor="#C9CFDF">
            {
              (fill) => (
                <Text style={{fontSize: 14}}>{Math.floor(nutrition.protein.value)}g</Text>
              )
            }
          </AnimatedCircularProgress>
          <Text>Proteiin</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <AnimatedCircularProgress
                  size={60}
                  width={5}
                  fill={60}
                  rotation= {0}
                  tintColor={ThemeStyle.accentColor}
                  padding={10}
            backgroundColor="#C9CFDF">
            {
              (fill) => (
                <Text style={{fontSize: 14}}>{Math.floor(nutrition.fat.value)}g</Text>
              )
            }
          </AnimatedCircularProgress>
          <Text>Fat</Text>
        </View>
      </View>
    )
  }

  showExercise(exercise) {
    return (
      <View style={{ flexDirection: "row", marginTop: 8, justifyContent: 'space-around' }}>
        <View style={{alignItems: 'center'}}>
          <Text style={{color: '#ff6a63'}}>Calories</Text>
          <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 5}}>{exercise.calories.value}</Text>
        </View>
        <View style={{marginLeft: 15}}>
          <Text style={{color: '#f1ce50'}}>Time</Text>
          <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 5}}>{exercise.duration.value} <Text style={{fontSize: 12, fontWeight: '300'}}>Min</Text></Text>
        </View>
        <View style={{marginLeft: 15}}>
          <Text style={{color: '#4191fb'}}>Distance</Text>
          <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 5}}>{exercise.distance.value} <Text style={{fontSize: 12, fontWeight: '300'}}>Miile</Text></Text>
        </View>
      </View>
    )
  }

  showHeartRate(heartRate) {
    return (
      <View style={{ flexDirection: "row", marginTop: 8, justifyContent: 'space-around'  }}>
        <View style={{alignItems: 'center'}}>
          <Text style={{color: '#ff6a63'}}>Heart Rate</Text>
          <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 5}}>{heartRate.heartRate}<Text style={{fontSize: 12, fontWeight: '300'}}>BPM</Text></Text>
        </View>
        <View style={{marginLeft: 15}}>
          <Text style={{color: '#ff6a63'}}>Resting</Text>
          <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 5}}>{heartRate.resting}<Text style={{fontSize: 12, fontWeight: '300'}}>BPM</Text></Text>
        </View>
        <View style={{marginLeft: 15}}>
          <Text style={{color: '#ff6a63'}}>Variaility</Text>
          <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 5}}>{heartRate.variability}<Text style={{fontSize: 12, fontWeight: '300'}}>BPM</Text></Text>
        </View>
      </View>
    )
  }

  showSleep(sleep){
    return (
      <View style={{ flexDirection: "row", marginTop: 8, justifyContent: 'space-around'  }}>
        <View style={{alignItems: 'center'}}>
          <Text style={{color: '#ff6a63'}}>Duration</Text>
          <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 5}}>{sleep.sleep[0].duration}</Text>
        </View>
        <View style={{marginLeft: 15}}>
          <Text style={{color: '#00cc51'}}>Bedtime</Text>
          <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 5}}>{moment(sleep.sleep[0].bed_time).format("hh:mm")}<Text style={{fontSize: 12, fontWeight: '300'}}>PM</Text></Text>
        </View>
        <View style={{marginLeft: 15}}>
          <Text style={{color: '#4191fb'}}>Wakeup</Text>
          <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 5}}>{moment(sleep.sleep[0].wake_time).format("hh:mm")}<Text style={{fontSize: 12, fontWeight: '300'}}>AM</Text></Text>
        </View>
      </View>
    )
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
              type: "danger",
              message: "Something went wrong"
            });
          }}
        >
          {deleteEntry => (
            <Card
              style={{
                marginBottom: 12,
                marginHorizontal: 12,
                paddingVertical: 12
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  if (Platform.OS === `ios`) {
                    LayoutAnimation.easeInEaseOut();
                  }
                  this.setState({ isExpanded: !this.state.isExpanded });
                }}
              >
                <View style={{ padding: 20}}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}
                  >
                    {
                      <Image
                        source={
                          type == 'Nutrition' ? require("../../assets/images/redesign/timeline_nutrition.png") : 
                          type == 'Exercise' ? require("../../assets/images/redesign/timeline_exercise.png") : 
                          type == 'Heart Rate' ? require("../../assets/images/redesign/timeline_heart_rate.png") : 
                          type == 'Sleep' ? require("../../assets/images/redesign/timeline_sleep.png") : null
                          
                        }
                        style={{ height: 60, width: 60, resizeMode: "contain" }}
                      />
                    }
                    {
                      <Image
                        source={
                          type == 'Nutrition' ? require("../../assets/images/redesign/timeline_nutrition_background.png") : 
                          type == 'Exercise' ? require("../../assets/images/redesign/timeline_exercise_background.png") : 
                          type == 'Heart Rate' ? require("../../assets/images/redesign/timeline_heart_rate_background.png") : 
                          type == 'Sleep' ? require("../../assets/images/redesign/timeline_sleep_background.png") : null
                        }
                        style={{ position: "absolute", right: -12, top: 0, width: 100, height: 80 }}
                      />
                    }
                    <View
                      style={{
                        flex: 1,
                        marginLeft: 24
                      }}
                    >
                      <Text style={[TextStyles.HeaderBold]}>
                        {type == 'Nutrition' ? "Nutrition" : 
                        type == 'Exercise' ? "Exercise" : 
                        type == 'Heart Rate' ? "Heart Rate" : 
                        type == 'Sleep' ? "Sleep" : null}
                      </Text>
                      {
                        type == 'Nutrition' ? this.showNutririon(rowData.nutrition) : 
                        type == 'Exercise' ? this.showExercise(rowData.healthExercise) : 
                        type == 'Heart Rate' ? this.showHeartRate(rowData.heartRate) : 
                        type == 'Sleep' ? this.showSleep(rowData.sleep) : null
                        
                      }
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

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0EFF5"
  },
  subHeaderItem: {
    paddingVertical: 8,
    marginLeft: 4,
    ...TextStyles.GeneralTextBold
  },
  sectionContainer: {
    flex: 1,
    borderColor: ThemeStyle.disabledLight,
    borderTopWidth: 1,
    justifyContent: "center",
    paddingBottom: 10,
    paddingTop: 8,
    marginLeft: 16
  }
});
