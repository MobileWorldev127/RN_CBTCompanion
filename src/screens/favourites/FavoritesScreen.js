import React, { Component, Fragment } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal
} from "react-native";
import Header from "../../components/Header";
import styles from "./styles";
import Amplify, { API, graphqlOperation, Auth } from "aws-amplify";
import { NavigationActions } from "react-navigation";
import {
  currentEnv,
  getAmplifyConfig,
  getEnvVars,
  APP,
  favouriteTypes,
  flowConstants
} from "../../constants";
import moment from "moment";
import { TabView } from "react-native-tab-view";
import Animated from "react-native-reanimated";
import { errorMessage, showApiError } from "../../utils";
import { showMessage } from "react-native-flash-message";
import { withStore, withSafeAreaActions } from "../../utils/StoreUtils";
import ThemeStyle from "../../styles/ThemeStyle";
import TextStyles from "../../common/TextStyles";
import LinearGradient from "react-native-linear-gradient";
import { getFavourite, deleteFavourite } from "../../queries/favorites";
import { NoData } from "../../components/NoData";
import { client, swasthCommonsClient } from "../../App";
import { getExerciseByIDQuery } from "../../queries/getExercise";
import { getMeditationsByID } from "../../queries/getMeditationByID";
import Icon from "../../common/icons";
import { setCurrentExercise } from "../../actions/RecordActions";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";
import { performNetworkTask } from "../../utils/NetworkUtils";
import * as Animatable from "react-native-animatable";
import _ from "lodash";
import { omitDeep } from "../../utils/ExerciseUtils";

moment.suppressDeprecationWarnings = true;
moment.locale("en");

class FavouritesScreen extends Component {
  constructor(props) {
    super(props);
    const {
      navigation: {
        state: { params }
      }
    } = props;
    // this.toast = null;
    this.state = {
      lessons: [],
      exercises: [],
      meditations: [],
      practiceIdeas: [],
      index: 0,
      routes: [
        { key: favouriteTypes.EXERCISE, title: "Exercises" },
        { key: favouriteTypes.LESSON, title: "Lessons" },
        { key: favouriteTypes.MEDITATION, title: "Meditations" },
        { key: favouriteTypes.PRACTICE_IDEA, title: "Practice Ideas" }
      ]
    };
  }

