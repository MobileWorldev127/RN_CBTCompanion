import gql from "graphql-tag";

export const getUserPracticeIdea = gql`
  query getUserPracticeIdea($id: String!) {
    getUserPracticeIdea(id: "") {
      lesson
      sequence
      userId
      id
      practiceIdeaId
      type
      date
      timestamp
      instruction
      title
      children {
        answer
        audioExists
        audioFilePath
        description
        type
        title
        sequence
        children {
          type
          description
          title
          audioExists
          audioFilePath
        }
      }
    }
  }
`;
