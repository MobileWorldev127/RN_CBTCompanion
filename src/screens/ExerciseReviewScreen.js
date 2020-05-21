import React, { Component } from "react";
import {
  StyleSheet,
  View,
  StatusBar,
  Platform,
  Text,
  Image,
  Dimensions
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import ThemeStyle from "../styles/ThemeStyle";
import ReactNativeParallaxHeader from "react-native-parallax-header";
import Timeline from "react-native-timeline-flatlist";
import Header from "./../components/Header";
import CustomButton from "./../components/Button";
import TextStyles from "../common/TextStyles";
import {
  addCompletedExercise,
  addUserExercise,
  addUserMeasure,
  setCompletedACTMeasure,
  setCurrentExercise,
  editUserExercise
} from "./../actions/RecordActions";
import { removeEmptyData, omitDeep } from "./../utils/ExerciseUtils";
import { ApolloConsumer } from "react-apollo";
import { withStore } from "../utils/StoreUtils";
import {
  getCloudIDFromImageName,
  cloudinaryPaths,
  getImagePath,
  getMeditationImage
} from "../utils/ImageUtils";
import {
  flowConstants,
  actMeasureTypes,
  exerciseTypes,
  APP,
  exerciseIcons
} from "../constants";
import { submitHomework } from "../actions/HomeworkActions";
import { StackActions, NavigationActions } from "react-navigation";
import moment from "moment";
import { getUserExerciseQuery } from "../queries/getUserExercise";
import CLImage from "../components/CLImage";
import LottieLoader from "../components/lottieLoader";
import { recordScreenEvent, screenNames } from "../utils/AnalyticsUtils";
import { getUserMeasureByIdQuery } from "../queries/getUserMeasureById";
import { pluralString } from "../utils";
import CachedImage from "react-native-image-cache-wrapper";
import FollowUpScreen from "./FollowUpScreen";
import { showOfflineMessage, performNetworkTask } from "../utils/NetworkUtils";
import { showApiError } from "../utils";
import * as Animatable from "react-native-animatable";

const STATUSBAR_HEIGHT = 15;
export class ExerciseReviewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
    let { params } = props.navigation.state;
    this.isOverview = params.isOverview;
    this.state.imageSource = this.isOverview
      ? getImagePath(
          this.props.exerciseData.image,
          this.props.exerciseData.title
        )
      : undefined;
    if (
      (params.isOverview && props.flowType === flowConstants.ACT_MEASURE) ||
      params.isUserMeasure
    ) {
      this.state.imageSource = "../assets/images/act-measure.jpg";
    }
    this.state.data = this.isOverview
      ? removeEmptyData(this.props.exerciseData)
      : undefined;
    this.typeSelector = {
      [exerciseTypes.MULTI_SELECT_WITH_RATING]: this
        .renderMultiSelectWithRating,
      [exerciseTypes.MULTI_SELECT_WITH_OPTIONS]: this.renderMultiSelect,
      [exerciseTypes.RATING]: this.renderRating,
      [exerciseTypes.TEXT]: this.renderTextType,
      [exerciseTypes.MULTI_SELECT]: this.renderMultiSelect,
      [exerciseTypes.RATING_DISCRETE]: this.renderRatingDiscrete,
      [exerciseTypes.SINGLE_SELECT]: this.renderSingleSelect,
      [exerciseTypes.SINGLE_SELECT_WITH_FLOW]: this.renderSingleSelect,
      [exerciseTypes.DISPLAY]: this.renderDisplayType,
      [exerciseTypes.GROUP]: this.renderGroup,
      [exerciseTypes.SINGLE_SELECT_WITH_RATING]: this
        .renderMultiSelectWithRating,
      [exerciseTypes.CHALLENGE]: this.renderTextType,
      [exerciseTypes.TEXT_VIEW]: this.renderDisplayType,
      [exerciseTypes.CHECKLIST]: this.renderCheckList,
      [exerciseTypes.PRIORITY_RATING]: this.renderPriorityRating,
      [exerciseTypes.GROUPED_ITEMS]: this.renderGroupedItems,
      [exerciseTypes.LOOKUP]: this.renderTextType,
      [exerciseTypes.AUDIO]: this.renderAudio,
      [exerciseTypes.FOLLOW]: this.renderGroup,
      [exerciseTypes.MULTI_SELECT_WITH_DESC]: this.renderMultiSelect
    };
  }

  renderChips = (list, type) => {
    // console.log(list);
    let elementsList = [];
    if (list.length > 0) {
      list.map(data => {
        elementsList.push(
          <View
            key={data.key.id}
            style={{
              paddingHorizontal: 12,
              borderWidth: 1,
              marginRight: 8,
              marginBottom: 12,
              borderRadius: 25,
              paddingVertical: 6,
              borderColor: data.key.color,
              backgroundColor: data.value ? data.key.color : "#fff"
            }}
          >
            <Text
              style={[
                TextStyles.ContentText,
                {
                  color: data.value ? "#fff" : data.key.color
                }
              ]}
            >
              {data.value
                ? data.key.name + " : " + data.value + "%"
                : data.key.name}
            </Text>
          </View>
        );
      });
    }
    return elementsList;
  };

  renderGroup = data => {
    return (
      <View style={{ flexDirection: "column" }}>
        <Text style={[TextStyles.SubHeader2, { paddingBottom: 10 }]}>
          {data.title}
        </Text>
        {data.details.map(element => this.renderItem(element, true))}
      </View>
    );
  };

  renderGroupedItems = data => {
    console.log("RENDERING GROUPED ITEM REVIEW", data);
    return (
      <View style={{ flexDirection: "column", marginLeft: 8 }}>
        <Text style={[TextStyles.SubHeader2, { paddingBottom: 10 }]}>
          {data.title}
        </Text>
        {data.details.map(element => this.renderItem(element, true))}
      </View>
    );
  };

  renderItem = (element, isGroupElement) => {
    let data = element;
    // console.log(data);
    if (
      data.type == exerciseTypes.GROUP ||
      data.type === exerciseTypes.GROUPED_ITEMS ||
      data.type === exerciseTypes.FOLLOW ||
      data.value
    ) {
      return (
        <View style={{ paddingBottom: 4 }}>
          {this.typeSelector[data.type](data, isGroupElement)}
        </View>
      );
    } else {
      return null;
    }
  };

  renderTitle = (title, isGroupElement) => {
    return (
      <Text
        style={[
          isGroupElement ? TextStyles.GeneralTextBold : TextStyles.SubHeader2,
          {
            color: isGroupElement
              ? ThemeStyle.mainColor
              : TextStyles.SubHeader2.color
          }
        ]}
      >
        {title}
      </Text>
    );
  };

  renderTextType = (element, isGroupElement) => {
    let data = element;
    return (
      <View style={{ paddingVertical: 8 }}>
        {this.renderTitle(data.question, isGroupElement)}
        <Text
          style={[
            data.type === exerciseTypes.LOOKUP
              ? TextStyles.SubHeader2
              : TextStyles.ContentText,
            {
              marginTop: 4,
              color:
                data.type === exerciseTypes.LOOKUP
                  ? ThemeStyle.accentColor
                  : undefined
            }
          ]}
        >
          {data.value.stringValues[0]}
        </Text>
      </View>
    );
  };

  renderRatingDiscrete = (element, isGroupElement) => {
    let data = element;
    return (
      <View style={{ paddingVertical: 8 }}>
        {this.renderTitle(data.question, isGroupElement)}
        <Text style={[TextStyles.ContentText, { marginTop: 4 }]}>
          {data.value.stringValues[0]}
        </Text>
      </View>
    );
  };

  renderMultiSelectWithRating = (element, isGroupElement) => {
    let data = element;
    return (
      <View style={{ paddingVertical: 8 }}>
        {this.renderTitle(data.question, isGroupElement)}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center"
          }}
        >
          {this.renderChips(data.value.keyValues)}
        </View>
      </View>
    );
  };

  renderMultiSelect = (element, isGroupElement) => {
    let data = element;
    return (
      <View style={{ paddingVertical: 8 }}>
        {this.renderTitle(data.question, isGroupElement)}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center"
          }}
        >
          {this.renderChips(data.value.keyValues)}
        </View>
      </View>
    );
  };

  renderSingleSelect = (element, isGroupElement) => {
    let data = element;
    return (
      <View style={{ paddingVertical: 8 }}>
        {this.renderTitle(data.question, isGroupElement)}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center"
          }}
        >
          {this.renderChips(data.value.keyValues)}
        </View>
      </View>
    );
  };

  renderRating = (element, isGroupElement) => {
    let data = element;
    return (
      <View style={{ paddingVertical: 8 }}>
        {this.renderTitle(data.question, isGroupElement)}
        <View
          style={{
            flexDirection: "row",
            marginTop: 4
          }}
        >
          <View
            style={{
              flex: data.value.intValues[0] / data.scale.max,
              height: 18,
              borderRadius: 16,
              backgroundColor: ThemeStyle.mainColor,
              zIndex: 2
            }}
          />
          <View
            style={{
              flex: 1 - data.value.intValues[0] / data.scale.max,
              height: 18,
              borderTopRightRadius: 16,
              borderBottomRightRadius: 16,
              marginLeft: -16,
              backgroundColor: "#eee"
            }}
          />
        </View>
        <Text style={[TextStyles.ContentText, { marginTop: 4 }]}>
          {data.placeholder +
            " : " +
            data.value.intValues[0] +
            "/" +
            data.scale.max}
        </Text>
      </View>
    );
  };

  renderCheckList = (element, isGroupElement) => {
    let data = element;
    return (
      <View style={{ paddingVertical: 8 }}>
        {this.renderTitle(data.question, isGroupElement)}
        {data.value.stringValues.length > 0 ? (
          data.value.stringValues.map(item => {
            return (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingTop: 8
                }}
              >
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: "#333"
                  }}
                />
                <Text
                  style={[TextStyles.ContentText, { paddingHorizontal: 8 }]}
                >
                  {item}
                </Text>
              </View>
            );
          })
        ) : (
          <Text style={[TextStyles.ContentText, { paddingTop: 6 }]}>
            {"Nothing Selected"}
          </Text>
        )}
      </View>
    );
  };

  renderPriorityRating = (element, isGroupElement) => {
    let data = element;
    return (
      <View style={{ paddingVertical: 8 }}>
        {this.renderTitle(data.question, isGroupElement)}
        {data.value.keyValues.length > 0 ? (
          data.value.keyValues.map(item => {
            return (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingTop: 8
                }}
              >
                <Text>{item.value + 1 + "."}</Text>
                <Text
                  style={[TextStyles.GeneralText, { paddingHorizontal: 8 }]}
                >
                  {item.key.name}
                </Text>
              </View>
            );
          })
        ) : (
          <Text style={[TextStyles.GeneralText, { paddingTop: 6 }]}>
            {"No Priority Set"}
          </Text>
        )}
      </View>
    );
  };

  renderAudio = data => {
    let minutes =
      Math.floor(data.value.stringValues[0]) > 0
        ? Math.floor(data.value.stringValues[0]) +
          pluralString(Math.floor(data.value.stringValues[0]), "minute") +
          " "
        : "";
    minutes +=
      data.value.stringValues[0] % 1 > 0
        ? Math.floor((data.value.stringValues[0] % 1) * 60) +
          pluralString(
            Math.floor((data.value.stringValues[0] % 1) * 60),
            "second"
          )
        : "";
    timePlayed = `Minutes Played : ${minutes}`;
    return (
      <View style={{ paddingVertical: 8 }}>
        <View style={{ flexDirection: "row", marginTop: 4 }}>
          <View>
            <CachedImage
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                borderWidth: 1,
                borderColor: "#000",
                position: "absolute"
              }}
              resizeMode="center"
              source={exerciseIcons["audio.png"]}
            />
            <CachedImage
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                borderWidth: 1,
                borderColor: "#000"
              }}
              source={{
                uri: getMeditationImage(data.image)
              }}
            />
          </View>
          <View
            style={{
              justifyContent: "center",
              marginLeft: 12,
              flex: 1
            }}
          >
            <Text style={TextStyles.SubHeaderBold}>{data.title}</Text>
            <Text
              style={[TextStyles.GeneralText, { color: ThemeStyle.mainColor }]}
            >
              {timePlayed}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  componentDidMount() {
    let flowType = "Exercise";
    switch (this.props.flowType) {
      case flowConstants.ACT_MEASURE:
        flowType = "ACT Measures";
        break;
      case flowConstants.ENTRY_FLOW:
        flowType = "Entry Flow";
        break;
      case flowConstants.EXERCISE:
        flowType = "Exercise";
        break;
      case flowConstants.HOMEWORK:
        flowType = "Homework";
        break;
    }
    recordScreenEvent(screenNames.exerciseReview, {
      title: this.isOverview
        ? "Exercise Overview"
        : this.props.navigation.state.params.title,
      userExerciseID: this.isOverview
        ? "-1"
        : this.props.navigation.state.params.id,
      flowType: flowType
    });
  }

  render() {
    // console.log(this.state.imageSource);
    let { params } = this.props.navigation.state;
    return (
      <View style={ThemeStyle.pageContainer}>
        <StatusBar
          translucent={true}
          backgroundColor={"transparent"}
          barStyle={"light-content"}
          hidden={false}
        />
        <Header
          title={
            this.isOverview
              ? this.props.flowType === flowConstants.ACT_MEASURE
                ? "Measure Overview"
                : "Exercise Overview"
              : "Exercise Review"
          }
          isBack={true}
          navBarStyle={{
            backgroundColor: "#0000",
            borderColor: "#0000"
          }}
          goBack={() => {
            this.props.navigation.goBack(null);
          }}
        />
        <Text
          style={[
            TextStyles.Header2,
            { marginHorizontal: 24, marginVertical: 12 }
          ]}
        >
          {this.isOverview ? this.props.exerciseData.title : params.title}
        </Text>
        {/* <View> */}
        <ApolloConsumer>
          {client => (
            <ReactNativeParallaxHeader
              style={{
                backgroundColor: ThemeStyle.backgroundColor
              }}
              headerMinHeight={12}
              headerMaxHeight={
                this.state.imageSource &&
                this.state.imageSource.endsWith(".json")
                  ? 340
                  : 200
              }
              extraScrollHeight={20}
              navbarColor={ThemeStyle.backgroundColor}
              renderImage={() => {
                console.log(
                  "RENDERING IMAGE",
                  this.props.flowType,
                  this.state.imageSource
                );
                if (
                  (this.isOverview &&
                    this.props.flowType === flowConstants.ACT_MEASURE) ||
                  params.isUserMeasure
                ) {
                  return (
                    <Animatable.View
                      style={{
                        flex: 1,
                        height: 200,
                        marginHorizontal: 24,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 10,
                        overflow: "hidden"
                      }}
                    >
                      <Image
                        source={require("../assets/images/act-measure.jpg")}
                        style={{
                          width: "100%",
                          height: 200
                        }}
                        resizeMode="cover"
                      />
                    </Animatable.View>
                  );
                }
                return this.state.imageSource &&
                  this.state.imageSource.endsWith(".json") ? (
                  <LottieLoader source={""} src={this.state.imageSource} />
                ) : (
                  <Animatable.View
                    style={{
                      flex: 1,
                      height: 200,
                      marginHorizontal: 24,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 10,
                      overflow: "hidden"
                    }}
                    animation="zoomIn"
                  >
                    <CLImage
                      cloudId={getCloudIDFromImageName(
                        this.state.imageSource,
                        cloudinaryPaths.exercise
                      )}
                      style={{ width: "100%", height: 200 }}
                    />
                  </Animatable.View>
                );
              }}
              backgroundImage={this.state.imageSource}
              backgroundColor={ThemeStyle.backgroundColor}
              backgroundImageScale={1.2}
              renderContent={() => {
                if (!this.isOverview) {
                  this.props.setLoading(true);
                  let variables = {
                    id: this.props.navigation.state.params.id
                    // exerciseId: this.props.navigation.state.params.exerciseId
                  };
                  console.log("GET USER EXERCISE VARIABLE", variables);
                  client
                    .watchQuery({
                      query: getUserExerciseQuery,
                      variables,
                      fetchPolicy: "cache-first"
                    })
                    .subscribe({
                      next: data => {
                        console.log("USER EXERCISE DATA", data);
                        if (data.loading && !data.data) {
                          return;
                        }
                        this.props.setLoading(false);
                        if (!this.state.data) {
                          const exercise = params.isUserMeasure
                            ? data.data.getUserMeasureById
                            : data.data.getUserExercise;
                          let imageSource = getImagePath(
                            exercise.image,
                            exercise.title
                          );
                          if (
                            (this.isOverview &&
                              this.props.flowType ===
                                flowConstants.ACT_MEASURE) ||
                            params.isUserMeasure
                          ) {
                            imageSource = "../assets/images/act-measure.jpg";
                          }
                          this.setState({
                            exerciseData: exercise,
                            data: removeEmptyData(exercise),
                            imageSource,
                            allowFollowUp:
                              !exercise.followCompleted &&
                              exercise.followupDate &&
                              moment().isSameOrAfter(
                                moment(exercise.followupDate)
                              )
                          });
                        }
                      },
                      error: error => {
                        this.props.setLoading(false);
                        showApiError();
                        console.log(error);
                      }
                    });
                }
                if (this.state.data && this.state.data.length > 0) {
                  return (
                    <Timeline
                      style={{
                        padding: 16,
                        paddingRight: 24,
                        backgroundColor: ThemeStyle.backgroundColor
                      }}
                      data={this.state.data}
                      circleSize={32}
                      circleColor={"#fff"}
                      circleStyle={{
                        borderWidth: 1.5,
                        borderColor: ThemeStyle.mainColor
                      }}
                      lineWidth={1}
                      lineColor={ThemeStyle.mainColor}
                      iconStyle={{
                        width: 16,
                        height: 16
                      }}
                      renderDetail={item => this.renderItem(item)}
                      detailContainerStyle={[
                        {
                          paddingHorizontal: 16,
                          backgroundColor: "#fff",
                          borderRadius: 10,
                          marginBottom: 24,
                          marginLeft: 12
                        },
                        ThemeStyle.shadow()
                      ]}
                      showTime={false}
                      options={{
                        contentContainerStyle: { paddingBottom: 72 },
                        removeClippedSubviews: false
                      }}
                      innerCircle={"icon"}
                    />
                  );
                } else {
                  return (
                    <View
                      style={[
                        ThemeStyle.pageContainer,
                        {
                          height: Dimensions.get("window").height
                        }
                      ]}
                    >
                      <Text
                        style={[
                          TextStyles.SubHeaderBold,
                          { textAlign: "center" }
                        ]}
                      >
                        No entries
                      </Text>
                    </View>
                  );
                }
              }}
            />
          )}
        </ApolloConsumer>
        {!params.isOverview && this.state.allowFollowUp && (
          <CustomButton
            style={{
              position: "absolute",
              bottom: 0,
              left: 24,
              right: 24,
              marginBottom: 24,
              alignSelf: "flex-end"
            }}
            name={"Follow Up"}
            onPress={() => {
              performNetworkTask(() => {
                const { exerciseData } = this.state;
                console.log("EXERCISE DATA", exerciseData);
                this.props.setCurrentExercise(
                  exerciseData,
                  flowConstants.FOLLOW_UP
                );
                this.props.navigation.navigate("ExerciseScreen", {
                  currentIndex: exerciseData.details.length - 1,
                  exerciseId: exerciseData.id
                });
              });
            }}
          />
        )}
        {params.isOverview && (
          <CustomButton
            style={{
              position: "absolute",
              bottom: 0,
              right: 24,
              marginBottom: 24,
              alignSelf: "flex-end"
            }}
            name={"Done"}
            onPress={() => {
              console.log("FLOW TYPE " + this.props.flowType);
              let exerciseId = this.props.exerciseData.id;
              let exerciseInput = omitDeep(
                this.props.exerciseData,
                "__typename"
              );
              exerciseInput.entryDate = moment().format("YYYY-MM-DD");
              exerciseInput.dateTime = moment().toISOString();
              if (APP.swasthApp === "CC") {
                exerciseInput.id = exerciseId;
                exerciseInput.exerciseId = undefined;
              } else {
                exerciseInput.id = undefined;
                exerciseInput.exerciseId = exerciseId;
              }
              console.log(
                "---SAVING EXERCISE---",
                JSON.stringify(exerciseInput)
              );
              switch (this.props.flowType) {
                case flowConstants.ENTRY_FLOW:
                  this.props.completeExercise(this.props.exerciseData);
                  this.props.navigation.navigate("RecordScreen");
                  break;
                case flowConstants.HOMEWORK:
                  console.log("---SAVING EXERCISE---", exerciseInput);
                  this.props.addUserExercise(exerciseInput, data => {
                    console.log(data);
                    this.props.submitHomework(
                      data.data.addUserExercise.id,
                      () => this.props.navigation.navigate("HomeworkScreen")
                    );
                  });
                  break;
                case flowConstants.EXERCISE:
                  this.props.addUserExercise(exerciseInput, data => {
                    console.log("ADDED EXERCISE", data);
                    if (
                      this.props.isFollowUp &&
                      exerciseInput.title === "Prediction"
                    ) {
                      FollowUpScreen.schedulePredictionNotification(
                        exerciseInput.followupDate,
                        data.data &&
                          data.data.addUserExercise &&
                          data.data.addUserExercise.id
                      );
                    }
                    const resetAction = StackActions.reset({
                      index: 0,
                      actions: [
                        NavigationActions.navigate({
                          routeName: "DrawerRoutes"
                        })
                      ]
                    });
                    this.props.navigation.dispatch(resetAction);
                  });
                  break;
                case flowConstants.ACT_MEASURE:
                  let measureInput = omitDeep(
                    this.props.exerciseData,
                    "__typename"
                  );
                  measureInput = omitDeep(measureInput, "title");
                  measureInput = omitDeep(measureInput, "done");
                  this.props.addUserMeasure(measureInput, data => {
                    let currentDate = moment();
                    if (
                      this.props.exerciseData.type === actMeasureTypes.WEEKLY
                    ) {
                      AsyncStorage.setItem(
                        `@act${currentDate.format("ww YYYY")}`,
                        JSON.stringify(true)
                      );
                    } else {
                      AsyncStorage.setItem(
                        `@act${currentDate.format("DD MMM YYYY")}`,
                        JSON.stringify(true)
                      );
                    }
                    this.props.setCompletedMeasure(
                      this.props.exerciseData.type
                    );
                    this.props.navigation.navigate("ACTMeasuresScreen");
                  });
                  break;
                case flowConstants.FOLLOW_UP:
                  exerciseInput.followCompleted = moment().toISOString();
                  this.props.editUserExercise(
                    exerciseId,
                    exerciseInput,
                    data => {
                      const resetAction = StackActions.reset({
                        index: 0,
                        actions: [
                          NavigationActions.navigate({
                            routeName: "DrawerRoutes"
                          })
                        ]
                      });
                      this.props.navigation.dispatch(resetAction);
                    }
                  );
                  break;
              }
            }}
          />
        )}
        {/* </View> */}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  exerciseData: state.record.currentExercise,
  flowType: state.record.flowType,
  isFollowUp: state.record.isFollowUp
});

const mapDispatchToProps = dispatch => ({
  completeExercise: exerciseData =>
    dispatch(addCompletedExercise(exerciseData)),
  addUserExercise: (exerciseInput, onAdded) =>
    dispatch(addUserExercise(exerciseInput, onAdded)),
  setCurrentExercise: (exercise, flowType) =>
    dispatch(setCurrentExercise(exercise, flowType)),
  editUserExercise: (id, exerciseInput, onAdded) =>
    dispatch(editUserExercise(id, exerciseInput, onAdded)),
  submitHomework: (submitID, onSubmitted) =>
    dispatch(submitHomework(submitID, onSubmitted)),
  addUserMeasure: (userMeasure, onAdded) =>
    dispatch(addUserMeasure(userMeasure, onAdded)),
  setCompletedMeasure: type => dispatch(setCompletedACTMeasure(type))
});

export default withStore(
  ExerciseReviewScreen,
  mapStateToProps,
  mapDispatchToProps
);

var styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Gill Sans",
    textAlign: "center",
    margin: 10,
    color: "#ffffff",
    backgroundColor: "transparent"
  },
  container: {
    flex: 1,
    backgroundColor: "#F0EFF5"
  }
});
