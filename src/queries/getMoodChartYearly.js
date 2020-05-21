import gql from 'graphql-tag';

export const getMoodChartYearlyQuery = gql`
  query getMoodChartYearly($startDate: String!, $endDate: String!) {
    getMoodChartYearly (
      startDate: $startDate,
      endDate: $endDate
    ) {
      mood
      from
    }
  }
`