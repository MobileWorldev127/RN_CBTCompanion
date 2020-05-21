import gql from "graphql-tag";

export const patchEntryQuery = gql`
  mutation patchEntryQuery($EntryDate: String!, $entry: EntryInput!) {
    patchEntry(EntryDate: $EntryDate, entry: $entry) {
      msg
    }
  }
`;
