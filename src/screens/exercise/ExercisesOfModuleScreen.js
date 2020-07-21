import React, { Component, Fragment } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Animated,
  Image
} from "react-native";
import { Transition } from "react-navigation-fluid-transitions";
import Header from "../../components/Header";
import textStyle from "../../common/TextStyles";
import { Query, ApolloConsumer } from "react-apollo";
import { withStore, withSubscriptionActions } from "../../utils/StoreUtils";
import { getExercisesByModuleQuery } from "../../queries/getExercisesByModule";
import { getExerciseByIDQuery } from "../../queries/getExercise";
import { setCurrentExercise } from "../../actions/RecordActions";
import { showMessage } from "react-native-flash-message";
import { flowConstants, exerciseIcons, favouriteTypes } from "../../constants";
import Icon from "../../common/icons";
import { client } from "../../App";
import { errorMessage, showApiError } from "../../utils";
import { NoData } from "../../components/NoData";
import { addItemToFavorites } from "../favourites/FavoritesAction";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";
import _ from "lodash";
import Card from "../../components/Card";
import ThemeStyle from "../../styles/ThemeStyle";

class ExercisesOfModule extends Component {
  constructor(props) {
    super(props);
    this.transition = false;
    this.shouldAnimateThoughtRecord = false;
    this.state = {
      newListArray: [],
      nextpageLoaded: false
    };
  }

  onNavigateScreen(exercise, client) {
    if (exercise.locked !== false && !this.props.isSubscribed) {
      this.props.showSubscription();
    } else {
      this.props.setLoading(true);
      console.log(exercise);
      const querySubscription = client
        .watchQuery({
          query: getExerciseByIDQuery,
          variables: { id: exercise.id },
          fetchPolicy: "cache-first"
        })
        .subscribe({
          next: data => {
            console.log("EXERCISE DATA", data);
            if (data.loading && !data.data) {
              return;
            }
            this.props.setLoading(false);
            this.props.setCurrentExercise(
              _.cloneDeep(data.data.getExercise),
              flowConstants.EXERCISE
            );
            this.props.navigation.navigate("ExerciseScreen", {
              currentIndex: 0,
              exerciseId: exercise.id
            });
            querySubscription.unsubscribe();
          },
          error: error => {
            this.props.setLoading(false);
            console.log(error);
            showApiError();
          }
        });
    }
  }

  componentDidMount() {
    recordScreenEvent(screenNames.exerciseList, {
      module: this.props.navigation.state.params.title
    });
    this.props.setLoading(true);
    client
      .watchQuery({
        query: getExercisesByModuleQuery,
        variables: {
          module: this.props.navigation.state.params.title || "-1"
        },
        fetchPolicy: "network-only"
      })
      .subscribe({
        next: res => {
          console.log("MODULE EXERCISES", res.data);
          if (res.loading && !res.data) {
            return;
          }
          this.props.setLoading(false);
          if (res.data && res.data.getExercisesByModule) {
            this.setState({
              data: res.data.getExercisesByModule
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
          />
        )}
      </ApolloConsumer>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          title={this.props.navigation.state.params.title}
          goBack={() => {
            this.props.navigation.goBack(null);
          }}
        />

        <View style={ThemeStyle.pageContainer}>
          {this.state.data && this.state.data.length > 0 ? (
            <FlatList
              contentContainerStyle={{
                paddingVertical: 16,
                paddingHorizontal: 6
              }}
              data={this.state.data}
              renderItem={this.renderItemList.bind(this)}
              keyExtractor={(item, index) => item.title}
            />
          ) : (
            <NoData message={"No Exercises"} />
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
        delay: this.props.rowData.index * 25
      }).start();
    }
  }

  render() {
    let rowData = this.props.rowData;
    return (
      <Animated.View
        style={[
          { opacity: this.animation },
          {
            transform: [{ scale: this.animation }]
          }
        ]}
      >
        <Card
          style={{
            marginHorizontal: 12,
            marginVertical: 6,
            borderRadius: 12,
            padding: 16,
            shadowRadius: 8,
            shadowOpacity: 0.9,
            shadowOffset: { height: 2 }
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.props.onPress();
            }}
          >
            <View
              style={{
                alignItems: "center",
                flexDirection: "row"
              }}
            >
              <Image
                source={exerciseIcons[rowData.item.icon]}
                resizeMode="contain"
                style={{
                  width: 28,
                  height: 28,
                  tintColor: rowData.item.color
                }}
              />
              <Text
                style={[
                  textStyle.GeneralText,
                  { flex: 1, marginHorizontal: 16 }
                ]}
              >
                {rowData.item.title}
              </Text>
              {rowData.item.locked !== false && !this.props.isSubscribed ? (
                <Icon
                  family={"Ionicons"}
                  name={"ios-lock-closed-outline"}
                  color="#ffc107"
                  backgroundColor="transparent"
                />
              ) : (
                <Fragment>
                  <TouchableOpacity onPress={this.props.onFavPress}>
                    <Icon
                      name="md-heart-outline"
                      size={24}
                      style={{ marginRight: 14 }}
                      color={ThemeStyle.red}
                      family="Ionicons"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.props.onHistoryPress}>
                    <Icon
                      name="md-time"
                      size={24}
                      color={"#ddd"}
                      family="Ionicons"
                    />
                  </TouchableOpacity>
                </Fragment>
              )}
            </View>
          </TouchableOpacity>
        </Card>
      </Animated.View>
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
  ExercisesOfModule,
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
