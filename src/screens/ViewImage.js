import React, { Component } from "react";
import {
  StyleSheet,
  Image,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import Button from "./../components/Button";
import Icon from "./../common/icons";
import CachedImage from "react-native-image-cache-wrapper";

export default class ImageViewer extends Component {
  constructor(props) {
    super(props);
    this.state = this.props;
    console.log(this.state);
  }

  render() {
    // let uri = undefined;
    // if (this.props.navigation.state.params.isUri) {
    //   uri = this.props.navigation.state.params.file.uri;
    // } else {
    //   uri = this.props.navigation.state.params.file.FilePath;
    // }
    // console.log(uri);
    return (
      <View style={localStyles.containerStyle}>
        <CachedImage
          style={[localStyles.imageStyle]}
          source={{ uri: this.props.navigation.state.params.uri }}
          resizeMode={"contain"}
          activityIndicator={
            <View
              style={{
                height: 180,
                justifyContent: "center"
              }}
            >
              <ActivityIndicator />
            </View>
          }
        />
        <TouchableOpacity
          onPress={() => this.props.navigation.goBack(null)}
          style={{ position: "absolute", top: 48, right: 24 }}
        >
          <Icon
            name="ios-close-circle-outline"
            size={28}
            color="white"
            family="Ionicons"
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const localStyles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#000"
  },
  buttonStyle: {
    alignSelf: "stretch",
    justifyContent: "center",
    margin: 20
  },
  imageStyle: {
    alignSelf: "stretch",
    flex: 1
  }
});
