import gql from "graphql-tag";

export const getUserMeasureByIdQuery = gql`
  query getUserMeasureById($id: String!) {
    getUserMeasureById(id: $id) {
      id
      type
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
