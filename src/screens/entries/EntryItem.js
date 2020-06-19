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
let moment = require("moment");
import { Storage } from "aws-amplify";
import { Moods, timeLineItemTypes, IconList } from "../../constants";
import { getTimeLineViewQuery } from "../../queries/getTimeLineView";
import { pluralString } from "../../utils";
import { performNetworkTask } from "../../utils/NetworkUtils";
import { tabRoutes } from "../TabComponents/routes";
import Card from "../../components/Card";
const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export default class EntryItem extends Component<{}, {}> {
  constructor(props) {
    super(props);
    this.state = props;
  }

  componentWillReceiveProps(nextProps) {
    // console.log("will receive props", nextProps);
    this.setState({
      ...nextProps
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    // console.log("should Component Update", nextState);
    // console.log("should Component Update", this.state);
    return (
      nextState.isExpanded != this.state.isExpanded ||
      nextState.entryItem.id !== this.state.entryItem.id ||
      nextState.entryItem.type !== this.state.entryItem.type ||
      nextState.entryItem !== this.state.entryItem
    );
  }

  // renderEntryItems(items, type) {
  //   let elementsList = [];
  //   items.map(data => {
  //     let icon =
  //       type === "activity"
  //         ? data.icon.split(".")[0]
  //         : data[type].icon.split(".")[0];
  //     elementsList.push(
  //       <View
  //         key={data.id}
  //         style={{
  //           borderWidth: 1,
  //           marginHorizontal: 4,
  //           marginBottom: 8,
  //           borderRadius: 20,
  //           borderColor: ThemeStyle.disabledLight,
  //           backgroundColor: "#fff",
  //           flexDirection: "row",
  //           alignItems: "center"
  //         }}
  //       >
  //         <Image
  //           source={IconList[icon]}
  //           style={{
  //             width: 16,
  //             height: 16,
  //             marginRight: 4,
  //             margin: 4,
  //             resizeMode: "contain",
  //             tintColor: ThemeStyle.mainColor
  //           }}
  //         />
  //         <Text
  //           style={[TextStyles.ContentText, { paddingRight: 12 }]}
  //           numberOfLines={1}
  //         >
  //           {type === "activity" ? data.title : data[type].title}
  //         </Text>
  //         {type === "target" && (
  //           <View
  //             style={{
  //               backgroundColor: ThemeStyle.mainColorLight,
  //               borderRadius: 9,
  //               width: 18,
  //               height: 18,
  //               marginRight: 4,
  //               justifyContent: "center",
  //               alignItems: "center"
  //             }}
  //           >
  //             <Text style={TextStyles.ContentText}>{data.value}</Text>
  //           </View>
  //         )}
  //       </View>
  //     );
  //   });
  //   return (
  //     <View
  //       style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}
  //     >
  //       {elementsList}
  //     </View>
  //   );
  // }

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
                      // Share.open({
                      //   url: res,
                      //   title: "Open using:"
                      // })
                      //   .then(res => {
                      //     console.log(res);
                      //   })
                      //   .catch(err => console.log(err));
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
        <View>
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
      </View>
    );
  }

  renderIconWithBadge1(image) {
    return (
      <View style={{ marginRight: 12 }}>
        <View>
          <Image
            style={{ height: 26, width: 26 }}
            source={image}
            resizeMode="contain"
          />
        </View>
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

  render() {
    let rowData = this.state.entryItem;
    let rowExerciseData = this.state.entryTotal.healthExercise && this.state.entryTotal.healthExercise.calories.value > 0 && this.state.entryTotal.healthExercise;
    let rowHeartRateData = this.state.entryTotal.heartRate && this.state.entryTotal.heartRate;
    let rowSleepData = this.state.entryTotal.sleep && this.state.entryTotal.sleep.totalMinutes > 0 && this.state.entryTotal.sleep;
    let rowNutritionData = this.state.entryTotal.nutrition && this.state.entryTotal.nutrition.carbs.value > 0 && this.state.entryTotal.nutrition;

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
              <TouchableWithoutFeedback
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
                      flexDirection: "row",
                      paddingVertical: 4,
                      paddingHorizontal: 16,
                      alignItems: "center",
                      position: "absolute",
                      top: 0,
                      right: 0
                    }}
                  >
                    <Icon
                      family="Feather"
                      size={12}
                      name="clock"
                      color={ThemeStyle.disabled}
                    />
                    <Text
                      style={[
                        TextStyles.ContentText,
                        { marginLeft: 4, color: ThemeStyle.disabled }
                      ]}
                    >
                      {moment(rowData.dateTime).format("hh:mm A")}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}
                  >
                    <Image
                      source={Moods[5 - rowData.mood].src}
                      style={{ height: 64, width: 64, resizeMode: "contain" }}
                    />
                    <Image
                      source={require("../../assets/images/redesign/Mood-graphic.png")}
                      style={{ position: "absolute", right: -12, top: -12 }}
                    />
                    <View
                      style={{
                        flex: 1,
                        marginLeft: 24
                      }}
                    >
                      <Text style={[TextStyles.HeaderBold]}>
                        {Moods[5 - rowData.mood].name}
                      </Text>
                      {this.state.isExpanded ? (
                        <View style={{ flexDirection: "row", marginTop: 8 }}>
                          <TouchableOpacity
                            style={{
                              marginRight: 12,
                              width: 26,
                              height: 26,
                              borderRadius: 13,
                              backgroundColor: "#f2f2f2",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                            onPress={() => {
                              performNetworkTask(
                                () => {
                                  this.props.setEditEntry(rowData);
                                  this.props.navigation.navigate("Home", {
                                    isBack: true
                                  });
                                  // this.props.onChangeSelectedTab(
                                  //   tabRoutes.Record.name
                                  // );
                                },
                                "Editing entries is only allowed when online. Please connect to the internet and try again.",
                                true
                              );
                            }}
                          >
                            <Icon
                              family="SimpleLineIcons"
                              color={ThemeStyle.disabled}
                              size={12}
                              name="pencil"
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              marginRight: 12,
                              width: 26,
                              height: 26,
                              borderRadius: 13,
                              backgroundColor: ThemeStyle.red,
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                            onPress={() => {
                              performNetworkTask(
                                () => {
                                  Alert.alert(
                                    "Are you sure?",
                                    "This entry will be deleted",
                                    [
                                      {
                                        text: "Cancel",
                                        onPress: () =>
                                          console.log("Cancel Pressed"),
                                        style: "cancel"
                                      },
                                      {
                                        text: "OK",
                                        onPress: () => {
                                          this.props.setLoading(true);
                                          deleteEntry({
                                            variables: {
                                              id: rowData.id
                                            },
                                            refetchQueries: [
                                              {
                                                query: getTimeLineViewQuery,
                                                variables: getMonthRange()
                                              }
                                            ]
                                          });
                                        }
                                      }
                                    ],
                                    { cancelable: false }
                                  );
                                },
                                "Deleting entries is only allowed when online. Please connect to the internet and try again.",
                                true
                              );
                            }}
                          >
                            <Icon
                              family="EvilIcons"
                              color="#fff"
                              size={20}
                              name="trash"
                            />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={{ flexDirection: "row", marginTop: 8 }}>
                          {this.renderIconWithBadge(
                            require("../../assets/images/redesign/emotion-badge.png"),
                            rowData.emotions && rowData.emotions.length
                          )}
                          {rowExerciseData && this.renderIconWithBadge1(
                            require("../../assets/images/redesign/timeline_exercise.png"),
                          )}
                          {rowHeartRateData && this.renderIconWithBadge1(
                            require("../../assets/images/redesign/timeline_heart_rate.png"),
                          )}
                          {rowSleepData && this.renderIconWithBadge1(
                            require("../../assets/images/redesign/timeline_sleep.png"),
                          )}
                          {rowNutritionData && this.renderIconWithBadge1(
                            require("../../assets/images/redesign/timeline_nutrition.png"),
                          )}
                          {/* {this.renderIconWithBadge(
                            require("../../assets/images/redesign/activities-home.png"),
                            rowData.exercise && rowData.exercise.length
                          )} */}
                        </View>
                      )}
                    </View>
                  </View>
                  {this.state.isExpanded && (
                    <View style={{ marginTop: 16, marginBottom: 10 }}>
                      <View
                        animation="fadeIn"
                        style={{
                          marginTop: 5,
                          marginBottom: 5,
                          flexDirection: "row"
                        }}
                      >
                        {this.renderSectionIcon(
                          require("../../src/emotion_neutral.png"),
                          {
                            width: 24,
                            height: 24,
                            tintColor: ThemeStyle.text2
                          }
                        )}
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            marginLeft: 16
                          }}
                        >
                          <Text style={[styles.subHeaderItem]}>EMOTIONS</Text>
                          {this.renderChips(rowData.emotions)}
                        </View>
                      </View>
                      <View
                        animation="fadeIn"
                        delay={200}
                        style={{
                          marginTop: 5,
                          marginBottom: 5,
                          flexDirection: "row"
                        }}
                      >
                        {this.renderSectionIcon(
                          require("../../assets/images/redesign/sleep-icon-expend.png")
                        )}
                        <View style={styles.sectionContainer}>
                          <Text style={[styles.subHeaderItem]}>
                            Sleep & Medication
                          </Text>
                          <Text
                            style={[
                              TextStyles.ContentText,
                              { color: "#888", marginLeft: 4 }
                            ]}
                          >
                            {"Medication : "}
                            <Text
                              style={[
                                TextStyles.GeneralTextBold,
                                {
                                  fontSize: 12
                                }
                              ]}
                            >
                              {rowData.medication ? " Yes" : " No"}
                            </Text>
                          </Text>
                          <Text
                            style={[
                              TextStyles.ContentText,
                              { color: "#888", marginLeft: 4, marginTop: 8 }
                            ]}
                          >
                            {"Sleep Duration :  "}
                            <Text
                              style={[
                                TextStyles.GeneralTextBold,
                                {
                                  fontSize: 12
                                }
                              ]}
                            >
                              {rowData.sleepTime}
                            </Text>
                          </Text>
                        </View>
                      </View>
                      {rowData.skills && rowData.skills.length > 0 && (
                        <Animatable.View
                          animation={
                            Platform.OS === "ios" ? "fadeIn" : undefined
                          }
                          delay={100}
                          style={{
                            marginTop: 5,
                            marginBottom: 5,
                            flexDirection: "row"
                          }}
                        >
                          {this.renderSectionIcon(
                            require("../../assets/images/redesign/skills-icon-expand.png")
                          )}
                          <View style={styles.sectionContainer}>
                            <Text style={[styles.subHeaderItem]}>Skills</Text>
                            {this.renderEntryItems(rowData.skills, "skill")}
                          </View>
                        </Animatable.View>
                      )}
                      {rowData.targets && rowData.targets.length > 0 && (
                        <Animatable.View
                          animation={
                            Platform.OS === "ios" ? "fadeIn" : undefined
                          }
                          delay={100}
                          style={{
                            marginTop: 5,
                            marginBottom: 5,
                            flexDirection: "row"
                          }}
                        >
                          {this.renderSectionIcon(
                            require("../../assets/images/redesign/target-icon.png")
                          )}
                          <View style={styles.sectionContainer}>
                            <Text style={[styles.subHeaderItem]}>Targets</Text>
                            {this.renderEntryItems(rowData.targets, "target")}
                          </View>
                        </Animatable.View>
                      )}
                      {rowData.activities && rowData.activities.length > 0 && (
                        <Animatable.View
                          animation={
                            Platform.OS === "ios" ? "fadeIn" : undefined
                          }
                          delay={100}
                          style={{
                            marginTop: 5,
                            marginBottom: 5,
                            flexDirection: "row"
                          }}
                        >
                          {this.renderSectionIcon(
                            require("../../assets/images/redesign/activities-icon.png")
                          )}
                          <View style={styles.sectionContainer}>
                            <Text style={[styles.subHeaderItem]}>
                              Activities
                            </Text>
                            {this.renderEntryItems(
                              rowData.activities,
                              "activity"
                            )}
                          </View>
                        </Animatable.View>
                      )}
                      {rowData.exercise && rowData.exercise.length > 0 && (
                        <View
                          animation={
                            Platform.OS === "ios" ? "fadeIn" : undefined
                          }
                          delay={100}
                          style={{
                            marginTop: 5,
                            marginBottom: 5,
                            flexDirection: "row"
                          }}
                        >
                          {this.renderSectionIcon(
                            require("../../src/exercise.png")
                          )}
                          <View style={styles.sectionContainer}>
                            <Text style={[styles.subHeaderItem]}>
                              Exercises
                            </Text>
                            {this.renderChips(
                              rowData.exercise,
                              "exercise",
                              rowData.id
                            )}
                          </View>
                        </View>
                      )}
                      {rowData.journal && !!rowData.journal.text && (
                        <View
                          animation={
                            Platform.OS === "ios" ? "fadeIn" : undefined
                          }
                          delay={200}
                          style={{
                            marginTop: 5,
                            marginBottom: 5,
                            flexDirection: "row"
                          }}
                        >
                          {this.renderSectionIcon(
                            require("../../assets/images/redesign/journal-icon-expend.png")
                          )}
                          <View style={styles.sectionContainer}>
                            <Text style={[styles.subHeaderItem]}>Journal</Text>
                            <Text
                              style={[
                                TextStyles.ContentText,
                                { color: "#888", marginLeft: 4 }
                              ]}
                            >
                              {rowData.journal.text}
                            </Text>
                            {rowData.journal.assets &&
                              rowData.journal.assets[0].images &&
                              rowData.journal.assets[0].images.length > 0 &&
                              this.renderAttachment(
                                "Images",
                                rowData.journal.assets[0].images
                              )}
                            {rowData.journal.assets &&
                              rowData.journal.assets[0].videos &&
                              rowData.journal.assets[0].videos.length > 0 &&
                              this.renderAttachment(
                                "Videos",
                                rowData.journal.assets[0].videos
                              )}
                            {rowData.journal.assets &&
                              rowData.journal.assets[0].audios &&
                              rowData.journal.assets[0].audios.length > 0 &&
                              this.renderAttachment(
                                "Audios",
                                rowData.journal.assets[0].audios
                              )}
                          </View>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </TouchableWithoutFeedback>
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
