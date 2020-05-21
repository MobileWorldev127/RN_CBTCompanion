import gql from "graphql-tag";

export const getExerciseByIDQuery = gql`
  query getExercise($id: String!) {
    getExercise(id: $id) {
      id
      title
      module
      sequence
      locked
      isFollowUp
      followupDate
      followCompleted
      lesson
      description
      instructions
      color
      image
      details {
        question
        type
        placeholder
        image
        icon
        required
        instructions
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
        details {
          question
          type
          placeholder
          instructions
          image
          icon
          source
          title
          options {
            color
            name
            value
          }
          scale {
            min
            max
            start
            step
          }
          details {
            type
            image
            icon
            title
            instructions
            question
            placeholder
            source
            details {
              type
              title
              image
              question
              placeholder
              details {
                type
                title
                image
                question
                placeholder
                options {
                  name
                  color
                }
              }
              options {
                name
                color
                value
              }
            }
            scale {
              min
              max
              step
              start
              placeholder
            }
            options {
              name
              color
              value
            }
          }
        }
      }
    }
  }
`;

export const getExerciseByID = `
  query getExercise($id: String!) {
    getExercise(id: $id) {
      id
      title
      module
      sequence
      color
      image
      description
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
        options {
          color
          name
          value
        }
        details {
          question
          type
          placeholder
          image
          source
          title
          options {
            name
            value
            color
          }
          scale {
            min
            max
            start
            step
          }
          details {
            question
            type
            placeholder
            image
            source
            title
            options {
              name
              value
              color
            }
            scale {
              min
              max
              start
              step
            }
          }
        }
      }
    }
  }
`;
