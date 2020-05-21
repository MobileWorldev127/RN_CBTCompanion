import gql from "graphql-tag";

export const getAllHomeworks = gql`
  query getAllHomeworks($appId: String!) {
    getAllHomeworks(appId: $appId) {
      id
      assignee {
        type
        id
        name
      }
      assignedBy {
        id
        name
      }
      dueDate
      app
      items {
        type
        id
        title
        done
      }
      title
    }
  }
`;
