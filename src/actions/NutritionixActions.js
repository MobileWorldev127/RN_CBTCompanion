import { setLoading } from "./AppActions";
import { client, swasthCommonsClient } from "../App";
import { addFoodEntryQuery } from "../queries/addFoodEntry";

import Amplify from "aws-amplify";
import { getAmplifyConfig, getEnvVars } from "../constants";
import { API, graphqlOperation } from "aws-amplify";

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
    dispatch(setLoading(true));
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
        // reject(err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
};

export function getNutritionixNutrientsFoodList(querytxt, foodData) {
  console.log(querytxt)
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
        console.log("===>")
        console.log(data)
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


export function addFoodEntry(entry, foodEntryData) {
  return function(dispatch, state) {
    
    dispatch(setLoading(true));
    Amplify.configure(
      getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
    );
    
    let variables = {
      dateTime:"2020-05-26",
      meal:"Breakfast1111",
      details:[
        {
          name:"Chicken Soup",
          qty:2,
          unit: "cup",
          weight_grams: 30,
          macroNutrients: "{\"calories\":62}",
          microNutrients:[
            {
                attr_id: 203,
                value: 3.1496
            }
          ]
        }
      ],
    };
    console.log("--Submitting homework--", variables);
    API.graphql(graphqlOperation(addFoodEntryQuery, variables))
      .then(data => {
        console.log('@@@@@@@@@@@@@@@@@-- true')
        console.log(data);
      })
      .catch(err => {
        console.log('@@@@@@@@@@@@@@@@@-- false')
        console.log(err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
};

