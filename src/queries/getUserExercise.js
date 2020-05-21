import gql from "graphql-tag";

export const getUserExerciseQuery = gql`
  query getUserExercise($id: String!) {
    getUserExercise(id: $id) {
      id
      title
      module
      sequence
      color
      isFollowUp
      followupDate
      followCompleted
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
        options {
          color
          value
          name
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
          options {
            color
            value
            name
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
            options {
              color
              value
              name
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
