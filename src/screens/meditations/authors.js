import React, { Component } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Avatar, Divider } from "react-native-elements";
import { CONTENT_PATH as baseUrl } from "../../constants";

import { authorStyles as styles } from "./styles";
import TextStyles from "../../common/TextStyles";
import LinearGradient from "react-native-linear-gradient";
import ThemeStyle from "../../styles/ThemeStyle";

export default class Authors extends Component {
  render() {
    const { getByAuthor } = this.props;
    const firstAuthor = {
      name: "All",
      picture:
        "https://png.pngtree.com/element_origin_min_pic/17/09/18/2cd5ba137d14e948434e3959f390ffe5.jpg"
    };
    return (
      <View style={styles.authors}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.author}>
            <TouchableOpacity onPress={() => getByAuthor("author", "all")}>
              <LinearGradient
                colors={ThemeStyle.gradientColor}
                style={{ width: 36, height: 36, borderRadius: 18 }}
              />
            </TouchableOpacity>
            <Text style={[TextStyles.ContentTextBold, { marginTop: 4 }]}>
              {firstAuthor.name}
            </Text>
          </View>
          {this.props.authors.data.map((author, index) => (
            <Author
              key={index}
              author={author}
              onPress={() => getByAuthor("author", author)}
            />
          ))}
        </ScrollView>
      </View>
    );
  }
}

const Author = ({ author, onPress }) => (
  <View style={styles.author}>
    <Avatar
      large
      rounded
      source={{ uri: baseUrl + "meditations/author_icons/" + author + ".jpg" }}
      onPress={onPress}
      activeOpacity={0.5}
    />
    <Text style={[TextStyles.ContentTextBold, { marginTop: 4 }]}>{author}</Text>
  </View>
);
