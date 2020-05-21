export const getMeditationsByID = `query getMeditation($id : String!){
    getMeditation(id: $id){
    theme
    filename
    id
    author
    attribution
    imagePath
    title
    sequence
    type
  }
}`;
