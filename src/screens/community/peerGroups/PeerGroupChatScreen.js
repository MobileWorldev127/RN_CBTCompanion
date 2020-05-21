import React, { Component } from "react";
import { View, FlatList, Dimensions, Text, Keyboard } from "react-native";
import Icon from "../../../common/icons";
import ThemeStyle from "../../../styles/ThemeStyle";
import TextStyles from "../../../common/TextStyles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { API, graphqlOperation, Auth } from "aws-amplify";
import {
  getPeerSupportGroupMessagesQuery,
  subscribeToPeerSupportGroupMessage,
  sendPeerGroupMessageQuery
} from "../../../queries/peerGroupQueries";
import { showMessage } from "react-native-flash-message";
import { errorMessage, mapUserIdToNickname } from "../../../utils";
import { NoData } from "../../../components/NoData";
import MessageItem from "./MessageItem";
import { withStore, withSafeAreaActions } from "../../../utils/StoreUtils";
import Header from "../../../components/Header";
import MessageInput from "../../../components/MessageInput";
import _ from "lodash";

const { width } = Dimensions.get("window");

class PeerGroupChatScreen extends Component {
  constructor(props) {
    super(props);
    this.pageIndex = 0;
    this.state = {
      group: props.navigation.state.params.group
    };
    this.userMap = mapUserIdToNickname(this.state.group);
  }

  componentDidMount() {
    Auth.currentAuthenticatedUser().then(user => {
      console.log("CURRENT USER", user);
      this.setState({
        userId: user.username,
        userName: user.attributes.name
      });
    });
    this.fetchMessages();
    this.props.setTopSafeAreaView(ThemeStyle.backgroundColor)
  }

  componentWillUnmount() {
    if (this.subscription) {
      console.log("UNSUBSCRIBING");
      this.subscription.unsubscribe();
    }
    this.props.setTopSafeAreaView(ThemeStyle.mainColorLight)
  }

  fetchMessages = (groupId, pageIndex = this.pageIndex) => {
    if (this.pageIndex === 0) {
      this.props.setLoading(true);
    }
    const variables = {
      groupId: groupId || this.state.group.id,
      pageSize: 15,
      pageIndex: pageIndex
    };
    console.log("FETCHING MESSAGES", variables);
    API.graphql(graphqlOperation(getPeerSupportGroupMessagesQuery, variables))
      .then(res => {
        console.log("FETCHED MESSAGES", res.data.getPeerSupportGroupMessages);
        if (res.data && res.data.getPeerSupportGroupMessages) {
          this.props.setLoading(false);
          if (pageIndex > 0) {
            this.pageIndex++;
            if (res.data.getPeerSupportGroupMessages.length !== 15) {
              this.noMoreMessages = true;
            }
            this.state.chatMessages = [
              ...this.state.chatMessages,
              ...res.data.getPeerSupportGroupMessages
            ];
            this.setState(prevState => ({
              refreshData: !prevState.refreshData
            }));
          } else {
            this.setState({
              chatMessages: _.cloneDeep(res.data.getPeerSupportGroupMessages)
            });
            this.subscribeToNewMessages(variables.groupId);
          }
        }
      })
      .catch(err => {
        console.log(err);
        this.props.setLoading(false);
        showMessage(errorMessage("Failed to fetch messages. Please try again"));
      });
  };

  subscribeToNewMessages = groupId => {
    const variables = {
      groupId
    };
    this.subscription = API.graphql(
      graphqlOperation(subscribeToPeerSupportGroupMessage, variables)
    ).subscribe({
      next: ({ value }) => {
        console.log("RECEIVED MESSAGE", value);
        if (value.data && value.data.subscribeToPeerSupportGroupMessage) {
          this.setState(prevState => ({
            chatMessages: [
              value.data.subscribeToPeerSupportGroupMessage,
              ...prevState.chatMessages
            ],
            refreshData: !prevState.refreshData
          }));
        }
      },
      error: error => console.error("FAILED TO SUBSCRIBE TO MESSAGES", error),
      close: () => console.log("UNSUBSCRIBING TO MESSAGES")
    });
    console.log("SUBSCRIPTION", this.subscription);
  };

  sendMessage = () => {
    if (this.messageInput && this.messageInput.length) {
      Keyboard.dismiss();
      const variables = {
        message: this.messageInput,
        groupId: this.state.group.id
      };
      console.log("ADDING MESSAGE", variables);
      API.graphql(graphqlOperation(sendPeerGroupMessageQuery, variables))
        .then(res => {
          if (res.data) {
            console.log("ADDED MESSAGE");
            this.messageInput = undefined;
            this.textInput.clear();
          }
        })
        .catch(err => {
          handleAPIError(err);
        });
      // this.setState(prevState => {
      //   prevState.chatMessages.splice(0, 0, {
      //     message: this.messageInput,
      //     sender: prevState.refreshData ? "abcd" : undefined
      //   });
      //   this.messageInput = undefined;
      //   this.textInput.clear();
      //   return {
      //     chatMessages: prevState.chatMessages,
      //     refreshData: !prevState.refreshData
      //   };
      // });
    } else {
      showMessage({
        type: "danger",
        message: "Please enter a message"
      });
    }
  };

  render() {
    const { chatMessages, group, refreshData } = this.state;
    return (
      <View>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            width: "100%",
            height: "100%",
            justifyContent: "flex-end",
            flexDirection: "column",
            backgroundColor: ThemeStyle.pageContainer.backgroundColor
          }}
        >
          <Header
            title={group.name}
            goBack={() => {
              this.props.navigation.goBack(null);
            }}
            onRightIconClick={() => {
              this.props.navigation.push("JoinGroupScreen", {
                isJoined: true,
                group: this.state.group
              });
            }}
            rightIcon={() => (
              <Icon
                size={24}
                color={ThemeStyle.textColor}
                name="ios-information-circle-outline"
                family="Ionicons"
              />
            )}
          />
          {group.status === "Pending" && (
            <View
              style={{
                flex: 1,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                padding: 16
              }}
            >
              <Text style={[TextStyles.GeneralText, { textAlign: "center" }]}>
                {
                  "This group is pending verification. You can add message to group after it is verified."
                }
              </Text>
            </View>
          )}
          {group.status === "Active" && (
            <View style={{ flex: 1 }}>
              {chatMessages && chatMessages.length ? (
                <FlatList
                  inverted
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{ paddingVertical: 24 }}
                  data={chatMessages}
                  extraData={refreshData}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <MessageItem
                      chatMessage={item}
                      userId={this.state.userId}
                      userName={this.state.userName}
                      group={group}
                      nickname={this.userMap[item.senderId]}
                    />
                  )}
                  onEndReached={info => {
                    console.log("Info", info);
                    if (!this.noMoreMessages) {
                      this.fetchMessages(
                        this.state.group.id,
                        this.pageIndex + 1
                      );
                    } else {
                      // showMessage({
                      //   type: "info",
                      //   message: "No more messages to display"
                      // });
                    }
                  }}
                  onEndReachedThreshold={0.1}
                />
              ) : (
                <NoData message="Send a message to chat" header="No messages" />
              )}
              <MessageInput
                setRef={textInput => {
                  this.textInput = textInput;
                }}
                placeholder="Enter Message"
                onChangeText={text => {
                  this.messageInput = text;
                }}
                onSend={this.sendMessage}
                lightBackground
              />
            </View>
          )}
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

export default withSafeAreaActions(PeerGroupChatScreen);
