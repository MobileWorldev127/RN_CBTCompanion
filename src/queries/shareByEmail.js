import gql from "graphql-tag";

export const shareByEmailQuery = gql`
  query shareByEmail(
    $tz: String
    $startDate: String!
    $endDate: String!
    $email: String!
    $fields: FieldInput!
  ) {
    shareByEmail(
      startDate: $startDate
      endDate: $endDate
      email: $email
      fields: $fields
      tz: $tz
    ) {
      success
      message
    }
  }
`;
