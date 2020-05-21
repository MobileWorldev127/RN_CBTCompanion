import React, { Component } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Text
} from "react-native";
import { NoData } from "../../../components/NoData";
import ThemeStyle from "../../../styles/ThemeStyle";
import TextStyles from "../../../common/TextStyles";
import Icon from "../../../common/icons";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import { getDiscussionGroupsQuery } from "../../../queries/discussionQueries";
import { APP, getAmplifyConfig, getEnvVars } from "../../../constants";
import { showMessage } from "react-native-flash-message";
import { errorMessage, showApiError } from "../../../utils";
import Loader from "../../../components/Loader";
import { swasthCommonsClient } from "../../../App";
import * as Animatable from "react-native-animatable";
import Card from "../../../components/Card";

export default class DiscussionsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      discussions: [],
      loading: false
    };
  }

  componentDidMount() {
    Amplify.configure(
      getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
    );
    this.fetchDiscussionGroups();
  }

  fetchDiscussionGroups = () => {
    this.setState({
      loading: true
    });
    const variables = {
      appId: APP.swasthApp
    };
    console.log("FETCH DISCUSSION GROUPS", variables);
    swasthCommonsClient
      .watchQuery({
        query: getDiscussionGroupsQuery,
        variables: {
          appId: APP.swasthApp
        },
        fetchPolicy: "cache-and-network"
      })
      .subscribe({
        next: res => {
          console.log("FETCHED DISCUSSION GROUPS", res.data);
          this.setState({
            loading: false
          });
          if (res.data && res.data.getDiscussionGroups) {
            this.setState({
              discussions: res.data.getDiscussionGroups
            });
          }
        },
        error: err => {
          console.log(err);
          this.setState({
            loading: false
          });
          showApiError();
        }
      });
  };

  render() {
    const { discussions, loading } = this.state;
    if (loading) {
      return <Loader />;
    }
    if (!discussions || !discussions.length) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <NoData message="No Groups Found" />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={{
            paddingVertical: 16,
            backgroundColor: ThemeStyle.backgroundColor
          }}
          data={discussions}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => {
            return (
              <Animatable.View
                animation="fadeInUp"
                delay={index * 100}
                style={{
                  marginBottom: 12,
                  marginHorizontal: 20
                }}
              >
                <Card>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate("DiscussionPostsScreen", {
                        discussion: item
                      });
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        padding: 20,
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}
                    >
                      <View style={{ width: "100%" }}>
                        <Text
                          style={[
                            TextStyles.GeneralTextBold,
                            {
                              paddingVertical: 5,
                              color: ThemeStyle.mainColor
                            }
                          ]}
                        >
                          {item.name}
                        </Text>
                        <Text style={TextStyles.ContentText}>
                          {item.placeholder}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Card>
              </Animatable.View>
            );
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ThemeStyle.pageContainer.backgroundColor,
    flex: 1
  }
});
