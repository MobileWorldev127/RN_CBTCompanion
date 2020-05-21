import React from "react";
import { View, Text } from "react-native";
import styles from "./styles";
import TextStyles from "../../common/TextStyles";

const Box = props => {
  return (
    <View style={[styles.box, props.boxStyle]}>
      <View style={[{ borderRadius: 5 }, props.containerStyle]}>
        <Text style={TextStyles.SubHeaderBold}>{props.title}</Text>
        <View style={[styles.boxInner, props.innerContainerStyle]}>
          {props.children}
        </View>
      </View>
    </View>
  );
};

export default Box;
