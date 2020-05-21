import React, { Component } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import ThemeStyle from "../../../styles/ThemeStyle";
import Icon from "../../../common/icons";
import { FlatList } from "react-native-gesture-handler";
import TextStyles from "../../../common/TextStyles";
import { API, graphqlOperation } from "aws-amplify";
import {
  getJoinedPeerSupportGroupsQuery,
  getPeerSupportGroupsQuery,
  getUnJoinedPeerSupportGroups
} from "../../../queries/peerGroupQueries";
import { APP, peerGroupImages } from "../../../constants";
import { NoData } from "../../../components/NoData";
import Loader from "../../../components/Loader";
import { showMessage } from "react-native-flash-message";
import { errorMessage, hashCode } from "../../../utils";
import Button from "../../../components/Button";
import Header from "../../../components/Header";
import FloatingActionButton from "../../../components/FloatingActionButton";
import CachedImage from "react-native-image-cache-wrapper";
import { withSafeAreaActions } from "../../../utils/StoreUtils";

const { width, height } = Dimensions.get("window");

class BrowseGroupsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      peerGroups: []
    };
  }

  componentDidMount() {
    this.props.setTopSafeAreaView(ThemeStyle.backgroundColor)
    this.setState({
      loading: true
    });
    API.graphql(
      graphqlOperation(getUnJoinedPeerSupportGroups, {
        appId: APP.swasthApp
      })
    )
      .then(res => {
        console.log("FETCHED GROUPS", res.data);
        if (res.data && res.data.getUnJoinedPeerSupportGroups) {
          this.setState({
            peerGroups: res.data.getUnJoinedPeerSupportGroups,
            loading: false
          });
        }
      })
      .catch(err => {
        console.log(err);
        showMessage(errorMessage("Failed to fetch groups"));
        this.setState({
          loading: false
        });
      });
  }

  componentWillUnmount(){
    this.props.setTopSafeAreaView(ThemeStyle.mainColorLight)
  }

  render() {
    return (
      <React.Fragment>
        <Header
          title="Choose Group"
          goBack={() => {
            this.props.navigation.goBack(null);
          }}
        />
        <View
          style={{
            flex: 1,
            padding: 16,
            backgroundColor: ThemeStyle.backgroundColor
          }}
        >
          {/* <View
          style={{
            flexDirection: "row",
            backgroundColor: ThemeStyle.pageContainer.backgroundColor,
            borderRadius: 4,
            padding: 12,
            alignItems: "center"
          }}
        >
          <Icon family="ionicons" name="ios-search" size={28} />
          <Text
            style={{
              fontFamily: TextStyles.GeneralText.fontFamily,
              marginHorizontal: 12
            }}
          >
            Search for existing groups
          </Text>
        </View> */}

          <Text style={[TextStyles.GeneralText, { marginBottom: 24 }]}>
            Here are a list of groups that you can join to get help from peers
            in practicing different CBT skills.
          </Text>
          {this.state.loading ? (
            <Loader />
          ) : !!this.state.peerGroups && !!this.state.peerGroups.length ? (
            <FlatList
              keyExtractor={item => item.id}
              contentContainerStyle={{
                paddingBottom: 64,
                flexWrap: "wrap",
                flexDirection: "row"
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
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: item.name ? "#ccc" : "#fff",
                        width: width / 2.4,
                        height: 150,
                        marginRight: index % 2 !== 0 ? 0 : 12,
                        marginBottom: 12,
                        overflow: "hidden"
                      }}
                      onPress={() => {
                        if (item.name) {
                          this.props.navigation.navigate("JoinGroupScreen", {
                            group: item
                          });
                        }
                      }}
                    >
                      <CachedImage
                        source={
                          peerGroupImages[
                            item.name ? Math.abs(hashCode(item.name)) % 21 : 0
                          ]
                        }
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 4
                        }}
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
            <NoData message="No new group exist for you to join." header="" />
          )}
          <FloatingActionButton
            style={{ position: "absolute", bottom: 5, right: 16 }}
            onPress={() => {
              this.props.navigation.navigate("CreatePeerGroupScreen");
            }}
          />
        </View>
      </React.Fragment>
    );
  }
}

export default withSafeAreaActions(BrowseGroupsScreen);
