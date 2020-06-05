import { setLoading } from "./AppActions";
import { addFoodEntryMutation, addExerciseEntryMutation, addSleepMutation } from "../queries/addEntry";
import { deleteFoodEntryQuery, deleteExerciseEntryQuery, deleteSleepEntryQuery } from "../queries/deleteEntry";
import { getFoodEntriesquery, getExerciseEntriesquery, getSleepEntriesquery } from "../queries/getEntries";

import Amplify from "aws-amplify";
import { getAmplifyConfig, getEnvVars } from "../constants";
import { API, graphqlOperation } from "aws-amplify";
let moment = require("moment");

const NUTRITIONIX_INSTANT_SUCCESS = "NUTRITIONIX_INSTANT_SUCCESS";

const BASE_URL = 'https://trackapi.nutritionix.com/v2/';
const INSTANT = 'search/instant';
const ITEM = 'search/item';
const NUTIENTS = 'natural/nutrients'
const EXERCISE = 'natural/exercise';
const nutritionix_id = 'd794dc87';
const nutritionix_key = '46f56da4bf658b1dfa9c2ce9e0f45cb1';


export function getNutritionixInstantFoodListSuccess(response) {
  return {
    type: NUTRITIONIX_INSTANT_SUCCESS,
    payload: response
  };
}

