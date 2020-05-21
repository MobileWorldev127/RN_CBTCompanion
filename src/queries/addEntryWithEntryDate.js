import gql from "graphql-tag";

export const addEntryQuery = gql`
  mutation addEntryQuery($EntryDate: String!, $entry: EntryInput!) {
    addEntry(EntryDate: $EntryDate, entry: $entry) {
      msg
    }
  }
`;
