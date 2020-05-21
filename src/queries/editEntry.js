import gql from "graphql-tag";

export const editEntryQuery = gql`
  mutation editEntry($id: String!, $entry: EditEntryInput!) {
    editEntry(id: $id, entry: $entry) {
      id
    }
  }
`;
