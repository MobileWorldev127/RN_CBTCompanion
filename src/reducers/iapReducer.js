import { isPremiumApp } from "../constants";

const initialState = {
  items: [],
  purchases: [],
  isSubscriptionVisible: false,
  isSubscribed: isPremiumApp()
};

export default (reducer = (state = initialState, action) => {
  switch (action.type) {
    case "IAP_ITEMS_LOADED":
      return {
        ...state,
        items: action.payload
      };
    case "IAP_PURCHASES_LOADED":
      return {
        ...state,
        purchases: action.payload,
        isSubscribed: isPremiumApp()
          ? true
          : action.payload && action.payload.length > 0
      };
    case "SET_SUBSCRIBED":
      return {
        ...state,
        isSubscribed: isPremiumApp() ? true : action.payload
      };
    case "SHOW_SUBSCRIPTION":
      return Object.assign({}, state, {
        isSubscriptionVisible: true
      });
    case "HIDE_SUBSCRIPTION":
      return Object.assign({}, state, {
        isSubscriptionVisible: false
      });
    default:
      return state;
  }
});
