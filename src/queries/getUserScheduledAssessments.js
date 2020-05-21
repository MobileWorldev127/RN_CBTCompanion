import gql from "graphql-tag";

export const userSchdeuledAssessments = gql`
  query getUserSchdeuledAssessments {
    getUserSchdeuledAssessments {
      id
      isAllowed
      hasHistory
      title
      instructions
      items {
        id
        question
        options {
          text
          value
        }
      }
      nextDate
      therapistName
    }
  }
`;
