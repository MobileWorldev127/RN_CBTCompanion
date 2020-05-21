import gql from "graphql-tag";

export const getUserMeasuresQuery = gql`
  query getUserMeasures($startDate: String!, $endDate: String!) {
    getUserMeasures(startDate: $startDate, endDate: $endDate) {
      date
      dateTime
      type
      id
      userId
      defaultItemId
      details {
        type
        title
        details {
          title
          type
        }
      }
    }
  }
`;
