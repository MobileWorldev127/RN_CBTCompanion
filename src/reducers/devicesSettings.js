import { GET_APPLE_HEALTH_SETTINGS } from "../actions/DevicesSettings";

const initialState = {
  permissions: {
    read: ['Height'],
  },
};

export default (reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_APPLE_HEALTH_SETTINGS:
      return { ...state, appleHealthPermission: action.payload };
    default:
      return state;
  }
});
