import { getUserShareSettings } from "../queries/getUserShareSettings";
import Amplify, { API, graphqlOperation, Auth } from "aws-amplify";
import { getAmplifyConfig, getEnvVars } from "../constants";
import { setLoading } from "./AppActions";

export const GET_SOURCE_SETTINGS = "GET_SOURCE_SETTINGS";

export const getSourceSettings = response => dispatch => {
  dispatch({
    type: GET_SOURCE_SETTINGS,
    payload: response
  });
};
