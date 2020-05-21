import React, { Component } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Image,
  TextInput,
  Dimensions,
  Keyboard,
  LayoutAnimation,
  Platform,
  ScrollView,
  SafeAreaView
} from "react-native";
import { NoData } from "../../../components/NoData";
import ThemeStyle from "../../../styles/ThemeStyle";
import TextStyles from "../../../common/TextStyles";
import Icon from "../../../common/icons";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { commentOnDiscussionGroupMessageMutation } from "../../../queries/discussionQueries";
import { showMessage } from "react-native-flash-message";
import { errorMessage, stringToColour } from "../../../utils";
import Loader from "../../../components/Loader";
import moment from "moment";
import Header from "../../../components/Header";
import { withStore } from "../../../utils/StoreUtils";

import MessageItem from "../peerGroups/MessageItem";

const { width, height } = Dimensions.get("window");
const ContantHeight = height - 20;

import DeviceUiInfo from "../../../utils/DeviceUIInfo";
import Card from "../../../components/Card";
import MessageInput from "../../../components/MessageInput";

const { screenSize, guidelineBaseWidth, isIphonex } = DeviceUiInfo;

class DiscussionViewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      liked: false,
      discussion: props.navigation.state.params.discussion,
      groupId: props.navigation.state.params.groupId,
      title: props.navigation.state.params.title,
      boxHeight: 200,
      commentBoxHeight: ContantHeight - 200
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    Auth.currentAuthenticatedUser().then(user => {
      console.log("VIEW CURRENT USER", user);
      (this.userId = user.username), (this.userName = user.attributes.name);
      this.setState({ loading: false });
    });

    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      e => {
        this.keyboardHeight = e.endCoordinates.height;
        LayoutAnimation.easeInEaseOut();
        this.setState({
          keyboardVisible: true
        });
        if (this.commentScroll) {
          this.commentScroll.scrollToIndex({
            animated: true,
            index: this.state.discussion.comments.length - 1
          });
        }
      }
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        this.setState({
          keyboardVisible: false
        });
      }
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  refreshPost = () => {
    this.setState(prevState => ({
      commentsCount:
        prevState.discussion.comments && prevState.discussion.comments.length
    }));
    setTimeout(() => {
      this.commentScroll.scrollToIndex({
        animated: true,
        index: this.state.discussion.comments.length - 1
      });
    }, 100);
  };

  postComment = () => {
    if (!this.commentMessage || !this.commentMessage.trim().length) {
      showMessage(errorMessage("Please add a message to comment."));
      return;
    }
    Keyboard.dismiss();

    const variables = {
      groupId: this.state.groupId,
      messageId: this.state.discussion.id,
      comment: this.commentMessage
    };

    console.log(variables, this.props.userName, this.props.userId);
    this.props.setLoading(true);
    API.graphql(
      graphqlOperation(commentOnDiscussionGroupMessageMutation, variables)
    )
      .then(res => {
        this.props.setLoading(false);
        if (res.data && res.data.commentOnDiscussionGroupMessage) {
          const comments = this.state.discussion.comments;
          comments.push({
            createdAt: moment().toISOString(),
            senderName: this.userName,
            senderId: this.userId,
            comment: variables.comment,
            id: moment().toISOString()
          });
          this.commentMessage = undefined;
          this.textInput.clear();
          this.refreshPost();
          this.setState(prevState => ({
            refreshData: !prevState.refreshData
          }));
        }
      })
      .catch(err => {
        console.log(err);
        showMessage(errorMessage("Failed to add comment. Please try again"));
        this.props.setLoading(false);
      });
  };

  onLayout = event => {
    // if (this.state.dimensions) return // layout was already called
    let { width, height } = event.nativeEvent.layout;
    this.setState({
      boxHeight: Math.round(height) + 50,
      commentBoxHeight: isIphonex
        ? ContantHeight - Math.round(height) - 120
        : ContantHeight - Math.round(height) - 70
    });
  };

  getItemLayout = (data, index) => ({ length: 52, offset: 52 * index, index });

  render() {
    const {
      loading,
      discussion,
      title,
      commentBoxHeight,
      boxHeight
    } = this.state;
    const likes = discussion.likes || 0;
    return (
      <View style={styles.container}>
        <Header
          //   title={title.toUpperCase()}
          goBack={() => {
            this.props.navigation.goBack(null);
          }}
          navBarStyle={{ backgroundColor: ThemeStyle.mainColorLight }}
        />
        {loading ? (
          <Loader />
        ) : (
          <SafeAreaView style={styles.container}>
            <View
              onLayout={this.onLayout}
              style={{
                maxHeight: this.state.keyboardVisible ? 1 : boxHeight
              }}
            >
              <Card
                style={{
                  padding: 16,
                  marginVertical: 20,
                  marginHorizontal: 20
                }}
              >
                <Text
                  style={[
                    TextStyles.ContentText,
                    {
                      position: "absolute",
                      top: 0,
                      right: 12,
                      color: ThemeStyle.text1
                    }
                  ]}
                >
                  {moment(discussion.createdAt).format("DD MMM, hh:mm A")}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 12
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: ThemeStyle.accentColorTransparent,
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Text style={[TextStyles.SubHeader2, { color: "#fff" }]}>
                      {discussion.senderName[0]}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginLeft: 16,
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}
                  >
                    <Text
                      style={[TextStyles.SubHeader2, { marginVertical: 2 }]}
                    >
                      {discussion.senderId === this.userId
                        ? "You"
                        : discussion.senderName}
                    </Text>
                  </View>
                </View>
                <View
                  style={{ maxHeight: ContantHeight * 0.2, marginVertical: 2 }}
                >
                  <ScrollView>
                    <Text
                      style={[
                        TextStyles.GeneralText,
                        {
                          paddingVertical: 10
                        }
                      ]}
                    >
                      {discussion.message}
                    </Text>
                  </ScrollView>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 12
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Icon
                      family="MaterialCommunityIcons"
                      size={16}
                      name={"heart-multiple"}
                      color="red"
                    />
                    <Text style={[TextStyles.ContentText, { marginLeft: 4 }]}>
                      {likes + " Likes"}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Icon family="SimpleLineIcons" size={16} name="bubbles" />
                    <Text style={[TextStyles.ContentText, { marginLeft: 4 }]}>
                      {discussion.comments.length + " Comments"}
                    </Text>
                  </View>
                </View>
              </Card>
              <Text
                style={[
                  TextStyles.GeneralTextBold,
                  {
                    paddingHorizontal: 16,
                    backgroundColor: ThemeStyle.mainColorLight,
                    marginBottom: 12,
                    fontWeight: "bold",
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 10
                  }
                ]}
              >
                {" "}
                COMMENTS{" "}
              </Text>
            </View>
            <View style={{ justifyContent: "flex-end" }}>
              <View
                style={{
                  backgroundColor: ThemeStyle.pageContainer.backgroundColor,
                  width: width,
                  maxHeight: this.state.keyboardVisible
                    ? commentBoxHeight - this.keyboardHeight
                    : commentBoxHeight,
                  height: this.state.keyboardVisible
                    ? commentBoxHeight - this.keyboardHeight
                    : commentBoxHeight,
                  justifyContent: "space-between"
                }}
              >
                {discussion &&
                discussion.comments &&
                discussion.comments.length ? (
                  <FlatList
                    ref={ref => (this.commentScroll = ref)}
                    getItemLayout={this.getItemLayout}
                    onLayout={() =>
                      this.commentScroll.scrollToIndex({
                        animated: true,
                        index: discussion.comments.length - 1
                      })
                    }
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingVertical: 16 }}
                    data={discussion.comments}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => {
                      return (
                        <MessageItem
                          chatMessage={item}
                          userName={this.state.userName}
                          messageExtractor={item => item.comment}
                        />
                      );
                    }}
                  />
                ) : (
                  <NoData message="No one has commented on this post" />
                )}
                <MessageInput
                  setRef={textInput => {
                    this.textInput = textInput;
                  }}
                  placeholder="Write a comment"
                  onSend={this.postComment}
                  onChangeText={text => {
                    this.commentMessage = text;
                  }}
                  contentContainerStyle={{
                    marginVertical: 5
                  }}
                />
              </View>
            </View>
          </SafeAreaView>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeStyle.pageContainer.backgroundColor
  },
  postActionContainer: {
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center"
  }
});

export default withStore(DiscussionViewScreen);
