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
import { getSummaryTimeLineViewQuery } from "../../queries/getTimeLineView";
import Amplify from "aws-amplify";
import { getAmplifyConfig, getEnvVars } from "../../constants";
import { API } from "aws-amplify";

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0,
  color: (opacity = 1) => `rgba(255, 98, 89, ${opacity})`,
  strokeWidth: 3, // optional, default 3
  barPercentage: 1,
  useShadowColorFromDataset: false,
  propsForBackgroundLines: {
    strokeWidth: 0
  },
  // propsForDots: {
  //   r: "4",
  //   strokeWidth: "2",
  //   stroke: "#000",
  //   backgroundColor: 'red'
  // }
}

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMonth: moment(),
      moodChartRange: "week",
      moodCountRange: "week",
      moodCorrelationRange: "week",
      shareDialogVisible: false,
      summaryList: [],
      foodData: {
        labels: [],
        datasets: [
          {
            data: [],
            color: (opacity = 1) => `rgba(207, 116, 237, ${opacity})`
          },
          {
            data: [],
            color: (opacity = 1) => `rgba(241, 206, 80, ${opacity})`
          },
          {
            data: [],
            color: (opacity = 1) => `rgba(255, 98, 89, ${opacity})`
          },
          {
            data: [],
            color: (opacity = 1) => `rgba(65, 145, 251, ${opacity})`
          }
        ],
      },
      ExerciseData: {
        labels: [],
        datasets: [
          {
            data: [],
            color: (opacity = 1) => `rgba(207, 116, 237, ${opacity})`
          },
          {
            data: [],
            color: (opacity = 1) => `rgba(241, 206, 80, ${opacity})`
          },
          {
            data: [],
            color: (opacity = 1) => `rgba(255, 98, 89, ${opacity})`
          },
          {
            data: [],
            color: (opacity = 1) => `rgba(65, 145, 251, ${opacity})`
          }
        ],
      },
      SleepData: {
        labels: [],
        datasets: [
          {
            data: [],
            color: (opacity = 1) => `rgba(65, 145, 251, ${opacity})`
          },
          {
            data: [],
            color: (opacity = 1) => `rgba(207, 116, 237, ${opacity})`
          },
        ],
      }
    };
  }

  componentDidMount() {
    this.listener = this.props.navigation.addListener("didFocus", payload => {
      console.log("Focused graph");
      this.props.clearRecordFlow();
    });
    this.getAllData()
  }

  getAllData() { 
    Amplify.configure(
      getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
    );
    API.graphql({
      query: getSummaryTimeLineViewQuery,
      variables: getMonthRange(this.state.currentMonth, 'week')
    })
      .then(summarydata => {
        console.log('==========>', summarydata.data.getSummary)
        this.props.setLoading(false);
        
        let dateLabels = [];
        let caloriesSets = [];
        let carbsSets = [];
        let proteinSets = [];
        let fatSets = [];
        let exercise_calroiesSets = [];
        let exercise_TimeSets = [];
        let exercise_DistanceSets = [];
        let sleep_SleepSets = [];
        let sleep_MindfulnessSets = [];

        summarydata.data.getSummary.map((item, index) => {
          dateLabels.push(item.date.substr(5,5))
        })
        summarydata.data.getSummary.map((item, index) => {
          caloriesSets.push(item.nutrition.calories.value)
        })
        summarydata.data.getSummary.map((item, index) => {
          carbsSets.push(item.nutrition.carbs.value)
        })
        summarydata.data.getSummary.map((item, index) => {
          proteinSets.push(item.nutrition.protein.value)
        })
        summarydata.data.getSummary.map((item, index) => {
          fatSets.push(item.nutrition.fat.value)
        })
        summarydata.data.getSummary.map((item, index) => {
          exercise_calroiesSets.push(item.healthExercise.calories.value)
        })
        summarydata.data.getSummary.map((item, index) => {
          exercise_TimeSets.push(item.healthExercise.distance.value)
        })
        summarydata.data.getSummary.map((item, index) => {
          exercise_DistanceSets.push(item.healthExercise.duration.value)
        })
        summarydata.data.getSummary.map((item, index) => {
          sleep_SleepSets.push(item.sleep.totalMinutes)
        })
        summarydata.data.getSummary.map((item, index) => {
          sleep_MindfulnessSets.push(item.mindfulnessMinutes.totalMinutes)
        })

        this.setState({
          foodData: {
            labels: dateLabels,
            datasets: [
              {
                data: caloriesSets,
                color: (opacity = 1) => `rgba(207, 116, 237, ${opacity})`
              },
              {
                data: carbsSets,
                color: (opacity = 1) => `rgba(241, 206, 80, ${opacity})`
              },
              {
                data: proteinSets,
                color: (opacity = 1) => `rgba(255, 98, 89, ${opacity})`
              },
              {
                data: fatSets,
                color: (opacity = 1) => `rgba(65, 145, 251, ${opacity})`
              }
            ],
          },
          ExerciseData: {
            labels: dateLabels,
            datasets: [
              {
                data: exercise_calroiesSets,
                color: (opacity = 1) => `rgba(207, 116, 237, ${opacity})`
              },
              {
                data: exercise_TimeSets,
                color: (opacity = 1) => `rgba(241, 206, 80, ${opacity})`
              },
              {
                data: exercise_DistanceSets,
                color: (opacity = 1) => `rgba(65, 145, 251, ${opacity})`
              }
            ],
          },
          SleepData: {
            labels: dateLabels,
            datasets: [
              {
                data: sleep_SleepSets,
                color: (opacity = 1) => `rgba(65, 145, 251, ${opacity})`
              },
              {
                data: sleep_MindfulnessSets,
                color: (opacity = 1) => `rgba(207, 116, 237, ${opacity})`
              },
            ],
          }
        });
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        // dispatch(setLoading(false));
      });
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
              Client
            </Text>
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
              <Icon
                family={"Feather"}
                name={"more-vertical"}
                size={20}
              />
            </View>
          </TouchableHighlight>
        </View>
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.textStyle}>Food</Text>
            <View style={styles.innerContainer}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity>
                  <View style={styles.checkBoxView}>
                    <Icon
                      family={"Ionicons"}
                      name={"ios-checkbox"}
                      color="#cf74ed"
                      size={22}
                    />
                    <Text>  Calories</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View style={styles.checkBoxView}>
                    <Icon
                      family={"Ionicons"}
                      name={"ios-checkbox"}
                      color="#f1ce50"
                      size={22}
                    />
                    <Text>  Carbs</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View style={styles.checkBoxView}>
                    <Icon
                      family={"Ionicons"}
                      name={"ios-checkbox"}
                      color="#ff6259"
                      size={22}
                    />
                    <Text>  Protein</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View style={styles.checkBoxView}>
                    <Icon
                      family={"Ionicons"}
                      name={"ios-checkbox"}
                      color="#4191fb"
                      size={22}
                    />
                    <Text>  Fat</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <LineChart
                  data={this.state.foodData}
                  width={Dimensions.get("window").width+30} 
                  height={220}
                  chartConfig={chartConfig}
                  withHorizontalLabels={false}
                  withShadow={false}
                  // withDots={false}
                  // getDotColor={(opacity = 0) => `rgba(255, 255, 255, ${opacity})`}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                    marginLeft: -47
                  }}
                />
              </View>
            </View>

            <Text style={styles.textStyle}>Exercise</Text>
            <View style={styles.innerContainer}>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                <TouchableOpacity>
                  <View style={styles.checkBoxView}>
                    <Icon
                      family={"Ionicons"}
                      name={"ios-checkbox"}
                      color="#cf74ed"
                      size={22}
                    />
                    <Text>  Calories</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View style={styles.checkBoxView}>
                    <Icon
                      family={"Ionicons"}
                      name={"ios-checkbox"}
                      color="#f1ce50"
                      size={22}
                    />
                    <Text>  Time</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View style={styles.checkBoxView}>
                    <Icon
                      family={"Ionicons"}
                      name={"ios-checkbox"}
                      color="#4191fb"
                      size={22}
                    />
                    <Text>  Distance</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <LineChart
                  data={this.state.ExerciseData}
                  width={Dimensions.get("window").width+30} 
                  height={220}
                  chartConfig={chartConfig}
                  withHorizontalLabels={false}
                  withShadow={false}
                  // withDots={false}
                  // getDotColor={(opacity = 0) => `rgba(255, 255, 255, ${opacity})`}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                    marginLeft: -47
                  }}
                />
              </View>
            </View>

            <Text style={styles.textStyle}>Sleep & Mindfulness</Text>
            <View style={styles.innerContainer}>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end',}}>
                <TouchableOpacity>
                  <View style={styles.checkBoxView}>
                    <Icon
                      family={"Ionicons"}
                      name={"ios-checkbox"}
                      color="#4191fb"
                      size={22}
                    />
                    <Text>  Sleep</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View style={[styles.checkBoxView, {width: 120}]}>
                    <Icon
                      family={"Ionicons"}
                      name={"ios-checkbox"}
                      color="#cf74ed"
                      size={22}
                    />
                    <Text>  Mindfulness</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <LineChart
                  data={this.state.SleepData}
                  width={Dimensions.get("window").width+30} 
                  height={220}
                  chartConfig={chartConfig}
                  withHorizontalLabels={false}
                  withShadow={false}
                  // withDots={false}
                  // getDotColor={(opacity = 0) => `rgba(255, 255, 255, ${opacity})`}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                    marginLeft: -47
                  }}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default withSubscriptionActions(
  Graph,
  () => {},
  dispatch => ({
    clearRecordFlow: () => dispatch(clearState()),
    getNutritionixInstantFoodList: (query, data) =>
      dispatch(getNutritionixInstantFoodList(query, data)),
    getNutritionixNutrientsFoodList: (formdata, data) => 
      dispatch(getNutritionixNutrientsFoodList(formdata, data)),
    getNutritionixFoodItem: (itemId, data) =>
      dispatch(getNutritionixFoodItem(itemId, data)),
    getFoodEntries: (date, fetchListData) =>
      dispatch(getFoodEntries(date, fetchListData)),
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
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
  },
  innerContainer: {
    marginVertical: 16,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "lightgrey",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    padding: 16,
  },
  checkBoxView: {
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: (width - 64)/4,
  }
});
