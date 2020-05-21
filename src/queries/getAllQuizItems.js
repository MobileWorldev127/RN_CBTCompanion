export const getAllQuizItemsQuery = `query getAllQuizItems($noOfItems: Int!, $therapy: String!){
  getAllQuizItems(noOfItems: $noOfItems, therapy: $therapy){
    answer {
      key
      value
    }
    choices {
      key
      value
    }
    hint 
    id
    module
    question
    sequence
    summary
    therapy
  }
}`