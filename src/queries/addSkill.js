import gql from 'graphql-tag';

export const addSkillQuery =  gql`
mutation addCustomSkill( $title: String!, $description: String!, $icon: String!, $module: String!) {  
  addCustomSkill(skill: {
    title: $title
    description: $description
    icon: $icon
    module: $module
  }){
    msg
  }
}`