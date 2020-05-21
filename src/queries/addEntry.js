import gql from "graphql-tag";

export const addEntryQuery = gql`
  mutation addEntryQuery($entry: AddEntryInput!) {
    addEntry(entry: $entry) {
      id
    }
  }
`;
