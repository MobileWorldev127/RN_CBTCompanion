import React, { Component, Fragment } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Modal,
  SafeAreaView,
  ImageBackground
} from "react-native";
import Header from "./../../components/Header";
import Icon from "react-native-vector-icons/Ionicons";
// import withSubscription from "../../components/withSubscription";
import styles from "./styles";
// import { LinearGradient } from "expo";
import LinearGradient from "react-native-linear-gradient";
import Amplify, { API, graphqlOperation, Auth } from "aws-amplify";
// import { showLoader, hideLoader } from "../../utils/loaderUtil";
import { NavigationActions } from "react-navigation";
import _ from "lodash";
// import Toast from "react-native-easy-toast";
import moment from "moment";
// import { currentEnv } from "../../constants";
import { getEnvVars, getAmplifyConfig, APP } from "./../../constants";
// import theme from "../../theme";
import { showMessage } from "react-native-flash-message";
import TextStyles from "../../common/TextStyles";
import ThemeStyle from "../../styles/ThemeStyle";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";
import { isOnline, performNetworkTask } from "../../utils/NetworkUtils";
import Card from "../../components/Card";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import Button from "../../components/Button";
import { withSafeAreaActions } from "../../utils/StoreUtils";

class QuizScreen extends Component {
  constructor(props) {
    super(props);
    const {
      navigation: {
        state: { params }
      }
    } = props;
    // this.toast = null;
    this.scrollView = null;
    this.state = {
      currentQuiz: null,
      currentQuestion: 0,
      answers: {},
      currentAnswer: 1,
      score: "00.00%",
      result: { key: "", value: "" },
      resultModal: false
    };
  }

  goBack = () => this.props.navigation.dispatch(NavigationActions.back());

  componentDidMount() {
    recordScreenEvent(screenNames.quiz);
    this.props.setTopSafeAreaView(ThemeStyle.gradientStart);
    performNetworkTask(this.props.getAllQuizItemsRequest);
  }

  componentWillUnmount() {
    this.props.setTopSafeAreaView(ThemeStyle.backgroundColor);
  }

  startQuizAgain = () => {
    this.setState({
      resultModal: false,
      currentQuestion: 0,
      currentAnswer: 1,
      answers: {},
      currentQuiz: null,
      score: 0
    });
    this.props.getAllQuizItemsRequest();
  };

  hideResultModal = () => {
    this.setState({ resultModal: false });
    this.goBack();
  };

  nextItem = (totalItem, currentQuestion) => {
    this.setState({ currentQuestion: currentQuestion + 1 });
    setTimeout(() => {
      this.scrollView.scrollTo({ y: 0 });
    }, 150);
  };

  quizResult = () => {
    this.props.setLoading(true);
    Amplify.configure(
      getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
    );
    const quizMutation = `mutation recordQuiz($items: [QuizAnswerInput!]!) {
      recordQuiz(items: $items) {
          id
          recordDate
          recordTime
          items {
            quizId
            answer {
                key 
                value
            }
            correct
          }
          userId
          therapy
          result
      }
    }`;

    let answers = this.state.answers;
    let quizData = Object.keys(answers).map(function(key) {
      return {
        quizId: key,
        answer: answers[key]
      };
    });

    API.graphql(graphqlOperation(quizMutation, { items: quizData }))
      .then(response => {
        let correctAns = [];
        _.map(response.data.recordQuiz.items, item => {
          if (item.correct) {
            correctAns.push(item);
          }
        });

        this.setState({
          score: response.data.recordQuiz.result,
          result: {
            totalQestion: response.data.recordQuiz.items.length,
            totalRightAns: correctAns.length
          }
        });
        this.props.setLastQuizDate(new moment().format());
        this.setState({ resultModal: true });
        this.props.setLoading(false);
        // hideLoader();
      })
      .catch(err => {
        this.dropdown.alertWithType("error", "Error", err.errors[0].message);
        // hideLoader();
        this.props.setLoading(false);
        console.log(err);
      });
  };

