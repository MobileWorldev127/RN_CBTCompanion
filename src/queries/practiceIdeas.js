import gql from "graphql-tag";

export const getPracticeIdeasByLessonQuery = gql`
  query getPracticeIdeasByLesson($lessonId: String!) {
    getPracticeIdeasByLesson(lessonId: $lessonId) {
      title
      id
    }
  }
`;

export const getPracticeIdeaQuery = gql`
  query getPracticeIdea($id: String!) {
    getPracticeIdea(id: $id) {
      title
      type
      id
      instruction
      lesson
      sequence
      children {
        description
        type
        title
        audioExists
        audioFilePath
        sequence
        children {
          description
          type
          title
          audioExists
          audioFilePath
          sequence
        }
      }
    }
  }
`;

export const getPracticeIdeaHistoryQuery = gql`
  query getPracticeIdeaHistory($praciseIdeaId: String!) {
    getPracticeIdeaHistory(praciseIdeaId: $praciseIdeaId) {
      id
      title
      type
      date
      timestamp
      children {
        title
        answer
      }
    }
  }
`;

export const recordPracticeIdeaQuery = gql`
  mutation recordPracticeIdea($input: UserPracticeIdeaInput!) {
    recordPracticeIdea(input: $input) {
      id
    }
  }
`;

export const getUserPracticeIdeaQuery = gql`
  query getUserPracticeIdeaById($id: String!) {
    getUserPracticeIdeaById(id: $id) {
      title
      type
      id
      instruction
      lesson
      sequence
      children {
        description
        type
        title
        audioExists
        audioFilePath
        sequence
        answer
        children {
          description
          type
          title
          answer
          audioExists
          audioFilePath
          sequence
        }
      }
    }
  }
`;
