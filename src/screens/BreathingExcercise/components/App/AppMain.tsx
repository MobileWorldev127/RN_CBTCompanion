/* eslint-disable prettier/prettier */

import React, { FC } from "react";
import { View } from "react-native";
import SplashScreen from "react-native-splash-screen";
import { useAppContext } from "../../context/AppContext";
import { useOnMount } from "../../hooks/useOnMount";
import { useOnUpdate } from "../../hooks/useOnUpdate";
import { AppRouter } from "./AppRouter";

// Initializes the app state and, once done, hides the splash screen and shows
// the AppRouter

export const AppMain: FC<Props> = ({
  navigation
}) => {
  const { ready, initialize, setSystemColorScheme } = useAppContext();

  useOnMount(() => {
    initialize();
  });

  useOnUpdate((prevReady) => {
    if (!prevReady && ready) {
      SplashScreen.hide();
    }
  }, ready);

  return <AppRouter navigation={navigation}/>;
  // if (!ready) {
  //   return <View />;
  // } else {
  //   return <AppRouter />;
  // }
};
