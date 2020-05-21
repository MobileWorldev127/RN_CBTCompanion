import React, { Component } from "react";
import {
  View,
  TouchableHighlight,
  ScrollView,
  Text,
  TouchableOpacity
} from "react-native";
import * as Animatable from "react-native-animatable";
import Header from "../../components/Header";
import ThemeStyle from "../../styles/ThemeStyle";
import { withSubscriptionActions } from "../../utils/StoreUtils";
import TextStyles from "../../common/TextStyles";
import CachedImage from "react-native-image-cache-wrapper";
import { client } from "../../App";
import { screenNames, recordScreenEvent } from "../../utils/AnalyticsUtils";
import { getExercisesByModuleQuery } from "../../queries/getExercisesByModule";

import { getExerciseByIDQuery } from "../../queries/getExercise";
import { flowConstants } from "../../constants";
import { setCurrentExercise } from "../../actions/RecordActions";
import { showApiError } from "../../utils";
import { performNetworkTask } from "../../utils/NetworkUtils";
import LinearGradient from "react-native-linear-gradient";
import Card from "../../components/Card";
import { setTopSafeAreaView } from "../../actions/AppActions";
import _ from "lodash";

class AddScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        {
          title: "Record Entry",
          onPress: () =>
            this.props.navigation.navigate("Home", {
              isBack: true
            }),
          color: "#000",
          isIcon: true,
          image: require("../../assets/images/redesign/cbt-recordentry-graphic.png")
        }
      ]
    };
  }

  componentDidMount() {
    recordScreenEvent(screenNames.add);
    this.props.setLoading(true);
    client
      .watchQuery({
        query: getExercisesByModuleQuery,
        variables: { module: "CBT Tracking" }
      })
      .subscribe({
        next: data => {
          this.props.setLoading(false);
          if (data.loading && !data.data) {
            return;
          }
          console.log("DATA", data);
          if (
            data.data &&
            data.data.getExercisesByModule &&
            data.data.getExercisesByModule.length
          ) {
            const items = this.state.items;
            data.data.getExercisesByModule.forEach(exercise => {
              const isPrediction = exercise.title === "Prediction";
              items.push({
                ...exercise,
                image: isPrediction
                  ? require("../../assets/images/redesign/cbt-predictions-graphic-blue.png")
                  : require("../../assets/images/redesign/cbt-automaticthought-graphic.png"),
                color: isPrediction ? ThemeStyle.mainColor : "#39F",
                onPress: () => this.navigateToExercise(exercise),
                type: "exercise"
              });
            });
            this.setState({ items });
          }
        },
        error: err => {
          console.log(err);
          this.props.setLoading(false);
          showApiError(true);
        }
      });
  }

  navigateToExercise(exercise) {
    if (exercise.locked !== false && !this.props.isSubscribed) {
      this.props.showSubscription();
    } else {
      this.props.setTopSafeAreaView(ThemeStyle.backgroundColor);
      this.props.setLoading(true);
      console.log(exercise);
      const query = client
        .watchQuery({
          query: getExerciseByIDQuery,
          variables: { id: exercise.id },
          fetchPolicy: "cache-and-network"
        })
        .subscribe({
          next: data => {
            if (data.loading || !data.data) {
              return;
            }
            this.props.setLoading(false);
            this.props.setCurrentExercise(
              _.cloneDeep(data.data.getExercise),
              flowConstants.EXERCISE
            );
            console.log("EXERCISE DATA", data.data.getExercise);
            this.props.navigation.navigate("ExerciseScreen", {
              currentIndex: 0,
              exerciseId: exercise.id
            });
            query.unsubscribe();
          },
          error: error => {
            this.props.setLoading(false);
            console.log(error);
            showApiError(true);
          }
        });
    }
  }

  render() {
    console.log("RENDER", this.state.items);
    return (
      <View style={ThemeStyle.pageContainer}>
        <LinearGradient style={{ flex: 1 }} colors={ThemeStyle.gradientColor}>
          <Header
            isDrawer={true}
            openDrawer={() => {
              this.props.navigation.openDrawer();
            }}
            navBarStyle={{ backgroundColor: "transparent" }}
            title={""}
          />
          <View style={{ flex: 1 }}>
            {this.state.items.map((item, index) => {
              return (
                <Animatable.View
                  animation="pulse"
                  delay={index * 200}
                  style={{
                    flex: 0.33,
                    maxHeight: 160,
                    overflow: "hidden"
                  }}
                >
                  <Card style={{ marginHorizontal: 20, marginVertical: 12 }}>
                    <CachedImage
                      source={item.image}
                      style={{
                        width: 116,
                        position: "absolute",
                        top: 24,
                        right: 16
                      }}
                      resizeMode="contain"
                    />
                    <TouchableOpacity onPress={item.onPress}>
                      <View
                        style={{
                          height: "100%",
                          flexDirection: "row",
                          padding: 16,
                          alignItems: "center",
                          overflow: "hidden"
                        }}
                      >
                        <Text
                          style={[
                            TextStyles.SubHeader2,
                            {
                              width: "50%",
                              color: item.color,
                              marginHorizontal: 12
                            }
                          ]}
                        >
                          {item.title}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </Card>
                </Animatable.View>
              );
            })}
          </View>
        </LinearGradient>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  completedExercise: state.record.completedExercise
});

const mapDispatchToProps = dispatch => ({
  setCurrentExercise: (exercise, flowType) =>
    dispatch(setCurrentExercise(exercise, flowType)),
  setTopSafeAreaView: color => dispatch(setTopSafeAreaView(color))
});

export default withSubscriptionActions(
  AddScreen,
  mapStateToProps,
  mapDispatchToProps
);
