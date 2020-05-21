import React, { Component } from "react";
import { View, Text, TextInput, FlatList } from "react-native";
import Header from "../../../components/Header";
import TextStyles from "../../../common/TextStyles";
import Button from "../../../components/Button";
import { showMessage } from "react-native-flash-message";
import { errorMessage, hashCode, stringToColour } from "../../../utils";
import { API, graphqlOperation } from "aws-amplify";
import {
  joinPeerGroupQuery,
  leavePeerGroupQuery
} from "../../../queries/peerGroupQueries";
import { APP, peerGroupImages } from "../../../constants";
import { withStore } from "../../../utils/StoreUtils";
import ThemeStyle from "../../../styles/ThemeStyle";
import { NoData } from "../../../components/NoData";
import CachedImage from "react-native-image-cache-wrapper";
import { shouldRefreshGroups } from "./PeerGroupsScreen";
import { Card } from "react-native-elements";

class JoinGroupScreen extends Component {
  constructor(props) {
    super(props);
    this.nickname = "";
    this.isJoined = this.props.navigation.state.params.isJoined;
    this.group = this.props.navigation.state.params.group;
  }

  addUserToPeerGroup = () => {
    if (this.nickname && this.nickname.trim().length) {
      this.props.setLoading(true);
      API.graphql(
        graphqlOperation(joinPeerGroupQuery, {
          appId: APP.swasthApp,
          groupId: this.group.id,
          nickname: this.nickname
        })
      )
        .then(res => {
          this.props.setLoading(false);
          if (res.data && res.data.joinPeerSupportGroup) {
            shouldRefreshGroups(true);
            showMessage({
              type: "success",
              message: "Successfully added to group"
            });
            this.props.navigation.navigate("CommunityScreen");
          }
        })
        .catch(error => {
          this.props.setLoading(false);
          console.log(error);
          showMessage(errorMessage("Failed to join group. Please try again."));
        });
    } else {
      showMessage(errorMessage("Please enter a nickname first"));
    }
  };

  leavePeerGroup = () => {
    this.props.setLoading(true);
    API.graphql(
      graphqlOperation(leavePeerGroupQuery, {
        appId: APP.swasthApp,
        groupId: this.group.id
      })
    )
      .then(res => {
        this.props.setLoading(false);
        if (res.data && res.data.leavePeerSupportGroup) {
          shouldRefreshGroups(true);
          showMessage({
            type: "success",
            message: "Successfully left group"
          });
          setTimeout(() => {
            this.props.navigation.navigate("CommunityScreen");
          }, 1000);
        }
      })
      .catch(error => {
        this.props.setLoading(false);
        console.log(error);
        showMessage(errorMessage("Failed to leave group. Please try again."));
      });
  };

  render() {
    return (
      <View style={ThemeStyle.pageContainer}>
        <Header
          title={this.isJoined ? "Group Details" : "Join Group"}
          goBack={() => {
            this.props.navigation.goBack(null);
          }}
        />
        <View style={{ height: "100%" }}>
          <View
            style={{
              marginHorizontal: 24,
              marginTop: 16,
              marginBottom: 24,
              alignItems: "center"
            }}
          >
            <CachedImage
              source={
                peerGroupImages[
                  this.group.name ? Math.abs(hashCode(this.group.name)) % 21 : 0
                ]
              }
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                marginBottom: 16,
                borderWidth: 4,
                borderColor: "#fff"
              }}
            />
            {/* <View style={{ justifyContent: "center", marginLeft: 16, flex: 1 }}> */}
            <Text
              style={[
                TextStyles.SubHeader2,
                { textAlign: "center", marginBottom: 4 }
              ]}
            >
              {this.group.name}
            </Text>
            <Text style={[TextStyles.GeneralText, { textAlign: "justify" }]}>
              {this.group.description}
            </Text>
            {/* </View> */}
          </View>
          <Text
            style={[
              TextStyles.GeneralTextBold,
              {
                padding: 12,
                paddingHorizontal: 24,
                backgroundColor: ThemeStyle.mainColorLight,
                color: ThemeStyle.mainColor
              }
            ]}
          >
            Members
          </Text>
          {this.group.participants && !!this.group.participants.length ? (
            <FlatList
              contentContainerStyle={{ paddingBottom: 240 }}
              data={this.group.participants}
              keyExtractor={item => item.userId}
              renderItem={({ item }) => {
                return (
                  <View
                    style={{
                      paddingHorizontal: 24,
                      paddingTop: 24,
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 24,
                        marginRight: 12,
                        backgroundColor: stringToColour(item.nickname) + "33",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Text style={[TextStyles.SubHeader2]}>
                        {item.nickname && item.nickname[0]}
                      </Text>
                    </View>
                    <Text
                      style={[
                        TextStyles.GeneralTextBold,
                        { color: ThemeStyle.accentColor }
                      ]}
                    >
                      {item.nickname}
                    </Text>
                  </View>
                );
              }}
            />
          ) : (
            <View style={{ height: "70%", paddingBottom: 240 }}>
              <NoData />
            </View>
          )}
          {this.isJoined ? (
            <View
              style={{
                position: "absolute",
                width: "100%",
                paddingHorizontal: 16,
                bottom: 64
              }}
            >
              <Button
                name="Leave Group"
                style={{
                  backgroundColor: ThemeStyle.red
                }}
                noGradient
                onPress={this.leavePeerGroup}
              />
            </View>
          ) : (
            <View
              style={{
                position: "absolute",
                bottom: 0,
                padding: 16,
                width: "100%",
                height: 240,
                backgroundColor: ThemeStyle.pageContainer.backgroundColor
              }}
            >
              <Text style={TextStyles.GeneralTextBold}>Your Chat Nickname</Text>
              <TextInput
                style={[
                  TextStyles.GeneralText,
                  {
                    borderColor: "#ccc",
                    backgroundColor: "#fff",
                    borderWidth: 1,
                    minHeight: 42,
                    borderRadius: 4,
                    fontSize: 16,
                    textAlignVertical: "top",
                    color: "#000",
                    marginBottom: 16,
                    marginTop: 8,
                    paddingHorizontal: 8,
                    paddingTop: 8,
                  }
                ]}
                blurOnSubmit={true}
                returnKeyType="done"
                multiline={true}
                underlineColorAndroid="transparent"
                onChangeText={description => {
                  this.nickname = description;
                }}
              />
              <Button
                name="Join Group"
                // style={{
                //   width: "100%",
                //   marginHorizontal: 16
                // }}
                onPress={this.addUserToPeerGroup}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
}

export default withStore(JoinGroupScreen);
