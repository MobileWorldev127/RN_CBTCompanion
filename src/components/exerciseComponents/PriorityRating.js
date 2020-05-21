import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity
} from "react-native";
import ThemeStyle from "../../styles/ThemeStyle";
import { Transition } from "react-navigation-fluid-transitions";
import textStyles from "../../common/TextStyles";
import TextStyles from "../../common/TextStyles";
import DraggableFlatList from "react-native-draggable-flatlist";
import ComponentImage from "./Image";
import Title from "./Title";
const { width, height } = Dimensions.get("window");

export default class PriorityRating extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      list: this.props.options
    };
  }

  renderItem = ({ item, index, move }) => {
    console.log(item);
    return (
      <TouchableOpacity onLongPress={move}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 24,
            paddingVertical: 12,
            marginBottom: 12,
            borderRadius: 4,
            borderColor: "#ccc",
            borderWidth: 1,
            backgroundColor: "#fff"
          }}
        >
          <Text style={TextStyles.GeneralText}>{index + 1 + "."}</Text>
          <Text style={[TextStyles.GeneralText, { marginLeft: 16, flex: 1 }]}>
            {item.value}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    console.log(this.state.list);
    return (
      <View>
        {this.props.image && <ComponentImage image={this.props.image} />}
        <Transition appear="bottom">
          <View style={styles.mainContainer}>
            <Title
              showInstructions={this.props.showInstructions}
              title={this.props.question}
            />
            <Text
              style={[
                textStyles.GeneralText,
                {
                  fontFamily: TextStyles.SubHeaderBold.fontFamily,
                  paddingVertical: 16
                }
              ]}
            >
              {"Arrange in order of priority: "}
            </Text>
            <DraggableFlatList
              contentContainerStyle={{
                paddingBottom: 80
              }}
              data={this.state.list}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => item.name + ""}
              onMoveEnd={({ data }) => {
                let values = [];
                data.forEach((item, index) => {
                  values.push({
                    key: {
                      name: item.name,
                      color: item.color
                    },
                    value: index
                  });
                });
                this.props.onValueChange({ keyValues: values });
                console.log(data);
                this.setState({
                  list: data,
                  shouldRefresh: !this.state.shouldRefresh
                });
              }}
            />
          </View>
        </Transition>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
    marginTop: 8
  },
  innerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 12,
    backgroundColor: "#fff",
    marginVertical: 15
  }
});
