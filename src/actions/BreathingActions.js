import { setLoading } from './AppActions';
import { addMindfulnessMinutesMutation } from '../queries/addEntry';
import Amplify from 'aws-amplify';
import { getAmplifyConfig, getEnvVars } from '../constants';
import { API, graphqlOperation } from 'aws-amplify';
let moment = require('moment');

export function addBreathingEntry(entry, dateTime, exerciseEntryData) {
  Amplify.configure(getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL));

  let variables = {};
  variables = {
    source: "APPLEHEALTH",
    title: entry.title,
    image: '',
    startDate: dateTime,
    endDate: dateTime,
    totalMinutes: entry.totalMinutes,
  };
  API.graphql({
    query: addMindfulnessMinutesMutation,
    variables: {
      input: variables,
    },
  })
    .then(data => {
      if (exerciseEntryData) {
        exerciseEntryData(data.data);
      }
    })
    .catch(err => {
      console.log(err);
    })
    .finally(() => {});
}
