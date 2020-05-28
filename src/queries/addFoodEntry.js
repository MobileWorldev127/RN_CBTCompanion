import gql from "graphql-tag";

export const addFoodEntryMutation = gql`
  mutation addFoodEntry($input: FoodInput!) {
    addFoodEntry(input:$input) {
      success
      message
    }
  }
`;
