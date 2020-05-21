import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  TextInput,
  ActivityIndicator
} from "react-native";
import Icon from "../../common/icons";
import { Query, Mutation } from "react-apollo";
import {
  getUserPracticeIdeaQuery,
  recordPracticeIdeaQuery,
  getPracticeIdeaQuery
} from "../../queries/practiceIdeas";
import TextStyles from "../../common/TextStyles";
import * as Animatable from "react-native-animatable";
import ThemeStyle from "../../styles/ThemeStyle";
import HTML from "react-native-render-html";
import { showMessage } from "react-native-flash-message";
import LinearGradient from "react-native-linear-gradient";
import moment from "moment";
import { AirbnbRating } from "react-native-ratings";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";

export default class PracticeIdeaScreen extends Component {
  constructor(props) {
    titleDelay = 0;
    childDelay = 0;
    super(props);
    this.state = {
      practiceIdeaSelected: [],
      practiceIdeaDone: false
    };
  }

  onCheckBoxPress = (item, itemIndex) => {
    console.log(item);
    var selectedItems = this.state.practiceIdeaSelected || [];
    if (selectedItems.length == 0) {
      selectedItems.push(item);
      // selectedItems[itemIndex] = item;
    } else {
      let isExisting = false;
      selectedItems.map((selected, index) => {
        if (selected.title === item.title) {
          selectedItems.splice(index, 1);
          isExisting = true;
        }
      });
      if (!isExisting) selectedItems.push(item);
      // if (itemIndex in selectedItems) {
      //   delete selectedItems[itemIndex];
      // } else {
      //   selectedItems[itemIndex] = item;
      // }
    }
    console.log("SELECTED ITEMS", selectedItems);
    this.setState({
      practiceIdeaSelected: selectedItems,
      practiceIdeaDone: false
    });
  };

  getIdeaInput = (data, selectedPracticeIdeas) => {
    let entry = {};
    entry.date = moment().format("YYYY-MM-DD");
    entry.timestamp = moment().unix();
    entry.practiceIdeaId = this.props.practiceIdea.id;
    entry.title = data.title;
    entry.type = data.type;
    entry.children = [];
    selectedPracticeIdeas.forEach(element => {
      const input = {
        title: element.title,
        answer: element.description
      };
      if (element.type === "Group") {
        input.children = [];
        element.children.forEach(groupItem => {
          input.children.push({
            title: groupItem.title,
            answer: groupItem.description
          });
        });
      }
      entry.children.push(input);
    });
    console.log("PRACTICE IDEA INPUT", entry);
    return entry;
  };

  componentDidMount() {
    if (
      this.props.navigation &&
      this.props.navigation.state &&
      this.props.navigation.state.params
    ) {
      this.props = {
        ...this.props,
        ...this.props.navigation.state.params
      };
    }
    recordScreenEvent(screenNames.practiceIdeaRecord, {
      practiceIdeaId: this.props.practiceIdea.id,
      practiceIdeaTitle: this.props.practiceIdea.title
    });
  }

