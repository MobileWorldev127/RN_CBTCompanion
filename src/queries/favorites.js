import gql from "graphql-tag";

export const getFavourite = gql`
  query getFavourite($app: SwasthApp!) {
    getFavourite(app: $app) {
      userId
      app
      items {
        type
        items {
          id
          type
          title
        }
      }
    }
  }
`;

export const addFavourite = gql`
  mutation addFavourite($app: SwasthApp!, $input: [FavouriteItemInput!]!) {
    addFavourite(app: $app, input: $input) {
      userId
      app
      items {
        type
        id
        title
      }
    }
  }
`;

export const deleteFavourite = gql`
  mutation deleteFavourite($app: SwasthApp!, $input: FavouriteItemInput!) {
    deleteFavourite(app: $app, input: $input) {
      userId
      app
      items {
        type
        id
        title
      }
    }
  }
`;
