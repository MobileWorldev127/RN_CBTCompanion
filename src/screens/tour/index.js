import React, { Component } from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import pages from './pages';
import TextStyles from '../../common/TextStyles';
import { recordScreenEvent, screenNames } from '../../utils/AnalyticsUtils';
import { withSafeAreaActions } from '../../utils/StoreUtils';
import { setTopSafeAreaView } from '../../actions/AppActions';
import ThemeStyle from '../../styles/ThemeStyle';

class TourScreen extends Component {
  onClose = () => this.props.navigation.goBack();
  componentDidMount() {
    this.props.setTopSafeAreaView(ThemeStyle.backgroundColor);
    recordScreenEvent(screenNames.onboarding);
  }

  componentWillUnmount() {
    this.props.setTopSafeAreaView(ThemeStyle.gradientStart);
  }

  render() {
    return (
      <Onboarding
        pages={pages}
        onDone={this.onClose}
        onSkip={this.onClose}
        containerStyles={{ paddingBottom: 108 }}
        imageContainerStyles={{
          paddingBottom: 24,
        }}
        titleStyles={TextStyles.HeaderBold}
        subTitleStyles={TextStyles.GeneralText}
      />
    );
  }
}

export default withSafeAreaActions(TourScreen, dispatch => ({
  setTopSafeAreaView: color => dispatch(setTopSafeAreaView(color))
}));
