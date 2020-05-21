import React, { Component } from "react";
import {
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Image
} from "react-native";
import styles from "./styles";
import Icon from "./../../common/icons";
import TextStyles from "../../common/TextStyles";
import moment from "moment";
import ThemeStyle from "../../styles/ThemeStyle";
import Card from "../../components/Card";

export default class HomeworkItem extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.id !== nextProps.id;
  }

  render() {
    let item = this.props.item;
    return (
      <TouchableOpacity>
        <Card
          style={styles.itemContainer}
          contentStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
        >
          <Text style={styles.itemTitle}>{item.title}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 4
            }}
          >
            {!!(item.assignedBy && item.assignedBy.name) && (
              <Text style={[TextStyles.ContentText]}>
                Assigned by:{" "}
                <Text
                  style={[
                    TextStyles.ContentTextBold,
                    { color: ThemeStyle.accentColor }
                  ]}
                >
                  {item.assignedBy.name}
                </Text>
              </Text>
            )}
            {!!item.dueDate && (
              <Text style={[TextStyles.ContentText]}>
                {`Due Date: `}
                <Text
                  style={[
                    TextStyles.ContentTextBold,
                    { color: ThemeStyle.mainColor }
                  ]}
                >
                  {` ${moment(item.dueDate).format("DD MMM YYYY")}`}
                </Text>
              </Text>
            )}
          </View>
          {!!item.items && item.items.length && (
            <View style={{ paddingTop: 12 }}>
              {/* <Text
                style={[
                  TextStyles.GeneralText,
                  { paddingTop: 12, color: ThemeStyle.mainColor }
                ]}
              >
                Please complete the following as a part of this homework
              </Text> */}
              {item.items.map(this.renderHomeworkItem)}
            </View>
          )}
        </Card>
      </TouchableOpacity>
    );
  }

  renderHomeworkItem = homeworkItem => {
    return (
      <TouchableOpacity
        style={{ paddingHorizontal: 12 }}
        onPress={() => this.props.onHomeworkItemPress(homeworkItem)}
      >
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            paddingVertical: 12
          }}
        >
          {this.renderHomeworkItemImage(homeworkItem.type)}
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={[TextStyles.GeneralText]}>{homeworkItem.title}</Text>
            <Text
              style={[
                TextStyles.ContentTextBold,
                { color: ThemeStyle.mainColor }
              ]}
            >
              {homeworkItem.type}
            </Text>
          </View>
          {homeworkItem.done ? this.renderCompleted() : this.renderIncomplete()}
        </View>
      </TouchableOpacity>
    );
  };

  renderHomeworkItemImage = type => {
    let backgroundColor = ThemeStyle.pageContainer.backgroundColor;
    switch (type) {
      case "Exercise":
        backgroundColor = ThemeStyle.exerciseColor;
        break;
      case "Meditation":
        backgroundColor = ThemeStyle.meditationColor;
        break;
      case "Lesson":
        backgroundColor = ThemeStyle.lessonColor;
        break;
      case "PracticeIdea":
        backgroundColor = ThemeStyle.practiceIdeasColor;
        break;
    }
    return (
      <View
        style={{
          height: 48,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 16
        }}
      >
        {type === "Exercise" && (
          <Image
            style={styles.homeworkItemImage}
            source={require("../../assets/images/redesign/exercise-graphic-bg.png")}
            resizeMode="contain"
          />
        )}
        {type === "Meditation" && (
          <Image
            style={styles.homeworkItemImage}
            source={require("../../assets/images/redesign/Meditations-graphic.png")}
            resizeMode="contain"
          />
        )}
        {type === "Lesson" && (
          <Image
            style={[styles.homeworkItemImage, {opacity: 0.4}]}
            source={require("../../assets/images/redesign/lessons-graphic.png")}
            resizeMode="contain"
          />
        )}
        {type === "PracticeIdea" && (
          <Image
            style={styles.homeworkItemImage}
            source={require("../../assets/images/redesign/Practice-ideas.png")}
            resizeMode="contain"
          />
        )}
      </View>
    );
  };

  renderCompleted = () => {
    return (
      <Icon
        family="Ionicons"
        name="ios-checkmark-circle-outline"
        size={28}
        color="#bbb"
        style={{ color: "#008000" }}
      />
    );
  };

  renderIncomplete = () => {
    return (
      <Icon
        family="MaterialIcons"
        name="chevron-right"
        size={28}
        color={ThemeStyle.disabledLight}
      />
    );
  };
}
