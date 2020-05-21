import React, { Component } from "react";
import {
  Image,
  View,
  StyleSheet,
  PixelRatio,
  ActivityIndicator
} from "react-native";
import * as CLOUDINARY from "cloudinary-core";
import CachedImage from "react-native-image-cache-wrapper";

export const cloudName = "dbt";

const cloudinary = CLOUDINARY.Cloudinary.new({ cloud_name: cloudName });

export default class CLImage extends Component {
  constructor() {
    super();
    this.state = {
      layoutDone: false,
      imageWidth: 0,
      imageHeight: 0
    };
  }

  render() {
    return this.state.layoutDone ? this.renderImage() : this.renderFreeForm();
  }

  renderFreeForm() {
    return (
      <View
        style={[this.props.style, styles.background]}
        onLayout={event => this.onLayoutDone(event.nativeEvent.layout)}
      />
    );
  }

  renderImage() {
    let opts = {};
    Object.assign(opts, this.props.options, {
      width: this.state.imageWidth,
      height: this.state.imageHeight
    });
    return (
      <CachedImage
        style={[
          { width: this.state.imageWidth, height: this.state.imageHeight },
          this.props.style
        ]}
        source={{ uri: this.imageUrl(this.props.cloudId, opts) }}
        resizeMode={this.props.resizeMode}
        activityIndicator={
          <View
            style={{
              flex: 1,
              justifyContent: "center"
            }}
          >
            <ActivityIndicator />
          </View>
        }
      >
        {this.props.children}
      </CachedImage>
    );
  }

  onLayoutDone(layout) {
    if (layout.width > 0 && layout.height > 0) {
      this.setState({
        layoutDone: true,
        imageWidth: layout.width,
        imageHeight: layout.height
      });
    }
  }

  imageUrl(cloudId, options = {}) {
    let opts = {};
    Object.assign(
      opts,
      {
        crop: "fill",
        gravity: "face",
        format: "jpg",
        quality: 75,
        secure: true
      },
      options
    );
    opts.width = PixelRatio.getPixelSizeForLayoutSize(options.width);
    opts.height = PixelRatio.getPixelSizeForLayoutSize(options.height);
    let url = cloudinary.url(cloudId, opts);
    console.log("Image url is:" + url);
    return url;
  }
}

const styles = StyleSheet.create({
  background: { backgroundColor: "rgba(0,0,0,0.2)" }
});
