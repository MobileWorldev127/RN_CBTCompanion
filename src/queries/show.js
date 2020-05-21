import gql from 'graphql-tag';

export const unhideSkillQuery = gql`
mutation unhideSkillQuery ($id: String!) {
  unhideSkill(itemId: $id){
    msg
  }
}`

export const unhideTargetQuery = gql`
mutation unhideTargetQuery ($id: String!) {
  unhideTarget(itemId: $id){
    msg
  }
}`

export const unhideActivityQuery = gql`
mutation unhideActivityQuery ($id: String!) {
  unhideActivity(itemId: $id){
    msg
  }
}`

