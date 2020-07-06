import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import moment from 'moment';
import Icon from '../../common/icons';
import ThemeStyle from '../../styles/ThemeStyle';
import { getMonthRange } from '../../utils/DateTimeUtils';
import TextStyles from '../../common/TextStyles';
import { Dropdown } from 'react-native-material-dropdown';
import { withSubscriptionActions } from '../../utils/StoreUtils';
import { clearState } from '../../actions/RecordActions';
const { width } = Dimensions.get('screen');
import { getSummaryTimeLineViewQuery } from '../../queries/getTimeLineView';
import Amplify from 'aws-amplify';
import { getAmplifyConfig, getEnvVars } from '../../constants';
import { API } from 'aws-amplify';
import { LineChart } from 'react-native-chart-kit';

const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0,
  color: (opacity = 1) => `rgba(255, 98, 89, ${opacity})`,
  strokeWidth: 3, // optional, default 3
  barPercentage: 1,
  useShadowColorFromDataset: false,
  propsForBackgroundLines: {
    strokeWidth: 0,
  },
  // propsForDots: {
  //   r: "4",
  //   strokeWidth: "2",
  //   stroke: "#000",
  //   backgroundColor: 'red'
  // }
};

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMonth: moment(),
      dateRange: 'week',
      shareDialogVisible: false,
      isClicked_food_calories: true,
      isClicked_food_carbs: true,
      isClicked_food_protein: true,
      isClicked_food_fat: true,
      isClicked_exercise_calories: true,
      isClicked_exercise_time: true,
      isClicked_exercise_distance: true,
      isClicked_sleep_sleep: true,
      isClicked_sleep_mindfulness: true,
      dateLabels: [],
      food_caloriesSets: [],
      food_carbsSets: [],
      food_proteinSets: [],
      food_fatSets: [],
      exercise_calroiesSets: [],
      exercise_TimeSets: [],
      exercise_DistanceSets: [],
      sleep_SleepSets: [],
      sleep_MindfulnessSets: [],
      summaryList: [],
      foodData: {
        labels: [],
        datasets: [
          {
            data: [],
            color: (opacity = 1) => `rgba(207, 116, 237, ${opacity})`,
          },
          {
            data: [],
            color: (opacity = 1) => `rgba(241, 206, 80, ${opacity})`,
          },
          {
            data: [],
            color: (opacity = 1) => `rgba(255, 98, 89, ${opacity})`,
          },
          {
            data: [],
            color: (opacity = 1) => `rgba(65, 145, 251, ${opacity})`,
          },
        ],
      },
      ExerciseData: {
        labels: [],
        datasets: [
          {
            data: [],
            color: (opacity = 1) => `rgba(207, 116, 237, ${opacity})`,
          },
          {
            data: [],
            color: (opacity = 1) => `rgba(241, 206, 80, ${opacity})`,
          },
          {
            data: [],
            color: (opacity = 1) => `rgba(255, 98, 89, ${opacity})`,
          },
          {
            data: [],
            color: (opacity = 1) => `rgba(65, 145, 251, ${opacity})`,
          },
        ],
      },
      SleepData: {
        labels: [],
        datasets: [
          {
            data: [],
            color: (opacity = 1) => `rgba(65, 145, 251, ${opacity})`,
          },
          {
            data: [],
            color: (opacity = 1) => `rgba(207, 116, 237, ${opacity})`,
          },
        ],
      },
    };
    this.rangeOptions = [
      {
        label: '7 days',
        value: 'week',
      },
      {
        label: '30 days',
        value: 'month',
      },
      {
        label: '1 year',
        value: 'year',
      },
    ];
  }

  componentDidMount() {
    this.listener = this.props.navigation.addListener('didFocus', () => {
      console.log('Focused graph');
      this.props.clearRecordFlow();
    });
    this.getAllData(this.state.dateRange);
  }

  getAllData(dateRange) {
    Amplify.configure(
      getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
    );
    API.graphql({
      query: getSummaryTimeLineViewQuery,
      variables: getMonthRange(this.state.currentMonth, dateRange),
    })
      .then(summarydata => {
        console.log('==========>', summarydata.data.getSummary);
        this.props.setLoading(false);

        let dateLabels = [];
        let food_caloriesSets = [];
        let food_carbsSets = [];
        let food_proteinSets = [];
        let food_fatSets = [];
        let exercise_calroiesSets = [];
        let exercise_TimeSets = [];
        let exercise_DistanceSets = [];
        let sleep_SleepSets = [];
        let sleep_MindfulnessSets = [];

        summarydata.data.getSummary.map(item => {
          dateLabels.push(item.date.substr(5, 5));
        });
        summarydata.data.getSummary.map(item => {
          console.log(item.nutrition.calories.value)
          food_caloriesSets.push(item.nutrition.calories.value);
        });
        summarydata.data.getSummary.map(item => {
          food_carbsSets.push(item.nutrition.carbs.value * 7);
        });
        summarydata.data.getSummary.map(item => {
          food_proteinSets.push(item.nutrition.protein.value * 11);
        });
        summarydata.data.getSummary.map(item => {
          food_fatSets.push(item.nutrition.fat.value * 8);
        });
        summarydata.data.getSummary.map(item => {
          exercise_calroiesSets.push(item.healthExercise.calories.value);
        });
        summarydata.data.getSummary.map(item => {
          exercise_TimeSets.push(item.healthExercise.distance.value);
        });
        summarydata.data.getSummary.map(item => {
          exercise_DistanceSets.push(item.healthExercise.duration.value);
        });
        summarydata.data.getSummary.map(item => {
          sleep_SleepSets.push(item.sleep.totalMinutes);
        });
        summarydata.data.getSummary.map(item => {
          sleep_MindfulnessSets.push(item.mindfulnessMinutes.totalMinutes);
        });

        this.setState({
          dateLabels: dateLabels,
          food_caloriesSets: food_caloriesSets,
          food_carbsSets: food_carbsSets,
          food_proteinSets: food_proteinSets,
          food_fatSets: food_fatSets,
          exercise_calroiesSets: exercise_calroiesSets,
          exercise_TimeSets: exercise_TimeSets,
          exercise_DistanceSets: exercise_DistanceSets,
          sleep_SleepSets: sleep_SleepSets,
          sleep_MindfulnessSets: sleep_MindfulnessSets,
          foodData: {
            labels: dateLabels,
            datasets: [
              {
                data: food_caloriesSets,
                color: (opacity = 1) => `rgba(207, 116, 237, ${opacity})`,
              },
              {
                data: food_carbsSets,
                color: (opacity = 1) => `rgba(241, 206, 80, ${opacity})`,
              },
              {
                data: food_proteinSets,
                color: (opacity = 1) => `rgba(255, 98, 89, ${opacity})`,
              },
              {
                data: food_fatSets,
                color: (opacity = 1) => `rgba(65, 145, 251, ${opacity})`,
              },
            ],
          },
          ExerciseData: {
            labels: dateLabels,
            datasets: [
              {
                data: exercise_calroiesSets,
                color: (opacity = 1) => `rgba(207, 116, 237, ${opacity})`,
              },
              {
                data: exercise_TimeSets,
                color: (opacity = 1) => `rgba(241, 206, 80, ${opacity})`,
              },
              {
                data: exercise_DistanceSets,
                color: (opacity = 1) => `rgba(65, 145, 251, ${opacity})`,
              },
            ],
          },
          SleepData: {
            labels: dateLabels,
            datasets: [
              {
                data: sleep_SleepSets,
                color: (opacity = 1) => `rgba(65, 145, 251, ${opacity})`,
              },
              {
                data: sleep_MindfulnessSets,
                color: (opacity = 1) => `rgba(207, 116, 237, ${opacity})`,
              },
            ],
          },
        });
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        // dispatch(setLoading(false));
      });
  }

  onClickedFood(val) {
    switch (val) {
      case 0:
        this.setState({
          isClicked_food_calories: !this.state.isClicked_food_calories,
          foodData: {
            labels: this.state.dateLabels,
            datasets: [
              {
                data: this.state.food_caloriesSets,
                color: (opacity = 1) => `rgba(207, 116, 237, ${this.state.isClicked_food_calories ? opacity : 0})`
              },
              {
                data: this.state.food_carbsSets,
                color: (opacity = 1) => `rgba(241, 206, 80, ${this.state.isClicked_food_carbs ? opacity : 0})`,
              },
              {
                data: this.state.food_proteinSets,
                color: (opacity = 1) => `rgba(255, 98, 89, ${this.state.isClicked_food_protein ? opacity : 0})`,
              },
              {
                data: this.state.food_fatSets,
                color: (opacity = 1) => `rgba(65, 145, 251, ${this.state.isClicked_food_fat ? opacity : 0})`,
              },
            ],
          }
        });
        break;
      case 1:
        this.setState({
          isClicked_food_carbs: !this.state.isClicked_food_carbs,
          foodData: {
            labels: this.state.dateLabels,
            datasets: [
              {
                data: this.state.food_caloriesSets,
                color: (opacity = 1) => `rgba(207, 116, 237, ${this.state.isClicked_food_calories ? opacity : 0})`
              },
              {
                data: this.state.food_carbsSets,
                color: (opacity = 1) => `rgba(241, 206, 80, ${this.state.isClicked_food_carbs ? opacity : 0})`,
              },
              {
                data: this.state.food_proteinSets,
                color: (opacity = 1) => `rgba(255, 98, 89, ${this.state.isClicked_food_protein ? opacity : 0})`,
              },
              {
                data: this.state.food_fatSets,
                color: (opacity = 1) => `rgba(65, 145, 251, ${this.state.isClicked_food_fat ? opacity : 0})`,
              },
            ],
          }
        });
        break;
      case 2:
        this.setState({
          isClicked_food_protein: !this.state.isClicked_food_protein,
          foodData: {
            labels: this.state.dateLabels,
            datasets: [
              {
                data: this.state.food_caloriesSets,
                color: (opacity = 1) => `rgba(207, 116, 237, ${this.state.isClicked_food_calories ? opacity : 0})`
              },
              {
                data: this.state.food_carbsSets,
                color: (opacity = 1) => `rgba(241, 206, 80, ${this.state.isClicked_food_carbs ? opacity : 0})`,
              },
              {
                data: this.state.food_proteinSets,
                color: (opacity = 1) => `rgba(255, 98, 89, ${this.state.isClicked_food_protein ? opacity : 0})`,
              },
              {
                data: this.state.food_fatSets,
                color: (opacity = 1) => `rgba(65, 145, 251, ${this.state.isClicked_food_fat ? opacity : 0})`,
              },
            ],
          }
        });
        break;
      case 3:
        this.setState({
          isClicked_food_fat: !this.state.isClicked_food_fat,
          foodData: {
            labels: this.state.dateLabels,
            datasets: [
              {
                data: this.state.food_caloriesSets,
                color: (opacity = 1) => `rgba(207, 116, 237, ${this.state.isClicked_food_calories ? opacity : 0})`
              },
              {
                data: this.state.food_carbsSets,
                color: (opacity = 1) => `rgba(241, 206, 80, ${this.state.isClicked_food_carbs ? opacity : 0})`,
              },
              {
                data: this.state.food_proteinSets,
                color: (opacity = 1) => `rgba(255, 98, 89, ${this.state.isClicked_food_protein ? opacity : 0})`,
              },
              {
                data: this.state.food_fatSets,
                color: (opacity = 1) => `rgba(65, 145, 251, ${this.state.isClicked_food_fat ? opacity : 0})`,
              },
            ],
          }
        });
        break;
    }
  }

  onClickedExercise(val) {
    switch (val) {
      case 0:
        this.setState({
          isClicked_exercise_calories: !this.state.isClicked_exercise_calories,
          ExerciseData: {
            labels: this.state.dateLabels,
            datasets: [
              {
                data: this.state.exercise_calroiesSets,
                color: (opacity = 1) => `rgba(207, 116, 237, ${this.state.isClicked_exercise_calories? opacity : 0})`,
              },
              {
                data: this.state.exercise_TimeSets,
                color: (opacity = 1) => `rgba(241, 206, 80, ${this.state.isClicked_exercise_time? opacity : 0})`,
              },
              {
                data: this.state.exercise_DistanceSets,
                color: (opacity = 1) => `rgba(65, 145, 251, ${this.state.isClicked_exercise_distance? opacity : 0})`,
              },
            ],
          }
        });
        break;
      case 1:
        this.setState({
          isClicked_exercise_time: !this.state.isClicked_exercise_time,
          ExerciseData: {
            labels: this.state.dateLabels,
            datasets: [
              {
                data: this.state.exercise_calroiesSets,
                color: (opacity = 1) => `rgba(207, 116, 237, ${this.state.isClicked_exercise_calories? opacity : 0})`,
              },
              {
                data: this.state.exercise_TimeSets,
                color: (opacity = 1) => `rgba(241, 206, 80, ${this.state.isClicked_exercise_time? opacity : 0})`,
              },
              {
                data: this.state.exercise_DistanceSets,
                color: (opacity = 1) => `rgba(65, 145, 251, ${this.state.isClicked_exercise_distance? opacity : 0})`,
              },
            ],
          }
        });
        break;
      case 2:
        this.setState({
          isClicked_exercise_distance: !this.state.isClicked_exercise_distance,
          ExerciseData: {
            labels: this.state.dateLabels,
            datasets: [
              {
                data: this.state.exercise_calroiesSets,
                color: (opacity = 1) => `rgba(207, 116, 237, ${this.state.isClicked_exercise_calories? opacity : 0})`,
              },
              {
                data: this.state.exercise_TimeSets,
                color: (opacity = 1) => `rgba(241, 206, 80, ${this.state.isClicked_exercise_time? opacity : 0})`,
              },
              {
                data: this.state.exercise_DistanceSets,
                color: (opacity = 1) => `rgba(65, 145, 251, ${this.state.isClicked_exercise_distance? opacity : 0})`,
              },
            ],
          }
        });
        break;
    }
  }

  onClickedSleep(val) {
    switch(val) {
      case 0:
        this.setState({
          isClicked_sleep_sleep: !this.state.isClicked_sleep_sleep,
          SleepData: {
            labels: this.state.dateLabels,
            datasets: [
              {
                data: this.state.sleep_SleepSets,
                color: (opacity = 1) => `rgba(65, 145, 251, ${this.state.isClicked_sleep_sleep? opacity : 0})`,
              },
              {
                data: this.state.sleep_MindfulnessSets,
                color: (opacity = 1) => `rgba(207, 116, 237, ${this.state.isClicked_sleep_mindfulness? opacity : 0})`,
              },
            ],
          }
        });
        break;
      case 1:
        this.setState({
          isClicked_sleep_mindfulness: !this.state.isClicked_sleep_mindfulness,
          SleepData: {
            labels: this.state.dateLabels,
            datasets: [
              {
                data: this.state.sleep_SleepSets,
                color: (opacity = 1) => `rgba(65, 145, 251, ${this.state.isClicked_sleep_sleep? opacity : 0})`,
              },
              {
                data: this.state.sleep_MindfulnessSets,
                color: (opacity = 1) => `rgba(207, 116, 237, ${this.state.isClicked_sleep_mindfulness? opacity : 0})`,
              },
            ],
          }
        });
        break;
    }
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
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              isBack
                ? this.props.navigation.goBack('')
                : this.props.navigation.openDrawer();
            }}
          >
            <Image source={require('../../assets/images/redesign/Back.png')} />
          </TouchableHighlight>
          <View
            style={{
              flex: 5,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}
          >
            <Text
              style={[
                TextStyles.SubHeaderBold,
                {
                  fontWeight: 'bold',
                  fontSize: 21,
                  marginVertical: 3,
                },
              ]}
            >
              Health and Nutrition
            </Text>
          </View>
          <Dropdown
            containerStyle={{
              width: 82,
              height: 40,
              marginTop: -16,
              marginRight: 10,
            }}
            data={this.rangeOptions}
            value={this.state.dateRange}
            rippleOpacity={0.0}
            dropdownPosition={0}
            onChangeText={value => {
              // this.setState({
              //   dateRange: value
              // });
              this.getAllData(value);
            }}
          />
        </View>
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.textStyle}>Food</Text>
            <View style={styles.innerContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <TouchableOpacity onPress={() => this.onClickedFood(0)}>
                  <View style={styles.checkBoxView}>
                    {this.state.isClicked_food_calories ? (
                      <Icon
                        family={'MaterialIcons'}
                        name={'check-box'}
                        color="#cf74ed"
                        size={22}
                      />
                    ) : (
                      <Icon
                        family={'MaterialIcons'}
                        name={'check-box-outline-blank'}
                        color="lightgray"
                        size={22}
                      />
                    )}
                    <Text> Calories</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.onClickedFood(1)}>
                  <View style={styles.checkBoxView}>
                    {this.state.isClicked_food_carbs ? (
                      <Icon
                        family={'MaterialIcons'}
                        name={'check-box'}
                        color="#f1ce50"
                        size={22}
                      />
                    ) : (
                      <Icon
                        family={'MaterialIcons'}
                        name={'check-box-outline-blank'}
                        color="lightgray"
                        size={22}
                      />
                    )}
                    <Text> Carbs</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.onClickedFood(2)}>
                  <View style={styles.checkBoxView}>
                    {this.state.isClicked_food_protein ? (
                      <Icon
                        family={'MaterialIcons'}
                        name={'check-box'}
                        color="#ff6259"
                        size={22}
                      />
                    ) : (
                      <Icon
                        family={'MaterialIcons'}
                        name={'check-box-outline-blank'}
                        color="lightgray"
                        size={22}
                      />
                    )}
                    <Text> Protein</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.onClickedFood(3)}>
                  <View style={styles.checkBoxView}>
                    {this.state.isClicked_food_fat ? (
                      <Icon
                        family={'MaterialIcons'}
                        name={'check-box'}
                        color="#4191fb"
                        size={22}
                      />
                    ) : (
                      <Icon
                        family={'MaterialIcons'}
                        name={'check-box-outline-blank'}
                        color="lightgray"
                        size={22}
                      />
                    )}
                    <Text> Fat</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <LineChart
                  data={this.state.foodData}
                  width={Dimensions.get('window').width + 30}
                  height={220}
                  chartConfig={chartConfig}
                  withHorizontalLabels={false}
                  withShadow={false}
                  // withDots={false}
                  // getDotColor={(opacity = 0) => `rgba(255, 255, 255, ${opacity})`}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                    marginLeft: -47,
                  }}
                />
              </View>
            </View>

            <Text style={styles.textStyle}>Exercise</Text>
            <View style={styles.innerContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                }}
              >
                <TouchableOpacity onPress={() => this.onClickedExercise(0)}>
                  <View style={styles.checkBoxView}>
                    {this.state.isClicked_exercise_calories? (
                      <Icon
                        family={'MaterialIcons'}
                        name={'check-box'}
                        color="#cf74ed"
                        size={22}
                      />
                    ) : (
                      <Icon
                        family={'MaterialIcons'}
                        name={'check-box-outline-blank'}
                        color="lightgray"
                        size={22}
                      />)}
                    <Text> Calories</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.onClickedExercise(1)}>
                  <View style={styles.checkBoxView}>
                    {this.state.isClicked_exercise_time? (
                      <Icon
                        family={'MaterialIcons'}
                        name={'check-box'}
                        color="#f1ce50"
                        size={22}
                      />
                    ) : (
                      <Icon
                        family={'MaterialIcons'}
                        name={'check-box-outline-blank'}
                        color="lightgray"
                        size={22}
                      />
                    )}
                    <Text> Time</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.onClickedExercise(2)}>
                  <View style={styles.checkBoxView}>
                    {this.state.isClicked_exercise_distance ? (
                      <Icon
                        family={'MaterialIcons'}
                        name={'check-box'}
                        color="#4191fb"
                        size={22}
                      />
                    ) : (
                      <Icon
                        family={'MaterialIcons'}
                        name={'check-box-outline-blank'}
                        color="lightgray"
                        size={22}
                      />
                    )
                    }
                    <Text> Distance</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <LineChart
                  data={this.state.ExerciseData}
                  width={Dimensions.get('window').width + 30}
                  height={220}
                  chartConfig={chartConfig}
                  withHorizontalLabels={false}
                  withShadow={false}
                  // withDots={false}
                  // getDotColor={(opacity = 0) => `rgba(255, 255, 255, ${opacity})`}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                    marginLeft: -47,
                  }}
                />
              </View>
            </View>

            <Text style={styles.textStyle}>Sleep & Mindfulness</Text>
            <View style={styles.innerContainer}>
              <View
                style={{ flexDirection: 'row', justifyContent: 'flex-end' }}
              >
                <TouchableOpacity onPress={() => this.onClickedSleep(0)}>
                  <View style={styles.checkBoxView}>
                    {this.state.isClicked_sleep_sleep ? (
                      <Icon
                        family={'MaterialIcons'}
                        name={'check-box'}
                        color="#4191fb"
                        size={22}
                      />
                    ) : (
                      <Icon
                        family={'MaterialIcons'}
                        name={'check-box-outline-blank'}
                        color="lightgray"
                        size={22}
                      />
                    )}
                    <Text> Sleep</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.onClickedSleep(1)}>
                  <View style={[styles.checkBoxView, { width: 120 }]}>
                    {this.state.isClicked_sleep_mindfulness ? (
                      <Icon
                        family={'MaterialIcons'}
                        name={'check-box'}
                        color="#cf74ed"
                        size={22}
                      />
                    ) : (
                      <Icon
                        family={'MaterialIcons'}
                        name={'check-box-outline-blank'}
                        color="lightgray"
                        size={22}
                      />
                    )}
                    <Text> Mindfulness</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <LineChart
                  data={this.state.SleepData}
                  width={Dimensions.get('window').width + 30}
                  height={220}
                  chartConfig={chartConfig}
                  withHorizontalLabels={false}
                  withShadow={false}
                  // withDots={false}
                  // getDotColor={(opacity = 0) => `rgba(255, 255, 255, ${opacity})`}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                    marginLeft: -47,
                  }}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
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
    height: Platform.OS === 'ios' ? 64 : 54,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    marginHorizontal: 16,
  },
  textStyle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
  },
  innerContainer: {
    marginVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: 'lightgrey',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    padding: 16,
  },
  checkBoxView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: (width - 64) / 4,
  },
});
