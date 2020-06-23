import React, { Component, Fragment } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Platform,
  TouchableHighlight,
  Dimensions,
  Picker
} from "react-native";
import moment from "moment";
import { Calendar } from "react-native-calendars";
import Icon from "../../common/icons";
import ThemeStyle from "../../styles/ThemeStyle";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryArea,
  VictoryScatter,
  VictoryGroup,
  VictoryPie
} from "victory-native";
import { Query } from "react-apollo";
import { Moods, moodColors } from "./../../constants";
import { getMonthRange, isCurrentMonth } from "../../utils/DateTimeUtils";
import { showMessage } from "react-native-flash-message";
import {
  getMoodChartMonthlyQuery,
  getMoodCountQuery,
  getMoodCorelationsQuery
} from "../../queries";
import { G, Image as SVGImage } from "react-native-svg";
import TextStyles from "../../common/TextStyles";
import { getStatsQuery } from "../../queries/getStats";
import { getEntriesDateQuery } from "../../queries/getEntriesDate";
import { errorMessage, showApiError } from "../../utils";
let _ = require("lodash");
import { Dropdown } from "react-native-material-dropdown";
import { withStore, withSubscriptionActions } from "../../utils/StoreUtils";
import { clearState } from "../../actions/RecordActions";
import PremiumView from "../PremiumView";
import Sharing from "./../../components/Share";
import { Auth } from "aws-amplify";
import { getTimeLineViewQuery } from "../../queries/getTimeLineView";
const { width, height } = Dimensions.get("screen");
import * as Animatable from "react-native-animatable";

