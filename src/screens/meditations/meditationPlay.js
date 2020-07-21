import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image
} from "react-native";
import { meditationPlay as styles } from "./styles";
import Icon from "react-native-vector-icons/Ionicons";
import ProgressBar from "../../components/ProgressBar";
import * as Animateable from "react-native-animatable";
import LinearGradient from "react-native-linear-gradient";
import {
  CONTENT_PATH as baseUrl,
  getAmplifyConfig,
  getEnvVars,
  favouriteTypes
} from "../../constants";
import ThemeStyle from "../../styles/ThemeStyle";
import TextStyles from "../../common/TextStyles";
import Video from "react-native-video";
import { showMessage } from "react-native-flash-message";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import { addUserMeditationMutation } from "../../queries/addUserMeditation";
import moment, { max } from "moment";
import { errorMessage } from "../../utils";
import { addItemToFavorites } from "../favourites/FavoritesAction";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";
import { getMeditationImage } from "../../utils/ImageUtils";
import { performNetworkTask } from "../../utils/NetworkUtils";

export default class MeditationPlay extends Component {
  static navigatorStyle = {
    tabBarHidden: true
  };
  soundObject = null;
  state = {
    playing: false,
    loaded: false
  };
  startDate = moment();

  playSound = () => {
    if (this.state.loaded) {
      this.setState({ playing: true });
    } else {
      showMessage({ type: "warning", message: "Loading Audio. Please Wait" });
    }
  };

