import gql from "graphql-tag";

export const getFoodEntriesquery = gql`
  query getFoodEntries($startDate: String!, $endDate: String!) {
    getFoodEntries(startDate: $startDate, endDate: $endDate) {
      _id
      userId
      source
      dateTime
      meal
      details{
        name
        brand
        qty
        unit
        weight_grams
        macroNutrients
        microNutrients {
         usda_tag,
         name,
         unit,
         value
        }
      }
    }
  }
`;
