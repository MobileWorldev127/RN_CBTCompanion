import React, { Component } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import styles from "./styles";
import { SearchBar } from "react-native-elements";
import Header from "./../../components/Header";
import * as Animatable from "react-native-animatable";
import ThemeStyle from "../../styles/ThemeStyle";
import TextStyles from "../../common/TextStyles";
import { Query } from "react-apollo";
import { getModulesQuery } from "../../queries/getModules";
import { showMessage } from "react-native-flash-message";
import { getCloudIDFromImageName } from "../../utils/ImageUtils";
import { withSubscriptionActions } from "../../utils/StoreUtils";
import CachedImage from "react-native-image-cache-wrapper";
import { clearState } from "../../actions/RecordActions";
import Icon from "./../../common/icons";
import CLImage from "../../components/CLImage";
import HTML from "react-native-render-html";
import { addItemToFavorites } from "../favourites/FavoritesAction";
import { favouriteTypes } from "../../constants";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";
import { showApiError } from "../../utils";
import Card from "../../components/Card";

class LessonScreen extends Component {
  componentDidMount() {
    this.listener = this.props.navigation.addListener("didFocus", payload => {
      console.log("Focused entries");
      this.props.clearRecordFlow();
    });
    recordScreenEvent(screenNames.lessons);
  }

  componentWillUnmount() {
    this.listener.remove();
  }

  render() {
    let params = this.props.navigation.state.params;
    let isBack = params && params.isBack;
    let isChild = params && params.isChild;
    let parent = "-1";
    if (params && params.parent) {
      parent = params.parent;
    }
    let parentTitle = params && params.parentTitle;
    return (
      <View style={ThemeStyle.pageContainer}>
        {/* <View> */}
        <Header
          isDrawer={isBack ? false : true}
          openDrawer={() => {
            this.props.navigation.openDrawer();
          }}
          goBack={() => {
            this.props.navigation.goBack(null);
          }}
          title={parentTitle ? parentTitle : "Lessons"}
        />
        {/* <SearchBar
            lightTheme
            containerStyle={{ backgroundColor: "white", borderTopWidth: 0 }}
            icon={{ style: { fontSize: 18, marginTop: 4 } }}
            inputStyle={{
              backgroundColor: ThemeStyle.pageContainer.backgroundColor,
              height: 40,
              paddingLeft: 30
            }}
            placeholderTextColor="#aaa"
            onChangeText={() => {}}
            placeholder="Search"
          /> */}
        {/* </View> */}
        <Query
          query={getModulesQuery}
          variables={{
            parent: parent
          }}
          fetchPolicy="network-only"
          onCompleted={data => {
            this.props.setLoading(false);
          }}
          onError={err => {
            console.log(err);
            this.props.setLoading(false);
            showApiError(parent === "-1");
          }}
        >
          {({ loading, data }) => {
            if (loading) {
              this.props.setLoading(true);
              return null;
            }
            if (data) {
              console.log(data);
              let modules = data.getModules;
              return (
                <ScrollView
                  contentContainerStyle={[
                    {
                      paddingBottom: 64
                    },
                    parent !== "-1" && {
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      paddingHorizontal: 20
                    }
                  ]}
                >
                  {modules &&
                    modules.map(module =>
                      module.isLesson ? (
                        <SubChild
                          navigation={this.props.navigation}
                          title={module.title}
                          isLesson={module.isLesson}
                          id={module.id}
                          locked={module.locked}
                          isSubscribed={this.props.isSubscribed}
                          showSubscription={this.props.showSubscription}
                          image={module.image}
                          isModuleLesson
                        />
                      ) : (
                        <ModuleSection
                          id={module.id}
                          image={module.image}
                          title={module.title}
                          locked={module.locked}
                          description={module.transcript}
                          isLesson={module.isLesson}
                          subModules={module.children}
                          navigation={this.props.navigation}
                          isSubscribed={this.props.isSubscribed}
                          showSubscription={this.props.showSubscription}
                        />
                      )
                    )}
                </ScrollView>
              );
            } else {
              return null;
            }
          }}
        </Query>
      </View>
    );
  }
}

let titleDelay = 0;
let childDelay = 0;

