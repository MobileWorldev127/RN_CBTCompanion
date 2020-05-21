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
        title
        color
      }
      predictions {
        id
        title
        color
        followupDate
        followCompleted
        details {
          question
          type
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
      challengeExercises {
        id
        title
        color
        followupDate
        followCompleted
        details {
          question
          type
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
      practiceIdeas {
        id
        title
      }
      meditations {
        id
        totalMinutes
        title
      }
    }
  }
`;
