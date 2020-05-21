import gql from "graphql-tag";

export const addUserMeditationMutation = gql`
  mutation addUserMeditation($input: UserMeditationInput!) {
    addUserMeditation(input: $input) {
      msg
    }
  }
`;
