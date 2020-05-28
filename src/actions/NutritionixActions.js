import { setLoading } from "./AppActions";
import { client, swasthCommonsClient } from "../App";
import { addFoodEntryMutation } from "../queries/addFoodEntry";
import { getFoodEntriesquery } from "../queries/getFoodEntries";
import { deleteFoodEntryQuery } from "../queries/deleteFoodEntry";

import Amplify from "aws-amplify";
import { getAmplifyConfig, getEnvVars } from "../constants";
import { API, graphqlOperation } from "aws-amplify";
let moment = require("moment");

const NUTRITIONIX_INSTANT_SUCCESS = "NUTRITIONIX_INSTANT_SUCCESS";

const BASE_URL = 'https://trackapi.nutritionix.com/v2/';
const INSTANT = 'search/instant';
const ITEM = 'search/item';
const NUTIENTS = 'natural/nutrients'
const nutritionix_id = '7ff2fd49';
const nutritionix_key = '884a94b05d6044a0e241747c7496dc2a';


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
  console.log('------------->')
  console.log(dateTime)
  return function(dispatch, state) {
    // dispatch(setLoading(true));
    Amplify.configure(
      getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
    );

    let variables = {
      dateTime: dateTime,
      meal: title,
      source: "Nutritionix",
      details: [
        {
          name: entry.food_name,
          qty: entry.serving_qty,
          unit: entry.serving_unit,
          weight_grams: entry.serving_weight_grams,
          macroNutrients: JSON.stringify({
            calories: entry.nf_calories,
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
        console.log(data)
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
}
