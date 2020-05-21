import React, { Component } from "react";
import {
  FlatList,
  View,
  Modal,
  TouchableOpacity,
  Keyboard,
  LayoutAnimation,
  Dimensions,
  Image,
  Text
} from "react-native";
import MessageInput from "../../../components/MessageInput";
import { API, graphqlOperation } from "aws-amplify";
import { commentOnDiscussionGroupMessageMutation } from "../../../queries/discussionQueries";
import { showMessage } from "react-native-flash-message";
import { errorMessage } from "../../../utils";
import moment from "moment";
import { SafeAreaView } from "react-navigation";
import { NoData } from "../../../components/NoData";
import Icon from "../../../common/icons";
import ThemeStyle from "../../../styles/ThemeStyle";
import MessageItem from "../peerGroups/MessageItem";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Header from "../../../components/Header";
import TextStyles from "../../../common/TextStyles";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("screen");
const modalHeight = height - 190;

export default class CommentsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      post: undefined,
      refreshData: false
    };
  }

  show = (post, refreshPost) => {
    this.setState({
      visible: true,
      post,
      comments: post && post.comments,
      refreshPost
    });
  };

  hide = () => {
    this.setState({
      visible: false
    });
  };

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      e => {
        this.keyboardHeight = e.endCoordinates.height;
        LayoutAnimation.easeInEaseOut();
        this.setState({
          keyboardVisible: true
        });
        if (this.state.visible && this.itemScroll) {
          setTimeout(() => {
            this.itemScroll.scrollToIndex({
              animated: true,
              index: this.state.comments.length - 1
            });
          }, 500);
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

  postComment = () => {
    if (!this.commentMessage || !this.commentMessage.trim().length) {
      showMessage(errorMessage("Please add a message to comment."));
      return;
    }
    Keyboard.dismiss();
    const variables = {
      groupId: this.props.groupId,
      messageId: this.state.post.id,
      comment: this.commentMessage
    };
    this.props.setLoading(true);
    API.graphql(
      graphqlOperation(commentOnDiscussionGroupMessageMutation, variables)
    )
      .then(res => {
        this.props.setLoading(false);
        if (res.data && res.data.commentOnDiscussionGroupMessage) {
          const comments = this.state.comments;
          comments.push({
            createdAt: moment().toISOString(),
            senderName: this.props.userName,
            senderId: this.props.userId,
            comment: variables.comment,
            id: moment().toISOString()
          });
          this.commentMessage = undefined;
          this.textInput.clear();
          this.state.refreshPost();
          this.setState(prevState => ({
            refreshData: !prevState.refreshData
          }));
          setTimeout(() => {
            this.itemScroll.scrollToIndex({
              animated: true,
              index: this.state.comments.length - 1
            });
          }, 100);
        }
      })
      .catch(err => {
        console.log(err);
        showMessage(errorMessage("Failed to add comment. Please try again"));
        this.props.setLoading(false);
      });
  };

  getItemLayouts = (data, index) => ({ length: 52, offset: 52 * index, index });

  render() {
    const { visible, post, comments } = this.state;
    return (
      <Modal
        visible={visible}
        animationType="slide"
        animated
        transparent
        backdropColor="transparent"
        onRequestClose={() => this.hide()}
      >
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: "space-between",
            position: "relative"
          }}
        >
          <View
            style={{
              backgroundColor: "#0003",
              flex: 1,
              justifyContent: "flex-end"
            }}
          >
            <View
              style={{
                width: "100%",
                position: "absolute",
                top: 0
              }}
            >
              <TouchableWithoutFeedback
                onPress={this.hide}
                style={{ height: 150 }}
              />
              <View
                style={{
                  position: "absolute",
                  top: 150,
                  backgroundColor: "#fff",
                  height: this.state.keyboardVisible
                    ? modalHeight - this.keyboardHeight
                    : modalHeight,
                  justifyContent: "space-between",
                  borderTopRightRadius: 20,
                  borderTopLeftRadius: 20
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    padding: 20,
                    alignItems: "center"
                  }}
                >
                  <TouchableOpacity onPress={this.hide}>
                    <Image
                      source={require("../../../assets/images/redesign/Back.png")}
                    />
                  </TouchableOpacity>
                  <Text style={[TextStyles.Header2, { marginLeft: 16 }]}>
                    Comments
                  </Text>
                </View>
                {post && post.comments && post.comments.length ? (
                  <FlatList
                    ref={ref => (this.itemScroll = ref)}
                    getItemLayout={this.getItemLayouts}
                    initialScrollIndex={post.comments.length - 1}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingVertical: 12 }}
                    data={comments}
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
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}
