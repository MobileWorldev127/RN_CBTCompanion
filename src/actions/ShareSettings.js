import { getUserShareSettings } from "../queries/getUserShareSettings";
import Amplify, { API, graphqlOperation, Auth } from "aws-amplify";
import { getAmplifyConfig, getEnvVars } from "../constants";
import { setLoading } from "./AppActions";

export const GET_SHARE_SETTINGS = "GET_SHARE_SETTINGS";
export const GET_SHARE_SETTINGS_SUCCESS = "GET_SHARE_SETTINGS_SUCCESS";
export const GET_SHARE_SETTINGS_FAILURE = "GET_SHARE_SETTINGS_FAILURE";

export const VERIFY_INVITATION = "VERIFY_INVITATION";
export const ADD_SHARE_SETTINGS = "ADD_SHARE_SETTINGS";
export const EDIT_SHARE_SETTINGS = "EDIT_SHARE_SETTINGS";

export const getShareSettings = () => dispatch => {
  dispatch({
    type: GET_SHARE_SETTINGS,
    payload: null
  });

  Amplify.configure(getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL));
  dispatch(setLoading(true));
  API.graphql(
    graphqlOperation(getUserShareSettings, { appId: getEnvVars().appId })
  )
    .then(response => {
      const result = response.data.getUserShareSettings;
      // this.setState({ providerList: result })
      dispatch(getShareSettingsSuccess(result));
    })
    .catch(err => console.log(err))
    .finally(() => {
      dispatch(setLoading(false));
    });
};

export function getShareSettingsSuccess(response) {
  return {
    type: GET_SHARE_SETTINGS_SUCCESS,
    payload: response
  };
}

export function getShareSettingsFailure() {
  return {
    type: GET_SHARE_SETTINGS_FAILURE,
    payload: null
  };
}
