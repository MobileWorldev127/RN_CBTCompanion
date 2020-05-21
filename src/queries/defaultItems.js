import gql from "graphql-tag";

export const defaultItemsQuery = gql`
  query getDefaultItems {
    getDefaultItems {
      skills {
        id
        title
        description
        icon
        module
      }
      targets {
        id
        title
        description
        icon
        module
      }
      activities {
        id
        title
        description
        icon
      }
    }
  }
`;
