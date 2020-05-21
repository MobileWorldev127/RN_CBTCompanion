import gql from 'graphql-tag';

export const getActivitiesCountQuery = gql`
  query getActivitiesCountQuery ($startDate: String!, $endDate: String! ) {
    getActivitiesCount (
      startDate: $startDate
      endDate: $endDate
    ) {
      activity {
        icon
        title
      }
      count
    }
  }
`
