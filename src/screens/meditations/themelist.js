import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import { themeStyles as styles } from "./styles";
import { FlatGrid } from "react-native-super-grid";
import { CONTENT_PATH as baseUrl } from "../../constants";
import Loader from "../../components/Loader";
import TextStyles from "../../common/TextStyles";
import CachedImage from "react-native-image-cache-wrapper";
import * as Animatable from "react-native-animatable";

export default ThemeList = props => (
  <View style={styles.container}>
    {props.themes.loading ? (
      <Loader />
    ) : (
      <FlatGrid
        items={props.themes.data}
        spacing={16}
        style={styles.gridView}
        renderItem={({ item }) => (
          <ThemeBox item={item} onPress={() => props.onSelect("theme", item)} />
        )}
      />
    )}
  </View>
);

const ThemeBox = ({ item, onPress }) => (
  <Animatable.View animation="zoomIn">
    <TouchableOpacity style={styles.box} onPress={onPress}>
      <CachedImage
        source={{
          uri: baseUrl + "meditations/theme_icons/cbt/" + item + ".jpg",
          cache: "force-cache"
        }}
        style={{ width: "100%", height: 150, borderRadius: 10 }}
      />
      <View style={styles.content}>
        <Text style={[TextStyles.SubHeaderBold, styles.imageTitle]}>
          {item}
        </Text>
      </View>
    </TouchableOpacity>
  </Animatable.View>
);
