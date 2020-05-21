import gql from "graphql-tag";

export const addUserMeasureQuery = gql`
  mutation addUserMeasure($input: ACMeasureInput!) {
    addUserMeasure(input: $input) {
      msg
    }
  }
`;
