import React, { Component } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  Keyboard,
  LayoutAnimation,
  Dimensions,
  Text
} from "react-native";
import { API, graphqlOperation } from "aws-amplify";
import { sendMessageToDiscussionGroupMutation } from "../../../queries/discussionQueries";
import { showMessage } from "react-native-flash-message";
import { SafeAreaView } from "react-navigation";
import { errorMessage } from "../../../utils";
import Icon from "../../../common/icons";
import ThemeStyle from "../../../styles/ThemeStyle";
import Button from "../../../components/Button";
import TextStyles from "../../../common/TextStyles";
import Header from "../../../components/Header";
import Card from "../../../components/Card";

const { width, height } = Dimensions.get("screen");
const modalHeight = height - 50;

export default class AddPostModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      e => {
        this.keyboardHeight = e.endCoordinates.height;
        LayoutAnimation.easeInEaseOut();
        this.setState({
          keyboardVisible: true
        });
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

  show = () => {
    this.setState({
      visible: true
    });
  };

  hide = () => {
    this.setState({
      visible: false
    });
  };

  createPost = () => {
    if (!this.messageInput || !this.messageInput.trim().length) {
      showMessage(errorMessage("Please add a message to post"));
      return;
    }
    this.props.setLoading(true);
    const variables = {
      groupId: this.props.discussion.id,
      message: this.messageInput
    };
    API.graphql(
      graphqlOperation(sendMessageToDiscussionGroupMutation, variables)
    )
      .then(res => {
        this.props.setLoading(false);
        if (res.data && res.data.sendMessageToDiscussionGroup) {
          this.messageInput = undefined;
          this.textInput.clear();
          this.props.onPostAdded(res.data.sendMessageToDiscussionGroup);
          this.hide();
        }
      })
      .catch(err => {
        console.log(err);
        this.props.setLoading(false);
        showMessage(errorMessage("Failed to add post. Please try again."));
      });
  };

  render() {
    return (
      <Modal
        visible={this.state.visible}
        animationType="slide"
        animated
        transparent={false}
        backdropColor="transparent"
        onRequestClose={() => this.hide()}
      >
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: ThemeStyle.backgroundColor,
            justifyContent: "space-between",
            position: "relative"
          }}
        >
          <View
            style={{
              justifyContent: "flex-start"
            }}
          >
            <View
              style={{
                backgroundColor: ThemeStyle.pageContainer.backgroundColor,
                width: width,
                height: this.state.keyboardVisible
                  ? modalHeight - this.keyboardHeight
                  : modalHeight
              }}
            >
              <Header
                title="Add New Post"
                goBack={() => {
                  this.hide();
                }}
              />
              <View
                style={{
                  flex: 1,
                  // justifyContent: "flex-end"
                  padding: 16,
                  marginBottom: 12,
                  paddingVertical: 5
                }}
              >
                <Text
                  style={[
                    TextStyles.Header2,
                    {
                      paddingVertical: 10
                    }
                  ]}
                >
                  {" "}
                  New Discussion Topic{" "}
                </Text>
                {/* <Text style={[
                TextStyles.ContentText, {
                  paddingVertical: 10
                }
              ]}> Message
                </Text> */}
                <Card>
                  <TextInput
                    ref={ref => {
                      this.textInput = ref;
                    }}
                    style={[
                      TextStyles.GeneralText,
                      {
                        minHeight: 150,
                        maxHeight: this.state.keyboardVisible
                          ? (modalHeight - this.keyboardHeight) / 2
                          : modalHeight / 2,
                        // paddingHorizontal: 16,
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: ThemeStyle.disabledLight,
                        alignItems: "flex-start",
                        padding: 12,
                        paddingTop: 12,
                        margin: 16
                      }
                    ]}
                    underlineColorAndroid="transparent"
                    placeholder={"Write your post here..."}
                    onChangeText={text => {
                      this.messageInput = text;
                    }}
                    multiline={true}
                    numberOfLines={10}
                  />
                </Card>
                <Button
                  name="SUBMIT POST"
                  onPress={this.createPost}
                  style={{ marginTop: 20 }}
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}
