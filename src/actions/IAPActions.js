import * as RNIap from "react-native-iap";
import { Platform, NativeModules } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { showMessage } from "react-native-flash-message";
import { setLoading } from "./AppActions";
import {
  APP,
  asyncStorageConstants,
  getAmplifyConfig,
  getEnvVars
} from "../constants";
import { recordInteractionEvent, eventNames } from "../utils/AnalyticsUtils";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import { setPremiumStatusQuery } from "../queries/setPremiumStatus";
import { getPremiumFeatureQuery } from "../queries/getPremiumFeature";
const { RNIapModule } = NativeModules;

let purchaseUpdateSubscription = null;
let purchaseErrorSubscription = null;

export const hasIAP = () => {
  return !!RNIapModule;
};

const itemSkus = Platform.select({
  ios: APP.iap.ios,
  android: APP.iap.android
});

const iapItemsLoaded = products => ({
  type: "IAP_ITEMS_LOADED",
  payload: products
});

export const setSubscription = isPremium => {
  return {
    type: "SET_SUBSCRIBED",
    payload: isPremium
  };
};

export const showSubscription = () => {
  recordInteractionEvent(eventNames.showSubscription);
  return {
    type: "SHOW_SUBSCRIPTION"
  };
};

export const hideSubscription = () => ({
  type: "HIDE_SUBSCRIPTION"
});

export const initializePremiumContent = (cb = () => {}) => {
  return async dispatch => {
    dispatch(
      prepareIAP(() => {
        dispatch(getSubscriptionItems());
      })
    );
    const hasPremium = await fetchPremiumStatus();
    if (hasPremium === true) {
      savePremiumFeature(true);
      dispatch(setSubscription(true));
      cb(true);
    } else if (hasPremium === false) {
      savePremiumFeature(false);
      dispatch(getPurchases(cb));
    } else {
      const hasPremium = await getPremiumFeature();
      if (hasPremium === true) {
        dispatch(setSubscription(true));
        cb(true);
      } else {
        dispatch(getPurchases(cb));
      }
    }
  };
};

export const fetchPremiumStatus = async () => {
  try {
    Amplify.configure(
      getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
    );
    const res = await API.graphql({
      query: getPremiumFeatureQuery,
      variables: {
        appId: APP.swasthApp
      }
    });
    console.log("PREMIUM STATUS", res.data);
    if (res.data && res.data.getPremiumFeature) {
      return res.data.getPremiumFeature.hasPremium;
    }
  } catch (e) {
    console.log("ERROR FETCHING PREMIUM STATUS", e);
  }
};

export const savePremiumFeature = hasPremium => {
  AsyncStorage.setItem(
    asyncStorageConstants.hasPremium,
    JSON.stringify(hasPremium)
  );
};

export const getPremiumFeature = async () => {
  const data = await AsyncStorage.getItem(asyncStorageConstants.hasPremium);
  return JSON.parse(data);
};

export const prepareIAP = (cb = () => {}) => {
  return dispatch => {
    // showLoader();
    RNIap.initConnection()
      .then(canMakePayments => {
        // console.log(canMakePayments);
        console.log(
          "INIT CONNECTION",
          purchaseErrorSubscription,
          purchaseErrorSubscription
        );
        if (!purchaseUpdateSubscription) {
          purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
            purchase => {
              if (purchase && purchase.transactionReceipt) {
                recordInteractionEvent(eventNames.iapComplete, {
                  itemID: purchase.productId + ""
                });
                dispatch(getPurchases());
                RNIap.finishTransaction(purchase);
              }
            }
          );
        }
        if (!purchaseErrorSubscription) {
          purchaseErrorSubscription = RNIap.purchaseErrorListener(error => {
            console.warn("purchaseErrorListener", error);
            dispatch(setLoading(false));
            showMessage({
              message: "Failed to make a purchase. Please try again.",
              type: "danger"
            });
          });
        }
      })
      .catch(e => console.log(e))
      .finally(() => {
        // hideLoader();
        cb();
      });
  };
};

export const getSubscriptionItems = () => {
  return dispatch => {
    // showLoader();
    RNIap.getSubscriptions(itemSkus)
      .then(products => {
        console.log("SUBSCRIPTION ITEMS", products);
        dispatch(iapItemsLoaded(products));
      })
      .catch(e => {
        showMessage({
          message: "Failed to fetch subscriptions. Please try again.",
          type: "danger"
        });
        console.log(e);
      })
      .finally(() => {
        // hideLoader();
      });
  };
};

