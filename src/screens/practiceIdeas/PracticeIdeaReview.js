import React, { Component, Fragment } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import HTML from "react-native-render-html";
import Icon from "../../common/icons";
import * as Animatable from "react-native-animatable";
import { client } from "../../App";
import { showMessage } from "react-native-flash-message";
import { errorMessage } from "../../utils";
import Header from "../../components/Header";
import { NoData } from "../../components/NoData";
import { getUserPracticeIdeaQuery } from "../../queries/practiceIdeas";
import { withStore } from "../../utils/StoreUtils";
import TextStyles from "../../common/TextStyles";
import ThemeStyle from "../../styles/ThemeStyle";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";

class PracticeIdeaReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
  }

  componentDidMount() {
    console.log(
      "PRACTICE IDEA REVIEW",
      this.props.navigation.state.params.practiceIdeaId
    );
    recordScreenEvent(screenNames.practiceIdeaReview, {
      practiceIdeaId: this.props.navigation.state.params.practiceIdeaId
    });
    client
      .query({
        query: getUserPracticeIdeaQuery,
        variables: { id: this.props.navigation.state.params.practiceIdeaId }
      })
      .then(res => {
        this.props.setLoading(false);
        console.log("GET USER PRACTICE IDEA", res.data);
        if (res.data && res.data.getUserPracticeIdeaById) {
          this.setState({
            data: res.data.getUserPracticeIdeaById
          });
        }
      })
      .catch(err => {
        console.log(err);
        showMessage(errorMessage());
        this.props.setLoading(false);
      });
  }

  render() {
    let data = this.state.data;
    return (
      <View>
        <Header
          title={"Practice Idea Review"}
          goBack={() => this.props.navigation.goBack(null)}
        />
        <ScrollView contentContainerStyle={{ paddingBottom: 72 }}>
          {data && !!data.children && !!data.children.length ? (
            <View>
              <Animatable.Text
                animation="fadeInUp"
                delay={100}
                style={[
                  TextStyles.GeneralText,
                  { fontSize: 18, margin: 16, marginVertical: 24 }
                ]}
              >
                {data.title}
              </Animatable.Text>
              {data.children.map((child, index) => {
                return (
                  <Animatable.View
                    animation="fadeInUp"
                    delay={100}
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
                      <Text
                        style={[
                          TextStyles.SubHeaderBold,
                          { fontSize: 15, flex: 1 }
                        ]}
                      >
                        {child.title}
                      </Text>
                    </View>
                    {child.answer && (
                      <HTML
                        html={child.answer}
                        containerStyle={{ paddingVertical: 5 }}
                      />
                    )}
                    {child.children &&
                      child.children.length &&
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
                          {item.answer && (
                            <HTML
                              html={item.answer}
                              containerStyle={{ paddingVertical: 4 }}
                            />
                          )}
                        </View>
                      ))}
                  </Animatable.View>
                );
              })}
            </View>
          ) : (
            <NoData message={"No data found"} />
          )}
        </ScrollView>
      </View>
    );
  }
}

export default withStore(PracticeIdeaReview);
