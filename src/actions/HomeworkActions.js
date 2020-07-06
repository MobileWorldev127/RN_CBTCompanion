import Amplify from "aws-amplify";
import { getAmplifyConfig, getEnvVars } from "../constants";
import { API, graphqlOperation } from "aws-amplify";
import { submitHomeworkMutation } from "../queries/submitHomework";
import { setLoading } from "./AppActions";

const SUBMIT_HOMEWORK = "SUBMIT_HOMEWORK";
const SET_CURRENT_HOMEWORK = "SET_CURRENT_HOMEWORK";
const SET_CURRENT_HOMEWORK_ITEM = "SET_CURRENT_HOMEWORK_ITEM";

export const ACTION_TYPES = {
  SUBMIT_HOMEWORK,
  SET_CURRENT_HOMEWORK_ITEM
};

export function setCurrentHomeworkItem(homework, homeworkItem) {
  return {
    type: SET_CURRENT_HOMEWORK_ITEM,
    payload: {
      homework,
      homeworkItem
    }
  };
}

export function submitHomework(
  submitID,
  onSubmitted,
  homeworkID,
  homeworkInput
) {
  return function(dispatch, state) {
    dispatch(setLoading(true));
    Amplify.configure(
      getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
    );
    let variables = {
      homeworkId: homeworkID ? homeworkID : state().homework.currentHomework.id,
      appId: getEnvVars().appId,
      input: homeworkInput
        ? homeworkInput
        : {
            id: submitID,
            title: state().homework.currentHomeworkItem.title,
            type: state().homework.currentHomeworkItem.type,
            homeworkItemId: state().homework.currentHomeworkItem.id
          }
    };
    API.graphql(graphqlOperation(submitHomeworkMutation, variables))
      .then(data => {
        if (onSubmitted) {
          onSubmitted(data);
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
}
