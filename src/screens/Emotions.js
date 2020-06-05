import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  AsyncStorage
} from "react-native";
import CustomButton from "./../components/Button";
import ThemeStyle from "../styles/ThemeStyle";
import Header from "./../components/Header";
import textStyles from "./../common/TextStyles";
import { Query } from "react-apollo";
import { getLookupValuesQuery } from "../queries/getLookupValues";
import { withStore } from "./../utils/StoreUtils";
import { setEmotions } from "../actions/RecordActions";
import ModalSlider from "../components/ModalSlider";
import { showMessage } from "react-native-flash-message";
import { recordScreenEvent, screenNames } from "../utils/AnalyticsUtils";
import { getScreens, asyncStorageConstants } from "../constants";
import { client } from "../App";
import { errorMessage, showApiError } from "../utils";
import { isOnline } from "../utils/NetworkUtils";
import * as Animatable from "react-native-animatable";
import Card from "../components/Card";

var _ = require("lodash");

const { width, height } = Dimensions.get("window");
class Emotions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: [],
      modalVisible: false,
      currentEmotion: {
        id: 6,
        name: "Grateful",
        color: "#68ee2e"
      }
    };
  }

  setEmotionAndOpenModal = emotion => {
    this.setState({
      modalVisible: true,
      currentEmotion: emotion
    });
  };

  closeModal = () => {
    this.setState({
      modalVisible: false
    });
  };

  sliderOneValuesChangeStart = () => {
    this.setState({
      sliderOneChanging: true
    });
  };

  componentDidMount() {
    recordScreenEvent(screenNames.emotions, {
      mood: this.props.navigation.state.params.mood.name
    });
    this.fetchEmotionList();
  }

  fetchEmotionList = () => {
    this.props.setLoading(true);
    client
      .watchQuery({
        query: getLookupValuesQuery,
        variables: {
          keyname: "Emotion List"
        },
        fetchPolicy: "cache-and-network"
      })
      .subscribe({
        next: res => {
          if (res.loading && !res.data) {
            return;
          }
          console.log("---EMOTION LIST---", res.data.getLookupValues.value);
          console.log("ELEMENT LIST", this.state.elements);
          this.props.setLoading(false);
          this.setState(
            {
              elements: _.cloneDeep(res.data.getLookupValues.value)
            },
            () => {
              if (this.props.isEdit) {
                this.selectEmotionsFromEntry();
              }
            }
          );
        },
        error: err => {
          console.log(err);
          this.props.setLoading(false);
          showApiError(true);
        }
      });
  };

  renderEmotionList = () => {
    let elementsList = [];
    this.state.elements.map(data => {
      elementsList.push(
        <TouchableOpacity
          key={data.id}
          style={{
            paddingHorizontal: 15,
            borderWidth: 1,
            marginHorizontal: 4,
            marginBottom: 12,
            borderRadius: 25,
            paddingVertical: 6,
            borderColor: data.color,
            backgroundColor: data.percentage ? data.color : "#fff"
          }}
          onPress={() => {
            this.setEmotionAndOpenModal(data);
          }}
        >
          <Text
            style={[
              textStyles.ContentText,
              {
                color: data.percentage ? "#fff" : data.color
              }
            ]}
          >
            {data.percentage
              ? data.name + ": " + data.percentage + "%"
              : data.name}
          </Text>
        </TouchableOpacity>
      );
    });
    return elementsList.length > 0 ? (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          paddingHorizontal: 16
        }}
      >
        {elementsList}
      </View>
    ) : null;
  };

  render() {
    let elementsList = [];
    return (
      <View style={ThemeStyle.pageContainer}>
        <Header
          title="Emotions"
          goBack={() => {
            this.props.navigation.goBack(null);
          }}
        />
        <ScrollView>
          <View
            style={{
              flex: 1,
              paddingTop: 10,
              paddingBottom: 60
            }}
          >
            <Animatable.View animation="fadeInDown">
              <Card
                style={{ marginHorizontal: 20 }}
                contentStyle={{
                  flexDirection: "row",
                  paddingHorizontal: 24,
                  paddingVertical: 24,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Image
                  source={this.props.navigation.state.params.mood.src}
                  style={{ width: 60, height: 60 }}
                />
                <Text
                  style={[textStyles.SubHeader2, { paddingHorizontal: 16 }]}
                >
                  You are feeling{" "}
                  <Text
                    style={{
                      color: this.props.navigation.state.params.mood.color
                    }}
                  >
                    {this.props.navigation.state.params.mood.name.toUpperCase()}
                  </Text>
                </Text>
              </Card>
            </Animatable.View>
            <Animatable.View animation="fadeInUp">
              <Card
                style={{ marginHorizontal: 20, marginVertical: 12 }}
                contentStyle={{ paddingVertical: 24 }}
              >
                <Text
                  style={[
                    textStyles.GeneralTextBold,
                    {
                      fontSize: 16,
                      color: ThemeStyle.mainColor,
                      paddingBottom: 16,
                      paddingHorizontal: 20
                    }
                  ]}
                >
                  Select emotion and intensity before the practice
                </Text>
                {this.state.elements.length > 0 && this.renderEmotionList()}
              </Card>
            </Animatable.View>
          </View>
        </ScrollView>
        <CustomButton
          style={{
            position: "absolute",
            bottom: 0,
            right: 24,
            marginBottom: 24,
            alignSelf: "flex-end"
          }}
          name={"Next"}
          onPress={async () => {
            let selectedEmotions = this.getSelectedEmotions();
            if (selectedEmotions.length != 0) {
              this.props.setEmotion(this.getSelectedEmotions());
              console.log("GET SCREENS", getScreens());
              if (getScreens().indexOf("medication") != -1) {
                this.props.navigation.navigate("JournalScreen");
              } else if (
                getScreens().indexOf("measures") != -1 &&
                !this.props.isEdit
              ) {
                const isWeeklyAdded = JSON.parse(
                  await AsyncStorage.getItem(
                    asyncStorageConstants.weeklyMeasures()
                  )
                );
                const isDailyAdded = JSON.parse(
                  await AsyncStorage.getItem(
                    asyncStorageConstants.dailyMeasures()
                  )
                );
                console.log(
                  `---ACT WEEKLY AND DAILY-- ${isDailyAdded} ${isWeeklyAdded}`
                );
                if (isWeeklyAdded && isDailyAdded) {
                  this.props.navigation.navigate("JournalScreen");
                } else {
                  this.props.navigation.navigate("ACTMeasuresScreen");
                }
              } else {
                this.props.navigation.navigate("JournalScreen");
              }
            } else {
              showMessage({
                type: "danger",
                message: "Please select an emotion first"
              });
            }
          }}
        />
        <ModalSlider
          closeModal={this.closeModal}
          currentEmotion={this.state.currentEmotion}
          visible={this.state.modalVisible}
        />
      </View>
    );
  }

  selectEmotionsFromEntry = () => {
    _.forEach(this.state.elements, value => {
      _.forEach(this.props.editEntry.emotions, data => {
        if (value.name === data.emotion.name) {
          value.percentage = data.intensity;
        }
      });
    });
    this.setState({
      elements: this.state.elements
    });
  };

  getSelectedEmotions = () => {
    let selectedEmotions = [];
    _.forEach(this.state.elements, value => {
      if (value.percentage) {
        selectedEmotions.push({
          emotion: {
            id: value.id,
            color: value.color,
            name: value.name
          },
          intensity: value.percentage
        });
      }
    });
    return selectedEmotions;
  };
}

export default withStore(
  Emotions,
  state => ({
    isEdit: state.record.isEdit,
    editEntry: state.record.editEntry
  }),
  dispatch => ({
    setEmotion: emotions => dispatch(setEmotions(emotions))
  })
);

const styles = StyleSheet.create({
  sliderValue: {
    fontSize: 14,
    textAlign: "center",
    color: "red"
  }
});
