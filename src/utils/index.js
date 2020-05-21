import React from "react";
import { Linking, Platform } from "react-native";
import { v4 as uuid } from "uuid";
import { isOnline, showOfflineMessage } from "./NetworkUtils";
import { showMessage } from "react-native-flash-message";

export const errorMessage = message => ({
  message: message ? message : "Something went wrong",
  type: "danger"
});

export const showApiError = (showToast, message) => {
  if (isOnline()) {
    showMessage(errorMessage(message));
  } else {
    showOfflineMessage(message, showToast);
  }
};

export const groupByModules = (data = []) => {
  let modules = {};
  data.map(item => {
    if (modules.hasOwnProperty(item.module)) {
      modules[item.module].push(item);
    } else {
      modules[item.module] = [item];
    }
  });
  return modules;
};

export const call = ({ number, prompt = true }) => {
  const url = `${
    Platform.OS === "ios" && prompt ? "telprompt:" : "tel:"
  }${number}`;
  Linking.openURL(url).catch(err => console.log("Call Error: ", err));
};

export function pluralString(quantity, string, pluralString) {
  if (quantity > 1) {
    return " " + (pluralString ? pluralString : string + "s");
  } else {
    return " " + string;
  }
}

export function hashCode(s) {
  var h = 0,
    l = s.length,
    i = 0;
  if (l > 0) while (i < l) h = ((h << 5) - h + s.charCodeAt(i++)) | 0;
  return h;
}

export function stringToColour(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = "#";
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).substr(-2);
  }
  return colour;
}

export function mapUserIdToNickname(group) {
  const map = {};
  if (group && group.participants) {
    group.participants.forEach(item => {
      map[item.userId] = item.nickname;
    });
  }
  return map;
}

export function generateRandomID() {
  return uuid();
}

export function compareVersions(v1, v2, options) {
  let lexicographical = options && options.lexicographical,
    zeroExtend = options && options.zeroExtend,
    v1parts = v1.split(`.`),
    v2parts = v2.split(`.`);

  function isValidPart(x) {
    return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
  }

  if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
    return NaN;
  }

  if (zeroExtend) {
    while (v1parts.length < v2parts.length) {
      v1parts.push(`0`);
    }
    while (v2parts.length < v1parts.length) {
      v2parts.push(`0`);
    }
  }

  if (!lexicographical) {
    v1parts = v1parts.map(Number);
    v2parts = v2parts.map(Number);
  }

  for (let i = 0; i < v1parts.length; ++i) {
    if (v2parts.length == i) {
      return 1;
    }

    if (v1parts[i] == v2parts[i]) {
      continue;
    } else if (v1parts[i] > v2parts[i]) {
      return 1;
    } else {
      return -1;
    }
  }

  if (v1parts.length != v2parts.length) {
    return -1;
  }

  return 0;
}
