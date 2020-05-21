import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  SafeAreaView,
  ActivityIndicator
} from "react-native";
import Header from "../../components/Header";
import ThemeStyle from "../../styles/ThemeStyle";

import TextStyles from "../../common/TextStyles";
import { Query } from "react-apollo";
import { getPracticeIdeasByLessonQuery } from "../../queries/practiceIdeas";
import Icon from "../../common/icons";
import { withStore } from "../../utils/StoreUtils";
import { showMessage } from "react-native-flash-message";
import { addItemToFavorites } from "../favourites/FavoritesAction";
import { favouriteTypes } from "../../constants";
import PracticeIdeaScreen from "./PracticeIdeaScreen";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";

let animationDelay = 0;

class PracticeIdeaListScreen extends Component<{}, {}> {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      practiceIdea: { title: "", id: "" },
      practiveIdeaInfo: {},
      practiceIdeaSelected: [],
      practiveIdeaDone: false
    };
  }

  goBack = () => this.props.navigation.goBack();

  renderItemList(rowData) {
    return (
      <TouchableOpacity
        onPress={() => this.onIdeaItemPress(rowData.item)}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 24,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 1,
          backgroundColor: "#fff"
        }}
      >
        <Text style={[TextStyles.SubHeaderBold, { flex: 7 }]}>
          {rowData.item.title}
        </Text>
        <TouchableOpacity
          style={{ flex: 0.8 }}
          onPress={() => {
            addItemToFavorites(
              favouriteTypes.PRACTICE_IDEA,
              rowData.item.title,
              rowData.item.id,
              () => {
                showMessage({
                  type: "success",
                  message: "Added to Favorites"
                });
              }
            );
          }}
        >
          <Icon
            name="md-heart-empty"
            size={24}
            style={{ marginRight: 8 }}
            color={"red"}
            family="Ionicons"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 0.8 }}
          onPress={() => this.onIdeaItemPress(rowData.item)}
        >
          <Icon name="chevron-right" size={25} color="grey" family="Feather" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
  onIdeaItemPress(item) {
    this.setState({ isModalVisible: true, practiceIdea: item });
  }

  resetDefaults = () => {
    this.setState({
      isModalVisible: false,
      practiceIdea: { title: "", id: "" },
      practiveIdeaInfo: {},
      practiceIdeaSelected: [],
      practiveIdeaDone: false
    });
  };

  componentDidMount() {
    recordScreenEvent(screenNames.practiceIdea, {
      lessonID: this.props.navigation.state.params.lessonID,
      lessonTitle: this.props.navigation.state.params.lessonTitle
    });
  }

  render() {
    console.log("state", this.state);
    const {
      navigation: { navigate }
    } = this.props;

    const headerTitleView = (
      <View>
        <Text
          style={{
            color: ThemeStyle.mainColor,
            flexWrap: "wrap",
            fontSize: 15,
            fontWeight: "bold"
          }}
        >
          Ideas for {this.props.navigation.state.params.lessonTitle}
        </Text>
      </View>
    );
    const headerModalTitleView = (
      <View>
        <Text
          style={{
            color: ThemeStyle.mainColor,
            flexWrap: "wrap",
            fontSize: 15,
            fontWeight: "bold"
          }}
        >
          {this.state.practiceIdea.title}
        </Text>
      </View>
    );

    return (
      <View style={ThemeStyle.pageContainer}>
        <Header
          goBack={() => this.props.navigation.goBack(null)}
          title={`Ideas for ${this.props.navigation.state.params.lessonTitle}`}
          // rightIcon={() => (
          //   <TouchableOpacity
          //     style={{ position: "relative", top: 1 }}
          //     onPress={() => {}}
          //   >
          //     <Icon
          //       name="history"
          //       size={25}
          //       color={ThemeStyle.accentColor}
          //       family="MaterialCommunityIcons"
          //     />
          //   </TouchableOpacity>
          // )}
        />

        <Query
          query={getPracticeIdeasByLessonQuery}
          fetchPolicy="cache-and-network"
          variables={{ lessonId: this.props.navigation.state.params.lessonID }}
          onCompleted={() => {
            console.log("Completed");
          }}
        >
          {({ loading, error, data }) => {
            console.log("fetchedentry", data);
            console.log(loading);
            console.log("ers", error);
            if (loading) {
              return <LoadingView />;
            }
            if (error) {
              return null;
            }
            if (data && data.getPracticeIdeasByLesson.length > 0) {
              return (
                <FlatList
                  data={data.getPracticeIdeasByLesson}
                  renderItem={this.renderItemList.bind(this)}
                  keyExtractor={(item, index) => String(item.name)}
                />
              );
            }
            return (
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text
                    style={{
                      color: "#d0cFd5",
                      fontSize: 16,
                      paddingHorizontal: 24,
                      textAlign: "center"
                    }}
                  >
                    Sorry no Preactice ideas found for{" "}
                    {this.props.navigation.state.params.lessonTitle}.
                  </Text>
                </View>
              </View>
            );
          }}
        </Query>

        {/* Expanded view of idea */}
        <Modal
          animationType="fade"
          transparent={false}
          visible={this.state.isModalVisible}
          onRequestClose={() => {
            this.resetDefaults();
          }}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <PracticeIdeaScreen
              onClose={() => {
                this.setState({
                  isModalVisible: !this.state.isModalVisible
                });
              }}
              practiceIdea={{
                id: this.state.practiceIdea.id,
                title: this.state.practiceIdea.title
              }}
              resetDefaults={this.resetDefaults}
              setLoading={this.props.setLoading}
            />
          </SafeAreaView>
        </Modal>
        {/* Expanded view of idea */}
      </View>
    );
  }
}

const LoadingView = () => (
  <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <ActivityIndicator
      animating={true}
      size="large"
      color={ThemeStyle.mainColor}
    />
  </View>
);

export default withStore(PracticeIdeaListScreen);
