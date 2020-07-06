import React, { Component } from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation
} from "react-native";
import Header from "./../../components/Header";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import { getAmplifyConfig, getEnvVars, flowConstants } from "../../constants";
import { getAllHomeworks } from "../../queries/getAllHomeworks";
import { showMessage } from "react-native-flash-message";
import { errorMessage, showApiError } from "../../utils";
import styles from "./styles";
import { withStore, withSafeAreaActions } from "../../utils/StoreUtils";
import HomeworkItem from "./HomeworkItem";
import ThemeStyle from "../../styles/ThemeStyle";
import { getExerciseByIDQuery } from "../../queries/getExercise";
import { getMeditationsByID } from "../../queries/getMeditationByID";
import { client, swasthCommonsClient } from "./../../App";
import _ from "lodash";
import { setCurrentExercise } from "../../actions/RecordActions";
import {
  setCurrentHomeworkItem,
  submitHomework
} from "../../actions/HomeworkActions";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";
import moment from "moment";
import { NoData } from "../../components/NoData";
import { performNetworkTask } from "../../utils/NetworkUtils";
import { TabView } from "react-native-tab-view";
import TextStyles from "../../common/TextStyles";

class HomeworkScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingHomeworks: [],
      pastDueHomeworks: [],
      index: 0,
      routes: [
        { key: "pending", title: "Pending" },
        { key: "pastDue", title: "Past Due Date" }
      ]
    };
  }

  componentDidMount() {
    this.props.setTopSafeAreaView(ThemeStyle.mainColorLight);
    this.listener = this.props.navigation.addListener("didFocus", payload => {
      console.log("---Focused Homework Screen---", payload);
      this.fetchHomework();
    });
    recordScreenEvent(screenNames.homework);
    this.fetchHomework();
  }

  componentWillUnmount() {
    this.listener.remove();
    this.props.setTopSafeAreaView(ThemeStyle.backgroundColor);
  }

  fetchHomework = () => {
    this.props.setLoading(true);
    swasthCommonsClient
      .watchQuery({
        query: getAllHomeworks,
        variables: {
          appId: getEnvVars().appId
        },
        fetchPolicy: "cache-and-network"
      })
      .subscribe({
        next: data => {
          this.props.setLoading(false);
          if (data.data) {
            this.setState({
              ...this.filterHomeworksByDueDate(data.data.getAllHomeworks)
            });
          }
        },
        error: err => {
          console.log(err);
          showApiError();
          this.props.setLoading(false);
        }
      });
  };

  filterHomeworksByDueDate = homeworks => {
    const pendingHomeworks = [];
    const pastDueHomeworks = [];
    homeworks.forEach(item => {
      if (moment(item.dueDate, "YYYY-MM-DD").isBefore(moment())) {
        pastDueHomeworks.push(item);
      } else {
        pendingHomeworks.push(item);
      }
    });
    return {
      pendingHomeworks,
      pastDueHomeworks
    };
  };

  _handleIndexChange = index => this.setState({ index: index });
  // _renderTabBar = props => <TabBar {...props} style={{backgroundColor: '#ddf'}}/>;
  _renderTabBar = props => {
    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          return (
            <TouchableOpacity
              style={[
                styles.tabItem,
                {
                  borderBottomColor:
                    this.state.index === i ? ThemeStyle.mainColor : "#fff",
                  backgroundColor:
                    this.state.index === i
                      ? ThemeStyle.mainColor
                      : ThemeStyle.mainColorLight
                }
              ]}
              onPress={() => this.setState({ index: i })}
            >
              <View>
                <Text
                  style={[
                    TextStyles.GeneralTextBold,
                    {
                      color:
                        this.state.index === i
                          ? "#fff"
                          : TextStyles.GeneralText.color
                    }
                  ]}
                >
                  {route.title.toUpperCase()}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  _renderScene = ({ route }) => {
    switch (route.key) {
      case "pending":
        return this.tabContent(this.state.pendingHomeworks, "1");
      case "pastDue":
        return this.tabContent(this.state.pastDueHomeworks, "2");
      default:
        return null;
    }
  };

  tabContent = (homeworkList, index) => {
    return (
      <ScrollView contentContainerStyle={{ paddingBottom: 64, paddingTop: 16, minHeight: "100%" }}>
        {homeworkList.length > 0 ? (
          homeworkList.map(item => (
            <HomeworkItem
              item={item}
              id={item.id}
              onHomeworkItemPress={homeworkItem =>
                this.onHomeworkItemPress(item, homeworkItem)
              }
            />
          ))
        ) : (
          <NoData
            message={
              index === 1 ? "No pending homeworks" : "No homeworks assigned"
            }
            hideHeader
          />
        )}
      </ScrollView>
    );
  };

  render() {
    return (
      <View style={ThemeStyle.pageContainer}>
        <Header
          title="Homework"
          goBack={() => {
            this.props.navigation.goBack(null);
          }}
          navBarStyle={{ backgroundColor: ThemeStyle.mainColorLight }}
        />
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

  onHomeworkItemPress = (item, homeworkItem) => {
    performNetworkTask(() => {
      this.props.setCurrentHomeworkItem(item, homeworkItem);
      switch (homeworkItem.type) {
        case "Exercise":
          this.props.setLoading(true);
          client
            .query({
              query: getExerciseByIDQuery,
              variables: { id: homeworkItem.id }
            })
            .then(data => {
              this.props.setLoading(false);
              this.props.setCurrentExercise(
                _.cloneDeep(data.data.getExercise),
                flowConstants.HOMEWORK
              );
              this.props.navigation.navigate("ExerciseScreen", {
                currentIndex: 0
              });
            })
            .catch(err => {
              console.log(err);
              showMessage(errorMessage());
              this.props.setLoading(false);
            });
          break;
        case "Meditation":
          this.props.setLoading(true);
          Amplify.configure(
            getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
          );
          API.graphql(
            graphqlOperation(getMeditationsByID, { id: homeworkItem.id })
          )
            .then(data => {
              this.props.setLoading(false);
              this.props.navigation.push("MeditationPlay", {
                onClose: () => this.props.navigation.goBack(""),
                item: data.data.getMeditation,
                isHomework: true,
                submitHomework: this.props.submitHomework
              });
            })
            .catch(err => {
              console.log(err);
              showMessage(errorMessage());
              this.props.setLoading(false);
            });
          break;
        case "Lesson":
          this.props.navigation.push("LessonsContent", {
            isHomework: true,
            lessonID: homeworkItem.id,
            lessonTitle: homeworkItem.title
          });
          break;
        case "PracticeIdea":
          this.props.navigation.navigate("PracticeIdeasScreen", {
            onClose: () => {
              this.props.navigation.goBack(null);
            },
            practiceIdea: homeworkItem,
            resetDefaults: () => this.props.navigation.goBack(null),
            setLoading: this.props.setLoading
          });
          break;
      }
    });
  };
}

const mapDispatchToProps = dispatch => ({
  setCurrentExercise: (exercise, flowType) =>
    dispatch(setCurrentExercise(exercise, flowType)),
  setCurrentHomeworkItem: (homework, homeworkItem) =>
    dispatch(setCurrentHomeworkItem(homework, homeworkItem)),
  submitHomework: (submitID, onSubmitted) =>
    dispatch(submitHomework(submitID, onSubmitted))
});

export default withSafeAreaActions(
  HomeworkScreen,
  () => {},
  mapDispatchToProps
);
