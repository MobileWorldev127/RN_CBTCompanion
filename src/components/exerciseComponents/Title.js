import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import TextStyles from "../../common/TextStyles";
import Icon from "../../common/icons";
import ThemeStyle from "../../styles/ThemeStyle";
import * as Animatable from "react-native-animatable";

export default ComponentTitle = props => (
  <Animatable.View
    animation="fadeIn"
    style={[
      {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
      },
      props.containerStyle
    ]}
  >
    <Text
      style={[
        TextStyles.SubHeader2,
        props.style,
        { color: ThemeStyle.mainColor, maxWidth: "90%" }
      ]}
    >
      {props.title}
    </Text>
    {props.showInstructions && (
      <TouchableOpacity onPress={props.showInstructions}>
        <Icon
          size={24}
          color={ThemeStyle.mainColor}
          name="ios-information-circle-outline"
          family="Ionicons"
        />
      </TouchableOpacity>
    )}
  </Animatable.View>
);
