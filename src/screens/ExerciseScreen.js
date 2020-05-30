//@flow
import React, { Component } from "react";
import {
  Text,
  View,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Image
} from "react-native";
import textStyles from "./../common/TextStyles";
import ThemeStyle from "../styles/ThemeStyle";
import Header from "./../components/Header";
import CustomButton from "./../components/Button";
import {
  DiscreteRating,
  Rating,
  TextType,
  MutiSelect,
  MultiSelectWithRating,
  SingleSelect
} from "./../components/exerciseComponents";
import { withStore } from "../utils/StoreUtils";
import Display from "../components/exerciseComponents/Display";
import _ from "lodash";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { showMessage } from "react-native-flash-message";
import { errorMessage } from "../utils";
import { exerciseTypes, APP, followUpTypes } from "../constants";
import SingleSelectWithRating from "../components/exerciseComponents/SingleSelectWithRating";
import CheckList from "../components/exerciseComponents/CheckList";
import PriorityRating from "../components/exerciseComponents/PriorityRating";
import InstructionModal from "../components/exerciseComponents/InstructionModal";
import Icon from "../common/icons";
import Lookup from "../components/exerciseComponents/Lookup";
import { recordScreenEvent, screenNames } from "../utils/AnalyticsUtils";
import { getImagePath } from "../utils/ImageUtils";
import Audio from "../components/exerciseComponents/Audio";
import MultiSelectWithDesc from "../components/exerciseComponents/MultiSelectWithDesc";
import Card from "../components/Card";

const { width, height } = Dimensions.get("window");

class ExerciseScreen extends Component {
  constructor(props) {
    super(props);
    this.params = props.navigation.state.params;
    this.currentDataIndex = this.params.currentIndex;
    this.exerciseData = props.currentExercise;
    this.data = this.exerciseData.details[this.currentDataIndex];
    this.isLookup = false;
    this.isFollowUp = props.isFollowUp;
    this.currentDataIndex + 1 < this.exerciseData.details.length
      ? (this.detailsSplit = this.exerciseData.details.slice(
          this.currentDataIndex + 1,
          this.exerciseData.details.length
        ))
      : (this.detailsSplit = []);
    this.title = this.exerciseData.title;
    this.typeSelector = {
      [exerciseTypes.MULTI_SELECT_WITH_RATING]: this
        .renderMultiSelectWithRating,
      [exerciseTypes.MULTI_SELECT_WITH_OPTIONS]: this.renderMultiSelect,
      [exerciseTypes.RATING]: this.renderRating,
      [exerciseTypes.TEXT]: this.renderTextType,
      [exerciseTypes.MULTI_SELECT]: this.renderMultiSelect,
      [exerciseTypes.RATING_DISCRETE]: this.renderRatingDiscrete,
      [exerciseTypes.SINGLE_SELECT]: this.renderSingleSelect,
      [exerciseTypes.SINGLE_SELECT_WITH_FLOW]: this.renderSingleSelect,
      [exerciseTypes.DISPLAY]: this.renderDisplayType,
      [exerciseTypes.GROUP]: this.renderGroup,
      [exerciseTypes.SINGLE_SELECT_WITH_RATING]: this
        .renderSingleSelectWithRating,
      [exerciseTypes.CHALLENGE]: this.renderTextType,
      [exerciseTypes.TEXT_VIEW]: this.renderDisplayType,
      [exerciseTypes.CHECKLIST]: this.renderCheckList,
      [exerciseTypes.PRIORITY_RATING]: this.renderPriorityRating,
      [exerciseTypes.GROUPED_ITEMS]: this.renderGroupedItems,
      [exerciseTypes.LOOKUP]: this.renderLookup,
      [exerciseTypes.AUDIO]: this.renderAudio,
      [exerciseTypes.FOLLOW]: this.renderGroup,
      [exerciseTypes.MULTI_SELECT_WITH_DESC]: this.renderMultiSelectWithDesc
    };
    this.state = {
      lookupScore: 0,
      showInstructions: false,
      instructions: ""
    };
  }

  renderGroup = element => {
    let data = element ? element : this.data;
    return (
      <View>
        <Text
          style={[
            textStyles.Header2,
            {
              padding: 22
            }
          ]}
        >
          {data.title}
        </Text>
        {data.details.map(element => this.renderItem(element))}
      </View>
    );
  };

  renderGroupedItems = element => {
    let data = element ? element : this.data;
    return (
      <React.Fragment>
        <Text
          style={[
            textStyles.Header2,
            {
              padding: 16
            }
          ]}
        >
          {data.title}
        </Text>
        {data.details.map(element => this.renderItem(element, true))}
      </React.Fragment>
    );
  };

