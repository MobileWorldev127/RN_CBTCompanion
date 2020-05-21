import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { Transition } from "react-navigation-fluid-transitions";
import Header from "./../components/Header";
import CustomButton from "./../components/Button";
import { withStore } from "../utils/StoreUtils";
import { setCurrentExercise } from "../actions/RecordActions";
import { showMessage } from "react-native-flash-message";
import {
  flowConstants,
  actMeasureTypes,
  asyncStorageConstants
} from "../constants";
import { withNavigationFocus } from "react-navigation";
import { client } from "../App";
import { getDefaultACTMeasuresQuery } from "../queries/getDefaultActMeasures";
import moment from "moment";
import TextStyles from "../common/TextStyles";
import Icon from "../common/icons";
import { errorMessage } from "../utils";
import _ from "lodash";

class ACTMeasureScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      measures: []
    };
    console.log(this.props.navigation.state.params);
  }

  componentDidMount() {
    this.listener = this.props.navigation.addListener("willFocus", payload => {
      console.log("---FOCUSING ACT---", payload);
      this.fetchMeasures();
    });
  }

  componentWillUnmount() {
    this.listener.remove();
  }

  fetchMeasures = async () => {
    this.props.setLoading(true);
    try {
      let response = await client.query({
        query: getDefaultACTMeasuresQuery,
        fetchPolicy: "network-only"
      });
      if (response) {
        console.log("---ACT MEASURES---", response);
        const isWeeklyAdded = JSON.parse(
          await AsyncStorage.getItem(asyncStorageConstants.weeklyMeasures())
        );
        const isDailyAdded = JSON.parse(
          await AsyncStorage.getItem(asyncStorageConstants.dailyMeasures())
        );
        let measures = [];
        measures.push(
          this.createMeasureData(
            response.data.getDefaultItems[0].weeklyMeasures,
            actMeasureTypes.WEEKLY,
            isWeeklyAdded
          )
        );
        measures.push(
          this.createMeasureData(
            response.data.getDefaultItems[0].dailyMeasures,
            actMeasureTypes.DAILY,
            isDailyAdded
          )
        );
        this.setState({
          measures: measures,
          isDailyAdded,
          isWeeklyAdded
        });
        this.props.setLoading(false);
      } else {
        showMessage(errorMessage("Something went wrong. Please try again"));
        this.props.setLoading(false);
      }
    } catch (err) {
      console.log(err);
      this.props.setLoading(false);
    }
  };

  createMeasureData(actMeasure, type, isDone) {
    let measureInput = {
      date: moment().toISOString(),
      dateTime: moment().toISOString(),
      defaultItemId: type,
      type: type,
      done: isDone,
      title: `${type} Measure`,
      details: actMeasure.slice()
    };
    return measureInput;
    // let measureInput = {
    //   type: type,
    //   ...actMeasure
    // };
    // return measureInput;
  }

  renderItemList = rowData => {
    let item = rowData.item;
    console.log("---MEASURE ITEM---", item);
    let isDone =
      item.done ||
      (item.type === actMeasureTypes.WEEKLY
        ? this.props.isWeeklyAdded
        : this.props.isDailyAdded);
    return (
      <TouchableOpacity
        style={{ paddingHorizontal: 12 }}
        onPress={() => {
          if (!isDone) {
            this.props.setCurrentExercise(
              _.cloneDeep(rowData.item),
              flowConstants.ACT_MEASURE
            );
            this.props.navigation.navigate("ExerciseScreen", {
              currentIndex: 0
            });
          } else {
            showMessage({
              type: "success",
              message: "You have completed this ACT Measure"
            });
          }
        }}
      >
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            borderBottomColor: ThemeStyle.pageContainer.backgroundColor,
            borderBottomWidth: 1,
            paddingVertical: 16,
            paddingHorizontal: 16
          }}
        >
          {/* {this.renderHomeworkItemImage(homeworkItem.type)} */}
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={[TextStyles.SubHeaderBold]}>{item.title}</Text>
            {/* <Text style={TextStyles.GeneralText}>{item.type}</Text> */}
          </View>
          {isDone ? this.renderCompleted() : this.renderIncomplete()}
        </View>
      </TouchableOpacity>
    );
  };

  renderCompleted = () => {
    return (
      <Icon
        family="MaterialIcons"
        name="check-circle"
        size={28}
        color="#bbb"
        style={{ color: "#008000" }}
      />
    );
  };

  renderIncomplete = () => {
    return (
      <Icon
        family="MaterialIcons"
        name="chevron-right"
        size={28}
        color={ThemeStyle.accentColor}
      />
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          title="ACT Measures"
          goBack={() => {
            this.props.navigation.goBack(null);
          }}
        />

        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <Text
            style={[
              TextStyles.HeaderBold,
              { paddingVertical: 24, paddingHorizontal: 28 }
            ]}
          >
            Record your daily and weekly ACT Measures
          </Text>
          <FlatList
            contentContainerStyle={{
              paddingTop: 12,
              paddingBottom: 80
            }}
            data={this.state.measures}
            renderItem={this.renderItemList}
            keyExtractor={(item, index) => item.title}
          />
          {!this.isRecordExercise && (
            <View
              style={{
                position: "absolute",
                bottom: 0,
                alignItems: "flex-end",
                padding: 24,
                width: "100%",
                backgroundColor: "#fff0"
              }}
            >
              <CustomButton
                style={{
                  alignSelf: "flex-end"
                }}
                name={
                  this.state.isWeeklyAdded || this.state.isDailyAdded
                    ? "Next"
                    : "Skip"
                }
                onPress={() => this.props.navigation.navigate("JournalScreen")}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  isWeeklyAdded: state.record.isWeeklyAdded,
  isDailyAdded: state.record.isDailyAdded
});

const mapDispatchToProps = dispatch => ({
  setCurrentExercise: (exercise, flowType) =>
    dispatch(setCurrentExercise(exercise, flowType))
});

export default withNavigationFocus(
  withStore(ACTMeasureScreen, mapStateToProps, mapDispatchToProps)
);
