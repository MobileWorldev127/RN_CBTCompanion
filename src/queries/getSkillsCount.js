import gql from 'graphql-tag';

export const getSkillsCountQuery = gql`
  query getSkillsCountQuery ($startDate: String! $endDate: String! ) {
    getSkillsCount (
      startDate: $startDate
      endDate: $endDate
    ) {
      skill {
        icon
        title
      }
      count
    }
  }
`
