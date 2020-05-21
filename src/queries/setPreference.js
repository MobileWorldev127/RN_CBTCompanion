import gql from "graphql-tag";

export const setPreferenceQuery = gql`
  mutation setPreference($type: String!, $data: [PrefrenceDataInput!]) {
    setPreference(type: $type, data: $data) {
      userId
    }
  }
`;
