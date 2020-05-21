export const APP_ACTIONS = {
  TOGGLE_AFFIRMATION_VIEW: "TOGGLE_AFFIRMATION_VIEW"
};

export const setLoading = isLoading => ({
  type: "SET_LOADING",
  payload: isLoading
});

export const setTopSafeAreaView = color => ({
  type: "SET_TOP_SAFE_AREA",
  payload: color
});

export const setBottomSafeAreaView = color => ({
  type: "SET_BOTTOM_SAFE_AREA",
  payload: color
});

export const toggleAffirmationView = visible => ({
  type: "TOGGLE_AFFIRMATION_VIEW",
  payload: visible
});
