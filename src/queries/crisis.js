import gql from 'graphql-tag';

export const getCrisisItemsQuery = gql`
query getCrisisItems{
  getCrisisItems {
    id,
    crisisItem {
      title,
      description,
      tags,
      icon,
      skillId,
    },
    checkinCount,
    checkinValues {
      date,
      description
    },
  }
}`

export const crisisCheckinQuery =  gql`
mutation checkinCrisisItem( $id: String!, $date: String!, $description: String!) {  
  checkinCrisisItem(
    id: $id
    date: $date
    description: $description
  ){
    msg
  }
}`

export const addCrisisItemQuery =  gql`
mutation addCrisis( $title: String!, $description: String!, $icon: String, $tags: [String], $skillId: String) {  
  addCrisisItem(item: {
    title: $title
    description: $description
    icon: $icon,
    tags: $tags,
    skillId: $skillId
  }){
    msg
  }
}`

export const editCrisisItemQuery =  gql`
mutation editCrisis( $id: String!, $title: String!, $description: String!, $icon: String, $tags: [String], $skillId: String) {  
  editCrisisItem(item: {
    id: $id
    title: $title
    description: $description
    icon: $icon,
    tags: $tags,
    skillId: $skillId
  }){
    msg
  }
}`

export const deleteCrisisItemQuery = gql`
mutation deleteCrisisItem($id: String!) {
  deleteCrisisItem(
    id: $id
  ) {
    msg
  }
}
`