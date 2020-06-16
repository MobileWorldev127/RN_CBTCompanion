export const MEDITATION_ENDPOINT =
  "https://svsca4lrog.execute-api.us-east-1.amazonaws.com/prod/api/meditation/";
export const API_HOST = "svsca4lrog.execute-api.us-east-1.amazonaws.com";
export const CONTENT_PATH = "https://d2ot3z5xcrn0h2.cloudfront.net/";
export const CONTENT_PATH_HTTP = "https://d2ot3z5xcrn0h2.cloudfront.net/";
import AwsConfigDev from "../../aws-export-dev";
import AwsConfigProd from "../../aws-export";
import { Auth } from "aws-amplify";
import moment from "moment";
import AppConfigs from "./AppConfigs";
// import { Constants } from 'expo';

var screens = ["record", "emotion", "medication", "journal"];

export const getScreens = () => {
  return screens;
};

export function setScreens(userScreens) {
  screens = userScreens;
}

export const getHeaders = token => {
  let auth_date = new Date();
  let headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-access-token": token,
    "X-Amz-Date": auth_date.toISOString(),
    host: API_HOST,
    Authorization: token
  };
  return headers;
};

export const APP = AppConfigs.CBT;

const ENV = {
  dev: {
    APP_SYNC_URL: APP.graphql.dev,
    SWASTH_COMMONS_ENDPOINT_URL:
      "https://ybudbtbn75hgje3ael2kau7zk4.appsync-api.us-east-1.amazonaws.com/graphql",
    awsConfig: AwsConfigDev,
    validateReceiptIos: true,
    appId: APP.id,
    Region: "us-east-1",
    AuthMode: "AMAZON_COGNITO_USER_POOLS"
  },
  prod: {
    APP_SYNC_URL: APP.graphql.prod,
    SWASTH_COMMONS_ENDPOINT_URL:
      "https://haf7cr5vtvg7xk2ebhd3hfi2iq.appsync-api.us-east-1.amazonaws.com/graphql",
    awsConfig: AwsConfigProd,
    validateReceiptIos: true,
    appId: APP.id,
    Region: "us-east-1",
    AuthMode: "AMAZON_COGNITO_USER_POOLS"
  }
};

export const isPremiumApp = () => {
  // Set to true if you want to override subscription status
  return true;
};

export const getEnvVars = (env = "") => {
  if (env === null || env === undefined || env === "") return ENV.dev;
  if (env.indexOf("dev") !== -1) return ENV.dev;
  if (env.indexOf("staging") !== -1) return ENV.staging;
  if (env.indexOf("prod") !== -1) return ENV.prod;
};

export const getAmplifyConfig = endpoint => ({
  aws_appsync_graphqlEndpoint: endpoint,
  aws_appsync_region: "us-east-1",
  apiKey: null,
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
  API: {
    graphql_endpoint: endpoint,
    graphql_headers: async () => {
      let token = await Auth.currentSession();
      token = token.idToken.jwtToken;
      // console.log(token);
      return {
        Authorization: token
      };
    }
  }
});

export const AppSyncConfig = {
  //   "graphqlEndpoint": getEnvVars(Constants.manifest.releaseChannel),
  region: "us-east-1",
  authenticationType: "AMAZON_COGNITO_USER_POOLS",
  apiKey: null
};

// export const moodColors = {
//   1: "#EF5D60",
//   2: "#329F5B",
//   3: "#6A4C93",
//   4: "#1F487E",
//   5: "#151E3F"
// };

export const moodColors = {
  1: "#78c446",
  2: "#c5de44",
  3: "#face4a",
  4: "#f4a040",
  5: "#eb3944"
};

export const moodImages = {
  1: require("../assets/images/redesign/great-mood.png"),
  2: require("../assets/images/redesign/good-mood.png"),
  3: require("../assets/images/redesign/Okay-mood.png"),
  4: require("../assets/images/redesign/bad-mood.png"),
  5: require("../assets/images/redesign/awful-mood.png")
};

// export const moodImagesDark = {
//   1: require("./assets/images/rad-filled.png"),
//   2: require("./assets/images/good-filled.png"),
//   3: require("./assets/images/meh-filled.png"),
//   4: require("./assets/images/bad-filled.png"),
//   5: require("./assets/images/awful-filled.png")
// }