  renderItem = (element, isPadded) => {
    let data = element ? element : this.data;
    // console.log(data.type);
    return (
      <Card
        cardRadius={6}
        style={{
          marginBottom: isPadded ? -12 : 18,
          marginHorizontal: isPadded ? 0 : 16,
          shadowRadius: 4,
          shadowOffset: { height: 2 },
          shadowOpacity: isPadded ? 0 : 0.9,
          elevation: isPadded ? 0 : 2
        }}
      >
        {this.typeSelector[data.type](data)}
      </Card>
    );
  };

  renderTextType = element => {
    let data = element ? element : this.data;
    return (
      <TextType
        question={data.question}
        placeholder={data.placeholder}
        image={getImagePath(data.image, this.exerciseData.title)}
        color={this.exerciseData.color}
        onValueChange={value => (data.value = value)}
        isChallengeType={data.type === exerciseTypes.CHALLENGE}
        showInstructions={
          data.instructions
            ? () => {
                this.setState({
                  showInstructions: true,
                  instructions: data.instructions
                });
              }
            : undefined
        }
        value={data.value ? data.value.stringValues[0] : undefined}
      />
    );
  };

  renderDisplayType = element => {
    let data = element ? element : this.data;
    return (
      <Display
        image={getImagePath(data.image, this.exerciseData.title)}
        title={data.title}
        question={data.question}
        isTextView={data.type === exerciseTypes.TEXT_VIEW}
        showInstructions={
          data.instructions
            ? () => {
                this.setState({
                  showInstructions: true,
                  instructions: data.instructions
                });
              }
            : undefined
        }
      />
    );
  };

  renderPriorityRating = element => {
    let data = element ? element : this.data;
    return (
      <PriorityRating
        image={getImagePath(data.image, this.exerciseData.title)}
        options={_.cloneDeep(data.options)}
        question={data.question}
        onValueChange={value => (data.value = value)}
        showInstructions={
          data.instructions
            ? () => {
                this.setState({
                  showInstructions: true,
                  instructions: data.instructions
                });
              }
            : undefined
        }
      />
    );
  };

  renderRatingDiscrete = element => {
    let data = element ? element : this.data;
    return (
      <DiscreteRating
        image={getImagePath(data.image, this.exerciseData.title)}
        question={data.question}
        maxValue={data.scale.max}
        minValue={data.scale.min}
        step={data.scale.step}
        start={data.scale.start ? Math.floor(data.scale.start) : 0}
        options={data.options}
        onValueChange={value => (data.value = value)}
        showInstructions={
          data.instructions
            ? () => {
                this.setState({
                  showInstructions: true,
                  instructions: data.instructions
                });
              }
            : undefined
        }
      />
    );
  };

  renderMultiSelectWithRating = element => {
    let data = element ? element : this.data;
    return (
      <MultiSelectWithRating
        image={getImagePath(data.image, this.exerciseData.title)}
        source={data.source}
        question={data.question}
        maxValue={data.scale.max}
        minValue={data.scale.min}
        step={data.scale.step}
        options={data.options}
        placeholder={data.placeholder}
        onValueChange={value => (data.value = value)}
        setLoading={this.props.setLoading}
        showInstructions={
          data.instructions
            ? () => {
                this.setState({
                  showInstructions: true,
                  instructions: data.instructions
                });
              }
            : undefined
        }
      />
    );
  };

  renderSingleSelectWithRating = element => {
    let data = element ? element : this.data;
    return (
      <SingleSelectWithRating
        image={getImagePath(data.image, this.exerciseData.title)}
        source={data.source}
        question={data.question}
        maxValue={data.scale.max}
        minValue={data.scale.min}
        step={data.scale.step}
        options={data.options}
        placeholder={data.placeholder}
        onValueChange={value => (data.value = value)}
        setLoading={this.props.setLoading}
        showInstructions={
          data.instructions
            ? () => {
                this.setState({
                  showInstructions: true,
                  instructions: data.instructions
                });
              }
            : undefined
        }
      />
    );
  };

  renderMultiSelect = element => {
    let data = element ? element : this.data;
    return (
      <MutiSelect
        image={getImagePath(data.image, this.exerciseData.title)}
        source={data.source}
        question={data.question}
        options={data.options}
        onValueChange={value => (data.value = value)}
        setLoading={this.props.setLoading}
        showInstructions={
          data.instructions
            ? () => {
                this.setState({
                  showInstructions: true,
                  instructions: data.instructions
                });
              }
            : undefined
        }
      />
    );
  };

