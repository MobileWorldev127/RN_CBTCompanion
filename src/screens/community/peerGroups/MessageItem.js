import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import ThemeStyle from "../../../styles/ThemeStyle";
import TextStyles from "../../../common/TextStyles";
import moment from "moment";
import { stringToColour } from "../../../utils";

export default class MessageItem extends React.Component {
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.chatMessage.id !== this.props.chatMessage.id ||
      nextProps.chatMessage.message !== this.props.chatMessage.message
    );
  }

  render() {
    const { chatMessage, userId, nickname, messageExtractor } = this.props;
    const isSentMessage = userId === chatMessage.senderId;
    return (
      <View
        style={
          isSentMessage
            ? styles.sentMessageContainer
            : styles.receivedMessageContainer
        }
      >
        {!isSentMessage && (
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 24,
              marginRight: 8,
              backgroundColor: stringToColour(chatMessage.senderName) + "33",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={[TextStyles.SubHeader2]}>
              {nickname ? nickname[0] : chatMessage.senderName[0]}
            </Text>
          </View>
        )}
        <View
          style={[
            isSentMessage ? styles.sentMessage : styles.receivedMessage,
            {
              backgroundColor: isSentMessage
                ? "#fff"
                : stringToColour(chatMessage.senderName) + "33"
            }
          ]}
        >
          {!isSentMessage && (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={[
                  TextStyles.ContentText,
                  { fontWeight: "bold", minWidth: 100 }
                ]}
              >
                {nickname ? nickname : chatMessage.senderName}
              </Text>
              {/* <Text style={TextStyles.FooterText}>
                  {moment(chatMessage.createdAt).format("DD MMM, hh:mm A")}
              </Text> */}
            </View>
          )}
          <Text style={TextStyles.ContentText}>
            {messageExtractor
              ? messageExtractor(chatMessage)
              : chatMessage.message}
          </Text>
          <Text
            style={[
              TextStyles.FooterText,
              { marginTop: 2, position: "absolute", top: -18, right: 6 }
            ]}
          >
            {moment(chatMessage.createdAt).format("DD MMM, hh:mm A")}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  receivedMessageContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 32,
    marginHorizontal: 12
  },
  sentMessageContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 32,
    marginHorizontal: 12
  },
  receivedMessage: {
    backgroundColor: ThemeStyle.accentColorTransparent,
    borderRadius: 8,
    minHeight: 32,
    minWidth: 130,
    maxWidth: "80%",
    padding: 12
  },
  sentMessage: {
    backgroundColor: "#fff",
    borderRadius: 8,
    minHeight: 32,
    minWidth: 130,
    maxWidth: "80%",
    padding: 12
  }
});
