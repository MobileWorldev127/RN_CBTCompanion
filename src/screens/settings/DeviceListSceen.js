import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  StyleSheet,
  Linking,
  NativeAppEventEmitter,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from '../../common/icons';
import { NavigationActions } from 'react-navigation';
import Header from '../../components/Header';
import { withSubscriptionActions } from '../../utils/StoreUtils';
import { showMessage } from 'react-native-flash-message';
import ThemeStyle from '../../styles/ThemeStyle';
import qs from 'qs';
import config from './../../constants/AppConfigs';
import { getAmplifyConfig, getEnvVars } from './../../constants';
import AppleHealthKit from 'rn-apple-healthkit';
import GoogleFit, { Scopes } from 'react-native-google-fit';
import Amplify from 'aws-amplify';
import { API } from 'aws-amplify';
import {
  logAppleDataMutation,
  upsertHealthKitSourceSettings,
} from '../../queries/addEntry';
import { setAppleHealthSettings } from '../../actions/DevicesSettings';
import {
  EmiiterHandlerSubscribe,
  EmiiterHandlerSubscribe1,
} from '../../screens/settings/EventEmitter';
import { getHealthKitSourceSettings } from '../../queries/getHealthKitSourceSettings';

let moment = require('moment');

const screenWidth = Dimensions.get('window').width;

