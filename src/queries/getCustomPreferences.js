import gql from "graphql-tag";

export const getCustomTargetPreferencesQuery = `query getCustomPreferences($type: String!, $module: String!){
      getCustomPreferences(type:$type, module:$module ){
        hide { targets }
        custom{
          targets { id title description icon module }
        }
      }
    }`;

export const getCustomSkillPreferencesQuery = `query getCustomPreferences($type: String!, $module: String!){
  getCustomPreferences(type:$type, module:$module ){
    hide { skills }
    custom{
      skills { id title description icon module }
    }
  }
}`;

export const getCustomActivityPreferencesQuery = `query getCustomActivity {
  getCustomActivity {
    id
    title
    description
    icon
  }
}`;