const STATUSBAR_HEIGHT = 15;
class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMonth: moment(),
      moodChartRange: "week",
      moodCountRange: "week",
      moodCorrelationRange: "week",
      shareDialogVisible: false
    };
    this.rangeOptions = [
      {
        label: "7 days",
        value: "week"
      },
      {
        label: "30 days",
        value: "month"
      },
      {
        label: "1 year",
        value: "year"
      }
    ];
  }

  componentDidMount() {
    this.listener = this.props.navigation.addListener("didFocus", payload => {
      console.log("Focused summary");
      this.props.clearRecordFlow();
    });
  }

  componentWillUnmount() {
    this.listener.remove();
  }

  renderSectionIcon(image) {
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
          style={{ width: 32, height: 32 }}
          resizeMode="contain"
        />
      </View>
    );
  }

  render() {
    let { params } = this.props.navigation.state;
    let isBack = params && params.isBack;

    return (
      <View style={ThemeStyle.pageContainer}>
        <StatusBar backgroundColor={ThemeStyle.backgroundColor} />
        <View style={[styles.navBar]}>
          <TouchableHighlight
            underlayColor="#74cc9533"
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
            onPress={() => {
              isBack
                ? this.props.navigation.goBack("")
                : this.props.navigation.openDrawer();
            }}
          >
            <Image source={require("../../assets/images/redesign/Back.png")} />
          </TouchableHighlight>
          <View
            style={{
              flex: 5,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row"
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  currentMonth: this.state.currentMonth.subtract(1, "M")
                });
              }}
              style={{
                marginRight: 15,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Icon
                family="Entypo"
                color={ThemeStyle.mainColor}
                size={18}
                name="chevron-thin-left"
              />
            </TouchableOpacity>
            <Text
              style={[
                TextStyles.SubHeaderBold,
                {
                  fontWeight: "bold",
                  fontSize: 21,
                  marginVertical: 3
                }
              ]}
            >
              {this.state.currentMonth.format("MMM YYYY")}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (!isCurrentMonth(this.state.currentMonth)) {
                  this.setState({
                    currentMonth: this.state.currentMonth.add(1, "M")
                  });
                }
              }}
              style={{
                marginLeft: 15,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Icon
                family="Entypo"
                color={
                  !isCurrentMonth(this.state.currentMonth)
                    ? ThemeStyle.mainColor
                    : "#ccc"
                }
                size={18}
                name="chevron-thin-right"
              />
            </TouchableOpacity>
          </View>
          <TouchableHighlight
            underlayColor={`${ThemeStyle.accentColor}33`}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
            onPress={this.onSharePress}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Image
                source={require("../../assets/images/redesign/share.png")}
              />
            </View>
          </TouchableHighlight>
        </View>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.innerContainer}>
              <Query
                query={getStatsQuery}
                onError={err => {
                  showApiError(true);
                  console.log(err);
                }}
                fetchPolicy="cache-and-network"
              >
                {({ loading, data }) => {
                  if (loading) {
                    return (
                      <ActivityIndicator
                        style={{ alignSelf: "center", padding: 16 }}
                      />
                    );
                  }
                  if (data) {
                    console.log(data);
                    return (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-around",
                          padding: 12
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderRightWidth: 0.5,
                            borderColor: "lightgrey",
                            paddingRight: 8
                          }}
                        >
                          <View
                            style={{
                              height: 40,
                              width: 40,
                              borderRadius: 20,
                              padding: 8,
                              backgroundColor: ThemeStyle.disabledLight,
                              overflow: "hidden",
                              justifyContent: "center",
                              alignItems: "center"
                            }}
                          >
                            <Image
                              source={require("../../assets/images/redesign/current-streak-icon.png")}
                              style={{
                                height: 24
                              }}
                              resizeMode="contain"
                            />
                          </View>
                          <View style={{ paddingLeft: 12 }}>
                            <Text
                              style={[
                                TextStyles.Header2,
                                { color: ThemeStyle.accentColor }
                              ]}
                            >
                              {data.getStats.currentStreak}
                            </Text>
                            <Text style={TextStyles.ContentText}>
                              Current Streak
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between"
                          }}
                        >
                          <View
                            style={{
                              height: 40,
                              width: 40,
                              borderRadius: 20,
                              padding: 8,
                              backgroundColor: ThemeStyle.disabledLight,
                              overflow: "hidden",
                              justifyContent: "center",
                              alignItems: "center"
                            }}
                          >
                            <Image
                              source={require("../../assets/images/redesign/longest-streak-icon.png")}
                              style={{
                                height: 24
                              }}
                              resizeMode="contain"
                            />
                          </View>
                          <View style={{ paddingLeft: 12 }}>
                            <Text
                              style={[
                                TextStyles.Header2,
                                { color: ThemeStyle.mainColor }
                              ]}
                            >
                              {data.getStats.longestStreak}
                            </Text>
                            <Text style={TextStyles.GeneralText}>
                              Longest Streak
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  } else return null;
                }}
              </Query>
            </View>
            {this.props.isSubscribed ? (
              <Query
                query={getTimeLineViewQuery}
                variables={getMonthRange(this.state.currentMonth)}
                onError={err => {
                  showApiError(true);
                  console.log(err);
                }}
                fetchPolicy="cache-and-network"
              >
                {({ loading, data }) => {
                  if (loading) {
                    return (
                      <ActivityIndicator
                        style={{ alignSelf: "center", padding: 16 }}
                      />
                    );
                  }
                  if (data) {
                    console.log(data);
                    let markedDates = {};
                    data.getTimeLineView.forEach(entry => {
                      markedDates[entry.date] = entry.entries &&
                        entry.entries.length && {
                          selected: true,
                          selectedColor: ThemeStyle.mainColor
                        };
                    });
                    console.log(markedDates);
                    return (
                      <View style={styles.innerContainer}>
                        <Calendar
                          style={styles.calendar}
                          maxDate={moment().format("YYYY-MM-DD")}
                          current={this.state.currentMonth.format("YYYY-MM-DD")}
                          theme={{
                            textDayFontFamily: "AirbnbCerealApp-Book",
                            textMonthFontFamily: "AirbnbCerealApp-Medium",
                            textDayHeaderFontFamily: "AirbnbCerealApp-Book",
                            textMonthFontSize: 18
                          }}
                          hideArrows={true}
                          markedDates={markedDates}
                        />
                      </View>
                    );
                  } else return null;
                }}
              </Query>
            ) : (
              <View style={styles.innerContainer}>
                <PremiumView
                  style={{ height: 300, padding: 16, backgroundColor: "#fff" }}
                  imageStyle={{ width: "80%", height: "60%" }}
                  showSubscription={this.props.showSubscription}
                />
              </View>
            )}
            <View style={styles.innerContainer}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingBottom: 12,
                  paddingHorizontal: 16
                }}
              >
                <Text style={[TextStyles.Header2, { paddingTop: 20 }]}>
                  Mood Chart
                </Text>
                <Dropdown
                  containerStyle={{ width: 82, height: 40, marginTop: -16 }}
                  data={this.rangeOptions}
                  value={this.state.moodCountRange}
                  rippleOpacity={0.0}
                  onChangeText={value => {
                    console.log(value);
                    this.setState({
                      moodChartRange: value
                    });
                  }}
                />
              </View>

              <Query
                query={getMoodChartMonthlyQuery}
                variables={getMonthRange(
                  this.state.currentMonth,
                  this.state.moodChartRange
                )}
                fetchPolicy="cache-and-network"
                onError={err => {
                  showApiError(true);
                  console.log(err);
                }}
              >
                {({ loading, data }) => {
                  console.log(data);
                  if (loading) {
                    return (
                      <ActivityIndicator
                        style={{ alignSelf: "center", padding: 16 }}
                      />
                    );
                  }
                  if (
                    data &&
                    data.getMoodChartMonthly &&
                    data.getMoodChartMonthly.length > 1
                  ) {
                    let chartData = [];
                    let tickValues = [];
                    let step = Math.round(
                      data.getMoodChartMonthly.length / 7 + 0.2
                    );
                    step = step === 0 ? 1 : step;
                    let i = 0;
                    console.log(step);
                    for (
                      i = 0;
                      i < data.getMoodChartMonthly.length;
                      i = i + step
                    ) {
                      let entry = data.getMoodChartMonthly[i];
                      chartData.push({
                        mood: entry.mood,
                        from: new Date(entry.from)
                      });
                      tickValues.push(new Date(entry.from));
                    }
                    console.log(chartData);
                    return (
                      <VictoryChart
                        domain={{ y: [0, 5.5] }}
                        padding={{ left: 32, bottom: 64, top: 48, right: 62 }}
                      >
                        {/* <VictoryAxis
                          // style={{
                          //   ticks: { stroke: "grey", size: 5 },
                          //   tickLabels: { fontSize: 15, padding: 5 }
                          // }}
              
                          dependentAxis
                          orientation="left"
                        /> */}
                        <VictoryAxis
                          crossAxis
                          style={{
                            ticks: { stroke: "grey", size: 5 },
                            tickLabels: { fontSize: 9, padding: 5 }
                          }}
                          tickValues={tickValues}
                          tickFormat={x => {
                            let tick = moment(x);
                            return tick.format("MM/DD");
                          }}
                          fixLabelOverlap={true}
                        />
                        <VictoryGroup data={chartData} y={"mood"} x={"from"}>
                          <VictoryLine
                            style={{ data: { stroke: ThemeStyle.mainColor } }}
                            interpolation="natural"
                          />
                          <VictoryScatter
                            interpolation="natural"
                            dataComponent={<MoodDataComponent />}
                          />
                        </VictoryGroup>
                      </VictoryChart>
                    );
                  } else
                    return (
                      <Text
                        style={[
                          TextStyles.SubHeaderBold,
                          {
                            padding: 16,
                            textAlign: "center",
                            alignSelf: "center"
                          }
                        ]}
                      >
                        No Data Available
                      </Text>
                    );
                }}
              </Query>
            </View>
            <View style={styles.innerContainer}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 16,
                  paddingBottom: 12
                }}
              >
                <Text style={[TextStyles.Header2, { paddingTop: 20 }]}>
                  Mood Count
                </Text>
                {this.props.isSubscribed && (
                  <Dropdown
                    containerStyle={{ width: 82, height: 40, marginTop: -16 }}
                    data={this.rangeOptions}
                    value={this.state.moodCountRange}
                    rippleOpacity={0.0}
                    onChangeText={value =>
                      this.setState({
                        moodCountRange: value
                      })
                    }
                  />
                )}
              </View>
              {this.props.isSubscribed ? (
                <Query
                  query={getMoodCountQuery}
                  variables={getMonthRange(
                    this.state.currentMonth,
                    this.state.moodCountRange
                  )}
                  fetchPolicy="cache-and-network"
                  onError={err => {
                    showApiError(true);
                    console.log(err);
                  }}
                >
                  {({ loading, data }) => {
                    console.log(data);
                    if (loading) {
                      return (
                        <ActivityIndicator
                          style={{ alignSelf: "center", padding: 16 }}
                        />
                      );
                    }
                    if (
                      data &&
                      data.getMoodCount &&
                      data.getMoodCount.length > 0
                    ) {
                      let chartData = [];
                      let chartLegend = [];
                      data.getMoodCount.forEach(mood => {
                        let moodMeta = Moods[Moods.length - mood.mood];
                        let moodData = {};
                        moodData.mood = mood.mood;
                        moodData.count = mood.count;
                        moodData.name = moodMeta.name;
                        moodData.color = moodMeta.color;
                        moodData.src = moodMeta.src;
                        chartLegend.push(moodData);
                        if (mood.count > 0) {
                          chartData.push(moodData);
                        }
                      });
                      {
                        /* chartData.forEach(mood => {
                        let moodMeta = Moods[Moods.length - mood.mood];
                        mood.name = moodMeta.name;
                        mood.color = moodMeta.color;
                        mood.src = moodMeta.src;
                      }); */
                      }
                      return (
                        <View style={{ justifyContent: "center" }}>
                          <VictoryPie
                            data={chartData}
                            x={"mood"}
                            y={"count"}
                            width={width - 48}
                            height={320}
                            padding={60}
                            innerRadius={48}
                            labels={d => d.name}
                            padAngle={3}
                            style={{
                              data: {
                                fill: d => d.color
                              }
                            }}
                          />
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "flex-start",
                              justifyContent: "space-between",
                              paddingVertical: 12,
                              paddingHorizontal: 12
                            }}
                          >
                            {chartLegend.map(datum => (
                              <View style={{ padding: 5 }}>
                                <Image
                                  source={datum.src}
                                  style={styles.imgStyle}
                                />
                                <View style={[styles.badgeStyle]}>
                                  <Text
                                    style={[
                                      styles.badgeText,
                                      { color: "#fff" }
                                    ]}
                                  >
                                    {datum.count}
                                  </Text>
                                </View>
                              </View>
                            ))}
                          </View>
                        </View>
                      );
                    } else
                      return (
                        <Text
                          style={[
                            TextStyles.SubHeaderBold,
                            {
                              padding: 16,
                              textAlign: "center",
                              alignSelf: "center"
                            }
                          ]}
                        >
                          No Data Available
                        </Text>
                      );
                  }}
                </Query>
              ) : (
                <PremiumView
                  style={{ height: 300, padding: 16, backgroundColor: "#fff" }}
                  imageStyle={{ width: "80%", height: "60%" }}
                  showSubscription={this.props.showSubscription}
                />
              )}
            </View>
            <View style={styles.innerContainer}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 16,
                  paddingBottom: 12
                }}
              >
                <Text style={[TextStyles.Header2, { paddingTop: 20 }]}>
                  Mood Correlations
                </Text>
                {this.props.isSubscribed && (
                  <Dropdown
                    containerStyle={{ width: 82, height: 40, marginTop: -16 }}
                    data={this.rangeOptions}
                    value={this.state.moodCorrelationRange}
                    rippleOpacity={0.0}
                    onChangeText={value =>
                      this.setState({
                        moodCorrelationRange: value
                      })
                    }
                  />
                )}
              </View>
              {this.props.isSubscribed ? (
                <Query
                  query={getMoodCorelationsQuery}
                  variables={getMonthRange(
                    this.state.currentMonth,
                    this.state.moodCorrelationRange
                  )}
                  fetchPolicy="cache-and-network"
                  onError={err => {
                    showApiError(true);
                    console.log(err);
                  }}
                >
                  {({ loading, data }) => {
                    console.log(data);
                    if (loading) {
                      return (
                        <ActivityIndicator
                          style={{
                            alignSelf: "center",
                            padding: 16,
                            height: 420
                          }}
                        />
                      );
                    }
                    if (
                      data &&
                      data.getMoodCorrelations &&
                      data.getMoodCorrelations.length > 0
                    ) {
                      return data.getMoodCorrelations.map(correlation => {
                        if (correlation.emotions.length > 0)
                          return (
                            <View
                              style={{
                                marginVertical: 12,
                                marginHorizontal: 16,
                                borderWidth: 2,
                                borderColor: "#f2f2f2",
                                borderRadius: 10,
                                overflow: "hidden",
                                padding: 16
                              }}
                            >
                              <View
                                style={{
                                  flex: 1,
                                  flexDirection: "row",
                                  alignItems: "center"
                                }}
                              >
                                <Image
                                  source={
                                    Moods[Moods.length - correlation.mood].src
                                  }
                                  style={{
                                    height: 64,
                                    width: 64,
                                    resizeMode: "contain"
                                  }}
                                />
                                <Image
                                  source={require("../../assets/images/redesign/Mood-graphic.png")}
                                  style={{
                                    position: "absolute",
                                    right: -12,
                                    top: -12
                                  }}
                                />
                                <Text
                                  style={[
                                    TextStyles.HeaderBold,
                                    { marginLeft: 24 }
                                  ]}
                                >
                                  {Moods[Moods.length - correlation.mood].name}
                                </Text>
                              </View>
                              <View style={{ marginTop: 16, marginBottom: 10 }}>
                                {correlation.emotions &&
                                  correlation.emotions.length && (
                                    <View
                                      animation="fadeIn"
                                      style={{
                                        marginTop: 5,
                                        marginBottom: 5,
                                        flexDirection: "row"
                                      }}
                                    >
                                      {this.renderSectionIcon(
                                        require("../../src/emotion_neutral.png")
                                      )}
                                      <View
                                        style={{
                                          flex: 1,
                                          justifyContent: "center",
                                          marginLeft: 16
                                        }}
                                      >
                                        <Text style={[styles.subHeaderItem]}>
                                          Emotions
                                        </Text>
                                        {this.renderChips(
                                          correlation.emotions,
                                          "emotions"
                                        )}
                                      </View>
                                    </View>
                                  )}
                                {correlation.sleep && (
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

                                      <View
                                        style={{
                                          flexDirection: "row",
                                          flex: 1,
                                          alignItems: "center"
                                        }}
                                      >
                                        <Text
                                          style={[
                                            TextStyles.ContentText,
                                            { color: "#888", marginLeft: 4 }
                                          ]}
                                        >
                                          {"Medication : "}
                                        </Text>
                                        <Text
                                          style={[
                                            TextStyles.ContentTextBold,
                                            {
                                              paddingHorizontal: 12,
                                              borderWidth: 1,
                                              borderRadius: 12,
                                              marginRight: 8,
                                              height: 24,
                                              paddingTop: 4,
                                              textAlign: "center",
                                              borderColor: ThemeStyle.green
                                            }
                                          ]}
                                        >{`Yes : ${correlation.medication.yes}`}</Text>
                                        <Text
                                          style={[
                                            TextStyles.ContentTextBold,
                                            {
                                              paddingHorizontal: 12,
                                              borderWidth: 1,
                                              borderRadius: 10,
                                              marginRight: 8,
                                              height: 20,
                                              paddingTop: 2,
                                              textAlign: "center",
                                              borderColor: ThemeStyle.red
                                            }
                                          ]}
                                        >{`No : ${correlation.medication.no}`}</Text>
                                      </View>
                                      <Text
                                        style={[
                                          TextStyles.ContentText,
                                          {
                                            color: "#888",
                                            marginLeft: 4,
                                            marginTop: 8
                                          }
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
                                          {correlation.sleep}
                                        </Text>
                                      </Text>
                                    </View>
                                  </View>
                                )}
                                {correlation.exercises &&
                                  correlation.exercises.length > 0 && (
                                    <Animatable.View
                                      animation="fadeIn"
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
                                        <Text style={[styles.subHeaderItem]}>
                                          Skills
                                        </Text>
                                        {this.renderChips(
                                          correlation.exercises,
                                          "exercise"
                                        )}
                                      </View>
                                    </Animatable.View>
                                  )}
                                {correlation.skills &&
                                  correlation.skills.length > 0 && (
                                    <Animatable.View
                                      animation="fadeIn"
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
                                        <Text style={[styles.subHeaderItem]}>
                                          Skills
                                        </Text>
                                        {this.renderChips(
                                          correlation.skills,
                                          "skill"
                                        )}
                                      </View>
                                    </Animatable.View>
                                  )}
                                {correlation.targets &&
                                  correlation.targets.length > 0 && (
                                    <Animatable.View
                                      animation="fadeIn"
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
                                        <Text style={[styles.subHeaderItem]}>
                                          Targets
                                        </Text>
                                        {this.renderChips(
                                          correlation.targets,
                                          "target"
                                        )}
                                      </View>
                                    </Animatable.View>
                                  )}
                                {correlation.activities &&
                                  correlation.activities.length > 0 && (
                                    <Animatable.View
                                      animation="fadeIn"
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
                                        {this.renderChips(
                                          correlation.activities,
                                          "activity"
                                        )}
                                      </View>
                                    </Animatable.View>
                                  )}
                              </View>
                            </View>
                          );
                      });
                    } else
                      return (
                        <Text
                          style={[
                            TextStyles.SubHeaderBold,
                            {
                              padding: 16,
                              textAlign: "center",
                              alignSelf: "center"
                            }
                          ]}
                        >
                          No Data Available
                        </Text>
                      );
                  }}
                </Query>
              ) : (
                <PremiumView
                  style={{ height: 300, padding: 16, backgroundColor: "#fff" }}
                  imageStyle={{ width: "80%", height: "60%" }}
                  showSubscription={this.props.showSubscription}
                />
              )}
              
            </View>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('GraphScreen', {isBack: true})}>
              <View style={styles.innerContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: 16,
                    paddingBottom: 12
                  }}
                >
                  <Text style={[TextStyles.Header2, { paddingTop: 20 }]}>
                    Physical Health and Nutrition
                  </Text>
                  {this.props.isSubscribed && (
                    <Dropdown
                      containerStyle={{ width: 82, height: 40, marginTop: -16 }}
                      data={this.rangeOptions}
                      value={this.state.moodCorrelationRange}
                      rippleOpacity={0.0}
                      onChangeText={value =>
                        this.setState({
                          moodCorrelationRange: value
                        })
                      }
                    />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {this.getSharing()}
      </View>
    );
  }

  getSharing = () => (
    <Sharing
      currentDate={this.state.currentMonth}
      setRef={ref => (this.shareDialog = ref)}
      visible={this.state.shareDialogVisible}
      onShare={this.onShare}
      onClose={() => {
        this.setState({ shareDialogVisible: false });
      }}
      setLoading={this.props.setLoading}
    />
  );
  onSharePress = async () => {
    if (this.props.isSubscribed) {
      this.props.setLoading(true);
      let user = await Auth.currentAuthenticatedUser();
      if (user && user.attributes.name && user.attributes.name !== "") {
        // console.log("showing share", this.shareDialog);
        this.props.setLoading(false);
        this.setState({
          shareDialogVisible: true
        });
      } else {
        this.props.setLoading(false);
        console.log("complete profile");
        showMessage({
          type: "warning",
          message: "Please complete your profile."
        });
        setTimeout(() => {
          this.props.navigation.navigate("EditProfileScreen");
        }, 1000);
      }
    } else {
      this.props.showSubscription();
    }
  };
  onShare = () => {
    showMessage({
      type: "success",
      message: "Success",
      description: "Email has been sent successfully!!"
    });
  };

  renderChips(data, type) {
    let elementsList = [];
    console.log("RENDER CHIPS", data, type);
    data.map(data => {
      elementsList.push(
        <TouchableOpacity
          key={data.id}
          style={{
            paddingHorizontal: 12,
            borderWidth: 1,
            marginRight: 8,
            marginBottom: 8,
            borderRadius: 20,
            borderColor: ThemeStyle.disabledLight,
            backgroundColor: "#fff",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <Text
            style={[
              TextStyles.ContentText,
              {
                color:
                  type === "exercise" || type == "emotions"
                    ? data.color
                    : data[type].color,
                paddingLeft: 10,
                paddingRight: 8,
                paddingVertical: 4
              }
            ]}
          >
            {type == "exercise" ? data.title : data.name}
          </Text>
          {data.count && (
            <View
              style={{
                backgroundColor: ThemeStyle.mainColorLight,
                borderRadius: 9,
                width: 18,
                height: 18,
                marginRight: 4,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 3
              }}
            >
              <Text style={[TextStyles.ContentText]}>{data.count}</Text>
            </View>
          )}
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
}

class MoodDataComponent extends React.Component {
  render() {
    const { datum, x, y } = this.props;
    let mood = Moods[5 - Math.round(datum.mood)];
    // let mood = _.find(Moods, { id: datum.mood });
    return (
      <G transform={`translate(${x - 12}, ${y - 12})`}>
        <SVGImage width={24} height={24} href={mood.src} />
      </G>
    );
  }
}

export default withSubscriptionActions(
  Summary,
  () => {},
  dispatch => ({
    clearRecordFlow: () => dispatch(clearState())
  })
);

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: ThemeStyle.backgroundColor,
    height: Platform.OS === "ios" ? 64 : 54,
    flexDirection: "row"
  },
  container: {
    flex: 1,
    marginHorizontal: 16
  },
  textStyle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    paddingVertical: 3
  },
  textStyle1: {
    fontSize: 14,
    color: "#80d6a1"
  },
  innerContainer: {
    marginVertical: 16,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "lightgrey",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 5
  },
  calendar: {
    borderColor: "#fff",
    borderRadius: 5,
    padding: 12
  },
  imgStyle: {
    height: 30,
    width: 30,
    resizeMode: "contain"
  },
  borderContainer: {
    borderTopWidth: 1,
    paddingVertical: 15,
    borderColor: "lightgrey"
  },
  badgeStyle: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: ThemeStyle.red,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold"
  },
  correlationTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10
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
