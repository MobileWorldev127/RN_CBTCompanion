import React, { Component, Fragment } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import Header from "./../../components/Header";
import moment from "moment";
import TextStyles from "../../common/TextStyles";
import { client } from "../../App";
import { getExerciseHistoryList } from "../../queries/getExerciseHistoryList";
import { errorMessage, showApiError } from "../../utils";
import { withStore } from "../../utils/StoreUtils";
import Icon from "../../common/icons";
import { NoData } from "../../components/NoData";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";
import ThemeStyle from "../../styles/ThemeStyle";
import Card from "../../components/Card";

moment.suppressDeprecationWarnings = true;
moment.locale("en");

class ExerciseHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exerciseList: []
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const id = navigation.getParam("exerciseId", "");
    console.log("EXERCISE ID", id);
    recordScreenEvent(screenNames.exerciseHistory, {
      exerciseId: id
    });
    this.props.setLoading(true);
    client
      .watchQuery({
        query: getExerciseHistoryList,
        variables: {
          exerciseId: id
        },
        fetchPolicy: "cache-and-network"
      })
      .subscribe({
        next: res => {
          console.log("EXERCISE HISTORY", res.data);
          if (res.loading && !res.data) {
            return;
          }
          this.props.setLoading(false);
          if (res.data && res.data.getExerciseHistory)
            this.setState({
              exerciseList: res.data.getExerciseHistory
            });
        },
        error: err => {
          this.props.setLoading(false);
          console.log(err);
          showApiError();
        }
      });
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={ThemeStyle.pageContainer}>
        <Header
          title="Exercise History"
          goBack={() => {
            this.props.navigation.goBack(null);
          }}
        />
        <Text
          style={[
            TextStyles.Header2,
            { marginHorizontal: 20, marginVertical: 16 }
          ]}
        >
          {navigation.getParam("exerciseName", "")}
        </Text>
        {this.state.exerciseList && this.state.exerciseList.length ? (
          <FlatList
            keyExtractor={item => item.id}
            data={this.state.exerciseList}
            renderItem={({ item }) => {
              return (
                <Card
                  style={{
                    marginHorizontal: 20,
                    marginBottom: 12,
                    shadowOffset: { height: 2 },
                    shadowOpacity: 1,
                    shadowRadius: 4
                  }}
                >
                  <TouchableOpacity
                    style={{
                      paddingVertical: 20,
                      paddingHorizontal: 15,
                      flexDirection: "row",
                      backgroundColor: "#fff",
                      alignItems: "center"
                    }}
                    onPress={() => {
                      this.props.navigation.navigate("ExerciseReviewScreen", {
                        title: item.title,
                        isOverview: false,
                        id: item.id,
                        exerciseId: item.exerciseId
                      });
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        flex: 1
                      }}
                    >
                      <Image
                        source={require("../../assets/images/redesign/history-date-time-icon.png")}
                        style={{
                          width: 48,
                          tintColor: ThemeStyle.accentColor
                        }}
                        resizeMode="contain"
                      />
                      <View style={{ marginLeft: 16 }}>
                        <Text style={[TextStyles.SubHeader2]}>
                          {moment(item.dateTime).format(
                            "DD MMMM, YYYY"
                          )}
                        </Text>
                        <Text style={TextStyles.GeneralText}>
                          {moment(item.dateTime).format("hh:mm A")}
                        </Text>
                      </View>
                      <Image
                        source={require("../../assets/images/redesign/right-arrow.png")}
                        style={{
                          height: 40,
                          position: "absolute",
                          right: 12,
                          padding: 5,
                          tintColor: "#bdbdbd",
                          transform: [{ rotate: "180deg" }]
                        }}
                        resizeMode="contain"
                      />
                    </View>
                  </TouchableOpacity>
                </Card>
              );
            }}
          />
        ) : (
          <NoData message={"No history found for the exercise\n"} />
        )}
      </View>
    );
  }
}
export default withStore(ExerciseHistory);
