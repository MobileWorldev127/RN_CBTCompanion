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
