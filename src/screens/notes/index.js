import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList
} from "react-native";
import Header from "./../../components/Header";
import ThemeStyle from "../../styles/ThemeStyle";
import TextStyles from "../../common/TextStyles";
import { Query } from "react-apollo";
import { getLessonNotesQuery } from "../../queries/notes";
import { showMessage } from "react-native-flash-message";
import { errorMessage } from "../../utils";
import { withStore } from "../../utils/StoreUtils";
import Icon from "../../common/icons";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";

class NotesScreen extends Component<{}, {}> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderNotes(rowData) {
    return (
      <TouchableOpacity
        onPress={() => this.onItemPress(rowData.item)}
        style={{ elevation: 2, backgroundColor: "#fff", marginBottom: 2 }}
      >
        <View
          style={{
            padding: 16,
            marginBottom: 2
          }}
        >
          <Text style={TextStyles.SubHeaderBold}>{rowData.item.title}</Text>
          <Text style={TextStyles.GeneralText}>{rowData.item.description}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  onItemPress(data) {
    const { lessonID, lessonTitle } = this.props.navigation.state.params;
    this.props.navigation.navigate("SingleNoteScreen", {
      type: "edit",
      noteInfo: data,
      lessonID,
      lessonTitle
    });
  }

  componentDidMount() {
    recordScreenEvent(screenNames.notes, {
      lessonID: this.props.navigation.state.params.lessonID,
      lessonTitle: this.props.navigation.state.params.lessonTitle
    });
  }

  render() {
    const {
      navigation: { navigate }
    } = this.props;

    return (
      <View style={ThemeStyle.pageContainer}>
        {/* <View> */}
        <Header
          title={"Notes"}
          goBack={() => {
            this.props.navigation.goBack(null);
          }}
        />
        {/* <Header
          backButton
          onBackPress={() => this.props.navigation.goBack()}
          title="Notes"
        /> */}

        <Query
          query={getLessonNotesQuery}
          variables={{
            lessonId: this.props.navigation.state.params.lessonID
          }}
          onCompleted={() => this.props.setLoading(false)}
          onError={err => {
            console.log(err);
            this.props.setLoading(false);
            showMessage({
              message: "Something went wrong",
              type: "danger"
            });
          }}
          fetchPolicy={"network-only"}
        >
          {({ loading, data }) => {
            if (loading) {
              this.props.setLoading(true);
              return null;
            }
            console.log(data, this.props.navigation.state.params.lessonID);
            if (
              data.getLessonNotes &&
              data.getLessonNotes.notes != null &&
              data.getLessonNotes.notes.length > 0
            ) {
              return (
                <View style={{ flex: 1 }}>
                  <FlatList
                    data={data.getLessonNotes.notes}
                    renderItem={this.renderNotes.bind(this)}
                    keyExtractor={(item, index) => String(item.noteId)}
                  />
                </View>
              );
            } else {
              return (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text
                    style={{
                      color: "grey",
                      fontSize: 15,
                      fontFamily: TextStyles.GeneralText.fontFamily,
                      letterSpacing: 0.8
                    }}
                  >
                    Sorry !
                  </Text>
                  <Icon
                    name="note"
                    family="SimpleLineIcons"
                    size={108}
                    style={{margin: 24}}
                    color="#aaa"
                  />
                  <Text
                    style={{
                      color: "grey",
                      fontSize: 15,
                      fontFamily: TextStyles.GeneralText.fontFamily,
                      letterSpacing: 0.8
                    }}
                  >
                    No notes exist for this lesson.
                  </Text>
                </View>
              );
            }
          }}
        </Query>
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            height: 50,
            width: 50,
            elevation: 3,
            borderRadius: 25,
            backgroundColor: ThemeStyle.accentColor,
            alignItems: "center",
            justifyContent: "center"
          }}
          onPress={() => {
            const {
              lessonID,
              lessonTitle
            } = this.props.navigation.state.params;
            navigate("SingleNoteScreen", {
              type: "add",
              lessonID,
              lessonTitle
            });
          }}
        >
          <Icon name="file-plus" family="Feather" size={23} color="white" />
        </TouchableOpacity>
      </View>
    );
  }
}

export default withStore(NotesScreen);
