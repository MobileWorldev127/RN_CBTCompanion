import React, { FC } from "react";
import { AppContextProvider } from "../../context/AppContext";
import { AppMain } from "./AppMain";
import { Platform, UIManager } from "react-native";
import { withStore } from "../../../../utils/StoreUtils";

// Enable layout animations on Android so that we can animate views to their new
// positions when a layout change happens
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// App entry point used to wrap the core logic of the app with context providers

export const App: FC<Props> = ({
  props,
  navigation
}) => {
  // let isBack = props.params.title;
  console.log('#####%%%%%%%%>', navigation.state.params.title)
  return (
    <AppContextProvider>
      <AppMain navigation={navigation}/>
    </AppContextProvider>
  );
};