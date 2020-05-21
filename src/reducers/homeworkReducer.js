import { ACTION_TYPES } from "./../actions/HomeworkActions";

let initialAuthState = {};

export default function homework(state = initialAuthState, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_CURRENT_HOMEWORK_ITEM:
      console.log("Setting homework item", action);
      return {
        ...state,
        currentHomework: action.payload.homework,
        currentHomeworkItem: action.payload.homeworkItem
      };
    default:
      return state;
  }
}
