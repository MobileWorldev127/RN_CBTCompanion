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

export const addSleepMutation = gql`
  mutation addSleepEntry($input: SleepInput!) {
    addSleepEntry(input: $input) {
      success
      message
    }
  }
`;

export const addMindfulnessMinutesMutation = gql`
  mutation addMindfulnessMinutes($input: MindfulnessMinutesInput!) {
    addMindfulnessMinutes(input: $input) {
      success
      message
    }
  }
`;

export const logAppleDataMutation = gql`
  mutation logAppleData($input: AppleDataInput!) {
    logAppleData(input: $input) {
      success
      message
    }
  }
`;

export const upsertHealthKitSourceSettings = gql`
  mutation upsertHealthKitSourceSettings(
    $settings: [HealthSourceSettingInput!]!
    $fitbitToken: String!
  ) {
    upsertHealthKitSourceSettings(
      settings: $settings
      fitbitToken: $fitbitToken
    ) {
      sourceType
      source
    }
  }
`;
