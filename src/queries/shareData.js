import gql from 'graphql-tag';

export const shareQuery =  gql`
query share($month: String!, $email: String!) {
  share(
    month: $month
    email: $email
  ){
    msg
  }
}`