import gql from 'graphql-tag';

export const addActivityQuery =  gql`
mutation addCustomActivity( $title: String!, $description: String!, $icon: String!) {  
  addCustomActivity(activity: {
    title: $title
    description: $description
    icon: $icon
  }){
    msg
  }
}`