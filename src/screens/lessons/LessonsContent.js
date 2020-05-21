import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  LayoutAnimation
} from "react-native";
import styles from "./styles";
import Header from "./../../components/Header";
import * as Animatable from "react-native-animatable";
import { Transition } from "react-navigation-fluid-transitions";
import ThemeStyle from "../../styles/ThemeStyle";
import TextStyles from "../../common/TextStyles";
import { Query } from "react-apollo";
import { getLessonByIdQuery } from "../../queries/getLessonsByID";
import { showMessage } from "react-native-flash-message";
import { withStore, withSubscriptionActions } from "../../utils/StoreUtils";
import {
  getLessonImage,
  getVideoPath,
  getCloudIDFromImageURL
} from "../../utils/ImageUtils";
import HTML from "react-native-render-html";
import CachedImage from "react-native-image-cache-wrapper";
import Video from "react-native-video";
import YouTube from "react-native-youtube";
import { errorMessage, showApiError } from "../../utils";
import PremiumView from "./../PremiumView";
import Button from "../../components/Button";
import { submitHomework } from "../../actions/HomeworkActions";
import Icon from "../../common/icons";
import LottieLoader from "../../components/lottieLoader";
import CLImage from "../../components/CLImage";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";
import { APP } from "../../constants";
import CardView from "../../components/Card";
import {
  setTopSafeAreaView,
  setBottomSafeAreaView
} from "../../actions/AppActions";
import FullScreenVideoPlayer from "../FullScreenVideoPlayer";
import Orientation from "react-native-orientation-locker";
import bugsnagClient from "../../utils/Bugsnag";

let animationDelay = 0;

class LessonContentScreen extends Component<{}, {}> {
  constructor(props) {
    super(props);
    this.state = {
      containerMounted: false
    };
  }
  componentWillMount() {
    animationDelay = 0;
  }
  goBack = () => {
    this.props.navigation.goBack();
  };

  componentDidMount() {
    recordScreenEvent(screenNames.lessons_content, {
      lessonID: this.props.navigation.state.params.lessonID,
      lessonTitle: this.props.navigation.state.params.lessonTitle
        ? this.props.navigation.state.params.lessonTitle
        : this.title
    });
    this.props.setTopSafeAreaView(ThemeStyle.mainColorLight);
  }

  componentWillUnmount() {
    this.props.setTopSafeAreaView(ThemeStyle.backgroundColor);
  }