export const Moods = [
  {
    id: 1,
    src: require("../assets/images/redesign/great-mood.png"),
    name: "Great",
    color: moodColors[1],
    value: 5
  },
  {
    id: 2,
    src: require("../assets/images/redesign/good-mood.png"),
    name: "Good",
    color: moodColors[2],
    value: 4
  },
  {
    id: 3,
    src: require("../assets/images/redesign/Okay-mood.png"),
    name: "Okay",
    color: moodColors[3],
    value: 3
  },
  {
    id: 4,
    src: require("../assets/images/redesign/bad-mood.png"),
    name: "Bad",
    color: moodColors[4],
    value: 2
  },
  {
    id: 5,
    src: require("../assets/images/redesign/awful-mood.png"),
    name: "Awful",
    color: moodColors[5],
    value: 1
  }
];

export const moduleColors = {
  "Cognitive Restructuring": "#800080",
  "Errors in Thinking": "#228B22",
  "Applying CBT": "#FF6347",
  "Defining Problems, Identifying Solutions and Setting Goals": "#005B96",
  "Contacting the Present Moment": "#008A85",
  "Defusion (Watch your thinking)": "#F41B46"
};

export const flowConstants = {
  HOMEWORK: 0,
  ENTRY_FLOW: 1,
  EXERCISE: 2,
  ACT_MEASURE: 3,
  FOLLOW_UP: 4
};

export const followUpTypes = {
  PREDICTION: "prediction",
  THOUGHT: "thought"
};

export const actMeasureTypes = {
  WEEKLY: "Weekly",
  DAILY: "Daily"
};

export const timeLineItemTypes = {
  DATE_GROUP: "DateGroup",
  ENTRY: "Entry",
  EXERCISE: "Exercise",
  MEDITATION: "Meditations",
  PRACTICE_IDEAS: "Practice Ideas",
  ////
  HEALTHEXERCISE: "healthExercise",
  HEARTRATE: "heartRate",
  MINDFULNESSMINUTES: "mindfulnessMinutes",
  NUTRITION: "nutrition",
  SLEEP: "sleep"
};

export const preferenceTypes = {
  TYPE_ENTRY: "entry",
  TYPE_ENTRY_FLOW: "entry_flow"
};

export const favouriteTypes = {
  EXERCISE: "Exercise",
  LESSON: "Lesson",
  MEDITATION: "Meditation",
  PRACTICE_IDEA: "PracticeIdea"
};

export const communityTypes = {
  DISCUSSIONS: "discussions",
  PEER_GROUPS: "peerGroups"
};

export const asyncStorageConstants = {
  weeklyMeasures: function(currentDate = moment()) {
    return `@act${currentDate.format("ww YYYY")}`;
  },
  dailyMeasures: function(currentDate = moment()) {
    return `@act${currentDate.format("DD MMM YYYY")}`;
  },
  premiumStatus: "PREMIUM_STATUS",
  hasPremium: "HAS_PREMIUM",
  userInfo: "USER_INFO",
  clearLocalStorage: "CLEAR_LOCAL_STORAGE_1"
};

export const getMeditationAudioPath = filename => {
  return `${CONTENT_PATH}meditations/audio_files/${filename}.mp3`;
};

export const exerciseTypes = {
  MULTI_SELECT_WITH_RATING: "multiSelectWithRating",
  MULTI_SELECT_WITH_OPTIONS: "multiSelectWithOptions",
  MULTI_SELECT_WITH_DESC: "multiSelectWithDesc",
  RATING: "Rating",
  TEXT: "text",
  MULTI_SELECT: "multiSelect",
  RATING_DISCRETE: "RatingDiscrete",
  SINGLE_SELECT: "singleSelect",
  DISPLAY: "display",
  GROUP: "group",
  SINGLE_SELECT_WITH_FLOW: "singleSelectWithFlow",
  SINGLE_SELECT_WITH_RATING: "singleSelectWithRating",
  TEXT_VIEW: "textView",
  CHALLENGE: "challenge",
  CHECKLIST: "checklist",
  PRIORITY_RATING: "priorityRating",
  GROUPED_ITEMS: "groupedItems",
  AUDIO: "audio",
  FOLLOW: "followup"
};