  pauseSound = () => {
    try {
      this.setState({ playing: false });
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  componentWillReceiveProps(nextProps) {
    this.startDate = moment();
  }

  onClose = () => {
    const item = this.props.item
      ? this.props.item
      : this.props.navigation.state.params.item;
    Amplify.configure(
      getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
    );
    console.log("CURRENT TIME", this.currentTime);
    if (!this.currentTime || this.currentTime === 0) {
      this.props.onClose
        ? this.props.onClose()
        : this.props.navigation.state.params.onClose();
      return;
    }
    let variables = {
      app: getEnvVars().appId,
      title: item.title,
      image: item.imagePath,
      startDate: this.startDate.toISOString(),
      endDate: moment().toISOString(),
      totalMinutes: "" + this.currentTime / 60
    };
    console.log(variables);
    API.graphql({
      query: addUserMeditationMutation,
      variables: {
        input: variables
      }
    })
      .then(data => {
        console.log(data);
        if (
          this.props.navigation &&
          this.props.navigation.state.params &&
          this.props.navigation.state.params.isHomework
        ) {
          this.props.navigation.state.params.submitHomework("", () => {});
        }
      })
      .catch(err => {
        console.log(err);
        showMessage(
          errorMessage("Failed to record meditation session. Please try again.")
        );
      })
      .finally(() => {
        this.props.onClose
          ? this.props.onClose()
          : this.props.navigation.state.params.onClose();
      });
  };

  forward = () => {
    if (this.currentTime + 10 < this.playableDuration) {
      this.player.seek(this.currentTime + 10);
    } else {
      this.player.seek(this.playableDuration);
    }
  };

  rewind = () => {
    this.player.seek(this.currentTime - 10);
  };

  getHeader = item => (
    <SafeAreaView>
      <View style={styles.header}>
        <TouchableOpacity style={styles.Headerbutton} onPress={this.onClose}>
          <Icon name="ios-arrow-round-back" size={35} color="white" />
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.Headerbutton}>
          <Icon
            name="ios-heart-outline"
            size={25}
            color="white"
            style={{ paddingTop: 6 }}
          />
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => {
            addItemToFavorites(
              favouriteTypes.MEDITATION,
              item.title,
              item.id,
              () => {
                showMessage({
                  type: "success",
                  message: "Added to Favorites"
                });
              }
            );
          }}
        >
          <Icon
            name="md-heart-outline"
            size={24}
            style={{ marginRight: 8 }}
            color={"#fff"}
            family="Ionicons"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  componentDidMount() {
    recordScreenEvent(screenNames.meditationPlay, {
      meditation: this.props.item
        ? this.props.item
        : this.props.navigation.state.params.item
    });
  }

  render() {
    const item = this.props.item
      ? this.props.item
      : this.props.navigation.state.params.item;
    return (
      <LinearGradient
        start={{ x: 0, y: 1 }}
        end={{ x: 0.8, y: 0 }}
        colors={ThemeStyle.gradientColor2}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          {this.getHeader(item)}
          <Video
            ref={ref => {
              this.player = ref;
            }}
            style={{
              height: 0,
              width: 0,
              backgroundColor: "#0000"
            }}
            source={{
              uri: `${baseUrl}meditations/audio_files/${item.filename}.mp3`
            }}
            paused={!this.state.playing}
            useTextureView={false}
            fullscreen={true}
            controls={false}
            audioOnly={true}
            onProgress={({
              currentTime,
              seekableDuration,
              playableDuration
            }) => {
              console.log(currentTime);
              this.currentTime = currentTime;
              this.playableDuration = playableDuration;
              this.seekableDuration = seekableDuration;
              this.setState({
                currentDuration: currentTime,
                maxDuration: playableDuration
              });
            }}
            onLoad={data => {
              this.setState({
                loaded: true
              });
            }}
            onEnd={this.pauseSound}
            playWhenInactive
            playInBackground
            ignoreSilentSwitch="ignore"
          />
          <MediaDetails
            author={item.author}
            name={item.title}
            image={item.imagePath}
            playing={this.state.playing}
            attribution={item.attribution}
          />
          <Controls
            playing={this.state.playing}
            play={this.playSound}
            pause={this.pauseSound}
            forward={this.forward}
            rewind={this.rewind}
            currentDuration={this.state.currentDuration}
            maxDuration={this.state.maxDuration}
          />
        </View>
      </LinearGradient>
    );
  }
}

const MediaDetails = props => (
  <View style={styles.media}>
    <Animateable.View
      animation={props.playing ? "rotate" : ""}
      easing="linear"
      duration={8000}
      iterationCount="infinite"
      style={styles.mediaImageSection}
    >
      <Image
        source={{
          uri: getMeditationImage(props.image)
        }}
        style={styles.mediaImage}
      />
    </Animateable.View>
    <Text style={[TextStyles.Header2, styles.mediaTitle]}>{props.name}</Text>
    <Text style={[TextStyles.GeneralTextBold, styles.mediaAuthor]}>
      {props.author}
    </Text>
    <Text
      style={[
        TextStyles.ContentText,
        { color: "rgba(0,0,0,0.3)", textAlign: "center", marginTop: 12 }
      ]}
    >
      {`Credits: ${props.attribution}`}
    </Text>
  </View>
);

const Controls = ({
  playing,
  play,
  pause,
  forward,
  rewind,
  currentDuration,
  maxDuration
}) => (
  <View style={styles.controls}>
    <View
      style={{
        alignItems: "center",
        width: "100%"
      }}
    >
      <View
        style={{
          flexDirection: "row",
          width: "80%",
          borderRadius: 5,
          height: 10,
          overflow: "hidden"
        }}
      >
        <View
          style={{
            flex: currentDuration / maxDuration || 0,
            backgroundColor: ThemeStyle.mainColor
          }}
        />
        <View
          style={{
            flex: 1 - (currentDuration / maxDuration || 0),
            backgroundColor: "#fff3"
          }}
        />
      </View>
    </View>
    <View style={styles.buttons}>
      <TouchableOpacity style={styles.mediaButton} onPress={rewind}>
        <Icon
          name="ios-rewind"
          size={16}
          color="white"
          style={{ paddingRight: 3 }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.mediaButton, styles.playPause]}
        onPress={() =>
          performNetworkTask(
            playing ? pause : play,
            "You can only play meditations when online. Please connect to the internet and try again"
          )
        }
      >
        <Icon
          name={playing ? "ios-pause" : "ios-play"}
          size={35}
          color="white"
          style={{ paddingLeft: playing ? 0 : 6 }}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.mediaButton} onPress={forward}>
        <Icon
          name="ios-fastforward"
          size={16}
          color="white"
          style={{ paddingLeft: 3 }}
        />
      </TouchableOpacity>
    </View>
  </View>
);
