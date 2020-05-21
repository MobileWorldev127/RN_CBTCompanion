import "babel-polyfill";
import { AppRegistry } from "react-native";
import App from "./src/App";
import { Client } from 'bugsnag-react-native';

const bugsnag = new Client("690d713ac89914f6017a7ed1383c1d2e");


AppRegistry.registerComponent("CBTCompanion", () => App);
