import gql from "graphql-tag";

export const addEntryQuery = gql`
  mutation addEntryQuery($entry: AddEntryInput!) {
    addEntry(entry: $entry) {
      id
    }
  }
`;

export const addFoodEntryMutation = gql`
  mutation addFoodEntry($input: FoodInput!) {
    addFoodEntry(input: $input) {
      success
      message
    }
  }
`;

export const addExerciseEntryMutation = gql`
  mutation addExerciseEntry($input: HealthExerciseInput!) {
    addExerciseEntry(input: $input) {
      success
      message
    }
  }
`;
