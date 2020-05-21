import { getAllQuizItemsQuery } from "../queries/getAllQuizItems";
import Amplify, { API, graphqlOperation, Auth } from "aws-amplify";

// import { showLoader, hideLoader } from "../../utils/loaderUtil";
// import { currentEnv } from "../../constants";
import { setLoading } from "./AppActions";
import { getEnvVars, getAmplifyConfig, APP } from "../constants";

export const GET_ALL_QUIZ_ITEMS = "GET_ALL_QUIZ_ITEMS";
export const GET_ALL_QUIZ_ITEMS_SUCCESS = "GET_ALL_QUIZ_ITEMS_SUCCESS";
export const GET_ALL_QUIZ_ITEMS_FAILURE = "GET_ALL_QUIZ_ITEMS_FAILURE";

export const SET_LAST_QUIZ_DATE = "SET_LAST_QUIZ_DATE";
export const SET_USER_NOTIFIED = "SET_USER_NOTIFIED";
export const SET_NOTIFY_DATE = "SET_NOTIFY_DATE";

export const getAllQuizItemsRequest = () => dispatch => {
  dispatch({
    type: GET_ALL_QUIZ_ITEMS,
    payload: null
  });
  Amplify.configure(getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL));
  dispatch(setLoading(true));
  //   showLoader();
  API.graphql(
    graphqlOperation(getAllQuizItemsQuery, {
      noOfItems: 10,
      therapy: APP.therapy
    })
  )
    .then(response => {
      console.log(response);
      let result = response.data.getAllQuizItems;
      dispatch(getAllQuizItemsSuccess(result));
    })
    .catch(err => {
      dispatch(getAllQuizItemsFailure(err));
      console.log(err);
    })
    .finally(() => {
      dispatch(setLoading(false));
      //   hideLoader();
    });
};

export function getAllQuizItemsSuccess(response) {
  return {
    type: GET_ALL_QUIZ_ITEMS_SUCCESS,
    payload: response
  };
}

export function getAllQuizItemsFailure() {
  return {
    type: GET_ALL_QUIZ_ITEMS_FAILURE,
    payload: null
  };
}

export function setLastQuizDate(date) {
  return {
    type: SET_LAST_QUIZ_DATE,
    payload: {
      date
    }
  };
}

export function setUserNotified(value = true) {
  return {
    type: SET_USER_NOTIFIED,
    payload: {
      value
    }
  };
}

export function setNotifyDate(date) {
  return {
    type: SET_NOTIFY_DATE,
    payload: {
      value: date
    }
  };
}
