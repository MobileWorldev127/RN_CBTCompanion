import gql from "graphql-tag";

export const deleteFoodEntryQuery = gql`
  mutation deleteEntry($entryType: HealthKitTypes!, $entryId: ID!) {
    deleteEntry(entryType: $entryType, entryId: $entryId) {
      success
      message
    }
  }
`;