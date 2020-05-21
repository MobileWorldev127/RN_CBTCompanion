import { GET_SHARE_SETTINGS_SUCCESS } from "../actions/ShareSettings";

const initialState = {
  providerList: []
};

export default (reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SHARE_SETTINGS_SUCCESS:
      return { ...state, providerList: action.payload };
    default:
      return state;
  }
});
