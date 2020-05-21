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
