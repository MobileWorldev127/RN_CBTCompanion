import React, { Component } from "react";
import {
  Text,
  View,
  NativeModules,
  LayoutAnimation,
  TouchableOpacity
} from "react-native";
import ThemeStyle from "../../styles/ThemeStyle";
import TextStyles from "../../common/TextStyles";
import { timeLineItemTypes, followUpTypes } from "../../constants";
let moment = require("moment");
import * as Animatable from "react-native-animatable";
import LinearGradient from "react-native-linear-gradient";
import HealthEntryItem from "./HealthEntryItem";
import EntryItem from "./EntryItem";

import TimeLineItem from "./TimeLineItem";
import { formatDateString } from "../../utils/DateTimeUtils";
import Card from "../../components/Card";
import FollowUpItem from "./FollowUpItem";
const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export default class DateGroup extends Component<{}, {}> {
  constructor(props) {
    super(props);
    this.state = props;
    this.renderEntry = this.renderEntry.bind(this);
    this.renderTimelineItem = this.renderTimelineItem.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // console.log("will receive props", nextProps);
    this.setState({
      ...nextProps
    });
  }

  renderEntry(entryItem, entryTotal, date) {
    return (
      <EntryItem
        key={entryItem.timestamp}
        entryItem={entryItem}
        entryTotal={entryTotal}
        entryDate={date}
        navigation={this.props.navigation}
        setLoading={this.props.setLoading}
        onDelete={this.props.onDelete}
        setModeAndData={this.props.setModeAndData}
        setEditEntry={this.props.setEditEntry}
        onChangeSelectedTab={this.props.onChangeSelectedTab}
      />
    );
  }

  HealthHealthEntryItem(entry, date, type) {
    return (
      <HealthEntryItem
        entryItem={entry}
        entryDate={date}
        entryType={type}
        navigation={this.props.navigation}
        setLoading={this.props.setLoading}
        onDelete={this.props.onDelete}
        setModeAndData={this.props.setModeAndData}
        setEditEntry={this.props.setEditEntry}
        onChangeSelectedTab={this.props.onChangeSelectedTab}
      />
    );
  }

  renderTimelineItem(items, type) {
    return (
      <TimeLineItem
        items={items}
        onPress={() => {}}
        type={type}
        navigation={this.props.navigation}
        setLoading={this.props.setLoading}
      />
    );
  }

  renderFollowUpItem(item, type) {
    return (
      <FollowUpItem
        type={type}
        id={item.id}
        data={item}
        navigation={this.props.navigation}
        setLoading={this.props.setLoading}
      />
    );
  }

  renderFirstItem() {
    let rowData = this.state.dateGroup;
    if (rowData.entries && rowData.entries.length) {
      return this.renderEntry(rowData.entries[0], rowData, rowData.date);
    }
    else if (rowData.predictions && rowData.predictions.length > 0) {
      return this.renderFollowUpItem(
        rowData.predictions[0],
        followUpTypes.PREDICTION
      );
    }
    else if (rowData.challengeExercises && rowData.challengeExercises.length > 0) {
      return this.renderFollowUpItem(
        rowData.challengeExercises[0],
        followUpTypes.THOUGHT
      );
    }
    else if (rowData.exercises && rowData.exercises.length > 0) {
      return this.renderTimelineItem(
        rowData.exercises,
        timeLineItemTypes.EXERCISE
      );
    }
    else if (rowData.meditations && rowData.meditations.length > 0) {
      return this.renderTimelineItem(
        rowData.meditations,
        timeLineItemTypes.MEDITATION
      );
    }
    else if (rowData.practiceIdeas && rowData.practiceIdeas.length > 0) {
      this.renderTimelineItem(
        rowData.practiceIdeas,
        timeLineItemTypes.PRACTICE_IDEAS
      );
    }
    else if (rowData.nutrition && rowData.nutrition.carbs.value > 0) {
      return this.HealthHealthEntryItem( rowData, rowData.date, "Nutrition" );
    }
    else if (rowData.healthExercise && rowData.healthExercise.calories.value > 0) {
      return this.HealthHealthEntryItem( rowData, rowData.date, "Exercise" );
    }    

    else if (rowData.heartRate) {
      return this.HealthHealthEntryItem( rowData, rowData.date, "Heart Rate" );
    }
    
    else if (rowData.sleep && rowData.sleep.totalMinutes > 0) {
      return this.HealthHealthEntryItem( rowData, rowData.date, "Sleep" );
    }
    return null;
  }

  render() {
    LayoutAnimation.easeInEaseOut();
    let rowData = this.state.dateGroup;
    return (
      <Animatable.View
        animation="fadeInUp"
        delay={this.props.index * 200}
        style={{
          marginHorizontal: 6,
          marginTop: 12,
          alignItems: "center"
        }}
      >
        <View
          style={{
            flex: 1,
            paddingVertical: 8,
            borderRadius: 4,
            width: "100%"
          }}
        >
          {this.state.isExpanded ? (
            <View style={{ marginTop: 24 }}>
              {rowData.entries &&
                rowData.entries.map((entry, i) =>
                  this.renderEntry(entry, rowData.date)
                )}
              {rowData.predictions &&
                rowData.predictions.map(prediction =>
                  this.renderFollowUpItem(prediction, followUpTypes.PREDICTION)
                )}
              {rowData.challengeExercises &&
                rowData.challengeExercises.map(exercise =>
                  this.renderFollowUpItem(exercise, followUpTypes.THOUGHT)
                )}
              {rowData.exercises &&
                rowData.exercises.length > 0 &&
                this.renderTimelineItem(
                  rowData.exercises,
                  timeLineItemTypes.EXERCISE
                )}
              {rowData.meditations &&
                rowData.meditations.length > 0 &&
                this.renderTimelineItem(
                  rowData.meditations,
                  timeLineItemTypes.MEDITATION
                )}
              {rowData.practiceIdeas &&
                rowData.practiceIdeas.length > 0 &&
                this.renderTimelineItem(
                  rowData.practiceIdeas,
                  timeLineItemTypes.PRACTICE_IDEAS
                )}
              {rowData.nutrition &&
                rowData.nutrition.carbs.value > 0 &&
                this.HealthHealthEntryItem(
                  rowData, rowData.date, "Nutrition"
                )}
              {rowData.healthExercise && 
                rowData.healthExercise.calories.value > 0 &&
                this.HealthHealthEntryItem(
                  rowData, rowData.date, "Exercise"
                )}
              {rowData.heartRate > 0 &&
                this.HealthHealthEntryItem(
                  rowData, rowData.date, "Heart Rate"
                )}
              {rowData.sleep && 
                rowData.sleep.totalMinutes > 0 &&
                this.HealthHealthEntryItem(
                  rowData, rowData.date, "Sleep"
                )}
            </View>
          ) : (
            <View>
              <Card
                style={{
                  position: "absolute",
                  width: "80%",
                  height: 110,
                  left: "10%",
                  bottom: "-3%",
                  elevation: 2
                }}
              />
              <Card
                style={{
                  position: "absolute",
                  width: "87%",
                  height: 110,
                  left: "6%",
                  bottom: 4,
                  elevation: 3
                }}
              />
              {this.renderFirstItem()}
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    isExpanded: true
                  });
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0
                }}
              />
            </View>
          )}
        </View>
        <LinearGradient
          start={{ x: 0.7, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={ThemeStyle.gradientColor}
          style={{
            paddingHorizontal: 24,
            paddingVertical: 4,
            position: "absolute",
            borderRadius: 24,
            elevation: 6
          }}
        >
          <Text
            style={[
              TextStyles.ContentText,
              {
                fontWeight: "bold",
                textAlign: "center",
                color: "#fff"
              }
            ]}
            onPress={() => {
              this.setState(prevState => ({
                isExpanded: !prevState.isExpanded
              }));
            }}
          >
            {formatDateString(rowData.date, "YYYY-MM-DD", "dddd, DD MMM")}
          </Text>
        </LinearGradient>
      </Animatable.View>
    );
  }
}
