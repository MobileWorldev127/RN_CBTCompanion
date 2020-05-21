import gql from "graphql-tag";

export const getMoodCorelationsQuery = gql`
  query getMoodCorrelations($startDate: String!, $endDate: String!) {
    getMoodCorrelations(startDate: $startDate, endDate: $endDate) {
      mood
      emotions {
        name
        color
      }
      sleep
      medication {
        yes
        no
      }
      exercises {
        id
        module
        title
        sequence
        description
        color
      }
    }
  }
`;
