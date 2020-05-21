import React, { Component, Fragment } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
  Modal,
  Image
} from "react-native";
import Header from "./../../components/Header";
import Icon from "react-native-vector-icons/Ionicons";
// import withSubscription from "../../components/withSubscription";
import styles from "./styles";
// import { LinearGradient, Constants } from "expo";
import moment from "moment";
import LinearGradient from "react-native-linear-gradient";
import ThemeStyle from "../../styles/ThemeStyle";
import TextStyles from "../../common/TextStyles";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";
import Card from "../../components/Card";

moment.suppressDeprecationWarnings = true;
moment.locale("en");

class AssessmentHistory extends Component {
  constructor(props) {
    super(props);
    const {
      navigation: {
        state: { params }
      }
    } = props;
    this.state = {
      data: [],
      showModal: false,
      currentAssessment: null,
      selectedAssessments: null
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const id = navigation.getParam("assessmentId", "");
    const selectedAssessments = navigation.getParam("assessments", null);
    this.setState({ selectedAssessments: selectedAssessments });
    if (id && id !== "") {
      this.props.getUserAssessmentsByIdRequest(id);
    }
    recordScreenEvent(screenNames.assessmentHistory, {
      assessmentId: id
    });
  }

  showAssessmentModal = () => {
    this.setState({ showModal: true });
  };

  hideAssessmentModal = () => {
    this.setState({ showModal: false });
  };

  getAssessmentModal = () => {
    const { currentAssessment, selectedAssessments } = this.state;
    if (currentAssessment && selectedAssessments) {
      const { result } = currentAssessment;
      const { items } = selectedAssessments;
      return (
        <Modal
          animationType="fade"
          visible={this.state.showModal}
          transparent={true}
          onRequestClose={() => {
            this.hideAssessmentModal();
          }}
        >
          <SafeAreaView
            style={{ flex: 1, backgroundColor: ThemeStyle.gradientStart }}
          >
            <LinearGradient
              colors={ThemeStyle.gradientColor}
              style={styles.modalContainer}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginHorizontal: 20
                }}
              >
                <Text style={[TextStyles.HeaderBold, styles.title]}>
                  {moment(currentAssessment.dateTime).format(
                    "DD MMMM, YYYY hh:mm A"
                  )}
                </Text>
                <TouchableOpacity onPress={() => this.hideAssessmentModal()}>
                  <Icon
                    name="ios-close-circle-outline"
                    size={26}
                    color="white"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.wrapper}>
                <Text
                  style={[
                    TextStyles.GeneralText,
                    {
                      color: "#fff",
                      fontSize: 14,
                      width: "100%",
                      marginBottom: 12
                    }
                  ]}
                >
                  {selectedAssessments.instructions}
                </Text>
                <FlatList
                  keyExtractor={item => item.id}
                  data={items}
                  renderItem={({ item }) => {
                    const questionItem = item;
                    return (
                      <View style={styles.modalContent}>
                        <View
                          style={{
                            width: "100%",
                            paddingVertical: 10,
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            paddingHorizontal: 10
                          }}
                        >
                          <Text
                            style={[
                              TextStyles.GeneralText,
                              { color: "rgba(0,0,0,1)", fontSize: 20 }
                            ]}
                          >
                            {questionItem.question}
                          </Text>
                        </View>
                        <View>
                          <FlatList
                            keyExtractor={item => item.value}
                            data={questionItem.options}
                            extraData={this.state}
                            renderItem={({ item, index }) => {
                              return (
                                <View>
                                  <View
                                    style={{
                                      paddingVertical: 15,
                                      flexDirection: "row"
                                    }}
                                  >
                                    <View
                                      style={{
                                        justifyContent: "center",
                                        marginHorizontal: 10
                                      }}
                                    >
                                      <Icon
                                        name={
                                          questionItem.answer === item.value
                                            ? "ios-checkmark-circle"
                                            : "ios-checkmark-circle-outline"
                                        }
                                        size={30}
                                        color={
                                          questionItem.answer &&
                                          questionItem.answer === item.value
                                            ? "#008000"
                                            : "#777"
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
                                          { fontSize: 18 }
                                        ]}
                                      >
                                        {item.text}
                                      </Text>
                                    </View>
                                  </View>
                                  {questionItem.options.length > index + 1 && (
                                    <View
                                      style={{
                                        height: 1,
                                        width: "80%",
                                        backgroundColor: "#CED0CE",
                                        marginLeft: "15%"
                                      }}
                                    />
                                  )}
                                </View>
                              );
                            }}
                          />
                        </View>
                      </View>
                    );
                  }}
                  ListFooterComponent={() => {
                    return (
                      <View style={styles.footerResultWrapper}>
                        <View
                          style={[
                            styles.resultModalContent,
                            {
                              padding: 25,
                              width: "100%",
                              justifyContent: "center",
                              alignItems: "center"
                            }
                          ]}
                        >
                          <View
                            style={{
                              paddingVertical: 15,
                              paddingHorizontal: 15,
                              borderBottomColor: "black",
                              borderBottomWidth: 0.3,
                              flexDirection: "row"
                            }}
                          >
                            <Text
                              style={[
                                TextStyles.HeaderBold,
                                {
                                  fontSize: 45,
                                  paddingVertical: 10
                                }
                              ]}
                            >
                              Score:
                              <Text
                                style={[
                                  TextStyles.HeaderBold,
                                  {
                                    fontSize: 45,
                                    fontWeight: "bold",
                                    paddingVertical: 10,
                                    color: ThemeStyle.mainColor,
                                    justifyContent: "center"
                                  }
                                ]}
                              >
                                {" "}
                                {result.score}
                              </Text>
                            </Text>
                          </View>
                          <Text
                            style={[
                              TextStyles.GeneralText,
                              {
                                top: 20,
                                fontSize: 30,
                                paddingVertical: 10
                              }
                            ]}
                          >
                            {result.display.key}:
                          </Text>
                          <Text
                            style={[
                              TextStyles.HeaderBold,
                              {
                                fontSize: 42,
                                paddingVertical: 10,
                                color: ThemeStyle.mainColor
                              }
                            ]}
                          >
                            {" "}
                            {result.display.value}
                          </Text>
                        </View>
                        <Text
                          style={{
                            color: "#fff",
                            top: 20,
                            marginBottom: 50
                          }}
                        >
                          * For the further details consult your mental health
                          professionals.
                        </Text>
                      </View>
                    );
                  }}
                />
              </View>

              {/* <DropdownAlert
              zIndex={999}
              ref={ref => (this.dropdown = ref)}
              onClose={() => {}}
            /> */}
            </LinearGradient>
          </SafeAreaView>
        </Modal>
      );
    }
  };

  showHistory = async () => {
    await this.state.selectedAssessments.items.map((obj, index) => {
      obj.answer = this.state.currentAssessment.items[index].value.toString();
    });
    this.showAssessmentModal();
  };
  render() {
    // const { data } = this.state;
    const { history } = this.props;
    return (
      <Fragment>
        <Header
          title="Assessment History"
          goBack={() => {
            this.props.navigation.goBack(null);
          }}
        />
        <View style={styles.container}>
          <FlatList
            keyExtractor={item => item.id}
            data={history}
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
                    this.setState(
                      {
                        currentAssessment: item
                      },
                      () => {
                        this.showHistory();
                      }
                    );
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
        </View>
        {this.getAssessmentModal()}
      </Fragment>
    );
  }
}
export default AssessmentHistory;
