import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated
} from "react-native";
import Header from "../../components/Header";
import textStyle from "../../common/TextStyles";
import { Query, ApolloConsumer } from "react-apollo";
import { getModulesQuery } from "../../queries/getModules";
import {
  getCloudIDFromImageURL,
  cloudinaryPaths
} from "../../utils/ImageUtils";
import { withStore } from "../../utils/StoreUtils";
import { setCurrentExercise } from "../../actions/RecordActions";
import { showMessage } from "react-native-flash-message";
import Icon from "../../common/icons";
import CLImage from "../../components/CLImage";
import { moduleColors } from "../../constants";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";
import _ from "lodash";
import { showApiError } from "../../utils";
import ThemeStyle from "../../styles/ThemeStyle";
import Card from "../../components/Card";

const { width, height } = Dimensions.get("window");

class Exercise extends Component {
  constructor(props) {
    super(props);
    this.shouldAnimateThoughtRecord = false;
    this.state = {
      newListArray: [],
      nextpageLoaded: false
    };
  }

  componentDidMount() {
    recordScreenEvent(screenNames.exerciseModuleList);
  }

  onNavigateScreen(exercise, client) {
    if (exercise.type != "filler" && exercise.title != "More") {
      if (exercise.hasSubModule) {
        this.props.navigation.push("ExerciseModules", {
          parent: exercise.id,
          isBack: true,
          title: exercise.title
        });
      } else {
        this.props.navigation.navigate("ExerciseByModules", {
          title: exercise.title
        });
      }
    } else if (exercise.title == "More") {
      this.setState({
        newListArray: this.exercises
      });
    }
  }

  renderItemList(rowData) {
    return (
      <ApolloConsumer>
        {client => (
          <AnimatedRecordItem
            isAnimated={true}
            onPress={this.onNavigateScreen.bind(this, rowData.item, client)}
            rowData={rowData}
            completedExercise={this.props.completedExercise}
          />
        )}
      </ApolloConsumer>
    );
  }

  render() {
    let { params } = this.props.navigation.state;
    let isBack = params && params.isBack;
    let title = (params && params.title) || "Exercise";
    return (
      <View style={ThemeStyle.pageContainer}>
        <Header
          isDrawer={!isBack}
          openDrawer={() => {
            this.props.navigation.openDrawer();
          }}
          goBack={() => {
            this.props.navigation.goBack("");
          }}
          title={title}
        />

        <View style={ThemeStyle.pageContainer}>
          <Query
            // query={getExercisesQuery}
            query={getModulesQuery}
            variables={{
              parent:
                this.props.navigation.state.params &&
                this.props.navigation.state.params.parent
                  ? this.props.navigation.state.params.parent
                  : "-1"
            }}
            fetchPolicy="network-only"
            onCompleted={() => this.props.setLoading(false)}
            onError={() => {
              this.props.setLoading(false);
              showApiError();
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
                var listmodules = _.cloneDeep(data.getModules);
                listmodules.forEach((module, index) => {
                  if (module.title === "Introduction") {
                    listmodules.splice(index, 1);
                  }
                });
                console.log(listmodules);
                if (listmodules.length % 2 != 0) {
                  listmodules.push({
                    color: "#fff",
                    type: "filler"
                  });
                }
                this.exercises = listmodules;
                if (this.state.newListArray.length == 0) {
                  this.state.newListArray = listmodules;
                }
                return (
                  <FlatList
                    contentContainerStyle={{
                      flexWrap: "wrap",
                      flexDirection: "row",
                      justifyContent: "center",
                      paddingTop: 36,
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
          <View
            style={{
              position: "absolute",
              bottom: 0,
              alignItems: "flex-end",
              padding: 24,
              width: "100%",
              backgroundColor: "#fff0"
            }}
          />
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
    // console.log(rowData);
    // console.log(this.props.completedExercise);
    let isCompleted = false;
    this.props.completedExercise.forEach(element => {
      if (element.id == rowData.item.id) {
        isCompleted = true;
      }
    });
    // console.log(isCompleted);
    let isMoreItem = rowData.item.title === "More";
    const Component = rowData.item.type === "filler" ? View : Card;
    return (
      <TouchableOpacity
        style={{
          marginHorizontal: 8,
          width: width / 2.4,
          marginBottom: 24
        }}
        onPress={() => {
          this.props.onPress();
        }}
      >
        <Animated.View
          style={[
            {
              alignItems: "center"
            },
            { opacity: this.animation },
            {
              transform: [{ scale: this.animation }]
            }
          ]}
        >
          <Component>
            {isMoreItem ? (
              <View
                style={{
                  width: width / 2.4,
                  height: ((width / 2.4) * 3) / 4,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Icon size={44} family="MaterialIcons" name="apps" />
              </View>
            ) : (
              <CLImage
                cloudId={getCloudIDFromImageURL(
                  rowData.item.image,
                  cloudinaryPaths.lessons
                )}
                style={{
                  width: isMoreItem ? 44 : width / 2.4,
                  height: ((width / 2.4) * 3) / 4
                }}
                resizeMode={isMoreItem ? "center" : "cover"}
              >
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isCompleted ? "#5BA48Fcc" : undefined
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
                </View>
              </CLImage>
            )}
            <View
              style={{
                minHeight: 52,
                justifyContent: "center"
              }}
            >
              <Text
                style={[
                  textStyle.GeneralTextBold,
                  {
                    textAlign: "center"
                  }
                ]}
              >
                {rowData.item.title}
              </Text>
            </View>
          </Component>
        </Animated.View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => ({
  completedExercise: state.record.completedExercise
});

const mapDispatchToProps = dispatch => ({
  setCurrentExercise: exercise => dispatch(setCurrentExercise(exercise))
});

export default withStore(Exercise, mapStateToProps, mapDispatchToProps);

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
