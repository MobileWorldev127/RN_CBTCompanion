import gql from "graphql-tag";

export const getPremiumFeatureQuery = gql`
  query getPremiumFeature($appId: SwasthApp!) {
    getPremiumFeature(appId: $appId) {
      hasPremium
    }
  }
`;
