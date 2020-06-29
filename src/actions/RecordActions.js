import { setLoading } from "./AppActions";
import { client } from "../App";
import { addUserExerciseMutation } from "../queries/addUserExercise";
import { showMessage } from "react-native-flash-message";
import { errorMessage } from "../utils";
import { addUserMeasureQuery } from "../queries/addUserMeasure";
import { actMeasureTypes } from "../constants";
import moment from "moment";
import { editUserExerciseMutation } from "../queries/editUserExercise";
import { getTimeLineViewQuery } from "../queries/getTimeLineView";
import { getMonthRange } from "../utils/DateTimeUtils";
import { v4 as uuid } from "uuid";
import { getUserExerciseQuery } from "../queries/getUserExercise";
import _ from "lodash";
import { addEntryQuery } from "../queries";
import bugsnagClient from "../utils/Bugsnag";


export const ACTION_TYPES = {
  ADD_COMPLETED_EXERCISE: "ADD_COMPLETED_EXERCISE",
  SET_EDIT_ENTRY: "SET_EDIT_ENTRY",
  SET_MOOD: "SET_MOOD",
  SET_EMOTIONS: "SET_EMOTIONS",
  SET_SLEEP: "SET_SLEEP",
  SET_JOURNAL: "SET_JOURNAL",
  ADD_DATA_TO_CURRENT_EXERCISE: "",
  SET_CURRENT_EXERCISE: "SET_CURRENT_EXERCISE",
  SET_CURRENT_ACT_MEASURE: "SET_CURRENT_ACT_MEASURE",
  SET_COMPLETED_ACT_MEASURE: "SET_COMPLETED_ACT_MEASURE",
  CLEAR_STATE: "CLEAR_STATE"
};

export const addCompletedExercise = exercise => ({
  type: ACTION_TYPES.ADD_COMPLETED_EXERCISE,
  payload: exercise
});

export const setEditEntry = entry => ({
  type: ACTION_TYPES.SET_EDIT_ENTRY,
  payload: entry
});

export const setMood = (mood, timestamp, isEdit, entryID) => ({
  type: ACTION_TYPES.SET_MOOD,
  payload: {
    mood,
    timestamp,
    isEdit,
    entryID
  }
});

export const setEmotions = emotions => ({
  type: ACTION_TYPES.SET_EMOTIONS,
  payload: emotions
});

export const setSleepData = sleepData => ({
  type: ACTION_TYPES.SET_SLEEP,
  payload: sleepData
});

export const setJournalData = journalData => ({
  type: ACTION_TYPES.SET_JOURNAL,
  payload: journalData
});

export const setCurrentExercise = (currentExercise, flowType) => ({
  type: ACTION_TYPES.SET_CURRENT_EXERCISE,
  payload: { currentExercise, flowType }
});

export const clearState = () => ({
  type: ACTION_TYPES.CLEAR_STATE
});

export const setCurrentACTMeasure = currentACTMeasure => ({
  type: ACTION_TYPES.SET_CURRENT_ACT_MEASURE,
  payload: {
    currentACTMeasure: currentACTMeasure
  }
});

export const setCompletedACTMeasure = type =>
  type === actMeasureTypes.WEEKLY
    ? {
        type: ACTION_TYPES.SET_COMPLETED_ACT_MEASURE,
        payload: {
          isWeeklyAdded: true
        }
      }
    : {
        type: ACTION_TYPES.SET_COMPLETED_ACT_MEASURE,
        payload: {
          isDailyAdded: true
        }
      };

