import React from "react";
import { View } from "react-native";
import FooterComponent from "./FooterComponent";
import { tabRoutes } from "./routes";
import EntriesScreen from "../EntriesScreen";
import Lessons from "./../lessons/LessonsScreen";
import AddEntry from "./AddScreen";
import MoreScreen from "./../MoreScreen";
import ExerciseModules from "./../exercise/ExerciseListScreen";
import { withSafeAreaActions } from "../../utils/StoreUtils";
import ThemeStyle from "../../styles/ThemeStyle";

class HomeTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: tabRoutes.HomeScreen.name,
      tabBarVisible: true
    };
  }

  componentDidMount() {
    this.willFocusSubscription = this.props.navigation.addListener(
      "willFocus",
      payload => {
        console.log("FOCUSED HOME", payload);
        this.props.setBottomSafeAreaView("#fff");
        this.props.setTopSafeAreaView(ThemeStyle.backgroundColor);
      }
    );
    this.willBlurSubscription = this.props.navigation.addListener(
      "willBlur",
      payload => {
        console.log("FOCUSED HOME", payload);
        this.props.setBottomSafeAreaView(ThemeStyle.backgroundColor);
      }
    );
  }

  componentWillUnmount() {
    if (
      this.willFocusSubscription &&
      typeof this.willFocusSubscription.remove === `function`
    ) {
      this.willFocusSubscription.remove();
    }
    if (
      this.willBlurSubscription &&
      typeof this.willBlurSubscription.remove === `function`
    ) {
      this.willBlurSubscription.remove();
    }
  }

  onChangeSelectedTab = activeTab => {
    this.overrideActiveTab = null;
    if (activeTab === tabRoutes.Record.name) {
      this.props.setTopSafeAreaView(ThemeStyle.gradientStart);
    } else {
      this.props.setBottomSafeAreaView("#fff");
      this.props.setTopSafeAreaView(ThemeStyle.backgroundColor);
    }
    this.setState({
      activeTab
    });
  };

  toggleTabBar = tabBarVisible => {
    this.setState({
      tabBarVisible
    });
  };

  render() {
    const { activeTab } = this.state;
    const { navigation } = this.props;
    if (navigation.state.params) {
      this.overrideActiveTab = navigation.state.params.activeTab;
      navigation.state.params.activeTab = null;
    }
    console.log("PARaMS", activeTab, this.overrideActiveTab);
    const currentTab = this.overrideActiveTab || activeTab;
    return (
      <View style={{ flex: 1 }}>
        {currentTab === tabRoutes.HomeScreen.name && (
          <EntriesScreen
            navigation={navigation}
            onChangeSelectedTab={this.onChangeSelectedTab}
          />
        )}
        {currentTab === tabRoutes.More.name && (
          <MoreScreen navigation={navigation} />
        )}
        {currentTab === tabRoutes.Exercise.name && (
          <ExerciseModules navigation={navigation} />
        )}
        {currentTab === tabRoutes.Record.name && (
          <AddEntry navigation={navigation} toggleTabBar={this.toggleTabBar} />
        )}
        {currentTab === tabRoutes.Lessons.name && (
          <Lessons navigation={navigation} />
        )}
        {this.state.tabBarVisible && (
          <FooterComponent
            navigation={navigation}
            onChangeSelectedTab={this.onChangeSelectedTab}
          />
        )}
      </View>
    );
  }
}

export default withSafeAreaActions(HomeTabs);
