import gql from "graphql-tag";

export const getLessonByIdQuery = gql`
  query getLessonById($id: String!) {
    getLessonById(id: $id) {
      id
      title
      locked
      transcript
      image
      videos
      cards {
        title
        image
        description
      }
    }
  }
`;

export const getLessonById = `
  query getLessonById($id: String!) {
    getLessonById(id: $id) {
      id
      title
      locked
      transcript
      image
      videos
      cards {
        title
        image
        description
      }
    }
  }
`;
