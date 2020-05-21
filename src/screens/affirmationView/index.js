import React, { Component } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import styles from "./styles";
import * as data from "../../affirmations.json";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";

export default class AffirmationView extends Component {
  getRandom = items => {
    let index = parseInt(Math.random() * (items.length - 1));
    return items[index];
  };
  getContent = () => {
    let category = this.getRandom(Object.values(data));
    let obj = {
      color: category.colors,
      content: this.getRandom(Object.values(category.content))
    };
    return obj;
  };
  render() {
    const { visible, onClose } = this.props;
    const affirmation = this.getContent();
    this.props.visible &&
      recordScreenEvent(screenNames.affirmation, {
        affirmationText: affirmation.content.Text
      });
    return (
      <Modal visible={visible} onRequestClose={onClose} animationType="fade">
        <LinearGradient colors={affirmation.color} style={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1 }} style={[styles.wrapper]}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon
                name="ios-close"
                size={38}
                color="white"
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.mainText}>{affirmation.content.Text}</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </LinearGradient>
      </Modal>
    );
  }
}
