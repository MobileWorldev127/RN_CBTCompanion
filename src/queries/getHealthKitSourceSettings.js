import gql from 'graphql-tag';

export const getHealthKitSourceSettings = gql`
  query getHealthKitSourceSettings {
    getHealthKitSourceSettings {
      source
      sourceType
    }
  }
`
