import gql from "graphql-tag";

export const getExerciseHistoryQuery = gql`
  query getEntry($id: String!) {
    getEntry(id: $id) {
      exercise {
        id
        title
        module
        sequence
        color
        description
        image
        details {
          question
          type
          placeholder
          image
          source
          title
          scale {
            min
            max
            start
            step
          }
          value {
            intValues
            stringValues
            keyValues {
              key {
                name
                color
                id
              }
              value
            }
          }
          details {
            question
            type
            placeholder
            image
            source
            title
            scale {
              min
              max
              step
              start
            }
            value {
              intValues
              stringValues
              keyValues {
                key {
                  name
                  color
                  id
                }
                value
              }
            }
          }
        }
      }
    }
  }
`;
