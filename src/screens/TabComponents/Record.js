import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  StatusBar,
  Animated,
  Fragment
} from "react-native";
import { Transition } from "react-navigation-fluid-transitions";
import Header from "./../../components/Header";
import CustomButton from "./../../components/Button";
import textStyle from "./../../common/TextStyles";
import { Query, ApolloConsumer } from "react-apollo";
import { getExercisesQuery } from "../../queries/getExercises";
import { withStore, withSubscriptionActions } from "../../utils/StoreUtils";
import { getExerciseByIDQuery } from "../../queries/getExercise";
import { setCurrentExercise } from "../../actions/RecordActions";
import { showMessage } from "react-native-flash-message";
import CachedImage from "react-native-image-cache-wrapper";
import { getUserExercisesQuery } from "../../queries/getUserExercises";
import { flowConstants, favouriteTypes } from "../../constants";
import { DrawerActions } from "react-navigation-drawer";
import Icon from "../../common/icons";
import CLImage from "../../components/CLImage";
import {
  cloudinaryPaths,
  getCloudIDFromImageName,
  getImagePath
} from "../../utils/ImageUtils";
import { addItemToFavorites } from "../favourites/FavoritesAction";
let _ = require("lodash");

const { width, height } = Dimensions.get("window");

class Record extends Component {
  constructor(props) {
    super(props);
    this.transition = false;
    this.shouldAnimateThoughtRecord = false;
    this.state = {
      newListArray: [],
      nextpageLoaded: false
    };
    console.log(this.props.navigation.state.params);
    this.isRecordExercise = this.props.navigation.getParam(
      "isRecordExercise",
      false
    );
  }

  onNavigateScreen(exercise, client) {
    if (exercise.type != "filler" && exercise.title != "More") {
      if (exercise.locked !== false && !this.props.isSubscribed) {
        this.props.showSubscription();
      } else {
        this.props.setLoading(true);
        console.log(exercise);
        client
          .query({
            query: getExerciseByIDQuery,
            variables: { id: exercise.id },
            fetchPolicy: "network-only"
          })
          .then(
            data => {
              this.props.setLoading(false);
              this.props.setCurrentExercise(
                _.cloneDeep(data.data.getExercise),
                this.isRecordExercise
                  ? flowConstants.EXERCISE
                  : flowConstants.ENTRY_FLOW
              );
              console.log(data.data.getExercise);
              this.props.navigation.navigate("ExerciseScreen", {
                currentIndex: 0
              });
            },
            error => {
              this.props.setLoading(false);
              console.log(error);
            }
          );
      }
    } else if (exercise.title == "More") {
      if (this.props.isSubscribed) {
        this.setState({
          newListArray: this.exercises
        });
      } else {
        this.props.showSubscription();
      }
    }
  }

