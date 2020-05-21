import gql from "graphql-tag";

export const getMeditationsByTheme = gql`
  query getMeditationsByTheme($theme: String!) {
    getMeditationsByTheme(theme: $theme) {
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
