import gql from "graphql-tag";

export const getStatsQuery = gql`
  query getStats {
    getStats {
      currentStreak
      longestStreak
    }
  }
`;
