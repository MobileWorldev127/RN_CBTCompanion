import gql from "graphql-tag";

export const addFoodEntryQuery = gql`
  mutation addFoodEntry($dateTime: String!, $meal: String!, $details:[FoodEntryInput!]) {
    addFoodEntry(input:{
      source:Nutritionix,
      dateTime: $dateTime,
      meal: $meal,
      details: $details
    }) {
      success
      message
    }
  }
`;