const ModuleSection = ({
  id,
  image,
  title,
  description,
  locked,
  isLesson,
  subModules,
  navigation,
  isSubscribed,
  showSubscription
}) => (
  <View
    style={{
      backgroundColor: ThemeStyle.backgroundColor
    }}
  >
    <TouchableOpacity
      disabled={!isLesson}
      onPress={() => {
        if (isLesson) {
          if (locked !== false && !isSubscribed) {
            showSubscription();
          } else {
            navigation.navigate("LessonsContent", {
              lessonID: id,
              lessonTitle: title
            });
          }
        }
      }}
    >
      {isLesson && (
        <CLImage
          cloudId={getCloudIDFromImageName(image)}
          style={{ width: "40%", height: 150 }}
        />
      )}

      <Animatable.View
        animation="fadeInRight"
        style={{
          marginHorizontal: 24,
          paddingTop: 24,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        {/* <HTML
            html={description}
            baseFontStyle={{ fontSize: 16 }}
            containerStyle={{ height: 96, flex: 9, paddingRight: 16 }}
          /> */}
        <Text
          animation="fadeInRight"
          style={[TextStyles.SubHeader2, { flex: 9, paddingRight: 16 }]}
        >
          {title}
        </Text>
        {isLesson ? (
          locked === false || isSubscribed ? (
            <View
              style={{
                flexDirection: "column",
                flex: 1,
                justifyContent: "space-between",
                alignSelf: "stretch"
              }}
            >
              <Icon
                style={{ flex: 1 }}
                family="Ionicons"
                name="ios-arrow-dropright"
                size={28}
                color={ThemeStyle.accentColor}
              />
              <TouchableOpacity
                style={{
                  marginRight: 8
                }}
                onPress={() => {
                  addItemToFavorites(favouriteTypes.LESSON, title, id, () => {
                    showMessage({
                      type: "success",
                      message: "Added to Favorites"
                    });
                  });
                }}
              >
                <Icon
                  name="md-heart-outline"
                  size={28}
                  color={"red"}
                  family="Ionicons"
                />
              </TouchableOpacity>
            </View>
          ) : (
            <Image
              source={require("../../src/ios_lock.png")}
              style={{
                width: 28,
                height: 28,
                tintColor: '#ffc107',
                backgroundColor: 'transparent'
              }}
              resizeMode="contain"
            />
          )
        ) : null}
      </Animatable.View>
    </TouchableOpacity>
    <ScrollView horizontal contentContainerStyle={{ paddingHorizontal: 24 }}>
      {subModules &&
        subModules.map(subModule => (
          <SubChild
            navigation={navigation}
            title={subModule.title}
            isLesson={subModule.isLesson}
            id={subModule.id}
            locked={subModule.locked}
            isSubscribed={isSubscribed}
            showSubscription={showSubscription}
            image={subModule.image}
          />
        ))}
    </ScrollView>
  </View>
);

const SubChild = ({
  image,
  title,
  navigation,
  isLesson,
  id,
  locked,
  isSubscribed,
  showSubscription,
  isModuleLesson
}) => {
  console.log("LESSON IMAGE", image);
  return (
    <TouchableOpacity
      style={[
        styles.childContainer,
        isModuleLesson && {
          marginVertical: 12,
          marginRight: 0
        }
      ]}
      onPress={() => {
        if (locked === false || isSubscribed) {
          if (isLesson) {
            navigation.navigate("LessonsContent", {
              lessonID: id,
              lessonTitle: title
            });
          } else {
            console.log("PUSHING LESSONS SCREEN WITH PARENT " + title);
            navigation.push("LessonsModule", {
              parent: id,
              isBack: true,
              isChild: true,
              parentTitle: title
            });
          }
        } else {
          showSubscription();
        }
      }}
    >
      <Card>
        <CLImage
          cloudId={getCloudIDFromImageName(image)}
          style={styles.childImage}
        >
          {locked !== false && !isSubscribed ? (
            <View
              style={{
                backgroundColor: "transparent",
                position: "absolute",
                bottom: 8,
                right: 8
              }}
            >
              <Image
                source={require("../../src/ios_lock.png")}
                style={{
                  width: 28,
                  height: 28,
                  tintColor: '#ffc107'
                }}
                resizeMode="contain"
              />
            </View>
          ) : isLesson ? (
            <TouchableOpacity
              style={{
                backgroundColor: "#3333",
                position: "absolute",
                padding: 8,
                bottom: 0,
                right: 0
              }}
              onPress={() => {
                addItemToFavorites(favouriteTypes.LESSON, title, id, () => {
                  showMessage({
                    type: "success",
                    message: "Added to Favorites"
                  });
                });
              }}
            >
              <Image
                source={require("../../src/heart.png")}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: 'red'
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ) : null}
        </CLImage>
        <View style={styles.childTitle}>
          <Text
            style={[
              TextStyles.GeneralTextBold,
              {
                textAlign: "center",
                color: isModuleLesson
                  ? ThemeStyle.mainColor
                  : TextStyles.GeneralTextBold.color
              }
            ]}
          >
            {isModuleLesson ? title : title}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default withSubscriptionActions(
  LessonScreen,
  () => {},
  dispatch => ({
    clearRecordFlow: () => dispatch(clearState())
  })
);
