// configureStore.js

import { createStore, applyMiddleware, combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";
// import { appNavigatorMiddleware } from "./../navigators/AppNavigator";
import AppReducer from "../reducers";

let store = createStore(
  combineReducers(AppReducer),
  applyMiddleware(thunkMiddleware)
);
export default store;
