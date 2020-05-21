import gql from "graphql-tag";

export const getMoodChartMonthlyQuery = gql`
  query getMoodChartMonthly($startDate: String!, $endDate: String!) {
    getMoodChartMonthly(startDate: $startDate, endDate: $endDate) {
      mood
      from
      to
    }
  }
`;
