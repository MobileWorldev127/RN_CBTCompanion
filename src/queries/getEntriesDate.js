import gql from "graphql-tag";

export const getEntriesDateQuery = gql`
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
        }
      }
    }
  }
`;