export const addUserExercise = (exerciseInput, onExerciseAdded) => {
  return function(dispatch, state) {
    dispatch(setLoading(true));
    let variables = {
      input: exerciseInput
    };
    console.log("--Adding exercise--", variables);
    client
      .mutate({
        mutation: addUserExerciseMutation,
        variables: variables,
        optimisticResponse: () => ({
          addUserExercise: {
            ...exerciseInput,
            id: exerciseInput.dateTime,
            __typename: "UserExercise"
          }
        }),
        update: (cache, res) => {
          console.log("RESPONSE", res);
          console.log("CACHE", cache);
          const input = _.cloneDeep(res.data.addUserExercise);
          input.details = addTypeNamesToDetails(input.details);
          console.log("WRITING USER EXERCISE", input);
          cache.writeQuery({
            query: getUserExerciseQuery,
            variables: { id: input.id },
            data: {
              getUserExercise: input
            }
          });
          let data = null;
          try {
            data = cache.readQuery({
              query: getTimeLineViewQuery,
              variables: getMonthRange(moment())
            });
          } catch (err) {
            data = {
              getTimeLineView: null
            };
          }
          console.log("CACHE TIMELINE", data);
          const isChallengeExercise =
            input.title == "Challenge Automatic Thought";
          const isPrediction = input.title == "Prediction";
          const timeLineObject = {
            date: moment().format("YYYY-MM-DD"),
            entries: [],
            exercises: !isChallengeExercise && !isPrediction ? [input] : [],
            meditations: [],
            practiceIdeas: [],
            predictions: isPrediction ? [input] : [],
            challengeExercises: isChallengeExercise ? [input] : [],
            __typename: "TimeLine"
          };
          if (data && data.getTimeLineView && data.getTimeLineView.length) {
            let dateExists = false;
            data.getTimeLineView.forEach(element => {
              if (element.date === moment().format("YYYY-MM-DD")) {
                if (isChallengeExercise) {
                  if (
                    element.challengeExercises &&
                    element.challengeExercises.length
                  ) {
                    element.challengeExercises.push(input);
                  } else {
                    element.challengeExercises = [input];
                  }
                } else if (isPrediction) {
                  if (element.predictions && element.predictions.length) {
                    element.predictions.push(input);
                  } else {
                    element.predictions = [input];
                  }
                } else {
                  if (element.exercises && element.exercises.length) {
                    element.exercises.push(input);
                  } else {
                    element.exercises = [input];
                  }
                }
                dateExists = true;
              }
            });
            if (!dateExists) {
              data.getTimeLineView.unshift(timeLineObject);
            }
          } else {
            data.getTimeLineView = [timeLineObject];
          }
          cache.writeQuery({
            query: getTimeLineViewQuery,
            variables: getMonthRange(moment()),
            data
          });
        }
      })
      .then(data => {
        console.log(data);
        dispatch(setLoading(false));
        if (onExerciseAdded) {
          onExerciseAdded(data);
        }
      })
      .catch(err => {
        console.log(err);
        console.log(err);
        bugsnagClient.leaveBreadcrumb("Add exercise failed");
        bugsnagClient.notify(err);
        dispatch(setLoading(false));
        showMessage(errorMessage("Failed to save exercise. Please try again."));
      });
  };
};

export const editUserExercise = (
  userExerciseId,
  exerciseInput,
  onExerciseUpdated
) => {
  return function(dispatch, state) {
    dispatch(setLoading(true));
    let variables = {
      id: userExerciseId,
      input: exerciseInput
    };
    console.log("--Editing exercise--", variables);
    client
      .mutate({
        mutation: editUserExerciseMutation,
        variables: variables
      })
      .then(data => {
        console.log(data);
        dispatch(setLoading(false));
        if (onExerciseUpdated) {
          onExerciseUpdated(data);
        }
      })
      .catch(err => {
        console.log(err);
        dispatch(setLoading(false));
        showMessage(
          errorMessage("Failed to update exercise. Please try again.")
        );
      });
  };
};

export const addUserMeasure = (measureInput, onMeasureAdded) => {
  return function(dispatch, state) {
    dispatch(setLoading(true));
    let variables = {
      input: measureInput
    };
    console.log("--Adding measure--", variables);
    client
      .mutate({
        mutation: addUserMeasureQuery,
        variables: variables
      })
      .then(data => {
        console.log(data);
        dispatch(setLoading(false));
        if (onMeasureAdded) {
          onMeasureAdded(data);
        }
      })
      .catch(err => {
        console.log(err);
        dispatch(setLoading(false));
        showMessage(errorMessage("Failed to save data. Please try again."));
      });
  };
};

