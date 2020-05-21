import { Analytics, Auth } from "aws-amplify";
import AsyncStorage from '@react-native-community/async-storage';
import { isOnline } from "./NetworkUtils";
import { asyncStorageConstants } from "../constants";

export const screenNames = {
  entries: "ENTRIES",
  meditation: "MEDIATION LIST",
  meditationPlay: "MEDITATION PLAYER",
  summary: "SUMMARY",
  lessons: "LESSONS",
  lessons_card: "LESSONS CARD",
  lessons_content: "LESSON CONTENT",
  subscription: "SUBSCRIBE",
  activity: "RECORD ACTIVITY",
  affirmation: "AFFIRMATION",
  assessmentHistory: "ASSESSMENT HISTORY",
  assessments: "ASSESSMENTS",
  crisisList: "CRISIS",
  exerciseHistory: "EXERCISE HISTORY",
  exerciseModuleList: "EXERCISE MODULES",
  exerciseList: "EXERCISE LIST",
  favorites: "FAVORITES",
  forgotPassword: "FORGOT PASSWORD",
  homework: "HOMEWORK",
  notes: "NOTES",
  practiceIdea: "PRACTICE IDEA LIST",
  practiceIdeaRecord: "RECORD PRACTICE IDEA",
  practiceIdeaReview: "REVIEW PRACTICE IDEA",
  quiz: "QUIZ",
  record: "RECORD MOOD",
  profile: "EDIT PROFILE",
  scheduleNotification: "REMINDERS/AFFIRMATIONS LIST",
  addNotification: "EDIT/ADD REMINDERS",
  entryPreferences: "ENTRY PREFERENCES",
  exerciseSettings: "EXERCISE SETTINGS",
  shareSettings: "SHARE SETTINGS LIST",
  skills: "SKILLS",
  targets: "TARGETS",
  onboarding: "ONBOARDING",
  emotions: "EMOTIONS",
  exerciseReview: "EXERCISE REVIEW",
  exercise: "EXERCISE",
  journal: "JOURNAL",
  login: "LOGIN",
  medication: "MEDICATION",
  more: "MORE",
  pin: "PIN CODE",
  settings: "SETTINGS",
  signUp: "SIGN UP",
  add: "ADD SCREEN"
};

export const eventNames = {
  iapInitiate: "IAP INITIATED",
  iapComplete: "IAP COMPLETED",
  iapLoaded: "IAP FETCHED",
  signIn: "SIGN IN",
  signUp: "SIGN UP",
  emailVerification: "EMAIL VERIFIED",
  showSubscription: "SHOW BUY SUBSCRIPTION"
};

export async function recordScreenEvent(
  eventName,
  attributes = {},
  metrics = {}
) {
  let userInfo = await Auth.currentUserInfo();
  if (!isOnline()) {
    userInfo = JSON.parse(
      await AsyncStorage.getItem(asyncStorageConstants.userInfo)
    );
  }
  console.log("SCREEN EVENT", userInfo, eventName);
  if (userInfo && userInfo.attributes) {
    Analytics.record({
      name: eventName,
      attributes: {
        userName: userInfo.attributes.name,
        userEmailId: userInfo.attributes.email,
        network: isOnline() ? "online" : "offline",
        ...attributes
      },
      metrics
    })
      .then(res => {
        console.log("SUCCESSFULLY SENT EVENT " + eventName, attributes);
      })
      .catch(err => console.log("ERROR SENDING EVENT " + eventName, err));
  }
}

export async function recordInteractionEvent(
  eventName,
  attributes = {},
  metrics = {}
) {
  let userInfo = await Auth.currentUserInfo();
  if (!isOnline()) {
    userInfo = await AsyncStorage.getItem(asyncStorageConstants.userInfo);
  }
  console.log("INTERACTION EVENT", userInfo, eventName);
  if (userInfo && userInfo.attributes) {
    Analytics.record({
      name: eventName,
      attributes: {
        userName: userInfo && userInfo.attributes.name,
        userEmailId: userInfo && userInfo.attributes.email,
        network: isOnline() ? "online" : "offline",
        ...attributes
      },
      metrics
    })
      .then(res => {
        console.log("SUCCESSFULLY SENT EVENT " + eventName, attributes);
      })
      .catch(err => console.log("ERROR SENDING EVENT " + eventName, err));
  }
}
