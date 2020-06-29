import gql from "graphql-tag";

export const getEntriesQuery = gql`
  query getEntries($startDate: String!, $endDate: String!) {
    getEntriesFromTo(startDate: $startDate, endDate: $endDate) {
      numOfEntries
      numOfExercises
      entries {
        entryDate
        entries {
          id
          mood
          dateTime
          exercise {
            id
            module
            title
            color
            sequence
            description
            example {
              key
              value
            }
          }
          emotions {
            emotion {
              id
              name
              color
            }
            intensity
          }
          medication
          bedTime
          wakeTime
          sleepTime
          journal {
            text
            assets {
              images
              videos
              audios
            }
          }
        }
      }
    }
  }
`;

export const getFoodEntriesquery = gql`
  query getFoodEntries($startDate: String!, $endDate: String!) {
    getFoodEntries(startDate: $startDate, endDate: $endDate) {
      _id
      userId
      source
      dateTime
      meal
      details {
        name
        brand
        qty
        unit
        weight_grams
        macroNutrients
        microNutrients {
          usda_tag
          name
          unit
          value
        }
      }
    }
  }
`;

export const getExerciseEntriesquery = gql`
  query getExerciseEntries($startDate: String!, $endDate: String!) {
    getExerciseEntries(startDate: $startDate, endDate: $endDate) {
      _id
      userId
      source
      dateTime
      details {
        name
        duration_min
        calories
        compendium_code
        met
        steps
        distance
      }
    }
  }
`;


export const getSleepEntriesquery = gql`
  query getSleepEntries($startDate: String!, $endDate: String!) {
    getSleepEntries(startDate: $startDate, endDate: $endDate) {
      _id
      userId
      source
      dateTime
      bed_time
      wake_time
      duration_min
      sleep_analysis {
        start_time
        end_time
        asleep
        rating
        energy_threshold
        deep_sleep
        average_hr
        recharge
      }
    }
  }
`;