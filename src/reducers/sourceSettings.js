import { GET_SOURCE_SETTINGS } from "../actions/SourceSettings";

const initialState = {
  sourceSettingsList: [{
      "activitySetting": "Manual", 
      "heartSetting": "Manual", 
      "mindfulnessSetting": "Manual", 
      "nutritionSetting": "Manual", 
      "sleepSetting": "Manual"
    }]
};

export default (reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SOURCE_SETTINGS:
      return { ...state, sourceSettingsList: action.payload };
    default:
      return state;
  }
});
