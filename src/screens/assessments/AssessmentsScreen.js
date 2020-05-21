import React, { Component, Fragment } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  Image,
  SafeAreaView,
  ImageBackground
} from "react-native";
import Header from "../../components/Header";
import Icon from "react-native-vector-icons/Ionicons";
// import withSubscription from "../../components/withSubscription";
import styles from "./styles";
// import { LinearGradient, Constants } from "expo";
import Amplify, { API, graphqlOperation, Auth } from "aws-amplify";
// import { showLoader, hideLoader } from "../../utils/loaderUtil";
import { NavigationActions } from "react-navigation";
import { currentEnv, getAmplifyConfig, getEnvVars } from "../../constants";
// import Toast from "react-native-easy-toast";
import moment from "moment";
import { TabView } from "react-native-tab-view";
import Animated from "react-native-reanimated";
import { errorMessage } from "../../utils";
import { showMessage } from "react-native-flash-message";
import { withStore } from "../../utils/StoreUtils";
import ThemeStyle from "../../styles/ThemeStyle";
import TextStyles from "../../common/TextStyles";
import LinearGradient from "react-native-linear-gradient";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";
import { performNetworkTask } from "../../utils/NetworkUtils";
import Card from "../../components/Card";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import Button from "../../components/Button";

moment.suppressDeprecationWarnings = true;
moment.locale("en");

class AssessmentsScreen extends Component {
  constructor(props) {
    super(props);
    const {
      navigation: {
        state: { params }
      }
    } = props;
    // this.toast = null;
    this.state = {
      data: [],
      showModal: false,
      currentAssessment: null,
      currentQuestion: null,
      answers: {},
      currentAnswer: 1,
      score: 0,
      result: { key: "", value: "" },
      resultModal: false,
      index: 0,
      routes: [
        { key: "due", title: "Due" },
        { key: "scheduled", title: "Scheduled" }
      ]
    };
  }

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
    const { assessments } = this.props;
    let dueAssements = [];
    let scheduledAssements = [];
    switch (route.key) {
      case "due":
        dueAssements = assessments.filter((item, index) => item.isAllowed);
        return this.tabContent(dueAssements, "1");
      case "scheduled":
        scheduledAssements = assessments.filter(
          (item, index) => !item.isAllowed
        );
        return this.tabContent(scheduledAssements, "2");
      default:
        return null;
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Fragment>
          <Header
            title="Assessments"
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
    this.props.setTopSafeAreaView(ThemeStyle.mainColorLight);
    this.props.getUserSceduledAssessmentsRequest();
    recordScreenEvent(screenNames.assessments);
  }

  componentWillUnmount() {
    this.props.setTopSafeAreaView(ThemeStyle.backgroundColor);
  }

  showAssessmentModal = () => {
    this.setState({ showModal: true });
  };

  hideAssessmentModal = () => {
    this.setState({ answers: {} });
    this.setState({ showModal: false });
  };

  hideResultModal = () => {
    this.props.getUserSceduledAssessmentsRequest();
    this.setState({ resultModal: false });
  };

  checkBoxValue = (val, id) => {
    let data = this.state.answers;
    data[id] = val;
    this.setState({ currentAnswer: val, answers: data });
    console.log(this.state.answers);
  };

  nextItem = (totalItem, currentQuestion) => {
    this.setState({ currentQuestion: currentQuestion + 1 });
  };
  saveData = () => {
    this.setState({ showModal: false });
    Amplify.configure(
      getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
    );
    const recordAssessmentMutation = `mutation recordAssessment($assessment: Record!){
      recordAssessment(assessment: $assessment){
        id
        assessmentId
        dateTime
        result {
          score
          display {
            key
            value
          }
        }
      }
    }`;

    let answers = this.state.answers;
    let results = Object.keys(answers).map(function(key) {
      return { id: key, value: answers[key] };
    });

    const recordAssessmentData = {
      assessment: {
        assessmentId: this.state.currentAssessment.id,
        data: results
      }
    };
    this.props.setLoading(true);
    // showLoader();
    API.graphql(
      graphqlOperation(recordAssessmentMutation, recordAssessmentData)
    )
      .then(response => {
        console.log(response);
        this.setState({
          score: response.data.recordAssessment.result.score,
          result: {
            key: response.data.recordAssessment.result.display.key,
            value: response.data.recordAssessment.result.display.value
          }
        });
        this.setState({ resultModal: true });
        this.props.setLoading(false);
        // hideLoader();
      })
      .catch(err => {
        this.setState({ showModal: true });
        showMessage(errorMessage(err.errors[0].message));
        // this.dropdown.alertWithType("error", "Error", err.errors[0].message);
        // hideLoader();
        this.props.setLoading(false);
        console.log(err);
      });
  };

