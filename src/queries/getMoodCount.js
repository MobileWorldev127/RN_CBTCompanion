import gql from 'graphql-tag';

export const getMoodCountQuery = gql`
  query getMoodCountQuery ($startDate: String! $endDate: String! ) {
    getMoodCount (
      startDate: $startDate
      endDate: $endDate
    ) {
      mood
      count
    }
  }
`
