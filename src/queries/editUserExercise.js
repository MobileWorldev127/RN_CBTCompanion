import gql from "graphql-tag";

export const editUserExerciseMutation = gql`
  mutation editUserExercise($id: String!, $input: ExerciseInput!) {
    editUserExercise(id: $id, input: $input) {
      id
    }
  }
`;
