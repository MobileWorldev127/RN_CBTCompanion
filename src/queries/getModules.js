import gql from "graphql-tag";

export const getModulesQuery = gql`
  query getModules($parent: String!) {
    getModules(parent: $parent) {
      id
      title
      sequence
      transcript
      image
      locked
      children {
        id
        title
        transcript
        isLesson
        image
        locked
      }
      isLesson
      hasSubModule
    }
  }
`;
