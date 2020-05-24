const NUTRITIONIX_INSTANT_SUCCESS = "NUTRITIONIX_INSTANT_SUCCESS";

const BASE_URL = 'https://trackapi.nutritionix.com/v2/search/';
const INSTANT = 'instant';
const nutritionix_id = '7ff2fd49';
const nutritionix_key = '884a94b05d6044a0e241747c7496dc2a';


export function getNutritionixInstantFoodListSuccess(response) {
  return {
    type: NUTRITIONIX_INSTANT_SUCCESS,
    payload: response
  };
}

export function getNutritionixInstantFoodList(query, data) {
  return function(dispatch, state) {
    dispatch(setLoading(true));
    fetch(BASE_URL + INSTANT, {
      method: "GET",
      headers: {
        "x-app-id": nutritionix_id,
        "x-app-key": nutritionix_key
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log('======>>>')
        if (data) {
          data(data);
        }
        resolve(data);
      })
      .catch(err => {
        reject(err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });;



    // let variables = {
    //   homeworkId: homeworkID ? homeworkID : state().homework.currentHomework.id,
    //   appId: getEnvVars().appId,
    //   input: homeworkInput
    //     ? homeworkInput
    //     : {
    //         id: submitID,
    //         title: state().homework.currentHomeworkItem.title,
    //         type: state().homework.currentHomeworkItem.type,
    //         homeworkItemId: state().homework.currentHomeworkItem.id
    //       }
    // };
    // console.log("--Submitting homework--", variables);
    // API.graphql(graphqlOperation(submitHomeworkMutation, variables))
    //   .then(data => {
    //     console.log(data);
    //     if (onSubmitted) {
    //       onSubmitted(data);
    //     }
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   })
    //   .finally(() => {
    //     dispatch(setLoading(false));
    //   });
  };
}