export const exerciseIcons = {
  "abc.png": require("../src/icons/abc.png"),
  "black-white.png": require("../src/icons/black-white.png"),
  "confusion.png": require("../src/icons/confusion.png"),
  "exaggerate.png": require("../src/icons/exaggerate.png"),
  "evidence.png": require("../src/icons/evidence.png"),
  "negative-belief.png": require("../src/icons/negative-belief.png"),
  "acting-on-urges.png": require("../src/icons/acting-on-urges.png"),
  "ask-say-no.png": require("../src/icons/ask-say-no.png"),
  "balancing.png": require("../src/icons/balancing.png"),
  "behavior-change.png": require("../src/icons/behavior-change.png"),
  "being-doing.png": require("../src/icons/being-doing.png"),
  "body-sensation.png": require("../src/icons/body-sensation.png"),
  "challenge-myth.png": require("../src/icons/challenge-myth.png"),
  "challenge.png": require("../src/icons/challenge.png"),
  "change-emotion.png": require("../src/icons/change-emotion.png"),
  "change-face-temp.png": require("../src/icons/change-face-temp.png"),
  "check-facts.png": require("../src/icons/check-facts.png"),
  "checklist.png": require("../src/icons/checklist.png"),
  "crisis-skills.png": require("../src/icons/crisis-skills.png"),
  "crisis.png": require("../src/icons/crisis.png"),
  "dialectics.png": require("../src/icons/dialectics.png"),
  "distract.png": require("../src/icons/distract.png"),
  "distress-after.png": require("../src/icons/distress-after.png"),
  "distress-before.png": require("../src/icons/distress-before.png"),
  "effective.png": require("../src/icons/effective.png"),
  "emotion-analysis.png": require("../src/icons/emotion-analysis.png"),
  "emotion-does.png": require("../src/icons/emotion-does.png"),
  "emotion-myths.png": require("../src/icons/emotion-myths.png"),
  "how-skill.png": require("../src/icons/how-skill.png"),
  "icons8-bipolar_disease.png": require("../src/icons/icons8-bipolar_disease.png"),
  "icons8-drunk-100.png": require("../src/icons/icons8-drunk-100.png"),
  "imagination.png": require("../src/icons/imagination.png"),
  "IMPROVE-one.png": require("../src/icons/IMPROVE-one.png"),
  "IMPROVE.png": require("../src/icons/IMPROVE.png"),
  "intense-exercise.png": require("../src/icons/intense-exercise.png"),
  "like.png": require("../src/icons/like.png"),
  "loving-kindness.png": require("../src/icons/loving-kindness.png"),
  "mastery.png": require("../src/icons/mastery.png"),
  "meditation.png": require("../src/icons/meditation.png"),
  "middle-path.png": require("../src/icons/middle-path.png"),
  "mindful-one-skill.png": require("../src/icons/mindful-one-skill.png"),
  "mindful-others.png": require("../src/icons/mindful-others.png"),
  "mindful.png": require("../src/icons/mindful.png"),
  "nonjudgmental.png": require("../src/icons/nonjudgmental.png"),
  "notice.png": require("../src/icons/notice.png"),
  "observe-describe-participate.png": require("../src/icons/observe-describe-participate.png"),
  "observe-emotions.png": require("../src/icons/observe-emotions.png"),
  "odp-bs.png": require("../src/icons/odp-bs.png"),
  "opposite-action.png": require("../src/icons/opposite-action.png"),
  "outcome.png": require("../src/icons/outcome.png"),
  "paced-breathing.png": require("../src/icons/paced-breathing.png"),
  "paired-muslcle-relax.png": require("../src/icons/paired-muslcle-relax.png"),
  "participate.png": require("../src/icons/participate.png"),
  "pleasant.png": require("../src/icons/pleasant.png"),
  "priority.png": require("../src/icons/priority.png"),
  "prosCons.png": require("../src/icons/prosCons.png"),
  "punish.png": require("../src/icons/punish.png"),
  "radical-acceptance-one.png": require("../src/icons/radical-acceptance-one.png"),
  "radical-acceptance.png": require("../src/icons/radical-acceptance.png"),
  "rating-after.png": require("../src/icons/rating-after.png"),
  "rating-before.png": require("../src/icons/rating-before.png"),
  "rating.png": require("../src/icons/rating.png"),
  "resisting-urges.png": require("../src/icons/resisting-urges.png"),
  "rethink.png": require("../src/icons/rethink.png"),
  "script.png": require("../src/icons/script.png"),
  "select-skill.png": require("../src/icons/select-skill.png"),
  "self-respect.png": require("../src/icons/self-respect.png"),
  "self-soothe.png": require("../src/icons/self-soothe.png"),
  "sleep.png": require("../src/icons/sleep.png"),
  "stop-behavior.png": require("../src/icons/stop-behavior.png"),
  "STOP.png": require("../src/icons/STOP.png"),
  "text.png": require("../src/icons/text.png"),
  "TIP.png": require("../src/icons/TIP.png"),
  "tracking.png": require("../src/icons/tracking.png"),
  "troubleshoot.png": require("../src/icons/troubleshoot.png"),
  "unpleasant.png": require("../src/icons/unpleasant.png"),
  "validate.png": require("../src/icons/validate.png"),
  "values-action-steps.png": require("../src/icons/values-action-steps.png"),
  "vulnerability.png": require("../src/icons/vulnerability.png"),
  "what-skill.png": require("../src/icons/what-skill.png"),
  "wise-mind.png": require("../src/icons/wise-mind.png"),
  "wise-mind.png": require("../src/icons/wise-mind.png"),
  "abstinence.png": require("../src/icons/abstinence.png"),
  "adaptive-denial.png": require("../src/icons/adaptive-denial.png"),
  "bridge.png": require("../src/icons/bridge.png"),
  "clear-clean-mind.png": require("../src/icons/clear-clean-mind.png"),
  "half-smile.png": require("../src/icons/half-smile.png"),
  "mindful-current.png": require("../src/icons/mindful-current.png"),
  "mindful-thoughts.png": require("../src/icons/mindful-thoughts.png"),
  "reality-acceptance.png": require("../src/icons/reality-acceptance.png"),
  "reality-acceptance-one.png": require("../src/icons/reality-acceptance-one.png"),
  "reinforce.png": require("../src/icons/reinforce.png"),
  "addiction.png": require("../src/icons/addiction.png"),
  "distract.png": require("../src/icons/distract.png"),
  "turning-mind.png": require("../src/icons/turning-mind.png"),
  "distract-one.png": require("../src/icons/distract-one.png"),
  "audio.png": require("../src/icons/audio.png"),
  "all-or-nothing.png": require("../src/icons/all-or-nothing.png"),
  "blaming.png": require("../src/icons/blaming.png"),
  "catastrophizing.png": require("../src/icons/catastrophizing.png"),
  "emotional-reasoning.png": require("../src/icons/emotional-reasoning.png"),
  "fortune-telling.png": require("../src/icons/fortune-telling.png"),
  "labeling.png": require("../src/icons/labeling.png"),
  "magnification.png": require("../src/icons/magnification.png"),
  "mind-reading.png": require("../src/icons/mind-reading.png"),
  "over-generalization.png": require("../src/icons/over-generalization.png"),
  "should-statements.png": require("../src/icons/should-statements.png"),
  "willing.png": require("../src/icons/willing.png"),
  "thought.png": require("../src/icons/thought.png"),
  "how.png": require("../src/icons/how.png"),
  "practice.png": require("../src/icons/practice.png"),
  "prompting-event.png": require("../src/icons/prompting-event.png"),
  "goal.png": require("../src/icons/goal.png"),
  "desire.png": require("../src/icons/desire.png"),
  "interpersonal.png": require("../src/icons/interpersonal.png"),
  "thumbs-up.png": require("../src/icons/thumbs-up.png"),
  "thumbs-down.png": require("../src/icons/thumbs-down.png"),
  "long-term.png": require("../src/icons/long-term.png"),
  "five-years-now.png": require("../src/icons/five-years-now.png"),
  "activity-1.png": require("../src/icons/activity-1.png"),
  "activity-2.png": require("../src/icons/activity-2.png"),
  "running.png": require("../src/icons/running.png"),
  "food.png": require("../src/icons/food.png"),
  "location.png": require("../src/icons/location.png"),
  "vomit.png": require("../src/icons/vomit.png"),
  "prediction.png": require("../src/icons/prediction.png"),

};

