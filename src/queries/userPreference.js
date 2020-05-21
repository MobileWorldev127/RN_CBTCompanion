import gql from "graphql-tag";
import { preferenceTypes } from "../constants";

export const userPreferenceQuery = gql`
  query getPreference($type: String!) {
    getPreference(type: $type) {
      type
      data
    }
  }
`;

export const defaultVariables = {
  type: preferenceTypes.TYPE_ENTRY
};
