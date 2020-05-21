import React, { Component } from "react";
import { View, Text, TextInput, FlatList } from "react-native";
import Header from "../../../components/Header";
import TextStyles from "../../../common/TextStyles";
import Button from "../../../components/Button";
import { showMessage } from "react-native-flash-message";
import { errorMessage } from "../../../utils";
import { API, graphqlOperation } from "aws-amplify";
import {
  joinPeerGroupQuery,
  leavePeerGroupQuery,
  createPeerGroupQuery
} from "../../../queries/peerGroupQueries";
import { APP } from "../../../constants";
import { withStore } from "../../../utils/StoreUtils";
import { StackActions } from "react-navigation";
import ThemeStyle from "../../../styles/ThemeStyle";
import { NoData } from "../../../components/NoData";

class CreatePeerGroupScreen extends Component {
  constructor(props) {
    super(props);
    this.nickname = "";
    this.groupName = "";
    this.groupDescription = "";
  }

  addUserToPeerGroup = () => {
    if (this.nickname && this.nickname.trim().length) {
      this.props.setLoading(true);
      API.graphql(
        graphqlOperation(joinPeerGroupQuery, {
          appId: APP.swasthApp,
          groupId: this.group.id
        })
      )
        .then(res => {
          this.props.setLoading(false);
          if (res.data && res.data.joinPeerSupportGroup) {
            showMessage({
              type: "success",
              message: "Successfully added to group"
            });
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

  createPeerGroup = () => {
    if (!(this.groupName && this.groupName.trim().length)) {
      showMessage(errorMessage("Please enter group name"));
      return;
    }
    if (!(this.groupDescription && this.groupDescription.trim().length)) {
      showMessage(errorMessage("Please enter group description"));
      return;
    }
    if (!(this.nickname && this.nickname.trim().length)) {
      showMessage(errorMessage("Please enter your nickname"));
      return;
    }
    this.props.setLoading(true);
    const variables = {
      name: this.groupName,
      description: this.groupDescription,
      nickname: this.nickname,
      appId: APP.swasthApp
    };
    console.log("CREATING PEER GROUP", variables);
    API.graphql(graphqlOperation(createPeerGroupQuery, variables))
      .then(res => {
        console.log("GROUP CREATED", res.data);
        this.props.setLoading(false);
        if (res.data && res.data.createPeerSupportGroup) {
          showMessage({
            type: "success",
            message: "Successfully created group"
          });
          this.props.navigation.dispatch(
            StackActions.replace({
              routeName: "PeerGroupChatScreen",
              params: {
                group: res.data.createPeerSupportGroup
              }
            })
          );
        }
      })
      .catch(err => {
        this.props.setLoading(false);
        console.log(err);
        showMessage(
          errorMessage("Failed to create group. Please try again later")
        );
      });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          title={"Create Group"}
          goBack={() => {
            this.props.navigation.goBack(null);
          }}
        />
        <View style={[ThemeStyle.pageContainer, { height: "100%" }]}>
          <View
            style={{
              padding: 16,
              width: "100%"
            }}
          >
            <Text style={TextStyles.GeneralTextBold}>Enter Group Name</Text>
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
                  color: "#000",
                  marginBottom: 24,
                  marginTop: 8,
                  padding: 8,
                  justifyContent: "center"
                }
              ]}
              blurOnSubmit={true}
              returnKeyType="done"
              multiline={true}
              underlineColorAndroid="transparent"
              onChangeText={name => {
                this.groupName = name;
              }}
            />
            <Text style={TextStyles.GeneralTextBold}>Enter Group Description</Text>
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
                  color: "#000",
                  marginBottom: 32,
                  marginTop: 8,
                  padding: 8,
                  justifyContent: "center"
                }
              ]}
              blurOnSubmit={true}
              returnKeyType="done"
              multiline={true}
              underlineColorAndroid="transparent"
              onChangeText={name => {
                this.groupDescription = name;
              }}
            />
            <Text style={TextStyles.GeneralTextBold}>Enter Nickname</Text>
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
                  color: "#000",
                  marginBottom: 32,
                  marginTop: 8,
                  padding: 8,
                  justifyContent: "center"
                }
              ]}
              blurOnSubmit={true}
              returnKeyType="done"
              multiline={true}
              underlineColorAndroid="transparent"
              onChangeText={name => {
                this.nickname = name;
              }}
            />
            <Button
              name="Create Group"
              // style={{
              //   width: "100%",
              //   marginHorizontal: 16
              // }}
              onPress={this.createPeerGroup}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default withStore(CreatePeerGroupScreen);