  _handleIndexChange = index => this.setState({ index: index });
  // _renderTabBar = props => <TabBar {...props} style={{backgroundColor: '#ddf'}}/>;
  _renderTabBar = props => {
    const AnimatedTouchable = Animated.createAnimatedComponent(
      TouchableOpacity
    );
    return (
      <View style={styles.tabBar}>
        <ScrollView
          overScrollMode="never"
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          contentContainerStyle={{
            paddingBottom: 4
          }}
        >
          {props.navigationState.routes.map((route, i) => {
            return (
              <AnimatedTouchable
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
                <Animated.View>
                  <Animated.Text
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
                  </Animated.Text>
                </Animated.View>
              </AnimatedTouchable>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  _renderScene = ({ route }) => {
    switch (route.key) {
      case favouriteTypes.EXERCISE:
        return this.tabContent(this.state.exercises, route.key);
      case favouriteTypes.LESSON:
        return this.tabContent(this.state.lessons, route.key);
      case favouriteTypes.MEDITATION:
        return this.tabContent(this.state.meditations, route.key);
      case favouriteTypes.PRACTICE_IDEA:
        return this.tabContent(this.state.practiceIdeas, route.key);
      default:
        return null;
    }
  };

  render() {
    return (
      <View style={ThemeStyle.pageContainer}>
        <Fragment>
          <Header
            title="Favorites"
            goBack={() => {
              this.props.navigation.goBack(null);
            }}
            navBarStyle={{ backgroundColor: ThemeStyle.mainColorLight }}
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
    recordScreenEvent(screenNames.favorites);
    this.props.setLoading(true);
    this.props.setTopSafeAreaView(ThemeStyle.mainColorLight);
    swasthCommonsClient
      .watchQuery({
        query: getFavourite,
        variables: {
          app: APP.swasthApp
        },
        fetchPolicy: "cache-and-network"
      })
      .subscribe({
        next: res => {
          console.log(res.data);
          this.props.setLoading(false);
          if (
            res.data &&
            res.data.getFavourite &&
            res.data.getFavourite.items
          ) {
            let exercises,
              meditations,
              lessons,
              practiceIdeas = [];
            res.data.getFavourite.items.forEach(element => {
              exercises =
                (element.type === favouriteTypes.EXERCISE && element.items) ||
                exercises;
              meditations =
                (element.type === favouriteTypes.MEDITATION && element.items) ||
                meditations;
              lessons =
                (element.type === favouriteTypes.LESSON && element.items) ||
                lessons;
              practiceIdeas =
                (element.type === favouriteTypes.PRACTICE_IDEA &&
                  element.items) ||
                practiceIdeas;
            });
            this.setState({
              exercises,
              lessons,
              meditations,
              practiceIdeas
            });
          }
        },
        error: err => {
          console.log(err);
          this.props.setLoading(false);
          showApiError();
        }
      });
  }

  componentWillUnmount() {
    this.props.setTopSafeAreaView(ThemeStyle.backgroundColor);
  }

  deleteFavorite(favoriteItem, index) {
    console.log("DELETE FAVORITE", favoriteItem);
    this.props.setLoading(true);
    Amplify.configure(
      getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
    );
    API.graphql({
      query: deleteFavourite,
      variables: {
        app: APP.swasthApp,
        input: omitDeep(favoriteItem, "__typename")
      }
    })
      .then(res => {
        console.log(res.data);
        this.props.setLoading(false);
        switch (favoriteItem.type) {
          case favouriteTypes.EXERCISE:
            this.state.exercises.splice(index, 1);
            this.setState({
              exercises: this.state.exercises
            });
            break;
          case favouriteTypes.LESSON:
            this.state.lessons.splice(index, 1);
            this.setState({
              lessons: this.state.lessons
            });
            break;
          case favouriteTypes.MEDITATION:
            this.state.meditations.splice(index, 1);
            this.setState({
              meditations: this.state.meditations
            });
            break;
          case favouriteTypes.PRACTICE_IDEA:
            this.state.practiceIdeas.splice(index, 1);
            this.setState({
              practiceIdeas: this.state.practiceIdeas.splice(index, 1)
            });
            break;
          default:
            return null;
        }
      })
      .catch(err => {
        console.log(err);
        this.props.setLoading(false);
        showMessage(errorMessage());
      });
  }

  navigateToExercise = exercise => {
    this.props.setLoading(true);
    console.log(exercise);
    client
      .watchQuery({
        query: getExerciseByIDQuery,
        variables: { id: exercise.id },
        fetchPolicy: "cache-first"
      })
      .subscribe({
        next: data => {
          this.props.setLoading(false);
          if (data.data && data.data.getExercise) {
            this.props.setCurrentExercise(
              _.cloneDeep(data.data.getExercise),
              flowConstants.EXERCISE
            );
            console.log("EXERCISE DATA", data.data.getExercise);
            this.props.navigation.navigate("ExerciseScreen", {
              currentIndex: 0,
              exerciseId: exercise.id
            });
          } else {
            showApiError();
          }
        },
        error: error => {
          console.log(error);
          this.props.setLoading(false);
          showApiError();
        }
      });
  };

  navigateToMeditation = item => {
    performNetworkTask(() => {
      this.props.setLoading(true);
      Amplify.configure(
        getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
      );
      API.graphql(graphqlOperation(getMeditationsByID, { id: item.id }))
        .then(data => {
          this.props.setLoading(false);
          console.log(data);
          this.props.navigation.push("MeditationPlay", {
            onClose: () => this.props.navigation.goBack(""),
            item: data.data.getMeditation
          });
        })
        .catch(err => {
          console.log(err);
          showMessage(errorMessage());
          this.props.setLoading(false);
        });
    });
  };

  tabContent = (favoritesArray, selectedTab) => {
    const { index } = this.state;
    if (!favoritesArray || !favoritesArray.length) {
      return (
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: ThemeStyle.backgroundColor }}>
          <NoData message="Nothing added to favorites" />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={{ padding: 16 }}
          data={favoritesArray}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => {
            return (
              <Animatable.View animation="fadeInUp" delay={index * 100}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.setTopSafeAreaView(ThemeStyle.backgroundColor);
                    switch (selectedTab) {
                      case favouriteTypes.EXERCISE:
                        this.navigateToExercise(item);
                        break;
                      case favouriteTypes.LESSON:
                        this.props.navigation.navigate("LessonsContent", {
                          lessonID: item.id,
                          lessonTitle: item.title
                        });
                        break;
                      case favouriteTypes.MEDITATION:
                        this.navigateToMeditation(item);
                        break;
                      case favouriteTypes.PRACTICE_IDEA:
                        performNetworkTask(() => {
                          this.props.navigation.navigate(
                            "PracticeIdeasScreen",
                            {
                              onClose: () => {
                                this.props.navigation.goBack(null);
                              },
                              practiceIdea: item,
                              resetDefaults: () =>
                                this.props.navigation.goBack(null),
                              setLoading: this.props.setLoading
                            }
                          );
                        });
                        break;
                      default:
                        return null;
                    }
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      backgroundColor: "#fff",
                      padding: 16,
                      marginBottom: 12,
                      borderRadius: 4,
                      alignItems: "center"
                    }}
                  >
                    <View style={{ width: "85%" }}>
                      <Text
                        style={[
                          TextStyles.SubHeaderBold,
                          {
                            fontSize: 15,
                            paddingVertical: 5
                          }
                        ]}
                      >
                        {item.title}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{ paddingHorizontal: 12 }}
                      onPress={() => {
                        performNetworkTask(
                          () => {
                            this.deleteFavorite(item, index);
                          },
                          "Deleting favorites is only allowed when online. Please connect to the internet and try again.",
                          true
                        );
                      }}
                    >
                      <Icon
                        name="ios-trash"
                        size={24}
                        color={ThemeStyle.red}
                        family="Ionicons"
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Animatable.View>
            );
          }}
        />
      </View>
    );
  };
}

const mapStateToProps = state => ({
  completedExercise: state.record.completedExercise
});

const mapDispatchToProps = dispatch => ({
  setCurrentExercise: (exercise, flowType) =>
    dispatch(setCurrentExercise(exercise, flowType))
});

export default withSafeAreaActions(
  FavouritesScreen,
  mapStateToProps,
  mapDispatchToProps
);
