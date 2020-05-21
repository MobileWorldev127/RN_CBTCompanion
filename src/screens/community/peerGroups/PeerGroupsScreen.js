import React, { Component } from "react";
import { View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import ThemeStyle from "../../../styles/ThemeStyle";
import Icon from "../../../common/icons";
import { FlatList, ScrollView, TextInput } from "react-native-gesture-handler";
import TextStyles from "../../../common/TextStyles";
import { API, graphqlOperation } from "aws-amplify";
import {
  getJoinedPeerSupportGroupsQuery,
  getPeerSupportGroupsQuery
} from "../../../queries/peerGroupQueries";
import { APP, peerGroupImages } from "../../../constants";
import { NoData } from "../../../components/NoData";
import Loader from "../../../components/Loader";
import { showMessage } from "react-native-flash-message";
import { errorMessage, hashCode, showApiError } from "../../../utils";
import Button from "../../../components/Button";
import CachedImage from "react-native-image-cache-wrapper";
import { performNetworkTask } from "../../../utils/NetworkUtils";
import { swasthCommonsClient } from "../../../App";
import Card from "../../../components/Card";
import * as Animatable from "react-native-animatable";

const { width, height } = Dimensions.get("window");

var shouldRefresh = false;

export function shouldRefreshGroups(refresh) {
  shouldRefresh = refresh;
}
export default class PeerGroupsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      peerGroups: []
    };
  }

  componentDidMount() {
    this.listener = this.props.navigation.addListener("didFocus", payload => {
      console.log("Focused peer groups", shouldRefresh);
      if (shouldRefresh) {
        this.fetchJoinedGroups();
        shouldRefresh = false;
      }
    });
    this.fetchJoinedGroups();
  }

  componentWillUnmount() {
    this.listener.remove();
  }

  fetchJoinedGroups = () => {
    this.setState({
      loading: true
    });
    swasthCommonsClient
      .watchQuery({
        query: getJoinedPeerSupportGroupsQuery,
        variables: {
          appId: APP.swasthApp
        },
        fetchPolicy: "cache-and-network"
      })
      .subscribe({
        next: res => {
          console.log("FETCHED JOINED GROUPS", res.data);
          if (res.data && res.data.getJoinedPeerSupportGroups) {
            const peerGroups = res.data.getJoinedPeerSupportGroups;
            if (peerGroups.length % 2 !== 0) {
              peerGroups.push({ name: undefined });
            }
            this.setState({
              peerGroups: res.data.getJoinedPeerSupportGroups,
              loading: false
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

  searchGroups = text => {
    const variables = {
      appId: APP.swasthApp,
      search: text
    };
    API.graphql(graphqlOperation(getPeerSupportGroupsQuery, variables))
      .then(res => {
        console.log("FETCHED SEARCH GROUPS", variables, res.data);
        if (res.data && res.data.getPeerSupportGroups) {
          let searchResults = [
            {
              name: "Create Group"
            }
          ];
          searchResults.push(...res.data.getPeerSupportGroups);
          this.setState({
            searchResults
          });
        }
      })
      .catch(err => {
        console.log(err);
        showMessage(errorMessage("Failed to fetch groups"));
      });
  };

  render() {
    return (
      <View style={[ThemeStyle.pageContainer, { padding: 16 }]}>
        <Animatable.View>
          <Card
            contentStyle={{
              flexDirection: "row",
              backgroundColor: "#fff",
              borderRadius: 4,
              padding: 8,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Icon
              family="ionicons"
              name="ios-search"
              size={16}
              color={ThemeStyle.text3}
            />
            <TextInput
              style={[
                TextStyles.ContentText,
                {
                  marginHorizontal: 12
                }
              ]}
              placeholder="Search for existing groups"
              underlineColorAndroid="transparent"
              onChangeText={text => {
                if (text && text.trim().length > 0) {
                  this.setState({
                    showResults: true
                  });
                  this.searchGroups(text);
                } else {
                  this.setState({
                    searchResults: undefined,
                    showResults: false
                  });
                }
              }}
            />
          </Card>
        </Animatable.View>
        {!!this.state.showResults && !!this.state.searchResults && (
          <ScrollView
            style={{ maxHeight: 180 }}
            contentContainerStyle={{
              backgroundColor: "#fff",
              borderRadius: 4
            }}
          >
            {this.state.searchResults.map(result => (
              <TouchableOpacity
                style={{
                  padding: 12,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#fff"
                }}
                onPress={() => {
                  performNetworkTask(() => {
                    if (result.name === "Create Group") {
                      this.props.navigation.navigate("CreatePeerGroupScreen", {
                        group: result
                      });
                    } else {
                      this.props.navigation.navigate("JoinGroupScreen", {
                        group: result
                      });
                    }
                  });
                }}
              >
                {result.name === "Create Group" && (
                  <Icon
                    family="MaterialIcons"
                    name="add"
                    size={28}
                    color={ThemeStyle.accentColor}
                  />
                )}

                <Text style={TextStyles.GeneralText}>{result.name}</Text>
                <Icon
                  family="MaterialIcons"
                  name="chevron-right"
                  size={28}
                  color={ThemeStyle.accentColor}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        {/* <Text
          style={[TextStyles.SubHeaderBold, { marginTop: 16, fontSize: 16 }]}
        >
          Joined Groups
        </Text> */}
        {this.state.loading ? (
          <Loader />
        ) : !!this.state.peerGroups && !!this.state.peerGroups.length ? (
          <FlatList
            contentContainerStyle={{
              paddingTop: 24,
              paddingBottom: 64,
              flexWrap: "wrap",
              flexDirection: "row",
              justifyContent: "center"
            }}
            data={this.state.peerGroups}
            renderItem={({ item, index }) => {
              console.log(
                "INDEX",
                item.name ? Math.abs(hashCode(item.name)) % 21 : 0
              );
              if (item.name) {
                return (
                  <TouchableOpacity
                    style={{
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: item.name ? "#ccc" : "#fff",
                      width: width / 2.4,
                      height: 150,
                      marginRight: index % 2 !== 0 ? 0 : 12,
                      marginBottom: 12,
                      overflow: "hidden"
                    }}
                    onPress={() => {
                      performNetworkTask(() => {
                        if (item.name) {
                          this.props.navigation.navigate(
                            "PeerGroupChatScreen",
                            {
                              group: item
                            }
                          );
                        }
                      });
                    }}
                  >
                    <CachedImage
                      source={
                        peerGroupImages[
                          item.name ? Math.abs(hashCode(item.name)) % 21 : 0
                        ]
                      }
                      style={{ width: "100%", height: "100%", borderRadius: 4 }}
                    />
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#0009",
                        padding: 12
                      }}
                    >
                      <Text
                        style={[
                          TextStyles.SubHeader2,
                          { color: "#fff", textAlign: "center", fontSize: 16 }
                        ]}
                      >
                        {item.name.trim().toUpperCase()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              } else return <View style={{ width: width / 2.4 }} />;
            }}
          />
        ) : (
          <NoData message="No Group Joined" header="" />
        )}
        <Button
          onPress={() => {
            performNetworkTask(() => {
              this.props.navigation.navigate("BrowseGroupsScreen", {
                search: ""
              });
            });
          }}
          name="Browse Groups"
          style={{
            position: "absolute",
            bottom: 15,
            marginHorizontal: 16,
            width: "100%"
          }}
        />
      </View>
    );
  }
}
