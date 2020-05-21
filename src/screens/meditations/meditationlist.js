import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image
} from "react-native";
import { meditationStyles as styles } from "./styles";
import { Avatar, Divider } from "react-native-elements";
import { CONTENT_PATH as baseUrl } from "../../constants";
import Loader from "../../components/Loader";
// import { Image } from '../../components';
import MeditationPlay from "./meditationPlay";
import TextStyles from "../../common/TextStyles";
import CachedImage from "react-native-image-cache-wrapper";
import * as Animatable from "react-native-animatable";
export default class MeditationList extends Component {
  state = {
    meditationPlayVisible: false,
    current: null
  };
  hideMeditationPlay = () =>
    this.setState({ meditationPlayVisible: false, current: null });
  render() {
    const { meditations } = this.props;
    const { meditationPlayVisible, current } = this.state;
    if (meditations.loading) {
      return <Loader />;
      // return null;
    }
    return (
      <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
        {meditations.data.map((item, index) => (
          <SingleMeditationItem
            key={item._id}
            author={item.author}
            image={item.imagePath}
            title={item.title}
            onPress={() =>
              this.setState({ current: item, meditationPlayVisible: true })
            }
            index={index}
          />
        ))}
        <Modal
          visible={meditationPlayVisible}
          animationType="fade"
          onRequestClose={this.hideMeditationPlay}
        >
          {meditationPlayVisible && (
            <MeditationPlay onClose={this.hideMeditationPlay} item={current} />
          )}
        </Modal>
      </ScrollView>
    );
  }
}

const SingleMeditationItem = props => (
  <Animatable.View animation="fadeInUp" delay={props.index * 200}>
    <TouchableOpacity style={styles.list} onPress={props.onPress}>
      <CachedImage
        source={{
          uri: baseUrl + "meditations/meditation_icons/" + props.image
        }}
        style={{ width: 50, height: 50, marginRight: 20, borderRadius: 25 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={[TextStyles.SubHeader2, styles.listTitle]}>
          {props.title}
        </Text>
        <Text style={[TextStyles.GeneralText, styles.author]}>
          {props.author}
        </Text>
      </View>
    </TouchableOpacity>
  </Animatable.View>
);
