import ThemeStyle from "../styles/ThemeStyle";
import { APP_ACTIONS } from "./../actions/AppActions";

const initialState = {
  isLoading: false,
  topSafeAreaView: ThemeStyle.gradientStart,
  bottomSafeAreaView: ThemeStyle.gradientEnd,
  affirmationVisible: false
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case "SET_LOADING":
      return Object.assign({}, state, {
        isLoading: action.payload
      });
    case "SET_TOP_SAFE_AREA":
      return Object.assign({}, state, {
        topSafeAreaView: action.payload
      });
    case "SET_BOTTOM_SAFE_AREA":
      return Object.assign({}, state, {
        bottomSafeAreaView: action.payload
      });
    case APP_ACTIONS.TOGGLE_AFFIRMATION_VIEW:
      return Object.assign({}, state, {
        affirmationVisible: action.payload
      });
    default:
      return state;
  }
}
