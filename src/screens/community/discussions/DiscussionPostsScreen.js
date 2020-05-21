import React, { Component } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  TextInput,
  Dimensions
} from "react-native";
import { NoData } from "../../../components/NoData";
import ThemeStyle from "../../../styles/ThemeStyle";
import TextStyles from "../../../common/TextStyles";
import Icon from "../../../common/icons";
import { API, graphqlOperation, Auth } from "aws-amplify";
import {
  getDiscussionGroupMessagesQuery,
  sendMessageToDiscussionGroupMutation,
  likeUnlikeDiscussionGroupMessageMutation,
  reportDiscussionGroupMessageMutation
} from "../../../queries/discussionQueries";
import { APP } from "../../../constants";
import { showMessage } from "react-native-flash-message";
import { errorMessage, stringToColour } from "../../../utils";
import Loader from "../../../components/Loader";
import moment from "moment";
import Header from "../../../components/Header";
import LinearGradient from "react-native-linear-gradient";
import { withStore } from "../../../utils/StoreUtils";
import CommentsModal from "./CommentsModal";
import AddPostModal from "./AddPostModal";
import Button from "../../../components/Button";
import * as Animatable from "react-native-animatable";
import Card from "../../../components/Card";

const { width } = Dimensions.get("window");

class DiscussionPostsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: false,
      discussion: props.navigation.state.params.discussion
    };
  }

  componentDidMount() {
    Auth.currentAuthenticatedUser().then(user => {
      console.log("CURRENT USER", user);
      (this.userId = user.username), (this.userName = user.attributes.name);
    });
    this.fetchDiscussionGroupPosts();
    this.willFocusSubscription = this.props.navigation.addListener(
      "willFocus",
      () => {
        this.fetchDiscussionGroupPosts();
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  fetchDiscussionGroupPosts = () => {
    this.setState({
      loading: true
    });
    const variables = {
      groupId: this.state.discussion.id
    };
    API.graphql(graphqlOperation(getDiscussionGroupMessagesQuery, variables))
      .then(res => {
        console.log("FETCHED DISCUSSION GROUP POSTS", res.data);
        this.setState({
          loading: false
        });
        if (res.data && res.data.getDiscussionGroupMessages) {
          this.setState({
            posts: res.data.getDiscussionGroupMessages.reverse()
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          loading: false
        });
        showMessage(
          errorMessage("Failed to fetch posts. Please try again later.")
        );
      });
  };

  createPost = () => {
    if (!this.messageInput || !this.messageInput.trim().length) {
      showMessage(errorMessage("Please add a message to post"));
      return;
    }
    this.props.setLoading(true);
    const variables = {
      groupId: this.state.discussion.id,
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
          this.setState(prevState => {
            const posts = prevState.posts;
            posts.unshift(res.data.sendMessageToDiscussionGroup);
            return {
              posts,
              refreshData: !prevState.refreshData
            };
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.props.setLoading(false);
        showMessage(errorMessage("Failed to add post. Please try again."));
      });
  };

  reportPost = () => {};

  render() {
    const { posts, loading, discussion } = this.state;
    return (
      <View style={styles.container}>
        <Header
          title={this.state.discussion.name}
          goBack={() => {
            this.props.navigation.goBack(null);
          }}
        />
        {loading ? (
          <Loader />
        ) : posts && posts.length ? (
          <FlatList
            contentContainerStyle={{ paddingVertical: 0 }}
            data={posts}
            keyExtractor={item => item.id}
            renderItem={({ item, index }) => {
              return (
                <Animatable.View animation="fadeInUp" delay={index * 100}>
                  <DiscussionPost
                    post={item}
                    setLoading={this.props.setLoading}
                    commentsModal={this.commentsModal}
                    groupId={discussion.id}
                    navigation={this.props.navigation}
                    userId={this.userId}
                  />
                </Animatable.View>
              );
            }}
          />
        ) : (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <NoData message="No Posts" />
          </View>
        )}
        <CommentsModal
          ref={ref => {
            this.commentsModal = ref;
          }}
          userId={this.userId}
          userName={this.userName}
          groupId={discussion.id}
          setLoading={this.props.setLoading}
          title={this.state.discussion.name}
        />
        <AddPostModal
          ref={ref => {
            this.addPostModal = ref;
          }}
          discussion={this.state.discussion}
          setLoading={this.props.setLoading}
          title={this.state.discussion.name}
          onPostAdded={post => {
            this.setState(prevState => {
              const posts = prevState.posts;
              posts.unshift(post);
              return {
                posts,
                refreshData: !prevState.refreshData
              };
            });
          }}
        />
        <LinearGradient
          colors={ThemeStyle.gradientColor}
          style={{
            justifyContent: "center",
            width: 55,
            position: "absolute",
            bottom: 15,
            right: 15,
            height: 55,
            borderRadius: 100,
            elevation: 6
          }}
        >
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center"
            }}
            onPress={() => {
              this.addPostModal.show();
            }}
          >
            <Icon
              family={"MaterialIcons"}
              name={"add"}
              color={"white"}
              size={30}
            />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }
}

class DiscussionPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupId: props.groupId,
      post: props.post,
      liked: false,
      commentsCount: props.post.comments && props.post.comments.length
    };
  }

  likeUnlikePost = () => {
    const { groupId, post, liked } = this.state;
    this.props.setLoading(true);
    const variables = {
      groupId,
      messageId: post.id,
      like: !liked
    };
    API.graphql(
      graphqlOperation(likeUnlikeDiscussionGroupMessageMutation, variables)
    )
      .then(res => {
        this.props.setLoading(false);
        if (res.data && res.data.likeUnlikeDiscussionGroupMessage) {
          this.setState({
            liked: variables.like
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.props.setLoading(false);
        showMessage(errorMessage());
      });
  };

  reportPost = () => {
    const { groupId, post } = this.state;
    this.props.setLoading(true);
    const variables = {
      groupId,
      messageId: post.id
    };
    API.graphql(
      graphqlOperation(reportDiscussionGroupMessageMutation, variables)
    )
      .then(res => {
        this.props.setLoading(false);
        if (res.data && res.data.reportDiscussionGroupMessage) {
          showMessage({
            type: "success",
            message:
              "This post has been successfully reported to our moderators"
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.props.setLoading(false);
        showMessage(errorMessage());
      });
  };

  refreshPost = () => {
    this.setState(prevState => ({
      commentsCount: prevState.post.comments && prevState.post.comments.length
    }));
  };

  render() {
    const { post, liked, commentsCount, groupId } = this.state;
    const likes = liked ? post.likes + 1 : post.likes;
    return (
      <Card
        style={{
          padding: 16,
          marginBottom: 12,
          marginHorizontal: 20
        }}
      >
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("DiscussionViewScreen", {
              discussion: post,
              groupId: groupId,
              title: this.props.navigation.state.params.discussion.name
            });
            // this.props.commentsModal.show(post, this.refreshPost)
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
            {moment(post.createdAt).format("DD MMM, hh:mm A")}
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
                {post.senderName[0]}
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
              <Text style={[TextStyles.SubHeader2, { marginVertical: 2 }]}>
                {post.senderId === this.props.userId ? "You" : post.senderName}
              </Text>
            </View>
          </View>
          <Text
            style={[
              TextStyles.GeneralText,
              {
                paddingVertical: 16,
                color: ThemeStyle.text2
              }
            ]}
            ellipsizeMode="tail"
            numberOfLines={5}
          >
            {post.message}
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
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
                {commentsCount + " Comments"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 24
          }}
        >
          <TouchableOpacity
            style={styles.postActionContainer}
            onPress={this.likeUnlikePost}
          >
            <Icon
              family="MaterialCommunityIcons"
              size={18}
              name={this.state.liked ? "heart" : "heart-outline"}
              color={this.state.liked ? ThemeStyle.red : ThemeStyle.text1}
            />
            <Text
              style={[
                TextStyles.ContentText,
                { marginLeft: 4, color: ThemeStyle.text1 }
              ]}
            >
              {this.state.liked ? "Unlike" : "Like"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.postActionContainer}
            onPress={() =>
              this.props.commentsModal.show(post, this.refreshPost)
            }
          >
            <Image
              source={require("../../../assets/images/redesign/comment-icon.png")}
              style={{ width: 18 }}
              resizeMode="contain"
            />
            <Text
              style={[
                TextStyles.ContentText,
                { marginLeft: 4, color: ThemeStyle.text1 }
              ]}
            >
              {"Comment"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.postActionContainer}
            onPress={this.reportPost}
          >
            <Image
              source={require("../../../assets/images/redesign/report-icon.png")}
              style={{ width: 18 }}
              resizeMode="contain"
            />
            <Text
              style={[
                TextStyles.ContentText,
                { marginLeft: 4, color: ThemeStyle.text1 }
              ]}
            >
              {"Report"}
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
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

export default withStore(DiscussionPostsScreen);
