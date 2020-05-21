import React from "react";
import { Modal, View, Image, TouchableOpacity, Platform } from "react-native";
import Orientation from "react-native-orientation-locker";
import ThemeStyle from "../styles/ThemeStyle";
import Video from "react-native-video";
import { getVideoPath } from "../utils/ImageUtils";
import bugsnagClient from "../utils/Bugsnag";

export default class FullScreenVideoPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  show = videoId => {
    this.setState({
      visible: true,
      videoId
    });
    Orientation.lockToLandscape();
  };

  hide = () => {
    Orientation.lockToPortrait();
    this.setState({
      visible: false,
      videoId: undefined
    });
  };

  render() {
    const { videoId, visible } = this.state;
    return (
      <Modal
        visible={visible}
        transparent={false}
        animated={false}
        supportedOrientations={["landscape", "portrait"]}
        onRequestClose={this.hide}
      >
        <View style={ThemeStyle.pageContainer}>
          {videoId && (
            <Video
              style={{
                height: "100%",
                width: "100%",
                backgroundColor: "#fff"
              }}
              source={{
                uri: videoId.startsWith("http")
                  ? videoId
                  : getVideoPath(videoId)
              }}
              onError={error => {
                bugsnagClient.notify(error);
              }}
              paused={false}
              resizeMode="contain"
              controls={true}
              fullscreen={false}
            />
          )}
          {Platform.OS === "android" && (
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 16,
                left: 16,
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: ThemeStyle.mainColor,
                justifyContent: "center",
                alignItems: "center"
              }}
              onPress={() => {
                this.hide();
              }}
            >
              <Image
                source={require("../assets/images/redesign/cross.png")}
                style={{ tintColor: "#fff", width: 24 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    );
  }
}
