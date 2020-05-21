import gql from "graphql-tag";

export const getLessonNotesQuery = gql`
  query getLessonNotes($lessonId: String!) {
    getLessonNotes(lessonId: $lessonId) {
      lessonId
      lessonTitle
      notes {
        title
        noteId
        description
      }
    }
  }
`;

export const addLessonNoteQuery = gql`
  mutation addLessonNote($input: LessonNoteInput!) {
    addLessonNote(input: $input) {
      msg
    }
  }
`;

export const editLessonNoteQuery = gql`
  mutation editLessonNote(
    $lessonId: String!
    $input: EditLessonNoteChildrenInput!
  ) {
    editLessonNote(lessonId: $lessonId, input: $input) {
      msg
    }
  }
`;
