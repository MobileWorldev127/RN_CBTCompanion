import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity
} from "react-native";
import * as Animatable from "react-native-animatable";
import ThemeStyle from "../../styles/ThemeStyle";
import { Transition } from "react-navigation-fluid-transitions";
import ComponentImage from "./Image";
import Title from "./Title";
import { getMeditationImage } from "../../utils/ImageUtils";
import { getMeditationAudioPath, exerciseIcons } from "../../constants";
import Icon from "../../common/icons";
import Video from "react-native-video";
import TextStyles from "../../common/TextStyles";
import { showMessage } from "react-native-flash-message";

export default class Audio extends Component {
  constructor(props) {
    super(props);
    this.currentTime = 0;
    this.playableDuration = 0;
    this.seekableDuration = 0;
    this.state = {
      playing: false
    };
  }

  playSound = () => {
    if (this.state.loaded) {
      this.setState({ playing: true });
    } else {
      showMessage({ type: "warning", message: "Loading Audio. Please Wait" });
    }
  };

  pauseSound = () => {
    console.log("PAUSE SOUND", this.currentTime, this.playableDuration);
    this.props.onValueChange(
      this.currentTime
        ? {
            stringValues: [`${this.currentTime / 60}`]
          }
        : undefined
    );
    try {
      this.setState({ playing: false });
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  forward = () => {
    if (this.currentTime + 10 < this.playableDuration) {
      this.player && this.player.seek(this.currentTime + 10);
    } else {
      this.player && this.player.seek(this.playableDuration);
    }
  };

  rewind = () => {
    this.player && this.player.seek(this.currentTime - 10);
  };

  render() {
    const { playing, imageLoaded } = this.state;
    return (
      <Animatable.View animation="fadeInLeft">
        <View style={styles.mainContainer}>
          <Title title={""} showInstructions={this.props.showInstructions} />
          <View style={{ flexDirection: "row", marginTop: 12, flex: 1 }}>
            <View>
              <Animatable.Image
                animation={playing ? "rotate" : ""}
                easing="linear"
                duration={8000}
                iterationCount="infinite"
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 48,
                  borderWidth: 1,
                  borderColor: "#000"
                }}
                onLoad={() => {
                  this.setState({
                    imageLoaded: true
                  });
                }}
                source={{
                  uri: getMeditationImage(this.props.image)
                }}
              />
              {!imageLoaded && (
                <Animatable.Image
                  animation={playing ? "rotate" : ""}
                  easing="linear"
                  duration={8000}
                  iterationCount="infinite"
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: 48,
                    borderWidth: 1,
                    borderColor: "#000",
                    position: "absolute"
                  }}
                  resizeMode="center"
                  source={require("../../assets/images/redesign/music-icon.png")}
                />
              )}
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
                  uri: getMeditationAudioPath(this.props.filename)
                }}
                paused={!playing}
                useTextureView={false}
                fullscreen={true}
                controls={false}
                audioOnly={true}
                onProgress={({
                  currentTime,
                  seekableDuration,
                  playableDuration
                }) => {
                  console.log(
                    "TIME",
                    currentTime,
                    playableDuration,
                    seekableDuration
                  );
                  this.currentTime = currentTime;
                  this.playableDuration = playableDuration;
                  this.seekableDuration = seekableDuration;
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
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 16,
                flex: 1
              }}
            >
              <Text
                style={[
                  TextStyles.SubHeader2,
                  { color: ThemeStyle.mainColor, textAlign: "center" }
                ]}
              >
                {this.props.title}
              </Text>
              <Text style={TextStyles.ContentText}>
                {this.props.placeholder}
              </Text>
              <View style={styles.buttons}>
                <TouchableOpacity
                  style={styles.mediaButton}
                  onPress={this.rewind}
                >
                  <Icon
                    family="Ionicons"
                    name="ios-rewind"
                    size={18}
                    style={{ paddingRight: 3 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.mediaButton, styles.playPause]}
                  onPress={playing ? this.pauseSound : this.playSound}
                >
                  <Icon
                    family="Ionicons"
                    name={playing ? "ios-pause" : "ios-play"}
                    size={26}
                    color={ThemeStyle.accentColor}
                    style={{ paddingLeft: playing ? 0 : 6 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.mediaButton}
                  onPress={this.forward}
                >
                  <Icon
                    family="Ionicons"
                    name="ios-fastforward"
                    size={18}
                    style={{ paddingLeft: 3 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Animatable.View>
    );
  }
}

var styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
    marginTop: 8
  },
  innerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 12,
    backgroundColor: "#fff",
    marginVertical: 15
  },
  buttons: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    flexDirection: "row"
  },
  mediaButton: {
    borderWidth: 1,
    borderColor: "#000",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8
  },
  playPause: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderColor: ThemeStyle.accentColor
  }
});