  render() {
    const {
      navigation: { navigate }
    } = this.props;
    return (
      <View style={ThemeStyle.pageContainer}>
        {/* <View> */}
        <Header
          title={""}
          goBack={() => {
            this.props.navigation.goBack(null);
          }}
          navBarStyle={{ backgroundColor: ThemeStyle.mainColorLight }}
          onRightIconClick={() => {}}
          rightIcon={() => (
            <View
              style={{ position: "relative", top: 1, flexDirection: "row" }}
            >
              <TouchableOpacity
                style={{ marginRight: 8, marginTop: 3 }}
                onPress={() => {
                  const {
                    lessonID,
                    lessonTitle
                  } = this.props.navigation.state.params;
                  this.props.navigation.navigate("NotesScreen", {
                    lessonID,
                    lessonTitle: lessonTitle ? lessonTitle : this.title
                  });
                }}
              >
                {/* <Image source={require("../../assets/images/redesign/note@2x.png")} /> */}
                <Icon
                  name="note"
                  size={20}
                  color={ThemeStyle.mainColor}
                  family="SimpleLineIcons"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  const {
                    lessonID,
                    lessonTitle
                  } = this.props.navigation.state.params;
                  this.props.navigation.navigate("PracticeIdeasListScreen", {
                    lessonID,
                    lessonTitle: lessonTitle ? lessonTitle : this.title
                  });
                }}
              >
                <Icon name="md-bulb" size={25} color={ThemeStyle.mainColor} />
              </TouchableOpacity>
            </View>
          )}
        />
        {/* <SearchBar
            lightTheme
            containerStyle={{ backgroundColor: "white", borderTopWidth: 0 }}
            icon={{ style: { fontSize: 18, marginTop: 4 } }}
            inputStyle={{
              backgroundColor: ThemeStyle.pageContainer.backgroundColor,
              height: 40,
              paddingLeft: 30
            }}
            placeholderTextColor="#ccc"
            onChangeText={() => {}}
            placeholder="Search..."
          />
        </View> */}
        <Query
          query={getLessonByIdQuery}
          variables={{
            id: this.props.navigation.state.params.lessonID
          }}
          onCompleted={() => this.props.setLoading(false)}
          onError={err => {
            console.log(err);
            this.props.setLoading(false);
            showApiError();
          }}
        >
          {({ loading, data }) => {
            if (loading) {
              this.props.setLoading(true);
              return null;
            }
            if (data) {
              console.log(data);
              let lesson = data.getLessonById;
              if (!lesson) {
                return null;
              }
              this.title = lesson.title;
              let showContent =
                !lesson.locked || (lesson.locked && this.props.isSubscribed);
              let youtubeVideos = [];
              if (showContent)
                return (
                  <View>
                    <ScrollView style={[{ paddingBottom: 64 }]}>
                      <Animatable.View
                        style={{
                          paddingHorizontal: 20,
                          paddingBottom: 16,
                          backgroundColor: ThemeStyle.mainColorLight,
                          borderBottomLeftRadius: 20,
                          borderBottomRightRadius: 20
                        }}
                        animation="slideInDown"
                      >
                        <Text
                          style={[
                            TextStyles.Header2,
                            { color: ThemeStyle.mainColor, marginVertical: 16 }
                          ]}
                        >
                          {this.props.navigation.state.params.lessonTitle
                            ? this.props.navigation.state.params.lessonTitle
                            : this.title}
                        </Text>
                        <ScrollView
                          horizontal={true}
                          decelerationRate={0}
                          snapToAlignment="center"
                          snapToInterval={300}
                        >
                          {!!lesson.videos &&
                            lesson.videos.map(videoId => {
                              if (
                                videoId.includes("youtube") ||
                                videoId.includes("youtu.be")
                              ) {
                                let id = videoId.includes("youtube")
                                  ? videoId.split("embed/")[1]
                                  : videoId.split("youtu.be/")[1];
                                youtubeVideos.push(id);
                                //let id = videoId.split("=")[1];
                                if (Platform.OS === "ios") {
                                  return (
                                    <CardView
                                      style={{
                                        marginRight: 16,
                                        shadowOpacity: 0
                                      }}
                                    >
                                      <YouTube
                                        apiKey={APP.youtubeAPIKey}
                                        controls={1}
                                        onReady={e => console.log("OnReady", e)}
                                        onChangeState={e => console.log(e)}
                                        videoId={id} // The YouTube video ID
                                        // play={true} // control playback of video with true/false
                                        fullscreen={true} // control whether the video should play in fullscreen or inline
                                        loop={false} // control whether the video should loop when ended
                                        onError={e => {
                                          console.log(
                                            "ERROR LOADING YOUTUBE VIDEO",
                                            e,
                                            id
                                          );
                                          showMessage(errorMessage());
                                        }}
                                        style={{
                                          height: 200,
                                          width: 280,
                                          backgroundColor: "#fff"
                                        }}
                                        play={false}
                                        showFullscreenButton={true}
                                        resumePlayAndroid={false}
                                      />
                                    </CardView>
                                  );
                                }
                              } else {
                                return (
                                  <CardView
                                    style={{
                                      marginRight: 16,
                                      shadowOpacity: 0
                                    }}
                                  >
                                    <Video
                                      ref={video => {
                                        this.videoPlayer = video;
                                      }}
                                      style={{
                                        height: 200,
                                        width: 280,
                                        backgroundColor:
                                          ThemeStyle.backgroundColor
                                      }}
                                      source={{
                                        uri: videoId.startsWith("http")
                                          ? videoId
                                          : getVideoPath(videoId)
                                      }}
                                      paused={true}
                                      resizeMode="contain"
                                      fullscreen={true}
                                      fullscreenAutorotate={false}
                                      fullscreenOrientation="landscape"
                                      onError={error => {
                                        bugsnagClient.notify(error);
                                      }}
                                      onFullscreenPlayerWillDismiss={() => {
                                        console.log(
                                          "FULLSCREEN PLAYER DISMISS"
                                        );
                                        if (Platform.OS === "ios") {
                                          Orientation.lockToPortrait();
                                        }
                                      }}
                                      controls={false}
                                    />
                                    <TouchableOpacity
                                      style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        justifyContent: "center",
                                        alignItems: "center"
                                      }}
                                      onPress={() => {
                                        if (Platform.OS === "ios") {
                                          this.videoPlayer.presentFullscreenPlayer();
                                        } else {
                                          this.fullscreenPlayer.show(videoId);
                                        }
                                      }}
                                    >
                                      <Icon
                                        family="MaterialCommunityIcons"
                                        name="play-circle"
                                        size={56}
                                        color={ThemeStyle.mainColor}
                                      />
                                    </TouchableOpacity>
                                  </CardView>
                                );
                              }
                            })}
                          {Platform.OS === "android" && !!youtubeVideos.length && (
                            <CardView
                              style={{ marginRight: 16, shadowOpacity: 0 }}
                            >
                              <YouTube
                                apiKey="AIzaSyAhsyzyamCHUkWFBo0C497B5NOlnpSWy20"
                                controls={1}
                                videoIds={youtubeVideos} // The YouTube video ID
                                play={false} // control playback of video with true/false
                                fullscreen={false} // control whether the video should play in fullscreen or inline
                                loop={false} // control whether the video should loop when ended
                                onError={e => showMessage(errorMessage())}
                                style={{
                                  height: 200,
                                  width: 280,
                                  backgroundColor: "#fff"
                                }}
                                showFullscreenButton={true}
                                resumePlayAndroid={false}
                              />
                            </CardView>
                          )}
                        </ScrollView>
                        {/* </Animatable.View> */}
                        <Desc
                          text={lesson.transcript}
                          showFullContent={this.state.showFullContent}
                        />
                        {!this.state.showFullContent && !!lesson.transcript && (
                          <Text
                            onPress={() => {
                              this.setState({ showFullContent: true });
                              LayoutAnimation.easeInEaseOut();
                            }}
                            style={[
                              TextStyles.GeneralTextBold,
                              { color: ThemeStyle.mainColor }
                            ]}
                          >
                            Read More
                          </Text>
                        )}
                      </Animatable.View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          marginHorizontal: 20,
                          marginVertical: 12
                        }}
                      >
                        {!!lesson.cards &&
                          lesson.cards.map(card => (
                            <Card
                              title={card.title}
                              image={card.image}
                              description={card.description}
                              navigate={navigate}
                            />
                          ))}
                      </View>
                      <View style={{ height: 90 }} />
                    </ScrollView>
                    <FullScreenVideoPlayer
                      ref={ref => {
                        this.fullscreenPlayer = ref;
                      }}
                    />
                  </View>
                );
              else
                return (
                  <PremiumView showSubscription={this.props.showSubscription} />
                );
            } else return null;
          }}
        </Query>
        {/* {this.props.navigation.state.params.isHomework && (
          <View style={{ padding: 16 }}>
            <Text style={[TextStyles.SubHeaderBold, { marginBottom: 12 }]}>
              Done with the homework?
            </Text>
            <Button
              name="Submit"
              onPress={() => {
                this.props.submitHomework("", () => {
                  this.props.navigation.goBack();
                });
              }}
            />
          </View>
        )} */}
      </View>
    );
  }
}

