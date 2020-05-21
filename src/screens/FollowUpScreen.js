import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import ThemeStyle from "../styles/ThemeStyle";
import { followUpTypes } from "../constants";
import Header from "../components/Header";
import CustomButton from "./../components/Button";
import TextStyles from "../common/TextStyles";
import moment from "moment";
import {
  localNotif,
  getID,
  notificationType
} from "../utils/NotificationUtils";
import Card from "../components/Card";

export default class FollowUpScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scheduleSelected: "Tomorrow",
      followUpSelected: "Yes"
    };
    this.schedule = ["4 hours", "Tomorrow", "1 week", "30 days"];
    this.followUp = ["Yes", "No"];
  }

  render() {
    let { params } = this.props.navigation.state;
    let type = params && params.type;
    let title = params && params.title;
    let onFollowUpSelected = params && params.onFollowUpSelected;
    return (
      <View style={[ThemeStyle.pageContainer]}>
        <Header
          title={title}
          goBack={() => {
            this.props.navigation.goBack(null);
          }}
        />
        <Card style={{ padding: 24, backgroundColor: "#fff", margin: 20 }}>
          <Text style={TextStyles.Header2}>Schedule a follow up</Text>
          {type === followUpTypes.PREDICTION
            ? this.renderFollowUpSchedule()
            : this.renderFollowUpQuestion()}
        </Card>
        <CustomButton
          style={{
            position: "absolute",
            bottom: 0,
            right: 24,
            marginBottom: 24,
            alignSelf: "flex-end"
          }}
          name={"Next"}
          onPress={() => {
            let followUpDate = null;
            if (type === followUpTypes.PREDICTION) {
              followUpDate = moment();
              switch (this.state.scheduleSelected) {
                case "4 hours":
                  followUpDate.add(4, "hours");
                  break;
                case "Tomorrow":
                  followUpDate.add(24, "hours");
                  break;
                case "1 week":
                  followUpDate.add(7, "days");
                case "30 days":
                  followUpDate.add(30, "days");
              }
            } else {
              if (this.state.followUpSelected === "Yes") {
                followUpDate = moment();
              }
            }
            if (onFollowUpSelected) {
              onFollowUpSelected(
                followUpDate ? followUpDate.toISOString() : null
              );
            }
            this.props.navigation.navigate("ExerciseReviewScreen", {
              isOverview: true
            });
          }}
        />
      </View>
    );
  }

  renderFollowUpSchedule = () => {
    const { scheduleSelected } = this.state;
    return (
      <View style={{ backgroundColor: "#fff" }}>
        <Text
          style={[
            TextStyles.GeneralTextBold,
            { marginBottom: 8, marginTop: 24 }
          ]}
        >
          Please select when you would like to follow up:
        </Text>
        {this.schedule.map(item => (
          <TouchableOpacity
            onPress={() => {
              this.setState({ scheduleSelected: item });
            }}
          >
            <View
              style={{
                backgroundColor:
                  scheduleSelected === item ? ThemeStyle.accentColor : "#eee",
                borderRadius: 24,
                padding: 16,
                width: "100%",
                marginTop: 12
              }}
            >
              <Text style={[TextStyles.GeneralText, { textAlign: "center" }]}>
                {item}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  renderFollowUpQuestion = () => {
    const { followUpSelected } = this.state;
    return (
      <View style={{ backgroundColor: "#fff" }}>
        <Text
          style={[
            TextStyles.GeneralTextBold,
            { marginBottom: 8, marginTop: 24 }
          ]}
        >
          Do you want to follow up?
        </Text>
        {this.followUp.map(item => (
          <TouchableOpacity
            onPress={() => {
              this.setState({ followUpSelected: item });
            }}
          >
            <View
              style={{
                backgroundColor:
                  followUpSelected === item ? ThemeStyle.accentColor : "#eee",
                borderRadius: 24,
                padding: 16,
                width: "100%",
                marginTop: 12
              }}
            >
              <Text style={[TextStyles.GeneralText, { textAlign: "center" }]}>
                {item}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  static async schedulePredictionNotification(followUpDate, userExerciseId) {
    let id = await getID();
    localNotif({
      id,
      title: "Your prediction is ready to review",
      message: "Check if it was an accurate prediction",
      date: new Date(followUpDate),
      data: {
        type: notificationType.prediction,
        userExerciseId
      }
    });
    console.log(
      "SCHEDULED NOTIFICATION",
      followUpDate,
      new Date(followUpDate),
      userExerciseId
    );
  }
}
