import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList
} from "react-native";
import ThemeStyle from "../../styles/ThemeStyle";
import Header from "./../../components/Header";
import CustomButton from "./../../components/Button";
import textStyle from "./../../common/TextStyles";
import TextStyles from "./../../common/TextStyles";
import Icon from "../../common/icons";
import { withStore } from "../../utils/StoreUtils";
import { client as appSyncClient } from "./../../App";
import { setPreferenceQuery } from "../../queries/setPreference";
import { showMessage } from "react-native-flash-message";
import { userPreferenceQuery } from "../../queries";
import { preferenceTypes, setScreens } from "../../constants";
let _ = require("lodash");
class EntrySettings extends Component {
  constructor(props) {
    super(props);
    this.transition = false;
    this.defaultItems = [
      {
        screen: "record",
        title: "Mood",
        isMandatory: true,
        hidden: false
      },
      {
        screen: "emotion",
        title: "Emotions",
        isMandatory: true,
        hidden: false
      },
      // {
      //   screen: "skill",
      //   title: "Skill Selection",
      //   isMandatory: true,
      //   hidden: false
      // },
      // {
      //   screen: "target",
      //   title: "Target Selection",
      //   isMandatory: true,
      //   hidden: false
      // },
      // {
      //   screen: "activity",
      //   title: "Activity Selection",
      //   isMandatory: false,
      //   hidden: false
      // },
      {
        screen: "medication",
        title: "Sleep/Medication",
        isMandatory: false,
        hidden: false
      },
      {
        screen: "measures",
        title: "ACT Measures",
        isMandatory: false,
        hidden: false
      },
      {
        screen: "journal",
        title: "Journal",
        isMandatory: true,
        hidden: false
      }
    ];
    this.state = {
      items: this.defaultItems
    };
  }

  componentDidMount() {
    this.props.setLoading(true);
    appSyncClient
      .query({
        query: userPreferenceQuery,
        fetchPolicy: "no-cache",
        variables: {
          type: preferenceTypes.TYPE_ENTRY_FLOW
        }
      })
      .then(res => {
        this.props.setLoading(false);
        console.log(res.data);
        if (res.data.getPreference && res.data.getPreference.data) {
          let preferences = JSON.parse(res.data.getPreference.data);
          this.defaultItems.forEach(item => {
            if (preferences.indexOf(item.screen) === -1) {
              item.hidden = true;
            }
          });
          this.setState({
            shouldRefresh: !this.state.shouldRefresh
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.props.setLoading(false);
      });
  }

  renderItemList = rowData => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 12,
          marginBottom: 8,
          backgroundColor: "#fff"
        }}
      >
        <Text
          style={[
            textStyle.GeneralText,
            {
              fontSize: 17,
              color: !rowData.item.hidden ? "#000" : "#aaa",
              marginLeft: 16,
              paddingVertical: 16,
              flex: 1
            }
          ]}
        >
          {rowData.item.title}
        </Text>
        {!rowData.item.isMandatory && (
          <TouchableOpacity
            style={{
              // flex: 1,
              // flexDirection: "row",
              // justifyContent: "flex-end",
              marginHorizontal: 16
            }}
            onPress={() => {
              rowData.item.hidden = !rowData.item.hidden;
              this.setState({
                shouldRefresh: !this.state.shouldRefresh
              });
            }}
          >
            <Icon
              family={"Ionicons"}
              size={32}
              color={rowData.item.hidden ? "#ccc" : ThemeStyle.accentColor}
              name={rowData.item.hidden ? "ios-eye-off" : "ios-eye"}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          title="Entry Preferences"
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
            Configure what you want to be a part of the entry flow
          </Text>
          <FlatList
            contentContainerStyle={{
              justifyContent: "center",
              paddingBottom: 80
            }}
            data={this.state.items}
            renderItem={this.renderItemList}
            keyExtractor={(item, index) => item.screen}
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
              name={"Save"}
              onPress={() => {
                this.props.setLoading(true);
                appSyncClient
                  .mutate({
                    mutation: setPreferenceQuery,
                    variables: {
                      type: preferenceTypes.TYPE_ENTRY_FLOW,
                      data: this.getEntryPreferences()
                    }
                  })
                  .then(
                    data => {
                      console.log(data);
                      setScreens(JSON.parse(this.getEntryPreferences()));
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

  getEntryPreferences = () => {
    let sequence = [];
    this.state.items.forEach(item => {
      if (!item.hidden) {
        sequence.push(item.screen);
      }
    });
    console.log("SAVING ENTRY PREFERENCES", JSON.stringify(sequence));
    return JSON.stringify(sequence);
  };
}

export default withStore(EntrySettings);
