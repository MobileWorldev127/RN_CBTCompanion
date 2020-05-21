import gql from "graphql-tag";

export const getDefaultACTMeasuresQuery = gql`
  query getDefaultItems {
    getDefaultItems {
      weeklyMeasures {
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
          id
          color
          name
          value
        }
        details {
          question
          type
          placeholder
          image
          icon
          source
          title
          options {
            id
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
            icon
            source
            title
            options {
              id
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
      id
      dailyMeasures {
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
          id
          color
          name
          value
        }
        details {
          question
          type
          placeholder
          icon
          image
          source
          title
          options {
            id
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
            icon
            image
            source
            title
            options {
              id
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
