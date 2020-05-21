import gql from 'graphql-tag';

export const getTargetsCountQuery = gql`
  query getTargetsCountQuery ($startDate: String! $endDate: String! ) {
    getTargetsCount (
      startDate: $startDate
      endDate: $endDate
    ) {
      target {
        icon
        title
      }
      count
    }
  }
`