export const buySubscription = productId => {
  return dispatch => {
    dispatch(setLoading(true));
    RNIap.requestSubscription(productId);
  };
};

const purchasesLoaded = purchases => {
  console.log("PURCHASES", purchases);
  recordInteractionEvent(eventNames.iapLoaded, {
    isPremiumUser: purchases.length > 0 ? "Yes" : "No",
    purchasedItems: purchases ? JSON.stringify(purchases) : ""
  });
  setPremiumStatus(purchases.length > 0);
  return {
    type: "IAP_PURCHASES_LOADED",
    payload: purchases
  };
};

export const getPurchases = (cb = () => {}) => {
  return dispatch => {
    RNIap.getAvailablePurchases()
      .then(purchases => {
        console.log(purchases);
        if (purchases.length) {
          if (Platform.OS === "ios") {
            const receiptBody = {
              "receipt-data":
                purchases[purchases.length - 1].transactionReceipt,
              password: APP.iapSharedSecret
            };
            RNIap.validateReceiptIos(receiptBody, false).then(receipt => {
              console.log("++++ RECEIPT", receipt);
              if (receipt.status === 21007) {
                RNIap.validateReceiptIos(receiptBody, true).then(
                  receiptProd => {
                    if (checkReceiptValidity(receiptProd)) {
                      cb(true);
                      dispatch(purchasesLoaded(purchases));
                      dispatch(hideSubscription());
                    } else {
                      cb(false);
                      dispatch(purchasesLoaded([]));
                    }
                  }
                );
              } else if (checkReceiptValidity(receipt)) {
                cb(true);
                dispatch(purchasesLoaded(purchases));
                dispatch(hideSubscription());
              } else {
                cb(false);
                dispatch(purchasesLoaded([]));
              }
            });
          } else {
            cb(purchases.length > 0);
            dispatch(purchasesLoaded(purchases));
            dispatch(hideSubscription());
          }
        } else {
          console.log(" ++++ NO PURCHASES");
          cb(false);
          dispatch(purchasesLoaded([]));
        }
      })
      .catch(e => {
        showMessage({
          message: "Failed to connect to store. Please try again.",
          type: "danger"
        });
        console.log("Available purchase error---->", e);
        dispatch(purchasesLoaded([]));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
};

const checkReceiptValidity = receipt => {
  if (receipt.latest_receipt_info) {
    const renewalHistory = receipt.latest_receipt_info;
    const expiration =
      renewalHistory[renewalHistory.length - 1].expires_date_ms;
    if (expiration && expiration > Date.now()) {
      console.log("++++ WORKING SUBSCRIPTION");
      return true;
    }
    console.log("++++ EXPIRED SUBSCRIPTION");
    return false;
  } else {
    console.log("++++NO LATEST RECEIPT INFO");
    return false;
  }
};

const setPremiumStatus = async isPremium => {
  const isPremiumCache = await AsyncStorage.getItem(
    asyncStorageConstants.premiumStatus
  );
  let isStatusChanged = !isPremiumCache;
  if (isPremiumCache === "true" && !isPremium) {
    isStatusChanged = true;
  }
  if (isPremiumCache === "false" && isPremium) {
    isStatusChanged = true;
  }
  if (isStatusChanged) {
    Amplify.configure(
      getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
    );
    API.graphql(
      graphqlOperation(setPremiumStatusQuery, {
        app: APP.swasthApp,
        status: isPremium
      })
    )
      .then(res => {
        console.log("CHANGED PREMIUM STATUS", res.data);
        AsyncStorage.setItem(
          asyncStorageConstants.premiumStatus,
          isPremium ? "true" : "false"
        );
      })
      .catch(err => {
        console.log("ERROR CHANGING PREMIUM STATUS", err);
      });
  }
};

export const clearListeners = () => {
  if (purchaseUpdateSubscription) {
    purchaseUpdateSubscription.remove();
    purchaseUpdateSubscription = null;
  }
  if (purchaseErrorSubscription) {
    purchaseErrorSubscription.remove();
    purchaseErrorSubscription = null;
  }
};

export const endIAPConnection = () => {
  console.log("END IAP CONNECTION");
  RNIap.endConnectionAndroid();
};