function OAuth(client_id, cb) {
  Linking.addEventListener('url', handleUrl);
  function handleUrl(event) {
    console.log(event.url);
    Linking.removeEventListener('url', handleUrl);
    const [, query_string] = event.url.match(/\#(.*)/);
    console.log(query_string);
    const query = qs.parse(query_string);
    console.log(`query: ${JSON.stringify(query)}`);
    cb(query.access_token);
  }
  const oauthurl = `https://www.fitbit.com/oauth2/authorize?${qs.stringify({
    client_id,
    response_type: 'token',
    scope: 'heartrate activity nutrition profile sleep weight',
    redirect_uri: 'CBTCompanion://fit',
    expires_in: '31536000',
  })}`;
  console.log(oauthurl);
  Linking.openURL(oauthurl).catch(err =>
    console.error('Error processing linking', err)
  );
}

class DeviceListSceen extends Component {
  constructor(props) {
    super(props);
    this.OAuth;
    this.state = {
      isApple: false,
      isFitbit: false,
      isGoogleFit: false,
      token: '',
      activeEnergyBurned: [],
      permissionOptions: {
        permissions: {
          read: ['Walking'],
        },
      },
      Mindfulness: [],
      HeartRate: [],
      Steps: {},
      Sleep: [],
      TotalFat: [],
      activitySetting: '',
      sleepSetting: '',
      heartSetting: '',
      mindfulnessSetting: '',
      nutritionSetting: '',
    };
  }

  componentDidMount = async() => {
    this.props.setLoading(true);
    Amplify.configure(
      getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
    );
    API.graphql({
      query: getHealthKitSourceSettings,
    })
      .then(data => {
        this.props.setLoading(false);
        data.data.getHealthKitSourceSettings.map(item => {
          if (item.sourceType == 'Exercise') {
            this.setState({ activitySetting: item.source });
          }
          if (item.sourceType == 'Sleep') {
            this.setState({ sleepSetting: item.source });
          }
          if (item.sourceType == 'HeartRate') {
            this.setState({ heartSetting: item.source });
          }
          if (item.sourceType == 'MindfulnessMinutes') {
            this.setState({ mindfulnessSetting: item.source });
          }
          if (item.sourceType == 'Nutrition') {
            this.setState({ nutritionSetting: item.source });
          }
        });
      })
      .catch(err => {
        this.props.setLoading(false);
        console.log(err);
      });
      const device = await AsyncStorage.getItem('DEVICE');
      if (device == 'APPLEHEALTH') {
        this.setState({ isApple: true })
      }

      const device1 = await AsyncStorage.getItem('DEVICE_FITBIT');
      if (device == 'FITBIT') {
        this.setState({ isFitbit: true })
      }
  }

  goack = () => this.props.navigation.dispatch(NavigationActions.back());

  clickedDevice(val) {
    if (val === 'google_fit') {
      // GoogleFit.checkIsAuthorized();
      const options = {
        scopes: [
          Scopes.FITNESS_ACTIVITY_READ,
          Scopes.FITNESS_LOCATION_READ,
          Scopes.FITNESS_BODY_READ,
          Scopes.FITNESS_NUTRITION_READ,
          Scopes.FITNESS_BLOOD_PRESSURE_READ,
          Scopes.FITNESS_BLOOD_GLUCOSE_READ,
          Scopes.FITNESS_OXYGEN_SATURATION_READ,
          Scopes.FITNESS_BODY_TEMPERATURE_READ,
          Scopes.FITNESS_REPRODUCTIVE_HEALTH_READ
        ],
      };
      GoogleFit.authorize(options)
        .then(authResult => {
          if (authResult.success) {
            const options1 = {
              startDate: new Date(
                new Date().setHours(0, 0, 0, 0)
              ).toISOString(),
              endDate: new Date().toISOString(),
            };
            GoogleFit.getHeartRateSamples(
              options1,
              (error, results_heartRate) => {
                console.log('Heart Rate >>> ', results_heartRate);
                GoogleFit.getDailyNutritionSamples(
                  options1,
                  (error, results_Nutrition) => {
                    // console.log("Nutrition >>>", results_Nutrition);
                    GoogleFit.getDailyStepCountSamples(options1)
                      .then(results_dailyStepsCount => {
                        // console.log("Daily steps >>> ", results_dailyStepsCount);
                        results_dailyStepsCount.map(item => {
                          console.log(item);;
                        });;
                        GoogleFit.getSleepData(
                          options1,
                          (isError, result_sleep) => {
                            // console.log('sleep result', isError, result_sleep);
                            let variables = {
                              HeartRate: results_heartRate,
                              Nutrition: results_Nutrition,
                              DailyStepsCount: results_dailyStepsCount,
                              Sleep: result_sleep,
                            };;
                            console.log("@@");;
                            console.log(variables);;
                          }
                        );
                      })
                      .catch(err => {
                        console.warn(err);
                      });
                  }
                );
              }
            );
          } else {
            // dispatch("AUTH_DENIED", authResult.message);
            console.log(authResult);
          }
        })
        .catch(() => {
          // dispatch("AUTH_ERROR");
        });

      this.setState({
        isApple: false,
        isFitbit: false,
        isGoogleFit: true,
      });
    } else if (val === 'fitbit') {
      let dateTime = moment().format('YYYY-MM-DD');
      OAuth(config.Fitbit.client_id, access_token => {
        fetch(
          'https://api.fitbit.com/1.2/user/-/sleep/date/' + dateTime + '.json',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
            // body: `root=auto&path=${Math.random()}`
          }
        )
          .then(res => res.json())
          .then(res => {
            console.log(`res: ${JSON.stringify(res)}`);

            Amplify.configure(
              getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
            );
            API.graphql({
              query: upsertHealthKitSourceSettings,
              variables: {
                settings: [
                  {
                    sourceType: 'Nutrition',
                    source: 'FITBIT',
                  },
                  {
                    sourceType: 'Exercise',
                    source: 'FITBIT',
                  },
                  {
                    sourceType: 'Sleep',
                    source: 'FITBIT',
                  },
                  {
                    sourceType: 'HeartRate',
                    source: 'FITBIT',
                  },
                  {
                    sourceType: 'MindfulnessMinutes',
                    source: 'FITBIT',
                  },
                ],
                fitbitToken: access_token,
              },
            })
              .then(data => {
                console.log(
                  'Fitbit result : ',
                  data.data.upsertHealthKitSourceSettings
                );
                this.setState({
                  isApple: false,
                  isFitbit: true,
                  isGoogleFit: false,
                  token: access_token,
                });
                AsyncStorage.setItem('DEVICE_FITBIT', 'FITBIT')
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(err => {
            console.error('Error: ', err);
          });
      });
    } else {
      let arr = [];
      arr.push(
        'Biotin',
        'Caffeine',
        'Calcium',
        'Carbohydrates',
        'Chloride',
        'Cholesterol',
        'Copper',
        'EnergyConsumed',
        'FatMonounsaturated',
        'FatPolyunsaturated',
        'FatSaturated',
        'FatTotal',
        'Fiber',
        'Folate',
        'Iodine',
        'Iron',
        'Magnesium',
        'Manganese',
        'Molybdenum',
        'Niacin',
        'PantothenicAcid',
        'Phosphorus',
        'Potassium',
        'Protein',
        'Riboflavin',
        'Selenium',
        'Sodium',
        'Sugar',
        'Thiamin',
        'VitaminA',
        'VitaminB12',
        'VitaminB6',
        'VitaminC',
        'VitaminD',
        'VitaminE',
        'VitaminK',
        'Zinc',
        'Water',
        'StepCount',
        'DistanceWalkingRunning',
        'SleepAnalysis',
        'HeartRate',
        'RestingHeartRate',
        'HeartRateVariability',
        'MindfulSession'
      );
      if (arr.length == 0) {
        alert('You have to select permission at Source Settings');
        return;
      }
      let optionsPermission = {
        permissions: {
          read: arr,
        },
      };
      this.setState({ 
        permissionOptions: optionsPermission,
        isApple: true 
      });
      this.props.setAppleHealthSettings(optionsPermission);

      AsyncStorage.setItem('DEVICE', 'APPLEHEALTH');
      EmiiterHandlerSubscribe(optionsPermission);
    }
  }

  render(){
    const { isApple, isFitbit, isGoogleFit } = this.state;
    // const device = await AsyncStorage.getItem('DEVICE');
    return (
      <View style={ThemeStyle.pageContainer}>
        <Header
          title="Devices"
          rightIcon={() => (
            <View
              style={{ position: 'relative', top: 1, flexDirection: 'row' }}
            >
              <TouchableOpacity
                style={{ marginLeft: 8, marginTop: 3 }}
                onPress={() => {
                  this.setState({
                    showInstructions: true,
                    instructions: this.exerciseData.instructions,
                  });
                }}
              >
                <Icon
                  family={'EvilIcons'}
                  name={'question'}
                  color="black"
                  size={25}
                />
              </TouchableOpacity>
            </View>
          )}
          goBack={() => this.props.navigation.goBack(null)}
        />
        <View style={styles.mainView}>
          {Platform.OS === 'ios' ? (
            <TouchableOpacity onPress={() => this.clickedDevice('health')}>
              <View style={isApple ? styles.clickedView : styles.unClickedView}>
                <Image
                  source={require('../../assets/images/redesign/applehealth_logo.png')}
                  style={styles.iconImg}
                />
                <Text style={isApple ? styles.clickedTxt : styles.unClickedTxt}>
                  Apple Health
                </Text>
                {
                  isApple ? 
                  <Image
                    source={require('../../src/check.png')}
                    style={styles.checkImg}
                  /> : null
                }
              </View>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity onPress={() => this.clickedDevice('fitbit')}>
            <View style={isFitbit ? styles.clickedView : styles.unClickedView}>
              <Image
                source={require('../../assets/images/redesign/fitbit_logo.png')}
                style={styles.iconImg}
              />
              <Text style={isFitbit ? styles.clickedTxt : styles.unClickedTxt}>
                Fitbit
              </Text>
              {
                isFitbit ? 
                <Image
                  source={require('../../src/check.png')}
                  style={styles.checkImg}
                /> : null
              }
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.clickedDevice('google_fit')}>
            <View
              style={isGoogleFit ? styles.clickedView : styles.unClickedView}
            >
              <Image
                source={require('../../assets/images/redesign/googlefit_logo.png')}
                style={styles.iconImg}
              />
              <Text
                style={isGoogleFit ? styles.clickedTxt : styles.unClickedTxt}
              >
                {' '}
                Google Fit
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text
          style={{
            marginTop: 50,
            marginHorizontal: 25,
          }}
        >
          token: {this.state.token}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clickedView: {
    width: (screenWidth - 20) / 3 - 15,
    height: (screenWidth - 20) / 3 - 15,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'blue',
  },
  unClickedView: {
    width: (screenWidth - 20) / 3 - 15,
    height: (screenWidth - 20) / 3 - 15,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  clickedTxt: {
    marginTop: 10,
    color: 'blue',
    fontSize: 16,
  },
  unClickedTxt: {
    marginTop: 10,
    color: 'black',
    fontSize: 16,
  },
  iconImg: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  checkImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    position: 'absolute',
    top: 10,
    right: 10
  }
});

const mapStateToProps = state => ({
  sourceSettingsList: state.sourceSettings.sourceSettingsList,
  appleHealthPermission: state.devicesSettings.appleHealthPermission,
});

const mapDispatchToProps = dispatch => ({
  setAppleHealthSettings: data => dispatch(setAppleHealthSettings(data)),
});

export default withSubscriptionActions(
  DeviceListSceen,
  mapStateToProps,
  mapDispatchToProps
);
