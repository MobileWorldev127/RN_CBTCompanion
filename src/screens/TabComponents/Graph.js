import React, { Component, Fragment } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Platform,
  TouchableHighlight,
  Dimensions,
  Picker
} from "react-native";
import moment from "moment";
import { Calendar } from "react-native-calendars";
import Icon from "../../common/icons";
import ThemeStyle from "../../styles/ThemeStyle";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryArea,
  VictoryScatter,
  VictoryGroup,
  VictoryPie
} from "victory-native";
import { Query } from "react-apollo";
import { Moods, moodColors } from "./../../constants";
import { getMonthRange, isCurrentMonth } from "../../utils/DateTimeUtils";
import { showMessage } from "react-native-flash-message";
import {
  getMoodChartMonthlyQuery,
  getMoodCountQuery,
  getMoodCorelationsQuery
} from "../../queries";
import { G, Image as SVGImage } from "react-native-svg";
import TextStyles from "../../common/TextStyles";
import { getStatsQuery } from "../../queries/getStats";
import { getEntriesDateQuery } from "../../queries/getEntriesDate";
import { errorMessage, showApiError } from "../../utils";
let _ = require("lodash");
import { Dropdown } from "react-native-material-dropdown";
import { withStore, withSubscriptionActions } from "../../utils/StoreUtils";
import { clearState } from "../../actions/RecordActions";
import PremiumView from "../PremiumView";
import Sharing from "./../../components/Share";
import { Auth } from "aws-amplify";
import { getTimeLineViewQuery } from "../../queries/getTimeLineView";
const { width, height } = Dimensions.get("screen");
import * as Animatable from "react-native-animatable";

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMonth: moment(),
      moodChartRange: "week",
      moodCountRange: "week",
      moodCorrelationRange: "week",
      shareDialogVisible: false
    };
    this.rangeOptions = [
      {
        label: "7 days",
        value: "week"
      },
      {
        label: "30 days",
        value: "month"
      },
      {
        label: "1 year",
        value: "year"
      }
    ];
  }

  componentDidMount() {
    this.listener = this.props.navigation.addListener("didFocus", payload => {
      console.log("Focused graph");
      this.props.clearRecordFlow();
    });
  }

  render() {
    let { params } = this.props.navigation.state;
    let isBack = params && params.isBack;

    return (
      <View style={ThemeStyle.pageContainer}>
        <StatusBar backgroundColor={ThemeStyle.backgroundColor} />
        <View style={[styles.navBar]}>
          <TouchableHighlight
            underlayColor="#74cc9533"
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
            onPress={() => {
              isBack
                ? this.props.navigation.goBack("")
                : this.props.navigation.openDrawer();
            }}
          >
            <Image source={require("../../assets/images/redesign/Back.png")} />
          </TouchableHighlight>
          <View
            style={{
              flex: 5,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row"
            }}
          >
            <Text
              style={[
                TextStyles.SubHeaderBold,
                {
                  fontWeight: "bold",
                  fontSize: 21,
                  marginVertical: 3
                }
              ]}
            >
              Client
            </Text>
          </View>
          <TouchableHighlight
            underlayColor={`${ThemeStyle.accentColor}33`}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
            onPress={this.onSharePress}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Icon
                family={"Feather"}
                name={"more-vertical"}
                size={20}
              />
            </View>
          </TouchableHighlight>
        </View>
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.textStyle}>Food</Text>
            <View style={styles.innerContainer}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity>
                  <View style={styles.checkBoxView}>
                    <Icon
                      family={"Ionicons"}
                      name={"ios-checkbox"}
                      color="#cf74ed"
                      size={22}
                    />
                    <Text>  Calories</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View style={styles.checkBoxView}>
                    <Icon
                      family={"Ionicons"}
                      name={"ios-checkbox"}
                      color="#f1ce50"
                      size={22}
                    />
                    <Text>  Carbs</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View style={styles.checkBoxView}>
                    <Icon
                      family={"Ionicons"}
                      name={"ios-checkbox"}
                      color="#ff6259"
                      size={22}
                    />
                    <Text>  Protein</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View style={styles.checkBoxView}>
                    <Icon
                      family={"Ionicons"}
                      name={"ios-checkbox"}
                      color="#4191fb"
                      size={22}
                    />
                    <Text>  Dat</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <Text>34</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default withSubscriptionActions(
  Graph,
  () => {},
  dispatch => ({
    clearRecordFlow: () => dispatch(clearState())
  })
);

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: ThemeStyle.backgroundColor,
    height: Platform.OS === "ios" ? 64 : 54,
    flexDirection: "row"
  },
  container: {
    flex: 1,
    marginHorizontal: 16
  },
  textStyle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
  },
  innerContainer: {
    marginVertical: 16,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "lightgrey",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    padding: 16,
  },
  checkBoxView: {
    flexDirection:'row',
    alignItems: 'center'
  }
});