export function getNutritionixInstantFoodList(query, foodData) {
  return function(dispatch, state) {
    // dispatch(setLoading(true));
    fetch(BASE_URL + INSTANT + '?query=' + query, {
      method: "GET",
      headers: {
        "x-app-id": nutritionix_id,
        "x-app-key": nutritionix_key
      },
    })
      .then(res => res.json())
      .then(data => {
        if (foodData) {
          foodData(data);
        }
      })
      .catch(err => {
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
};

export function getNutritionixNutrientsFoodList(querytxt, foodData) {
  return function(dispatch, state) {
    dispatch(setLoading(true));
    fetch(BASE_URL + NUTIENTS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-app-id": nutritionix_id,
        "x-app-key": nutritionix_key
      },
      body: JSON.stringify({
        query: querytxt
      })
    })
      .then(res => res.json())
      .then(data => {
        if (foodData) {
          foodData(data);
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
};

export function getNutritionixFoodItem(itemId, foodData) {
  return function(dispatch, state) {
    dispatch(setLoading(true));
    fetch(BASE_URL + ITEM + '?nix_item_id=' + itemId, {
      method: "GET",
      headers: {
        "x-app-id": nutritionix_id,
        "x-app-key": nutritionix_key
      },
    })
      .then(res => res.json())
      .then(data => {
        if (foodData) {
          foodData(data);
        }
      })
      .catch(err => {
        // reject(err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
};


export function addFoodEntry(entry, title, dateTime, foodEntryData) {
  return function(dispatch, state) {
    // dispatch(setLoading(true));
    Amplify.configure(
      getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
    );

    let variables = {};

    if (title === 'Water') {
      variables = {
        dateTime: dateTime,
        meal: title,
        source: "Nutritionix",
        details: [
          {
            name: entry.name,
            qty: entry.qty,
            unit: entry.unit,
            microNutrients: [
              {
                attr_id: 255,
                value: entry.total_water
              }
            ]
          }
        ],
      };
    }
    else {
      variables = {
        dateTime: dateTime,
        meal: title,
        source: "Nutritionix",
        details: [
          {
            name: entry.food_name,
            qty: entry.serving_qty,
            unit: entry.serving_unit,
            weight_grams: Math.round(entry.serving_weight_grams),
            macroNutrients: JSON.stringify({
              calories: Math.round(entry.nf_calories),
              total_fat: entry.nf_total_fat,
              saturated_fat: entry.nf_saturated_fat,
              cholesterol: entry.nf_cholesterol,
              sodium: entry.nf_sodium,
              total_carbohydrate: entry.nf_total_carbohydrate,
              dietary_fiber: entry.nf_dietary_fiber,
              sugars: entry.nf_sugars,
              protein: entry.nf_protein,
              potassium: entry.nf_potassium,
              P: 42.16
  
            }),
            microNutrients: entry.full_nutrients
          }
        ],
      };
    }
    API.graphql({
      query: addFoodEntryMutation,
      variables: {
        input: variables
      }
    })
      .then(data => {
        if (foodEntryData){
          foodEntryData(data.data);
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        // dispatch(setLoading(false));
      });
  };
};


export function getFoodEntries(date, fetchData) {
  return function(dispatch, state) {
    dispatch(setLoading(true));
    Amplify.configure(
      getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
    );
    API.graphql({
      query: getFoodEntriesquery,
      variables: {
        startDate: date,
        endDate: date
      }
    })
      .then(data => {
        if (fetchData){
          fetchData(data.data.getFoodEntries);
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
}

export function deleteFoodEntries(entryId, fetchData) {
  return function(dispatch, state) {
    dispatch(setLoading(true));
    Amplify.configure(

      getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
    );
    API.graphql({
      query: deleteFoodEntryQuery,
      variables: {
        entryType: "Nutrition",
        entryId: entryId
      }
    })
      .then(data => {
        if (fetchData){
          fetchData(data.data.deleteEntry);
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
}

export function getNutritionixExercise(query, exerciseData) {
  return function(dispatch, state) {
    // dispatch(setLoading(true));
    fetch(BASE_URL + EXERCISE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-app-id": nutritionix_id,
        "x-app-key": nutritionix_key
      },
      body: JSON.stringify({
        query: query.query
      })
    })
      .then(res => res.json())
      .then(data => {
        if (exerciseData) {
          exerciseData(data);
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        // dispatch(setLoading(false));
      });
  };
};

export function addExerciseEntry(entry, dateTime, exerciseEntryData) {
  console.log(entry)
  return function(dispatch, state) {
    // dispatch(setLoading(true));
    Amplify.configure(
      getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
    );

    let variables = {};
    variables = {
      dateTime: dateTime,
      source: "Manual",
      details: [
        {
          name: entry.name,
          duration_min: Math.round(entry.duration_min),
          calories: Math.round(entry.nf_calories),
        }
      ],
    };
    API.graphql({
      query: addExerciseEntryMutation,
      variables: {
        input: variables
      }
    })
      .then(data => {
        if (exerciseEntryData) {
          exerciseEntryData(data.data.addExerciseEntry);
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        // dispatch(setLoading(false));
      });
  };
};

export function deleteExerciseEntries(entryId, fetchData) {
  return function(dispatch, state) {
    dispatch(setLoading(true));
    Amplify.configure(
      getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
    );
    API.graphql({
      query: deleteExerciseEntryQuery,
      variables: {
        entryType: "Exercise",
        entryId: entryId
      }
    })
      .then(data => {
        if (fetchData) {
          fetchData(data.data.deleteEntry);
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
}

export function getExerciseEntries(date, fetchData) {
  return function(dispatch, state) {
    dispatch(setLoading(true));
    Amplify.configure(
      getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
    );
    API.graphql({
      query: getExerciseEntriesquery,
      variables: {
        startDate: date,
        endDate: date
      }
    })
      .then(data => {
        if (fetchData){
          fetchData(data.data.getExerciseEntries);
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
}

export function addSleepEntry(entry, dateTime, sleepEntryData) {
  return function(dispatch, state) {
    dispatch(setLoading(true));
    Amplify.configure(
      getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
    );

    let variables = {};
    variables = {
      dateTime: dateTime,
      source: "Manual",
      bed_time: entry.bed_time,
      wake_time: entry.wake_time,
      duration: entry.duration,
      duration_min: entry.duration_min,
      sleep_analysis: [],
    };
    API.graphql({
      query: addSleepMutation,
      variables: {
        input: variables
      }
    })
      .then(data => {
        if (sleepEntryData){
          sleepEntryData(data.data);
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
};

export function deleteSleepEntries(entryId, fetchData) {
  return function(dispatch, state) {
    dispatch(setLoading(true));
    Amplify.configure(
      getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
    );
    API.graphql({
      query: deleteSleepEntryQuery,
      variables: {
        entryType: "Sleep",
        entryId: entryId
      }
    })
      .then(data => {
        if (fetchData) {
          fetchData(data.data.deleteEntry);
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
}

export function getSleepEntries(date, fetchData) {
  return function(dispatch, state) {
    dispatch(setLoading(true));
    Amplify.configure(
      getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
    );
    API.graphql({
      query: getSleepEntriesquery,
      variables: {
        startDate: date,
        endDate: date
      }
    })
      .then(data => {
        if (fetchData){
          fetchData(data.data.getExerciseEntries);
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
}