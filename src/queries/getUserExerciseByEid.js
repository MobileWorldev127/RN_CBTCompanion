import gql from "graphql-tag";

export const getUserExerciseByEIdQuery = gql`
  query getUserExerciseByEId($exerciseId: String!) {
    getUserExerciseByEId(exerciseId: $exerciseId) {
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
        icon
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
            }
            value
          }
        }
        details {
          question
          type
          placeholder
          image
          icon
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
              }
              value
            }
          }
          details {
            question
            type
            placeholder
            image
            icon
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
