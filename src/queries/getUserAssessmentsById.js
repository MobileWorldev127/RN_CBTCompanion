import gql from "graphql-tag";

export const userAssessmentHistoryQuery = gql`
  query getUserAssessmentsById($assessmentId: String!) {
    getUserAssessmentsById(assessmentId: $assessmentId) {
      id
      assessmentId
      userId
      items {
        id
        value
      }
      result {
        score
        display {
          key
          value
        }
      }
      dateTime
    }
  }
`;
