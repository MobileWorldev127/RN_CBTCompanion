import React, { Component } from "react";
import Onboarding from "react-native-onboarding-swiper";
import pages from "./pages";
import TextStyles from "../../common/TextStyles";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";

export default class TourScreen extends Component {
  onClose = () => this.props.navigation.goBack();
  componentDidMount() {
    recordScreenEvent(screenNames.onboarding);
  }
  render() {
    return (
      <Onboarding
        pages={pages}
        onDone={this.onClose}
        onSkip={this.onClose}
        containerStyles={{ paddingBottom: 108 }}
        imageContainerStyles={{
          paddingBottom: 24
        }}
        titleStyles={TextStyles.HeaderBold}
        subTitleStyles={TextStyles.GeneralText}
      />
    );
  }
}