const addTypeNamesToDetails = details => {
  if (!details) {
    return null;
  }
  details = details.map(item => {
    const data = {
      ...item,
      __typename: "UserExerciseDetails"
    };
    if (item.scale) {
      data.scale = {
        ...item.scale,
        __typename: "ExerciseScale"
      };
    }
    if (item.options) {
      data.options = item.options.map(option => ({
        ...option,
        __typename: "ExerciseOptions"
      }));
    }
    data.value = {
      ...item.value,
      intValues: (item.value && item.value.intValues) || [],
      stringValues: (item.value && item.value.stringValues) || [],
      booleanValues: (item.value && item.value.booleanValues) || [],
      keyValues:
        (item.value &&
          item.value.keyValues &&
          item.value.keyValues.map(keyValue => ({
            key: {
              ...keyValue.key,
              __typename: "LookupValue"
            },
            value: keyValue.value,
            __typename: "KeyValue"
          }))) ||
        [],
      __typename: "ExerciseValue"
    };
    if (item.details) {
      data.details = addTypeNamesToDetails(item.details);
    }
    return data;
  });
  return details;
};

export const addEntry = entry => {
  return client.mutate({
    variables: {
      entry
    },
    mutation: addEntryQuery,
    optimisticResponse: () => ({
      addEntry: {
        msg: "offline",
        id: entry.dateTime,
        entry: {
          ...entry,
          id: entry.dateTime,
          __typename: "Entry"
        }
      }
    }),
    update: (cache, res) => {
      console.log("RESPONSE", res);
      console.log("CACHE", cache);
      const input = _.cloneDeep(res.data.addEntry);
      if (!input.entry || input.msg !== "offline") {
        return;
      }
      let data = null;
      try {
        data = cache.readQuery({
          query: getTimeLineViewQuery,
          variables: getMonthRange(moment(input.entry.entryDate, "YYYY-MM-DD"))
        });
      } catch (err) {
        data = {
          getTimeLineView: null
        };
      }
      // input.entry.targets = input.entry.targets.map(item => ({
      //   target: {
      //     ...item.target,
      //     __typename: "Target"
      //   },
      //   __typename: "TargetEntry",
      //   value: true
      // }));
      input.entry.emotions = input.entry.emotions.map(item => ({
        emotion: {
          ...item.emotion,
          __typename: "LookupValue"
        },
        intensity: item.intensity,
        __typename: "Emotions"
      }));
      if (input.entry.journal) {
        input.entry.journal.__typename = "Journal";
        input.entry.journal.assets = input.entry.journal.assets.map(item => ({
          ...item,
          __typename: "JournalAsset"
        }));
      } else {
        input.entry.journal = {
          assets: [
            {
              images: [],
              videos: [],
              audios: [],
              __typename: "JournalAsset"
            }
          ],
          text: "",
          __typename: "Journal"
        };
      }
      console.log("CACHE TIMELINE", data);
      const timeLineObject = {
        date: input.entry.entryDate,
        entries: [input.entry],
        exercises: [],
        meditations: [],
        practiceIdeas: [],
        __typename: "TimeLine"
      };
      if (data && data.getTimeLineView && data.getTimeLineView.length) {
        let dateExists = false;
        data.getTimeLineView.forEach(element => {
          if (element.date === input.entry.entryDate) {
            if (element.entries && element.entries.length) {
              element.entries.unshift(input.entry);
            } else {
              element.entries = [input.entry];
            }
            dateExists = true;
          }
        });
        if (!dateExists) {
          data.getTimeLineView.unshift(timeLineObject);
        }
      } else {
        data.getTimeLineView = [timeLineObject];
      }
      console.log("WRITING QUERY", data);
      cache.writeQuery({
        query: getTimeLineViewQuery,
        variables: getMonthRange(moment(input.entry.entryDate, "YYYY-MM-DD")),
        data
      });
    }
  });
};
