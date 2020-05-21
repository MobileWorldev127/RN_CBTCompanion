import gql from 'graphql-tag';

export const addTargetQuery =  gql`
mutation addCustomTarget( $title: String!, $description: String!, $icon: String!, $module: String!) {  
  addCustomTarget(target: {
    title: $title
    description: $description
    icon: $icon
    module: $module
  }){
    msg
  }
}`