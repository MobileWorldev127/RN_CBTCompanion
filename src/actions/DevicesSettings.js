export const GET_APPLE_HEALTH_SETTINGS = "GET_APPLE_HEALTH_SETTINGS";

export const setAppleHealthSettings = response => dispatch => {
  dispatch({
    type: GET_APPLE_HEALTH_SETTINGS,
    payload: response
  });
};