  getResultModal = () => {
    const { score, result } = this.state;
    return (
      <Modal
        animationType="fade"
        visible={this.state.resultModal}
        transparent={true}
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
                      fontSize: 32,
                      color: "#fff",
                      justifyContent: "center",
                      backgroundColor: "transparent"
                    }
                  ]}
                >
                  {score}
                </Text>
                <Text
                  style={[
                    TextStyles.GeneralTextBold,
                    {
                      textAlign: "center",
                      color: "#fff"
                    }
                  ]}
                >
                  {"Correct Answers"} :{" "}
                  <Text
                    style={[
                      TextStyles.GeneralTextBold,
                      {
                        textAlign: "center",
                        color: "#fff"
                      }
                    ]}
                  >
                    {result.totalRightAns}/{result.totalQestion}{" "}
                  </Text>
                </Text>
              </View>
              <Text
                style={[
                  TextStyles.ContentText,
                  { textAlign: "center", marginTop: 24 }
                ]}
              >
                * For the further details consult your mental health
                professionals.
              </Text>
              <Button
                name="Take Quiz Again"
                style={{ marginTop: 64, width: "90%" }}
                onPress={this.startQuizAgain}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  render() {
    const { quiz } = this.props;
    const { currentQuestion, answers, currentAnswer } = this.state;
    const items = quiz;

    if (!quiz || !quiz.length) {
      return (
        <Fragment>
          <Header
            title="Quiz"
            goBack={() => {
              this.props.navigation.goBack(null);
            }}
          />
          <View style={styles.emptyScreen}>
            <Text style={styles.emptyTitle}>
              Try after some time to start Quiz{" "}
            </Text>
          </View>
        </Fragment>
      );
    }
    const questionId = items[currentQuestion].id;
    return (
      <Fragment>
        <View style={styles.container}>
          {/* <LinearGradient
            colors={ThemeStyle.gradientColor}
            style={styles.modalContainer}
          > */}
          <LinearGradient
            colors={ThemeStyle.gradientColor2}
            style={styles.modalContainer}
          >
            <Header
              title="Quiz"
              goBack={() => {
                this.props.navigation.goBack(null);
              }}
              navBarStyle={{ backgroundColor: "transparent" }}
              isLightContent
            />
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
            contentContainerStyle={styles.wrapper}
            scrollEnabled={true}
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
                    data={items[currentQuestion].choices}
                    extraData={this.state}
                    renderItem={({ item, index }) => {
                      const question = items[currentQuestion];
                      const selected = _.find(
                        answers,
                        (item, key) => key === questionId
                      );
                      const isCorrect =
                        selected &&
                        selected.key === item.key &&
                        question.answer &&
                        question.answer.key === item.key;
                      const isIncorrect =
                        selected &&
                        selected.key === item.key &&
                        question.answer &&
                        answers[question.id].key == item.key;
                      return (
                        <View
                          style={{
                            marginBottom: 12,
                            backgroundColor: isCorrect
                              ? ThemeStyle.green
                              : isIncorrect
                              ? ThemeStyle.red
                              : "#fff",
                            borderRadius: 10,
                            overflow: "hidden"
                          }}
                        >
                          <TouchableOpacity
                            disabled={answers[question.id]}
                            style={{
                              paddingVertical: 12,
                              paddingHorizontal: 12,
                              flexDirection: "row"
                            }}
                            onPress={() => {
                              const { answers, currentQuestion } = this.state;
                              const question = items[currentQuestion];
                              answers[question.id] = item;
                              this.setState({ answers });
                            }}
                          >
                            <View
                              style={{
                                justifyContent: "center",
                                marginHorizontal: 15
                              }}
                            >
                              {isCorrect ? (
                                <Icon
                                  name="ios-checkmark-circle"
                                  size={30}
                                  color="#fff"
                                />
                              ) : isIncorrect ? (
                                <Icon
                                  name="ios-close-circle"
                                  size={30}
                                  color="#fff"
                                />
                              ) : (
                                <Icon
                                  name="ios-checkmark-circle-outline"
                                  size={30}
                                  color={ThemeStyle.disabledLight}
                                />
                              )}
                            </View>
                            <View style={{ flex: 1, justifyContent: "center" }}>
                              <Text
                                style={[
                                  TextStyles.GeneralText,
                                  {
                                    color:
                                      isCorrect || isIncorrect
                                        ? "#fff"
                                        : ThemeStyle.textColor
                                  }
                                ]}
                              >
                                {item.value}
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
            {answers[questionId] ? (
              <View
                style={[
                  styles.modalContent,
                  {
                    marginTop: 24,
                    backgroundColor: ThemeStyle.mainColor,
                    padding: 16,
                    marginBottom: 20
                  }
                ]}
              >
                <View style={{ color: "white" }}>
                  <Text
                    style={[TextStyles.GeneralTextBold, { color: "white" }]}
                  >
                    Explanation:{" "}
                  </Text>
                  {answers[questionId] &&
                  answers[questionId].key !==
                    items[currentQuestion].answer.key ? (
                    <Text
                      style={[
                        TextStyles.ContentText,
                        { color: "white", paddingVertical: 4, lineHeight: 16 }
                      ]}
                    >
                      {items[currentQuestion].hint}
                    </Text>
                  ) : null}
                </View>
                {
                  <Text
                    style={[
                      TextStyles.ContentText,
                      { color: "white", lineHeight: 16 }
                    ]}
                  >
                    {items[currentQuestion].summary}
                  </Text>
                }
              </View>
            ) : null}
          </ScrollView>
          <Button
            style={{ position: "absolute", bottom: 32, right: 24 }}
            name="Next"
            onPress={() => {
              if (items.length > currentQuestion + 1) {
                const { answers, currentQuestion } = this.state;
                const question = items[currentQuestion];
                if (answers[question.id] && answers[question.id].key) {
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
                  answers[items[currentQuestion].id].key
                ) {
                  this.quizResult();
                } else {
                  showMessage({
                    message: "Please select the answer!",
                    type: "warning"
                  });
                }
              }
            }}
          />
          {this.getResultModal()}
        </View>
      </Fragment>
    );
  }
}

export default withSafeAreaActions(QuizScreen);
