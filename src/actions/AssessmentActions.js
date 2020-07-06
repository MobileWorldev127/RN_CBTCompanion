import {
  userSchdeuledAssessments,
  userAssessmentHistoryQuery
} from "./../queries";
import { setLoading } from "./AppActions";
import { getEnvVars, getAmplifyConfig } from "./../constants";
import { swasthCommonsClient } from "../App";
import { showApiError } from "../utils";

export const GET_USER_SCHEDULED_ASSESSMENTS = "GET_USER_SCHEDULED_ASSESSMENTS";
export const GET_USER_SCHEDULED_ASSESSMENTS_SUCCESS =
  "GET_USER_SCHEDULED_ASSESSMENTS_SUCCESS";
export const GET_USER_SCHEDULED_ASSESSMENTS_FAILURE =
  "GET_USER_SCHEDULED_ASSESSMENTS_FAILURE";

export const GET_USER_ASSESSMENTS_BY_ID = "GET_USER_ASSESSMENTS_BY_ID";
export const GET_USER_ASSESSMENTS_BY_ID_SUCCESS =
  "GET_USER_ASSESSMENTS_BY_ID_SUCCESS";
export const GET_USER_ASSESSMENTS_BY_ID_FAILURE =
  "GET_USER_ASSESSMENTS_BY_ID_FAILURE";

export const getUserSceduledAssessmentsRequest = () => dispatch => {
  dispatch({
    type: GET_USER_SCHEDULED_ASSESSMENTS,
    payload: null
  });
  dispatch(setLoading(true));
  swasthCommonsClient
    .watchQuery({
      query: userSchdeuledAssessments,
      fetchPolicy: "cache-and-network"
    })
    .subscribe({
      next: response => {
        if (response.data) {
          let result = response.data.getUserSchdeuledAssessments;
          dispatch(getUserScheduledAssessmentsSuccess(result));
        }
        dispatch(setLoading(false));
      },
      error: err => {
        console.log(err);
        dispatch(getUserScheduledAssessmentsFailure(err));
        dispatch(setLoading(false));
        showApiError();
      }
    });
};

export function getUserScheduledAssessmentsSuccess(response) {
  return {
    type: GET_USER_SCHEDULED_ASSESSMENTS_SUCCESS,
    payload: response
  };
}

export function getUserScheduledAssessmentsFailure() {
  return {
    type: GET_USER_SCHEDULED_ASSESSMENTS_FAILURE,
    payload: null
  };
}

export const getUserAssessmentsByIdRequest = assessmentId => dispatch => {
  dispatch({
    type: GET_USER_ASSESSMENTS_BY_ID,
    payload: null
  });
  dispatch(setLoading(true));
  swasthCommonsClient
    .watchQuery({
      query: userAssessmentHistoryQuery,
      variables: { assessmentId: assessmentId },
      fetchPolicy: "cache-and-network"
    })
    .subscribe({
      next: response => {
        if (response.data) {
          let result = response.data.getUserAssessmentsById;
          console.log("ASSESSMENT HISTORY", result);
          dispatch(getUserAssessmentsByIdSuccess(result));
        }
        dispatch(setLoading(false));
      },
      error: err => {
        dispatch(getUserAssessmentsByIdFailure(err));
        dispatch(setLoading(false));
        showApiError();
      }
    });
};

export function getUserAssessmentsByIdSuccess(response) {
  return {
    type: GET_USER_ASSESSMENTS_BY_ID_SUCCESS,
    payload: response
  };
}

export function getUserAssessmentsByIdFailure(err) {
  return {
    type: GET_USER_ASSESSMENTS_BY_ID_FAILURE,
    payload: err || "Error"
  };
}
