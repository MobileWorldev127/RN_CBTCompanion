import React, { Component } from "react";
import { Provider } from "react-redux";
import store from "./store";
import AppWithNavigationState from "./navigators/AppNavigator";
import { enableScreens } from 'react-native-screens';
import Amplify, { Auth } from "aws-amplify";
import awsmobile from "../aws-export-dev";
import { ApolloProvider } from "react-apollo";
import AWSAppSyncClient from "aws-appsync";
import { getEnvVars } from "./constants";
import {
  addNetworkChangeListener,
  removeNetworkChangeListener
} from "./utils/NetworkUtils";
import AsyncStorage from "@react-native-community/async-storage";
import { getEntriesComponent } from "./screens/EntriesScreen";
import bugsnagClient from "./utils/Bugsnag";
import {EmiiterHandlerSubscribe} from './screens/settings/EventEmitter'

Amplify.configure(getEnvVars().awsConfig);

export const client = new AWSAppSyncClient({
  url: getEnvVars().APP_SYNC_URL,
  region: getEnvVars().Region,
  auth: {
    type: getEnvVars().AuthMode,
    jwtToken: async () =>
      (await Auth.currentSession()).getIdToken().getJwtToken()
  },
  offlineConfig: {
    keyPrefix: "cbt",
    callback: (err, succ) => {
      if (err) {
        const { mutation, variables } = err;
        bugsnagClient.leaveBreadcrumb(`Error for ${mutation}`);
        bugsnagClient.notify(err);
        console.warn(`ERROR for ${mutation}`, err);
        console.warn(`ERROR for ${mutation}`, err);
      } else {
        const { mutation, variables } = succ;

        console.info(`SUCCESS for ${mutation}`, succ);
        bugsnagClient.leaveBreadcrumb(`Success for ${mutation}`);
        if (getEntriesComponent()) {
          getEntriesComponent().fetchEntries();
        }
      }
    },
    storage: AsyncStorage
  }
});

export const swasthCommonsClient = new AWSAppSyncClient({
  url: getEnvVars().SWASTH_COMMONS_ENDPOINT_URL,
  region: getEnvVars().Region,
  auth: {
    type: getEnvVars().AuthMode,
    jwtToken: async () =>
      (await Auth.currentSession()).getIdToken().getJwtToken()
  },
  offlineConfig: {
    keyPrefix: "swasthCommon",
    callback: (err, succ) => {
      if (err) {
        const { mutation, variables } = err;

        console.warn(`ERROR for ${mutation}`, err);
      } else {
        const { mutation, variables } = succ;

        console.info(`SUCCESS for ${mutation}`, succ);
      }
    },
    storage: AsyncStorage
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    //Text.defaultProps.allowFontScaling=false,
    this.state = {};
    console.disableYellowBox = true;
    // enableScreens();
  }

  componentDidMount() {
    // EmiiterHandlerSubscribe();
    addNetworkChangeListener();
  }

  componentWillUnmount() {
    removeNetworkChangeListener();
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <AppWithNavigationState />
        </Provider>
      </ApolloProvider>
    );
  }
}

export default App;
