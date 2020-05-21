import gql from "graphql-tag";

export const getExercisesByModuleQuery = gql`
  query getExercisesByModule($module: String!) {
    getExercisesByModule(module: $module) {
      id
      title
      icon
      color
      image
      locked
    }
  }
`;