  renderItemList(rowData) {
    this.transition = !this.transition;
    return (
      <ApolloConsumer>
        {client => (
          <AnimatedRecordItem
            transition={this.transition}
            isAnimated={true}
            onPress={this.onNavigateScreen.bind(this, rowData.item, client)}
            onHistoryPress={() => {
              this.props.navigation.navigate("ExerciseHistoryScreen", {
                exerciseId: rowData.item.id,
                exerciseName: rowData.item.title
              });
            }}
            isSubscribed={this.props.isSubscribed}
            onFavPress={() => {
              addItemToFavorites(
                favouriteTypes.EXERCISE,
                rowData.item.title,
                rowData.item.id,
                () => {
                  showMessage({
                    type: "success",
                    message: "Added to Favorites"
                  });
                }
              );
            }}
            rowData={rowData}
            isRecordExercise={this.isRecordExercise}
            completedExercise={this.props.completedExercise}
          />
        )}
      </ApolloConsumer>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          translucent={false}
          backgroundColor={"rgb(132, 193, 224)"}
          barStyle={"light-content"}
          hidden={false}
        />
        <Header
          title="Exercise"
          isDrawer={this.isRecordExercise}
          isClose={!this.isRecordExercise}
          goBack={() => {
            this.props.navigation.goBack(null);
          }}
          openDrawer={() =>
            this.props.navigation.dispatch(DrawerActions.openDrawer())
          }
        />

        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <Query
            query={getUserExercisesQuery}
            fetchPolicy="cache-and-network"
            onCompleted={() => this.props.setLoading(false)}
            onError={err => {
              this.props.setLoading(false);
              showMessage({
                message: "Something went wrong",
                type: "danger"
              });
              console.log(err);
            }}
          >
            {({ loading, error, data }) => {
              console.log("here");
              if (loading) {
                this.props.setLoading(true);
                return null;
              }
              if (data) {
                console.log(data);
                let exercises = _.cloneDeep(data.getUserExercises);
                this.exercises = [];
                let initialExercise = [];
                exercises.forEach(data => {
                  if (data.display === "visible") {
                    this.exercises.push(data.exercise);
                    if (initialExercise.length < 3) {
                      initialExercise.push(data.exercise);
                    }
                  }
                });
                if (this.exercises.length % 2 != 0) {
                  this.exercises.push({
                    color: "#fff",
                    type: "filler"
                  });
                }
                initialExercise.push({
                  title: "More",
                  color: "#dddddd"
                });
                if (this.state.newListArray.length === 0) {
                  this.state.newListArray = initialExercise;
                }
                return (
                  <FlatList
                    contentContainerStyle={{
                      flexWrap: "wrap",
                      flexDirection: "row",
                      justifyContent: "center",
                      paddingTop: 12,
                      paddingBottom: 80
                    }}
                    data={this.state.newListArray}
                    renderItem={this.renderItemList.bind(this)}
                    keyExtractor={(item, index) => item.title}
                  />
                );
              } else {
                console.log(error);
                return null;
              }
            }}
          </Query>
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
                name={this.props.completedExercise.length > 0 ? "Next" : "Skip"}
                onPress={() => this.props.navigation.navigate("JournalScreen")}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
}

class AnimatedRecordItem extends Component {
  constructor(props) {
    super(props);
    if (this.props.isAnimated) {
      this.animation = new Animated.Value(0);
    } else {
      this.animation = new Animated.Value(1);
    }
  }

  componentDidMount() {
    if (this.props.isAnimated) {
      Animated.timing(this.animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        delay: this.props.rowData.index * 50
      }).start();
    }
  }

  render() {
    let rowData = this.props.rowData;
    let isCompleted = false;
    this.props.completedExercise.forEach(element => {
      if (element.id == rowData.item.id) {
        isCompleted = true;
      }
    });
    let isMoreItem = rowData.item.title === "More";
    return (
      <Transition
        appear={
          this.props.isRecordExercise
            ? undefined
            : this.props.transition
            ? "left"
            : "right"
        }
      >
        <TouchableOpacity
          style={{
            margin: 2,
            width: width / 2.2,
            borderRadius: 12
          }}
          onPress={() => {
            this.props.onPress();
          }}
        >
          <Animated.View
            style={[
              {
                alignItems: "center",
                backgroundColor: rowData.item.color + "aa"
              },
              { opacity: this.animation },
              {
                transform: [{ scale: this.animation }]
              }
            ]}
          >
            <Transition shared={"logo" + rowData.item.title}>
              {isMoreItem ? (
                <View
                  style={{
                    width: width / 2.2,
                    height: width / 2.2,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Icon size={44} family="MaterialIcons" name="apps" />
                </View>
              ) : (
                <CLImage
                  cloudId={getCloudIDFromImageName(
                    getImagePath(rowData.item.image, rowData.item.title),
                    cloudinaryPaths.exercise
                  )}
                  style={{
                    width: isMoreItem ? 44 : width / 2.2,
                    height: width / 2.2
                  }}
                  resizeMode={isMoreItem ? "center" : "cover"}
                >
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: isCompleted
                        ? "#5BA48Fcc"
                        : isMoreItem
                        ? undefined
                        : rowData.item.color + "55"
                    }}
                  >
                    {isCompleted && (
                      <Image
                        style={{
                          width: 48,
                          height: 48
                        }}
                        source={require("./../../src/done_white.png")}
                      />
                    )}
                    <View
                      style={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        flexDirection: "row"
                      }}
                    >
                      {isMoreItem || !rowData.item.title ? null : rowData.item
                          .locked !== false && !this.props.isSubscribed ? (
                        <Icon
                          family={"Ionicons"}
                          name={"ios-lock"}
                          color="#ffc107"
                          backgroundColor="transparent"
                        />
                      ) : (
                        <View
                          style={{
                            flexDirection: "row"
                          }}
                        >
                          <TouchableOpacity onPress={this.props.onFavPress}>
                            <Icon
                              name="md-heart-empty"
                              size={24}
                              style={{ marginRight: 8 }}
                              color={"red"}
                              family="Ionicons"
                            />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={this.props.onHistoryPress}>
                            <Icon
                              name="md-time"
                              size={24}
                              color={"#777"}
                              family="Ionicons"
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </CLImage>
              )}
            </Transition>
            <View
              style={{
                height: 64,
                justifyContent: "center"
              }}
            >
              <Text
                style={[
                  textStyle.GeneralText,
                  {
                    fontSize: 17,
                    color: "black",
                    textAlign: "center",
                    padding: 6
                  }
                ]}
              >
                {rowData.item.title}
              </Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Transition>
    );
  }
}

const mapStateToProps = state => ({
  completedExercise: state.record.completedExercise
});

const mapDispatchToProps = dispatch => ({
  setCurrentExercise: (exercise, flowType) =>
    dispatch(setCurrentExercise(exercise, flowType))
});

export default withSubscriptionActions(
  Record,
  mapStateToProps,
  mapDispatchToProps
);

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 15,
    borderRadius: 40,
    marginHorizontal: 30,
    marginVertical: 8
  },
  imageContainer: {
    alignItems: "center",
    padding: 10
  },
  imageStyle: {
    width: 80,
    height: 80,
    resizeMode: "contain"
  },
  textStyle: {
    fontSize: 16,
    color: "#808080",
    paddingVertical: 5
  }
});