  renderMultiSelectWithDesc = element => {
    let data = element ? element : this.data;
    return (
      <MultiSelectWithDesc
        image={getImagePath(data.image, this.exerciseData.title)}
        source={data.source}
        question={data.question}
        options={data.options}
        onValueChange={value => (data.value = value)}
        setLoading={this.props.setLoading}
        showInstructions={
          data.instructions
            ? () => {
                this.setState({
                  showInstructions: true,
                  instructions: data.instructions
                });
              }
            : undefined
        }
      />
    );
  };

  renderSingleSelect = element => {
    let data = element ? element : this.data;
    return (
      <SingleSelect
        image={getImagePath(data.image, this.exerciseData.title)}
        source={data.source}
        options={data.options}
        question={data.question}
        onValueChange={value => {
          // console.log("SELECTED VALUE", value);
          console.log("IS LOOKUP", this.isLookup);
          if (
            this.isLookup &&
            (!data.value ||
              data.value.keyValues[0].key.name !== value.keyValues[0].key.name)
          ) {
            if (value.keyValues[0].key.name === "Yes") {
              this.setState({
                lookupScore: this.state.lookupScore + 10
              });
            } else if (data.value) {
              this.setState({
                lookupScore: this.state.lookupScore - 10
              });
            }
            console.log("LOOKUP VALUE CHANGE", this.state.lookupScore);
          }
          data.value = value;
        }}
        setLoading={this.props.setLoading}
        showInstructions={
          data.instructions
            ? () => {
                this.setState({
                  showInstructions: true,
                  instructions: data.instructions
                });
              }
            : undefined
        }
      />
    );
  };

  renderLookup = element => {
    this.isLookup = true;
    let data = element;
    return (
      <Lookup
        image={getImagePath(data.image, this.exerciseData.title)}
        title={data.title}
        question={data.question}
        score={this.state.lookupScore}
        details={data.details}
        showInstructions={
          data.instructions
            ? () => {
                this.setState({
                  showInstructions: true,
                  instructions: data.instructions
                });
              }
            : undefined
        }
      />
    );
  };

  renderRating = element => {
    let data = element ? element : this.data;
    return (
      <Rating
        image={getImagePath(data.image, this.exerciseData.title)}
        question={data.question}
        maxValue={data.scale.max}
        minValue={data.scale.min}
        step={data.scale.step}
        start={
          data.scale.start
            ? Math.floor(data.scale.start)
            : Math.floor(data.scale.max / 2)
        }
        placeholder={data.placeholder}
        shouldShowPercentage={data.shouldShowPercentage}
        shouldShowMax={data.shouldShowMax}
        onValueChange={value => (data.value = value)}
        showInstructions={
          data.instructions
            ? () => {
                this.setState({
                  showInstructions: true,
                  instructions: data.instructions
                });
              }
            : undefined
        }
        // value={data.value ? data.value.intValues[0] : undefined}
      />
    );
  };

  renderCheckList = element => {
    let data = element ? element : this.data;
    return (
      <CheckList
        image={getImagePath(data.image, this.exerciseData.title)}
        question={data.question}
        details={_.cloneDeep(data.details)}
        onValueChange={value => (data.value = value)}
        showInstructions={
          data.instructions
            ? () => {
                this.setState({
                  showInstructions: true,
                  instructions: data.instructions
                });
              }
            : undefined
        }
      />
    );
  };

  renderAudio = element => {
    let data = element ? element : this.data;
    return (
      <Audio
        ref={ref => {
          this.audioPlayer = ref;
        }}
        image={data.image}
        placeholder={data.placeholder}
        title={data.title}
        filename={data.question}
        onValueChange={value => (data.value = value)}
        showInstructions={
          data.instructions
            ? () => {
                this.setState({
                  showInstructions: true,
                  instructions: data.instructions
                });
              }
            : undefined
        }
      />
    );
  };

  componentDidMount() {
    recordScreenEvent(screenNames.exercise, {
      exerciseID: this.exerciseData.id,
      exerciseTitle: this.exerciseData.title,
      currentDetailIndex: this.currentDataIndex + "",
      currentDataType: this.data.type
    });
  }

