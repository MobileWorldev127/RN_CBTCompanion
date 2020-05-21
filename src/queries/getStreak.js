import gql from 'graphql-tag';

export const getCurrentStreak = gql`
  query getCurrentStreak {
    getCurrentStreak 
  }
`
export const getLongestStreak = gql`
  query getLongestStreak {
    getLongestStreak 
  }
`