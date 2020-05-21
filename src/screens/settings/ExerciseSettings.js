import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar
} from "react-native";
import ThemeStyle from "../../styles/ThemeStyle";
import { Transition } from "react-navigation-fluid-transitions";
import Header from "./../../components/Header";
import CustomButton from "./../../components/Button";
import DraggableFlatList from "react-native-draggable-flatlist";
import textStyle from "./../../common/TextStyles";
import TextStyles from "./../../common/TextStyles";
import Icon from "../../common/icons";
import { withStore } from "../../utils/StoreUtils";
import { client as appSyncClient } from "./../../App";
import { getImagePath } from "../../utils/ImageUtils";
import CachedImage from "react-native-image-cache-wrapper";
import { setPreferenceQuery } from "../../queries/setPreference";
import { showMessage } from "react-native-flash-message";
import { getUserExercisesQuery } from "../../queries/getUserExercises";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";
let _ = require("lodash");
class ExerciseSettings extends Component {
  constructor(props) {
    super(props);
    this.transition = false;
    this.state = {
      newListArray: [],
      hiddenActivities: [],
      nextpageLoaded: false
    };
  }

  componentDidMount() {
    recordScreenEvent(screenNames.exerciseSettings);
    this.props.setLoading(true);
    appSyncClient
      .query({
        query: getUserExercisesQuery,
        fetchPolicy: "network-only"
      })
      .then(data => {
        console.log(data);
        this.setState({
          newListArray: _.cloneDeep(data.data.getUserExercises)
        });
        this.props.setLoading(false);
      });
  }

  renderItemList(rowData) {
    this.transition = !this.transition;
    // if (rowData.item.isSeparator) {
    //   return (
    //     <View
    //       style={{
    //         padding: 8,
    //         marginBottom: 8,
    //         paddingHorizontal: 12
    //       }}
    //     >
    //       <Text style={[TextStyles.GeneralText]}>{rowData.item.name}</Text>
    //     </View>
    //   );
    // }
    return (
      <Transition appear={this.transition ? "left" : "right"}>
        <TouchableOpacity
          onLongPress={rowData.item.shouldNotDrag ? () => {} : rowData.move}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              // borderBottomWidth : 2,
              // borderTopWidth : 2,
              //   paddingHorizontal: 24,
              //   paddingVertical: 12,
              marginHorizontal: 12,
              marginBottom: 8,
              backgroundColor: "#fff"
            }}
          >
            <CachedImage
              source={{
                uri: getImagePath(
                  rowData.item.exercise.title,
                  rowData.item.exercise.image
                )
              }}
              style={{
                // position: "absolute",
                width: 48,
                height: 48,
                borderRadius: 4
                // marginLeft : 24,
                // marginVertical : 12
              }}
              resizeMode="cover"
            />

            <Text
              style={[
                textStyle.GeneralText,
                {
                  fontSize: 17,
                  color: rowData.item.display === "visible" ? "#000" : "#aaa",
                  marginLeft: 16,
                  flex: 1
                }
              ]}
            >
              {rowData.item.exercise.title}
            </Text>
            <TouchableOpacity
              style={{
                // flex: 1,
                // flexDirection: "row",
                // justifyContent: "flex-end",
                marginHorizontal: 16
              }}
              onPress={() => {
                rowData.item.display =
                  rowData.item.display === "visible" ? "hidden" : "visible";
                this.setState({
                  shouldRefresh: !this.state.shouldRefresh
                });
              }}
            >
              <Icon
                family={"Ionicons"}
                size={32}
                color={
                  rowData.item.display === "hidden"
                    ? "#ccc"
                    : ThemeStyle.accentColor
                }
                name={
                  rowData.item.display === "hidden" ? "ios-eye-off" : "ios-eye"
                }
              />
            </TouchableOpacity>
            <View
              style={{
                position: "absolute",
                width: 48,
                height: 48,
                borderRadius: 4,
                backgroundColor: rowData.item.exercise.color + "88"
              }}
            />
          </View>
        </TouchableOpacity>
      </Transition>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          translucent={false}
          backgroundColor={"rgb(132, 193, 224)"}
          barStyle={"light-content"}
          hidden={false}
        />
        <Header
          title="Exercise Settings"
          goBack={() => {
            this.props.navigation.goBack(null);
          }}
        />
        <View style={ThemeStyle.pageContainer}>
          <Text
            style={[
              TextStyles.GeneralText,
              { paddingHorizontal: 12, paddingVertical: 12 }
            ]}
          >
            Long-press an item and drag to re-order
          </Text>
          <DraggableFlatList
            contentContainerStyle={{
              justifyContent: "center",
              paddingBottom: 80
            }}
            data={this.state.newListArray}
            renderItem={this.renderItemList.bind(this)}
            keyExtractor={(item, index) => item.id}
            onMoveEnd={({ data }) => {
              // if (data[1].isSeparator) {
              //   data[0].shouldNotDrag = true;
              // } else {
              //   data.forEach(element => {
              //     element.shouldNotDrag = false;
              //   });
              // }
              this.setState({ newListArray: data });
            }}
            extraData={this.state.shouldRefresh}
          />
          <View
            style={{
              position: "absolute",
              bottom: 0,
              alignItems: "flex-end",
              padding: 24,
              width: "100%",
              backgroundColor: "#fff0"
            }}
          >
            <CustomButton
              style={{
                alignSelf: "flex-end"
              }}
              name={"Done"}
              onPress={() => {
                this.props.setLoading(true);
                appSyncClient
                  .mutate({
                    mutation: setPreferenceQuery,
                    variables: {
                      type: "exerciseSequence",
                      data: this.getExerciseSequence()
                    }
                  })
                  .then(
                    data => {
                      console.log(data);
                      this.props.setLoading(false);
                      this.props.navigation.goBack(null);
                    },
                    onReject => {
                      console.log(onReject);
                      this.props.setLoading(false);
                      showMessage({
                        type: "danger",
                        message: "Something went wrong"
                      });
                    }
                  )
                  .catch(err => {
                    console.log(err);
                  });
              }}
            />
          </View>
        </View>
      </View>
    );
  }

  getExerciseSequence = () => {
    let sequence = [];
    this.state.newListArray.forEach(exercise => {
      sequence.push({
        id: exercise.exercise.id,
        display: exercise.display
      });
    });
    console.log(sequence);
    return sequence;
  };
}

export default withStore(ExerciseSettings);

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 15,
    borderRadius: 40,
    marginHorizontal: 30,
    marginVertical: 8
  },
  imageContainer: {
    alignItems: "center",
    padding: 10
  },
  imageStyle: {
    width: 80,
    height: 80,
    resizeMode: "contain"
  },
  textStyle: {
    fontSize: 16,
    color: "#808080",
    paddingVertical: 5
  }
});
