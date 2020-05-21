import React, { Component } from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { card as styles } from "./styles";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import ThemeStyle from "../../../styles/ThemeStyle";

export default class CardReminder extends Component {
  render() {
    const { time, days, deleteReminder, title, editReminder } = this.props;
    let newTime = moment(new Date(time)).format("hh:mm A");
    let amPm = newTime.split(" ")[1];
    newTime = newTime.split(" ")[0];
    const daily = days.length === 7;
    return (
      <View style={styles.card}>
        <ImageBackground
          style={styles.cardBg}
          source={{
            uri:
              "data:image/jpeg;base64,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"
          }}
        >
          <View
            style={[
              styles.overlay,
              {
                backgroundColor: daily
                  ? ThemeStyle.mainColor
                  : ThemeStyle.accentColor
              }
            ]}
          />
          <TouchableOpacity
            style={[styles.deleteButton, { right: 50 }]}
            onPress={editReminder}
          >
            <Icon name="ios-create" size={25} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={deleteReminder}
          >
            <Icon name="ios-trash" size={25} color="white" />
          </TouchableOpacity>
          <View style={styles.content}>
            <Text style={styles.title}>{title || "Daily Reminder"}</Text>
            <Text style={styles.time}>
              {newTime} {amPm}
            </Text>
            <View style={styles.dayContainer}>
              {days.map(day => (
                <View style={styles.day} key={day}>
                  <Text style={styles.dayText}>{day}</Text>
                </View>
              ))}
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
