import React, { Component, Fragment } from "react";
import { View, TouchableOpacity, ScrollView, StyleSheet, Text } from "react-native";
import Header from "../../components/Header";
import Amplify, { API, graphqlOperation, Auth } from "aws-amplify";
import { NavigationActions } from "react-navigation";
import { getAmplifyConfig, getEnvVars, communityTypes } from "../../constants";
import moment from "moment";
import { TabView } from "react-native-tab-view";
import Animated from "react-native-reanimated";
import { withStore, withSafeAreaActions } from "../../utils/StoreUtils";
import ThemeStyle from "../../styles/ThemeStyle";
import TextStyles from "../../common/TextStyles";
import { setCurrentExercise } from "../../actions/RecordActions";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";
import DiscussionsScreen from "./discussions/DiscussionsScreen";
import PeerGroupsScreen from "./peerGroups/PeerGroupsScreen";

moment.suppressDeprecationWarnings = true;
moment.locale("en");

class CommunityScreen extends Component {
  constructor(props) {
    super(props);
    const {
      navigation: {
        state: { params }
      }
    } = props;
    // this.toast = null;
    this.state = {
      index: 0,
      routes: [
        { key: communityTypes.DISCUSSIONS, title: "Discussions" },
        { key: communityTypes.PEER_GROUPS, title: "Peer Groups" }
      ]
    };
  }

  _handleIndexChange = index => this.setState({ index: index });
  // _renderTabBar = props => <TabBar {...props} style={{backgroundColor: '#ddf'}}/>;
  _renderTabBar = props => {
    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          return (
            <TouchableOpacity
              style={[
                styles.tabItem,
                {
                  borderBottomColor:
                    this.state.index === i ? ThemeStyle.mainColor : "#fff",
                  backgroundColor:
                    this.state.index === i
                      ? ThemeStyle.mainColor
                      : ThemeStyle.mainColorLight
                }
              ]}
              onPress={() => this.setState({ index: i })}
            >
              <View>
                <Text
                  style={[
                    TextStyles.GeneralTextBold,
                    {
                      color:
                        this.state.index === i
                          ? "#fff"
                          : TextStyles.GeneralText.color
                    }
                  ]}
                >
                  {route.title.toUpperCase()}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  _renderScene = ({ route }) => {
    switch (route.key) {
      case communityTypes.DISCUSSIONS:
        return <DiscussionsScreen navigation={this.props.navigation} />;
      case communityTypes.PEER_GROUPS:
        return <PeerGroupsScreen navigation={this.props.navigation} />;
      default:
        return null;
    }
  };

  render() {
    return (
      <View style={ThemeStyle.pageContainer}>
        <Fragment>
          <Header
            title="Community"
            goBack={() => {
              this.props.navigation.goBack(null);
            }}
            navBarStyle={{ backgroundColor: ThemeStyle.mainColorLight }}
          />
        </Fragment>
        <TabView
          navigationState={this.state}
          renderScene={this._renderScene}
          renderTabBar={this._renderTabBar}
          swipeEnabled={true}
          onIndexChange={this._handleIndexChange}
        />
      </View>
    );
  }

  goBack = () => this.props.navigation.dispatch(NavigationActions.back());

  componentDidMount() {
    // recordScreenEvent(screenNames.favorites);
    Amplify.configure(
      getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
    );
    this.props.setTopSafeAreaView(ThemeStyle.mainColorLight);
  }

  componentWillUnmount() {
    this.props.setTopSafeAreaView(ThemeStyle.backgroundColor);
  }
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    paddingTop: 0,
    paddingBottom: 16,
    backgroundColor: ThemeStyle.mainColorLight,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    overflow: "hidden"
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    backgroundColor: ThemeStyle.mainColor,
    borderRadius: 24,
    marginHorizontal: 16
  }
});

export default withSafeAreaActions(CommunityScreen);
