import gql from "graphql-tag";

export const getExercisesQuery = gql`
  query getExercises {
    getExercises {
      id
      title
      color
      module
      sequence
      description
      image
    }
  }
`;
