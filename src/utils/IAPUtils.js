import * as RNIap from "react-native-iap";
import { Platform, NativeModules } from "react-native";
const { RNIapModule } = NativeModules;
import { showLoader, hideLoader } from "../utils/loaderUtil";

export const hasIAP = () => {
  // console.log("Checking Iap: ", NativeModules.RNIapModule);
  // return !!NativeModules.RNIapModule;
  return true;
};

export let items = []; // Have a variable that shares

const itemSkus = Platform.select({
  ios: ["monthly.subscription", "six.month.subscription"],
  android: []
});

export const getSubscriptionItems = () => {
  return new Promise((resolve, reject) => {
    showLoader();
    RNIap.prepare()
      .then(() => RNIap.getSubscriptions(itemSkus))
      .then(products => {
        hideLoader();
        resolve(products);
      })
      .catch(e => {
        hideLoader();
        reject(e);
      });
  });
};

export const buySubscription = productId => {
  return new Promise((resolve, reject) => {
    showLoader();
    RNIap.buySubscription(productId)
      .then(res => {
        hideLoader();
        resolve(res); /* Get available Purcvhases */
      })
      .catch(e => {
        hideLoader();
        reject(e);
      });
  });
};

export const getPurchases = () => {
  return new Promise((resolve, reject) => {
    showLoader();
    RNIap.getAvailablePurchases()
      .then(s => {
        hideLoader();
        resolve(s);
      })
      .catch(e => {
        hideLoader();
        reject(e);
      });
  });
};
