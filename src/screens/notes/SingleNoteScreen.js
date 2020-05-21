import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput
} from "react-native";
import Header from "./../../components/Header";
import ThemeStyle from "../../styles/ThemeStyle";
import TextStyles from "../../common/TextStyles";
import { Query, Mutation } from "react-apollo";
import {
  addLessonNoteQuery,
  editLessonNoteQuery,
  getLessonNotesQuery
} from "../../queries/notes";
import { showMessage } from "react-native-flash-message";
import { errorMessage } from "../../utils";
import { withStore } from "../../utils/StoreUtils";
import Icon from "../../common/icons";
import styles from "./styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

class SingleNoteScreen extends Component<{}, {}> {
  constructor(props) {
    super(props);
    this.state = {
      desc: "",
      title: ""
    };
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;
    if (params != undefined && params.noteInfo != undefined) {
      this.setState({
        title: params.noteInfo.title,
        desc: params.noteInfo.description
      });
    }
  }

  getNoteInput() {
    const {
      type,
      lessonID,
      lessonTitle,
      noteInfo
    } = this.props.navigation.state.params;

    var lessonNoteInput = {};
    var notesObj = {};
    notesObj.lessonId = lessonID;
    notesObj.lessonTitle = lessonTitle;
    notesObj.notes = {
      // noteId: "21212asdasdasdf",
      title: this.state.title,
      description: this.state.desc
    };
    if (type == "edit") {
      notesObj.notes["noteId"] = noteInfo.noteId;
      lessonNoteInput.lessonId = lessonID;
      lessonNoteInput.input = notesObj.notes;
    } else {
      lessonNoteInput.input = notesObj;
    }
    console.log(lessonNoteInput);
    return lessonNoteInput;
  }

  renderNoteView() {
    const { type } = this.props.navigation.state.params;
    var query = type == "edit" ? editLessonNoteQuery : addLessonNoteQuery;
    return (
      <View style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
        <Mutation
          mutation={query}
          onCompleted={() => {
            this.props.setLoading(false);
            this.props.navigation.goBack(null);
          }}
          onError={err => {
            console.log(err);
            this.props.setLoading(false);
            showMessage({
              type: "danger",
              message: "Something went wrong"
            });
          }}
          refetchQueries={[
            {
              query: getLessonNotesQuery,
              variables: {
                lessonId: this.props.navigation.state.params.lessonID
              }
            }
          ]}
        >
          {addOrEditLessonNote => (
            <KeyboardAwareScrollView style={{ padding: 20 }}>
              <Text style={styles.labelText}>Title</Text>
              <TextInput
                onChangeText={title => this.setState({ title })}
                value={this.state.title}
                style={styles.input}
                multiline={true}
                placeholder="Enter Title"
              />
              <Text style={styles.labelText}>Description</Text>
              <TextInput
                onChangeText={desc => this.setState({ desc })}
                value={this.state.desc}
                style={[
                  styles.input,
                  { minHeight: 120, textAlignVertical: "top" }
                ]}
                multiline={true}
                placeholder="Enter Description"
              />

              <TouchableOpacity
                disabled={!this.state.desc || !this.state.title}
                style={
                  !this.state.desc || !this.state.title
                    ? { ...styles.button, backgroundColor: "#ccc" }
                    : styles.button
                }
                onPress={() => {
                  this.props.setLoading(true);

                  addOrEditLessonNote({
                    variables: this.getNoteInput()
                  });
                }}
              >
                <Icon name="save" family="Feather" size={18} color={"#fff"} />
                <Text style={styles.buttonText}>
                  {type == "edit" ? "Update" : "Save"}
                </Text>
              </TouchableOpacity>
            </KeyboardAwareScrollView>
          )}
        </Mutation>
      </View>
    );
  }

  render() {
    const {
      navigation: { navigate }
    } = this.props;

    return (
      <View style={ThemeStyle.pageContainer}>
        <Header
          goBack={() => {
            this.props.navigation.goBack(null);
          }}
          title={
            this.props.navigation.state.params.type == "edit"
              ? "Edit Note"
              : "Add Note"
          }
        />
        {this.renderNoteView()}
      </View>
    );
  }
}

export default withStore(SingleNoteScreen);
