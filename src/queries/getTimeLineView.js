import gql from "graphql-tag";

export const getTimeLineViewQuery = gql`
  query getTimeLineView($startDate: String!, $endDate: String!) {
    getTimeLineView(startDate: $startDate, endDate: $endDate) {
      date
      entries {
        id
        mood
        dateTime
        emotions {
          emotion {
            name
            color
          }
          intensity
        }
        medication
        bedTime
        wakeTime
        sleepTime
        journal {
          text
          assets {
            images
            videos
            audios
          }
        }
      }
      exercises {
        id
        dateTime
        module
        title
        sequence
        description
        color
        example {
          key
          value
        }
        default
        details {
          question
          type
          placeholder
          image
          color
          source
          title
          value {
            intValues
            stringValues
            booleanValues
            keyValues {
              key {
                id
                name
                description
                color
                description
              }
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
            color
            id
            name
            value
          }
          icon
        }
        image
        dateTime
        instructions
        isFollowUp
        followCompleted
        followupDate
      }
      challengeExercises {
        id
        dateTime
        module
        title
        sequence
        description
        color
        example {
          key
          value
        }
        default
        details {
          question
          type
          placeholder
          image
          color
          source
          title
          value {
            intValues
            stringValues
            booleanValues
            keyValues {
              key {
                id
                name
                description
                color
                description
              }
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
            color
            id
            name
            value
          }
          icon
        }
        image
        dateTime
        instructions
        isFollowUp
        followCompleted
        followupDate
      }
      predictions {
        id
        module
        title
        sequence
        description
        color
        example {
          key
          value
        }
        default
        details {
          question
          type
          placeholder
          image
          color
          source
          title
          value {
            intValues
            stringValues
            booleanValues
            keyValues {
              key {
                id
                name
                description
                color
                icon
              }
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
            color
            id
            name
            value
          }
          details {
            question
            type
            placeholder
            image
            color
            source
            title
            value {
              intValues
              stringValues
              booleanValues
              keyValues {
                key {
                  id
                  name
                  description
                  color
                  icon
                }
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
              color
              id
              name
              value
            }
            icon
          }
          icon
        }
        image
        entryDate
        dateTime
        instructions
        isFollowUp
        followCompleted
        followupDate
      }
      meditations {
        id
        userId
        app
        title
        image
        startDate
        endDate
        totalMinutes
      }
      practiceIdeas {
        id
        userId
        practiceIdeaId
        type
        date
        timestamp
        sequence
        instruction
        title
        lesson
      }
    }
  }
`;

export const getSummaryTimeLineViewQuery = gql`
  query getSummary($startDate: String!, $endDate: String!) {
    getSummary(startDate: $startDate, endDate: $endDate) {
      date
      nutrition {
        calories {
          value
          unit
        }
        carbs {
          value
          unit
        }
        protein {
          value
          unit
        }
        fat {
          value
          unit
        }
      }
      healthExercise {
        calories {
          value
          unit
        }
        duration {
          value
          unit
        }
        distance {
          value
          unit
        }
        steps {
          value
          unit
        }
      }
      sleep {
        totalMinutes
        sleep {
          bedTime
          wakeTime
          duration
        }
      }
      heartRate {
        state
        value
        valueAtRest
        variabilty
      }
      mindfulnessMinutes {
        totalMinutes
      }
    }
  }
`;