  render() {
    if (
      this.props.navigation &&
      this.props.navigation.state &&
      this.props.navigation.state.params
    ) {
      this.props = {
        ...this.props,
        ...this.props.navigation.state.params
      };
      console.log("FINAL PROPS", this.props);
    }
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            padding: 16,
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            style={styles.close}
            onPress={() => {
              this.props.onClose();
            }}
          >
            <Icon family="Ionicons" name="ios-close" size={45} />
          </TouchableOpacity>
          <Text
            style={[
              TextStyles.SubHeaderBold,
              { fontSize: 15, flex: 1, textAlign: "center" }
            ]}
          >
            {this.props.practiceIdea.title}
          </Text>
        </View>
        <Query
          query={getPracticeIdeaQuery}
          fetchPolicy="cache-and-network"
          variables={{ id: this.props.practiceIdea.id }}
          onCompleted={() => {
            console.log("Completed");
          }}
        >
          {({ loading, error, data }) => {
            console.log("fetchedentry", data);
            console.log(loading);
            console.log("ers", error);
            if (loading) {
              return <LoadingView />;
            }
            if (error) {
              return null;
            }
            if (data && data.getPracticeIdea) {
              return (
                <Mutation
                  mutation={recordPracticeIdeaQuery}
                  onCompleted={() => {
                    this.props.setLoading(false);
                    this.props.resetDefaults();
                    this.setState({
                      practiceIdeaSelected: [],
                      practiceIdeaDone: false
                    });
                  }}
                  onError={err => {
                    console.log(err);
                    this.props.setLoading(false);
                    showMessage({
                      type: "danger",
                      message: "Something went wrong"
                    });
                  }}
                >
                  {recordPracticeIdea => (
                    <View style={{ flex: 1 }}>
                      <ScrollView
                        contentContainerStyle={{ paddingBottom: 144 }}
                      >
                        <PracticeIdea
                          data={data.getPracticeIdea}
                          practiceIdeaSelected={this.state.practiceIdeaSelected}
                          onCheckBoxPressed={this.onCheckBoxPress}
                        />
                      </ScrollView>
                      {this.state.practiceIdeaSelected != "" && (
                        <View
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0
                          }}
                        >
                          <LinearGradient
                            colors={ThemeStyle.gradientColor}
                            style={{
                              width: "100%",
                              elevation: 3,
                              marginTop: 2,
                              padding: 16
                            }}
                          >
                            {this.state.practiceIdeaDone ? (
                              <View>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    paddingVertical: 5,
                                    paddingHorizontal: 8
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 16,
                                      color: "#fff",
                                      fontFamily:
                                        TextStyles.SubHeaderBold.fontFamily
                                    }}
                                  >
                                    Rate the Skill
                                  </Text>
                                  <TouchableOpacity
                                    onPress={() => {
                                      this.props.setLoading(true);
                                      recordPracticeIdea({
                                        variables: {
                                          input: this.getIdeaInput(
                                            data.getPracticeIdea,
                                            this.state.practiceIdeaSelected
                                          )
                                        }
                                      });
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontFamily:
                                          TextStyles.SubHeaderBold.fontFamily,
                                        color: "#fff"
                                      }}
                                    >
                                      Finish
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                                <AirbnbRating
                                  size={20}
                                  ratingCount={5}
                                  showRating={false}
                                  defaultRating={2}
                                  onFinishRating={() => {}}
                                  value={3}
                                  style={{
                                    paddingVertical: 1,
                                    paddingHorizontal: 3
                                  }}
                                />
                                <TextInput
                                  multiline={true}
                                  placeholder="Rate the skill..."
                                  style={{
                                    margin: 8,
                                    borderRadius: 5,
                                    backgroundColor: "#fff",
                                    padding: 12,
                                    height: 60,
                                    fontFamily:
                                      TextStyles.GeneralText.fontFamily,
                                    textAlignVertical: "top"
                                  }}
                                />
                              </View>
                            ) : (
                              <TouchableOpacity
                                style={{
                                  alignItems: "center",
                                  justifyContent: "center",
                                  paddingVertical: 5
                                }}
                                onPress={() =>
                                  this.setState({ practiceIdeaDone: true })
                                }
                              >
                                <Text
                                  style={{
                                    fontSize: 16,
                                    fontWeight: "bold",
                                    color: "#fff"
                                  }}
                                >
                                  Done
                                </Text>
                              </TouchableOpacity>
                            )}
                          </LinearGradient>
                        </View>
                      )}
                    </View>
                  )}
                </Mutation>
              );
            }
            return null;
          }}
        </Query>
      </View>
    );
  }
}

let titleDelay = 0;
let childDelay = 0;

const PracticeIdea = ({ data, practiceIdeaSelected, onCheckBoxPressed }) => (
  <View>
    <Animatable.Text
      animation="fadeInUp"
      delay={(titleDelay += 100)}
      style={[TextStyles.GeneralText, { fontSize: 18, margin: 16 }]}
    >
      {data.instruction}
    </Animatable.Text>

    {data.children.map((child, index) => {
      let isSelected = false;
      practiceIdeaSelected.forEach(element => {
        if (element.title === child.title) {
          isSelected = true;
          return true;
        }
      });
      return (
        <Animatable.View
          animation="fadeInUp"
          delay={(titleDelay += 100)}
          style={{
            paddingHorizontal: 16,
            marginBottom: 5,
            backgroundColor: ThemeStyle.pageContainer.backgroundColor,
            elevation: 2,
            paddingVertical: 12
          }}
        >
          <View
            style={{
              flex: 1,
              elevation: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <Text style={[TextStyles.SubHeaderBold, { fontSize: 15, flex: 1 }]}>
              {child.title}
            </Text>
            <TouchableOpacity onPress={() => onCheckBoxPressed(child, index)}>
              {isSelected ? (
                <Icon
                  name="checkbox-marked"
                  size={25}
                  color={ThemeStyle.accentColor}
                  family="MaterialCommunityIcons"
                />
              ) : (
                <Icon
                  name="crop-square"
                  size={25}
                  color={ThemeStyle.accentColor}
                  family="MaterialCommunityIcons"
                />
              )}
            </TouchableOpacity>
          </View>
          {child.description && (
            <HTML
              html={child.description}
              containerStyle={{ paddingVertical: 5 }}
            />
          )}
          {child.type === "Group" &&
            child.children &&
            child.children.map(item => (
              <View
                style={{
                  paddingTop: 8,
                  paddingHorizontal: 12
                }}
              >
                {item.title && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "#333"
                      }}
                    />
                    <Text
                      style={[
                        TextStyles.SubHeaderBold,
                        { paddingHorizontal: 8, fontSize: 14 }
                      ]}
                    >
                      {item.title}
                    </Text>
                  </View>
                )}
                {item.description && (
                  <HTML
                    html={item.description}
                    containerStyle={{ paddingVertical: 4 }}
                  />
                )}
              </View>
            ))}
        </Animatable.View>
      );
    })}
  </View>
);

const LoadingView = () => (
  <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <ActivityIndicator
      animating={true}
      size="large"
      color={ThemeStyle.mainColor}
    />
  </View>
);
