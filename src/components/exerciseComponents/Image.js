import CLImage from "../CLImage";
import React from "react";
import {
  cloudinaryPaths,
  getCloudIDFromImageName
} from "../../utils/ImageUtils";
import { View } from "react-native";
import * as Animatable from "react-native-animatable";

export default ComponentImage = props => {
  console.log("IMAGE PROPS", props);
  return props.image && props.image !== "" ? (
    <Animatable.View
      animation="zoomIn"
      style={{
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 4,
        overflow: "hidden"
      }}
    >
      <CLImage
        cloudId={getCloudIDFromImageName(props.image, cloudinaryPaths.exercise)}
        style={{
          height: 220,
          width: "100%",
          elevation: 16,
          overflow: "hidden"
        }}
      />
    </Animatable.View>
  ) : null;
};
