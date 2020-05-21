import gql from "graphql-tag";

export const getMeditationsByAuthor = gql`
  query getMeditationsByAuthor($author: String!) {
    getMeditationsByAuthor(author: $author) {
      theme
      filename
      id
      author
      attribution
      imagePath
      title
      sequence
      type
    }
  }
`;
