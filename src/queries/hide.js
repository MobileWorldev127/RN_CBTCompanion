import gql from 'graphql-tag';

export const hideSkillQuery = gql`
mutation hideSkillQuery ($id: String!) {
  hideSkill(itemId: $id){
    msg
  }
}`

export const hideTargetQuery = gql`
mutation hideTargetQuery ($id: String!) {
  hideTarget(itemId: $id){
    msg
  }
}`

export const hideActivityQuery = gql`
mutation hideActivityQuery ($id: String!) {
  hideActivity(itemId: $id){
    msg
  }
}`

