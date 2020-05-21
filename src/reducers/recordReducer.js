import { ACTION_TYPES } from "./../actions/RecordActions";
const initialRecordState = { completedExercise: [] };

export default function record(state = initialRecordState, action) {
  switch (action.type) {
    case ACTION_TYPES.ADD_COMPLETED_EXERCISE:
      let completedExercise = state.completedExercise.slice();
      let shouldPush = true;
      completedExercise.forEach(exercise => {
        if (exercise.id === action.payload.id) {
          exercise = action.payload;
          shouldPush = false;
        }
      });
      if (shouldPush) completedExercise.push(action.payload);
      return Object.assign({}, state, {
        completedExercise
      });
    case ACTION_TYPES.SET_EDIT_ENTRY:
      return Object.assign({}, state, {
        isEdit: true,
        editEntry: action.payload
      });
    case ACTION_TYPES.SET_MOOD:
      return Object.assign({}, state, {
        mood: action.payload.mood,
        timestamp: action.payload.timestamp
      });
    case ACTION_TYPES.SET_EMOTIONS:
      return Object.assign({}, state, {
        emotions: action.payload
      });
    case ACTION_TYPES.SET_SLEEP:
      return Object.assign({}, state, {
        sleep: action.payload
      });
    case ACTION_TYPES.SET_JOURNAL:
      return Object.assign({}, state, {
        journal: action.payload
      });
    case ACTION_TYPES.SET_CURRENT_EXERCISE:
      return Object.assign({}, state, {
        currentExercise: action.payload.currentExercise,
        isFollowUp: action.payload.currentExercise.isFollowUp,
        flowType: action.payload.flowType
      });

    case ACTION_TYPES.SET_COMPLETED_ACT_MEASURE:
      return Object.assign({}, state, {
        ...action.payload
      });
    case ACTION_TYPES.CLEAR_STATE:
      console.log("State clear");
      return {
        mood: undefined,
        timestamp: undefined,
        emotions: undefined,
        sleep: undefined,
        journal: undefined,
        currentExercise: undefined,
        completedExercise: [],
        isEdit: false,
        editEntry: undefined,
        isFollowUp: false
      };
    default:
      return state;
  }
}