  getAssessmentModal = () => {
    const {
      currentAssessment,
      currentQuestion,
      answers,
      currentAnswer
    } = this.state;

    if (currentAssessment) {
      const { items } = currentAssessment;
      return (
        <SafeAreaView>
          <Modal
            animationType="fade"
            visible={this.state.showModal}
            transparent={true}
            onRequestClose={() => {
              this.hideAssessmentModal();
            }}
          >
            <View style={styles.container}>
              <LinearGradient
                colors={ThemeStyle.gradientColor2}
                style={styles.modalContainer}
              >
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    marginVertical: 32,
                    justifyContent: "space-between"
                  }}
                >
                  <Text style={[TextStyles.SubHeaderBold, { color: "#fff" }]}>
                    Assessments
                  </Text>
                  <TouchableOpacity onPress={() => this.hideAssessmentModal()}>
                    <Image
                      source={require("../../assets/images/redesign/cross.png")}
                    />
                  </TouchableOpacity>
                </View>
                <AnimatedCircularProgress
                  size={96}
                  width={8}
                  fill={((currentQuestion + 1) / items.length) * 100}
                  tintColor={ThemeStyle.green}
                  backgroundColor="#0003"
                >
                  {fill => (
                    <Text
                      style={[TextStyles.SubHeaderBold, { color: "#fff" }]}
                    >{`${currentQuestion + 1}/${items.length}`}</Text>
                  )}
                </AnimatedCircularProgress>
              </LinearGradient>
              <ScrollView
                ref={ref => {
                  this.scrollView = ref;
                }}
                style={{ flex: 1 }}
                contentContainerStyle={styles.wrapper}
              >
                <View style={{ width: "90%" }}>
                  <Text
                    style={[
                      TextStyles.SubHeader2,
                      {
                        paddingVertical: 20
                      }
                    ]}
                  >
                    {items[currentQuestion].question}
                  </Text>
                </View>
                <View style={styles.modalContent}>
                  {currentQuestion >= 0 ? (
                    <View>
                      <FlatList
                        keyExtractor={item => item.value}
                        data={items[currentQuestion].options}
                        extraData={this.state}
                        renderItem={({ item, index }) => {
                          const questionId = items[currentQuestion].id;
                          const isSelected =
                            this.state.answers &&
                            this.state.answers[questionId] !== null &&
                            this.state.answers[questionId] === item.value;
                          return (
                            <View
                              style={{
                                marginBottom: 12,
                                backgroundColor: isSelected
                                  ? ThemeStyle.mainColor
                                  : "#fff",
                                borderRadius: 10,
                                overflow: "hidden"
                              }}
                            >
                              <TouchableOpacity
                                style={{
                                  paddingVertical: 12,
                                  paddingHorizontal: 12,
                                  flexDirection: "row"
                                }}
                                onPress={() =>
                                  this.checkBoxValue(item.value, questionId)
                                }
                              >
                                <View
                                  style={{
                                    justifyContent: "center",
                                    marginHorizontal: 15
                                  }}
                                >
                                  <Icon
                                    name={"ios-checkmark-circle"}
                                    size={30}
                                    color={
                                      isSelected
                                        ? "#fff"
                                        : ThemeStyle.disabledLight
                                    }
                                  />
                                </View>
                                <View
                                  style={{
                                    flex: 1,
                                    justifyContent: "center"
                                  }}
                                >
                                  <Text
                                    style={[
                                      TextStyles.GeneralText,
                                      {
                                        color: isSelected
                                          ? "#fff"
                                          : ThemeStyle.textColor
                                      }
                                    ]}
                                  >
                                    {item.text}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          );
                        }}
                      />
                    </View>
                  ) : null}
                </View>
              </ScrollView>
              <Button
                style={{ position: "absolute", bottom: 32, right: 24 }}
                name="Next"
                onPress={() => {
                  if (items.length > currentQuestion + 1) {
                    if (
                      answers[items[currentQuestion].id] &&
                      answers[items[currentQuestion].id] !== ""
                    ) {
                      this.nextItem(items.length, currentQuestion);
                    } else {
                      showMessage({
                        message: "Please select the answer!",
                        type: "warning"
                      });
                    }
                  } else {
                    if (
                      answers[items[currentQuestion].id] &&
                      answers[items[currentQuestion].id] !== ""
                    ) {
                      this.saveData();
                    } else {
                      this.toast.show("Please select the answer!");
                    }
                  }
                }}
              />
            </View>
          </Modal>
        </SafeAreaView>
      );
    }
  };

  getResultModal = () => {
    const { score, result } = this.state;
    return (
      <Modal
        animationType="fade"
        visible={this.state.resultModal}
        transparent={false}
        onRequestClose={() => {
          this.hideResultModal();
        }}
      >
        <SafeAreaView
          style={{ backgroundColor: ThemeStyle.backgroundColor, flex: 1 }}
        >
          <View style={ThemeStyle.pageContainer}>
            <Header isClose onClose={this.hideResultModal} title="Result" />
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 24
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: 220,
                  justifyContent: "center",
                  alignItems: "center"
                }}
                resizeMode="cover"
              >
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    position: "absolute",
                    right: 30,
                    bottom: 50,
                    backgroundColor: "#FF5F58"
                  }}
                />
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    position: "absolute",
                    left: 10,
                    bottom: 70,
                    backgroundColor: "#F3CA3E"
                  }}
                />
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    position: "absolute",
                    left: 40,
                    top: 30,
                    backgroundColor: "#33E1FF"
                  }}
                />
                <LinearGradient
                  colors={ThemeStyle.gradientColor2}
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: 100,
                    position: "absolute"
                  }}
                />
                <Text
                  style={[
                    TextStyles.HeaderBold,
                    {
                      fontSize: 68,
                      color: "#fff",
                      justifyContent: "center"
                    }
                  ]}
                >
                  {score}
                </Text>
              </View>
              <Card
                style={{ marginHorizontal: 20 }}
                contentStyle={{ paddingHorizontal: 24, paddingVertical: 16 }}
              >
                <Text
                  style={[
                    TextStyles.GeneralTextBold,
                    {
                      textAlign: "center"
                    }
                  ]}
                >
                  {result.key} :{" "}
                </Text>

                <Text
                  style={[
                    TextStyles.Header2,
                    {
                      textAlign: "center"
                    }
                  ]}
                >
                  {result.value}
                </Text>
              </Card>
              <Text
                style={[
                  TextStyles.ContentText,
                  { textAlign: "center", marginTop: 24 }
                ]}
              >
                * For the further details consult your mental health
                professionals.
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  tabContent = (assessmentArray, selectedTab) => {
    const { index } = this.state;
    if (!assessmentArray || !assessmentArray.length) {
      return (
        <View style={styles.emptyScreen}>
          <Text style={styles.emptyTitle}>No Assessments</Text>
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
              <Card
                style={{
                  marginBottom: 12
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.setState(
                      {
                        currentAssessment: item,
                        currentQuestion: 0
                      },
                      () => {
                        if (item.isAllowed) {
                          performNetworkTask(this.showAssessmentModal);
                        } else {
                          showMessage({
                            message: `You can complete the assessment on ${moment(
                              item.nextDate
                            ).format("DD-MMM-YYYY")}`,
                            type: "warning"
                          });
                          // this.toast.show(
                          //   `You can complete the assessment on ${moment(
                          //     item.nextDate
                          //   ).format("DD-MMM-YYYY")}`
                          // );
                        }
                      }
                    );
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: 16
                    }}
                  >
                    <View style={{ width: "80%" }}>
                      <Text style={[TextStyles.GeneralTextBold]}>
                        {item.title}
                      </Text>
                      {!!(item.therapistName && item.therapistName !== "") && (
                        <Text
                          style={[
                            TextStyles.ContentText,
                            { paddingVertical: 5 }
                          ]}
                        >
                          Assigned by:{" "}
                          <Text
                            style={[
                              TextStyles.ContentTextBold,
                              { color: ThemeStyle.accentColor }
                            ]}
                          >
                            {item.therapistName}
                          </Text>
                        </Text>
                      )}
                      {!!index && (
                        <Text
                          style={{ fontSize: 12, paddingVertical: 3 }}
                        >{`Next Date: ${moment(item.nextDate).format(
                          "DD-MMM-YYYY"
                        )}`}</Text>
                      )}
                    </View>
                    <View>
                      {!!item.hasHistory && (
                        <TouchableOpacity
                          onPress={() => {
                            this.props.navigation.navigate(
                              "AssessmentHistory",
                              {
                                assessmentId: item.id,
                                assessments: item
                              }
                            );
                          }}
                        >
                          <Icon
                            name="md-time"
                            size={22}
                            color={ThemeStyle.disabled}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </Card>
            );
          }}
        />
        {/* <Toast
          ref={ref => (this.toast = ref)}
          style={{ backgroundColor: "black" }}
          position="bottom"
          positionValue={250}
          fadeInDuration={1050}
          fadeOutDuration={2000}
          opacity={0.8}
          textStyle={{ color: "white" }}
        /> */}
        {/* <DropdownAlert ref={ref => (this.dropdown = ref)} onClose={() => {}} /> */}
        {this.getAssessmentModal()}
        {this.getResultModal()}
      </View>
    );
  };
}

export default AssessmentsScreen;