export const peerGroupImages = {
  0: require("../assets/images/peerGroups/beach.jpeg"),
  1: require("../assets/images/peerGroups/beach-house.jpeg"),
  2: require("../assets/images/peerGroups/cave.jpeg"),
  3: require("../assets/images/peerGroups/direction.jpeg"),
  4: require("../assets/images/peerGroups/evening.jpeg"),
  5: require("../assets/images/peerGroups/field.jpeg"),
  6: require("../assets/images/peerGroups/monument.jpeg"),
  7: require("../assets/images/peerGroups/mountain-top.jpeg"),
  8: require("../assets/images/peerGroups/mountain.jpeg"),
  9: require("../assets/images/peerGroups/nature-1.jpeg"),
  10: require("../assets/images/peerGroups/nature-10.jpeg"),
  11: require("../assets/images/peerGroups/nature-2.jpg"),
  12: require("../assets/images/peerGroups/nature-3.jpeg"),
  13: require("../assets/images/peerGroups/nature-4.jpeg"),
  14: require("../assets/images/peerGroups/nature-5.jpeg"),
  15: require("../assets/images/peerGroups/nature-6.jpeg"),
  16: require("../assets/images/peerGroups/nature-7.jpeg"),
  17: require("../assets/images/peerGroups/nature-8.jpeg"),
  18: require("../assets/images/peerGroups/nature-9.jpeg"),
  19: require("../assets/images/peerGroups/nature.jpeg"),
  20: require("../assets/images/peerGroups/peak.jpeg")
};
