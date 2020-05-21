import {
  GET_USER_SCHEDULED_ASSESSMENTS,
  GET_USER_SCHEDULED_ASSESSMENTS_FAILURE,
  GET_USER_SCHEDULED_ASSESSMENTS_SUCCESS,
  GET_USER_ASSESSMENTS_BY_ID,
  GET_USER_ASSESSMENTS_BY_ID_SUCCESS,
  GET_USER_ASSESSMENTS_BY_ID_FAILURE
} from "./../actions/AssessmentActions";

const initialState = {
  assessments: [],
  history: []
};

export default (reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_SCHEDULED_ASSESSMENTS_SUCCESS:
      return { ...state, assessments: action.payload };
    case GET_USER_SCHEDULED_ASSESSMENTS:
      return { ...state, assessments: [] };
    case GET_USER_ASSESSMENTS_BY_ID_SUCCESS:
      return { ...state, history: action.payload };
    case GET_USER_ASSESSMENTS_BY_ID:
      return { ...state, history: [] };
    default:
      return state;
  }
});
