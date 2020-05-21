import React from "react";
import { View, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "rgba(78,103,193,0.2)",
    shadowOffset: { height: 6 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4
  },
  cardContent: { overflow: "hidden", borderRadius: 10 }
});

export default props => {
  return (
    <View
      style={[
        styles.card,
        props.style,
        { borderRadius: props.cardRadius || 10 }
      ]}
    >
      <View
        style={[
          {
            overflow: "hidden",
            borderRadius: props.cardRadius || 10
          },
          props.contentStyle
        ]}
      >
        {props.children}
      </View>
    </View>
  );
};
