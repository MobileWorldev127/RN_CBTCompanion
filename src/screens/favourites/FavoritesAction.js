import Amplify, { API } from "aws-amplify";
import { getAmplifyConfig, getEnvVars, APP } from "../../constants";
import { addFavourite } from "../../queries/favorites";

export const addItemToFavorites = (type, title, id, onItemAdded) => {
  Amplify.configure(getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL));
  let variables = {
    app: APP.swasthApp,
    input: [
      {
        type,
        id,
        title
      }
    ]
  };
  console.log("ADDING FAVORITE", variables);
  API.graphql({
    query: addFavourite,
    variables: variables
  })
    .then(res => {
      console.log(res.data);
      if (res.data && res.data.addFavourite) {
        onItemAdded(true);
      } else {
        onItemAdded(false);
      }
    })
    .catch(err => {
      console.log(err);
      onItemAdded(false);
    });
};
