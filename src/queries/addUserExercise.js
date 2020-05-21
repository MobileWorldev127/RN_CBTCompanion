import gql from "graphql-tag";

export const addUserExerciseMutation = gql`
  mutation addUserExercise($input: ExerciseInput!) {
    addUserExercise(input: $input) {
      id
    }
  }
`;
