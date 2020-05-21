import React, { Component, Fragment } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import Header from "../../components/Header";
import Icon from "react-native-vector-icons/Ionicons";
import styles from "./styles";
import { NavigationActions } from "react-navigation";
import { actMeasureTypes } from "../../constants";
import moment from "moment";
import { TabView } from "react-native-tab-view";
import { errorMessage, showApiError } from "../../utils";
import Animated from 'react-native-reanimated';
import { showMessage } from "react-native-flash-message";
import { withStore } from "../../utils/StoreUtils";
import ThemeStyle from "../../styles/ThemeStyle";
import TextStyles from "../../common/TextStyles";
import LinearGradient from "react-native-linear-gradient";
import { client } from "../../App";
import { getUserMeasuresQuery } from "../../queries/getUserMeasures";
import _ from "lodash";
import { getMonthRange } from "../../utils/DateTimeUtils";

class ACTMeasuresHistoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      result: { key: "", value: "" },
      index: 0,
      routes: [
        { key: "daily", title: "Daily" },
        { key: "weekly", title: "Weekly" }
      ]
    };
  }

  _handleIndexChange = index => this.setState({ index: index });

  _renderTabBar = props => {
    const AnimatedTouchable = Animated.createAnimatedComponent(
      TouchableOpacity
    );
    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          return (
            <AnimatedTouchable
              style={[
                styles.tabItem,
                {
                  borderBottomColor:
                    this.state.index === i ? ThemeStyle.mainColor : "#fff",
                  backgroundColor: "f1f2f3"
                }
              ]}
              onPress={() => this.setState({ index: i })}
            >
              <Animated.View>
                <Animated.Text
                  style={[
                    TextStyles.GeneralText,
                    {
                      color:
                        this.state.index === i ? ThemeStyle.mainColor : "#000"
                    }
                  ]}
                >
                  {route.title}
                </Animated.Text>
              </Animated.View>
            </AnimatedTouchable>
          );
        })}
      </View>
    );
  };

  _renderScene = ({ route }) => {
    console.log("rendering ACT Measures history scene");
    let dailyMeasures = [];
    let weeklyMeasures = [];
    switch (route.key) {
      case "daily":
        if (this.state.actMeasures) {
          dailyMeasures = this.state.actMeasures.filter(
            (item, index) => item.type === actMeasureTypes.DAILY
          );
        }
        return this.tabContent(dailyMeasures, "1");
      case "weekly":
        if (this.state.actMeasures) {
          weeklyMeasures = this.state.actMeasures.filter(
            (item, index) => item.type === actMeasureTypes.WEEKLY
          );
        }
        return this.tabContent(weeklyMeasures, "2");
      default:
        return null;
    }
  };

  render() {
    console.log("rendering ACT Measures history");
    return (
      <View style={{ flex: 1 }}>
        <Fragment>
          <Header
            title="ACT Measures"
            goBack={() => {
              this.props.navigation.goBack(null);
            }}
          />
        </Fragment>
        <TabView
          navigationState={this.state}
          renderScene={this._renderScene}
          renderTabBar={this._renderTabBar}
          swipeEnabled={true}
          onIndexChange={this._handleIndexChange}
        />
      </View>
    );
  }

  goBack = () => this.props.navigation.dispatch(NavigationActions.back());

  componentDidMount() {
    this.props.setLoading(true);
    const currentMonth = this.props.navigation.state.params.currentMonth;
    client
      .query({
        query: getUserMeasuresQuery,
        fetchPolicy: "network-only",
        variables: getMonthRange(currentMonth)
      })
      .then(response => {
        this.props.setLoading(false);
        console.log(response);
        this.setState({
          actMeasures: _.cloneDeep(response.data.getUserMeasures)
        });
      })
      .catch(err => {
        console.log(err);
        this.props.setLoading(false);
        showMessage(errorMessage());
      });
  }

  tabContent = (assessmentArray, selectedTab) => {
    const { index } = this.state;
    if (!assessmentArray || !assessmentArray.length) {
      return (
        <View style={styles.emptyScreen}>
          <Text style={styles.emptyTitle}>No ACT Measures have been recorded</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={{ padding: 16 }}
          data={assessmentArray}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={{
                  paddingVertical: 20,
                  paddingHorizontal: 15,
                  borderBottomColor: "gray",
                  borderBottomWidth: 0.3,
                  flexDirection: "row",
                  backgroundColor: "#fff",
                  alignItems: "center"
                }}
                onPress={() => {
                  this.props.navigation.navigate("ExerciseReviewScreen", {
                    title: moment(item.dateTime).format("DD MMMM, YYYY"),
                    isOverview: false,
                    isUserMeasure: true,
                    id: item.id,
                    exerciseId: item.defaultItemId
                  });
                }}
              >
                <Icon
                  name="ios-calendar"
                  size={30}
                  color="black"
                  style={{ padding: 2 }}
                />
                <Text
                  style={[TextStyles.GeneralText, { fontSize: 14, left: 10 }]}
                >
                  {moment(item.dateTime).format("DD MMMM, YYYY hh:mm A")}
                </Text>
                <Icon
                  name="ios-arrow-forward"
                  size={30}
                  color="black"
                  style={{ position: "absolute", right: 12, padding: 5 }}
                />
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  };
}

export default withStore(ACTMeasuresHistoryScreen);