const Desc = ({ text, showFullContent }) => (
  <View
    style={[
      styles.transcript,
      {
        maxHeight: showFullContent ? undefined : 82,
        overflow: "hidden"
      }
    ]}
  >
    <HTML
      html={text}
      baseFontStyle={{
        color: "#000",
        fontSize: 14,
        lineHeight: 17
      }}
    />
  </View>
);

const Card = ({ title, image, navigate, description }) => {
  return (
    <Animatable.View
      animation="fadeInUp"
      delay={(animationDelay += 130)}
      style={{
        width: "48%",
        marginVertical: 12
      }}
    >
      <CardView>
        <TouchableOpacity
          onPress={() =>
            navigate("LessonsCard", {
              title,
              image,
              description
            })
          }
        >
          {image && !image.endsWith(".json") ? (
            <CLImage
              cloudId={getCloudIDFromImageURL(image)}
              source={{ uri: getLessonImage(image) }}
              style={[{ width: "100%", height: 120 }, styles.image]}
            />
          ) : (
            <LottieLoader
              source={""}
              src={image}
              dimensions={[{ width: "100%", height: 120 }, styles.image]}
            />
          )}
          <View style={styles.cartTitleSection}>
            <Text style={[TextStyles.GeneralTextBold, styles.cardTitle]}>
              {title}
            </Text>
          </View>
        </TouchableOpacity>
      </CardView>
    </Animatable.View>
  );
};

export default withSubscriptionActions(
  LessonContentScreen,
  () => {},
  dispatch => ({
    submitHomework: (submitID, onSubmitted) =>
      dispatch(submitHomework(submitID, onSubmitted)),
    setTopSafeAreaView: color => dispatch(setTopSafeAreaView(color))
  })
);
