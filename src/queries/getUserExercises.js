import gql from "graphql-tag";

export const getUserExercisesQuery = gql`
  query getUserExercises {
    getUserExercises {
      display
      exercise {
        id
        title
        color
        module
        sequence
        description
        image
      }
    }
  }
`;
