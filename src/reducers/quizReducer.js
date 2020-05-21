import {
  GET_ALL_QUIZ_ITEMS,
  GET_ALL_QUIZ_ITEMS_SUCCESS,
  SET_LAST_QUIZ_DATE,
  SET_USER_NOTIFIED,
  SET_NOTIFY_DATE
} from "../actions/QuizActions";

const initialState = {
  quizItems: [],
  reminderData: {
    lastQuizDate: "2000-01-01T00:00:00+05:30",
    userNotified: false,
    lastNotificationDate: "2000-01-01T00:00:00+05:30"
  }
};

export default (reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_QUIZ_ITEMS_SUCCESS:
      return { ...state, quizItems: action.payload };
    case GET_ALL_QUIZ_ITEMS:
      return { ...state, quizItems: [] };
    case SET_LAST_QUIZ_DATE:
      return {
        ...state,
        reminderData: {
          lastQuizDate: action.payload.date,
          userNotified: false,
          lastNotificationDate: action.payload.date
        }
      };
    case SET_USER_NOTIFIED:
      return {
        ...state,
        reminderData: {
          ...state.reminderData,
          userNotified: action.payload.value
        }
      };
    case SET_NOTIFY_DATE:
      return {
        ...state,
        reminderData: {
          ...state.reminderData,
          lastNotificationDate: action.payload.value
        }
      };
    default:
      return state;
  }
});