  render() {
    return (
      <View style={ThemeStyle.pageContainer}>
        <Header
          title={"this.title"}
          goBack={() => {
            this.props.navigation.goBack(null);
          }}
          onRightIconClick={() => {}}
          rightIcon={() => (
            <View
              style={{ position: "relative", top: 1, flexDirection: "row" }}
            >
              {this.exerciseData.lesson && this.exerciseData.lesson.length > 0 && (
                <TouchableOpacity
                  style={{ marginRight: 8, marginTop: 3 }}
                  onPress={() => {
                    console.log('lessonID', this.exerciseData.lesson);
                    this.props.navigation.push("LessonsContent", {
                      lessonID: this.exerciseData.lesson
                    });
                  }}
                >
                  <Image
                    source={require("../assets/images/redesign/note.png")}
                  /> 
                </TouchableOpacity>
              )}

              {this.exerciseData.instructions && (
                <TouchableOpacity
                  style={{ marginLeft: 8, marginTop: 3 }}
                  onPress={() => {
                    this.setState({
                      showInstructions: true,
                      instructions: this.exerciseData.instructions
                    });
                  }}
                >
                  <Image
                    source={require("../assets/images/redesign/info.png")}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
        />
        <KeyboardAwareScrollView
          contentContainerStyle={{ paddingBottom: 72, paddingTop: 16 }}
          extraScrollHeight={32}
          enableResetScrollToCoords={true}
        >
          {this.data.type === "group" && this.renderGroup()}
          {this.data.type != "group" && this.renderItem()}
        </KeyboardAwareScrollView>
        <CustomButton
          style={{
            position: "absolute",
            bottom: 0,
            right: 24,
            marginBottom: 24,
            alignSelf: "flex-end"
          }}
          name={"Next"}
          onPress={() => {
            if (this.audioPlayer) {
              this.audioPlayer.pauseSound();
            }
            if (this.data.type === exerciseTypes.MULTI_SELECT_WITH_OPTIONS) {
              console.log(this.data.value);
              this.exerciseData.details = this.exerciseData.details.slice(
                0,
                this.currentDataIndex + 1
              );
              if (
                this.data.value &&
                this.data.value.keyValues &&
                this.data.value.keyValues.length
              ) {
                this.data.value.keyValues.forEach(value => {
                  let data = _.cloneDeep(this.data.details[0]);
                  data.title = value.key.name;
                  this.exerciseData.details.push(data);
                });
              } else {
                showMessage(errorMessage("Please select at least one"));
                return;
              }
              this.exerciseData.details.push(...this.detailsSplit);
            }
            if (this.data.type === exerciseTypes.SINGLE_SELECT_WITH_FLOW) {
              console.log(this.data.value);
              this.exerciseData.details = this.exerciseData.details.slice(
                0,
                this.currentDataIndex + 1
              );
              if (
                this.data.value &&
                this.data.value.keyValues &&
                this.data.value.keyValues.length
              ) {
                this.data.value.keyValues.forEach(value => {
                  console.log(value);
                  this.data.details &&
                    this.data.details.forEach(detail => {
                      console.log(detail);
                      if (detail.title === value.key.name) {
                        let data = _.cloneDeep(detail);
                        this.exerciseData.details.push(data);
                        console.log(this.exerciseData);
                      }
                    });
                });
              } else {
                showMessage(errorMessage("Please select an answer first"));
                return;
              }
              this.exerciseData.details.push(...this.detailsSplit);
              console.log(this.exerciseData);
            }
            if (this.data.required) {
              if (!this.data.value) {
                showMessage(errorMessage("Please enter details first"));
                return;
              }
            }
            if (this.isLookup) {
              let lookup = this.data.details[this.data.details.length - 1];
              console.log("SETTING LOOKUP VALUE", lookup);
              if (lookup.type === exerciseTypes.LOOKUP) {
                let lookupText = undefined;
                lookup.details.forEach(lookupValue => {
                  if (
                    this.state.lookupScore === parseInt(lookupValue.placeholder)
                  ) {
                    lookupText = lookupValue.question;
                  }
                });
                if (lookupText) {
                  lookup.value = { stringValues: [lookupText] };
                }
              }
            }
            if (
              this.isFollowUp &&
              this.currentDataIndex === this.exerciseData.details.length - 2
            ) {
              return this.props.navigation.navigate("FollowUpScreen", {
                type:
                  this.title === `Challenge Automatic Thought`
                    ? followUpTypes.THOUGHT
                    : followUpTypes.PREDICTION,
                onFollowUpSelected: followupDate =>
                  (this.exerciseData.followupDate = followupDate),
                title: this.title
              });
            }
            if (
              this.currentDataIndex ===
              this.exerciseData.details.length - 1
            ) {
              this.props.navigation.push("ExerciseReviewScreen", {
                isOverview: true
              });
            } else {
              this.props.navigation.push("ExerciseScreen", {
                currentIndex: this.currentDataIndex + 1
              });
            }
          }}
        />
        <InstructionModal
          closeInstructions={() => {
            this.setState({
              showInstructions: false
            });
          }}
          visible={this.state.showInstructions}
          instructions={this.state.instructions}
        />
      </View>
    );
  }
}

export default withStore(ExerciseScreen, state => ({
  currentExercise: state.record.currentExercise,
  isFollowUp: state.record.isFollowUp
}));
