import gql from "graphql-tag";

export const deleteEntryQuery = gql`
  mutation deleteEntry($id: String!) {
    deleteEntry(id: $id) {
      id
    }
  }
`;

export const deleteEntryQueryByDate = gql`
  mutation deleteEntry($EntryDate: String!, $timestamp: String!) {
    deleteEntry(EntryDate: $EntryDate, timestamp: $timestamp) {
      msg
    }
  }
`;

export const deleteFoodEntryQuery = gql`
  mutation deleteEntry($entryType: HealthKitTypes!, $entryId: ID!) {
    deleteEntry(entryType: $entryType, entryId: $entryId) {
      success
      message
    }
  }
`;

export const deleteExerciseEntryQuery = gql`
  mutation deleteEntry($entryType: HealthKitTypes!, $entryId: ID!) {
    deleteEntry(entryType: $entryType, entryId: $entryId) {
      success
      message
    }
  }
`;
