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
import Icon from '../../common/icons';
import { NavigationActions } from 'react-navigation';
import Header from '../../components/Header';
import { withSubscriptionActions } from '../../utils/StoreUtils';
import { showMessage } from 'react-native-flash-message';
import ThemeStyle from '../../styles/ThemeStyle';
import qs from 'qs';
import config from './../../constants/AppConfigs';
import { getAmplifyConfig, getEnvVars } from "./../../constants";
import AppleHealthKit from 'rn-apple-healthkit';
import GoogleFit, { Scopes } from 'react-native-google-fit';
import Amplify from "aws-amplify";
import { API } from "aws-amplify";
import { logAppleDataMutation, upsertHealthKitSourceSettings } from "../../queries/addEntry";
import { setAppleHealthSettings } from "../../actions/DevicesSettings";
import {EmiiterHandlerSubscribe} from '../../screens/settings/EventEmitter'


let moment = require("moment");

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
    scope: 'heartrate activity activity profile sleep',
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

      // permissionOptions: {"permissions": {"read": ["Height", "StepCount", "DistanceWalkingRunning", "SleepAnalysis", "HeartRate", "RestingHeartRate", "HeartRateVariability", "MindfulSession", "Biotin", "Caffeine", "Calcium", "Carbohydrates", "Chloride", "Cholesterol", "Copper", "EnergyConsumed", "FatMonounsaturated", "FatPolyunsaturated", "FatSaturated", "FatTotal", "Fiber", "Folate", "Iodine", "Iron", "Magnesium", "Manganese", "Molybdenum", "Niacin", "PantothenicAcid", "Phosphorus", "Potassium", "Protein", "Riboflavin", "Selenium", "Sodium", "Sugar", "Thiamin", "VitaminA", "VitaminB12", "VitaminB6", "VitaminC", "VitaminD", "VitaminE", "VitaminK", "Zinc", "Water"]}},

      Mindfulness: [],
      HeartRate: [],
      Steps:  {},
      Sleep: [],
      TotalFat: []
    };
  }

  goack = () => this.props.navigation.dispatch(NavigationActions.back());

  clickedDevice(val) {
    if (val === 'google_fit') {
      GoogleFit.checkIsAuthorized();
      const options = {
        scopes: [
          Scopes.FITNESS_ACTIVITY_READ_WRITE,
          Scopes.FITNESS_BODY_READ_WRITE,
        ],
      };
      GoogleFit.authorize(options)
        .then(authResult => {
          if (authResult.success) {
            console.log(authResult);
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
      let dateTime = moment().format('YYYY-MM-DD')
      OAuth(config.Fitbit.client_id, access_token => {
        fetch('https://api.fitbit.com/1.2/user/-/sleep/date/' + dateTime + '.json', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          // body: `root=auto&path=${Math.random()}`
        })
          .then(res => res.json())
          .then(res => {
            console.log(`res: ${JSON.stringify(res)}`);
            
            Amplify.configure(
              getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
            );
            API.graphql({
              query: upsertHealthKitSourceSettings,
              variables: {
                settings: {
                  sourceType: "HeartRate",
                  source: "FITBIT"
                },
                fitbitToken: access_token
              }
            })
              .then(data => {
                this.setState({
                  isApple: false,
                  isFitbit: true,
                  isGoogleFit: false,
                  token: access_token,
                });
              })
              .catch(err => {
                console.log(err);
              })

            
          })
          .catch(err => {
            console.error('Error: ', err);
          });
      });
    } else {
      if (Platform.OS === 'ios') {
        const { sourceSettingsList } = this.props;
        console.log('SourceSettings ==>', sourceSettingsList)
        let arr = [];
        if (
          sourceSettingsList &&
          sourceSettingsList.activitySetting == 'Apple'
        ) {
          arr.push('StepCount', 'DistanceWalkingRunning');
        }
        if (sourceSettingsList && sourceSettingsList.sleepSetting == 'Apple') {
          arr.push('SleepAnalysis');
        }
        if (sourceSettingsList && sourceSettingsList.heartSetting == 'Apple') {
          arr.push('HeartRate', 'RestingHeartRate', 'HeartRateVariability');
        }
        if (
          sourceSettingsList &&
          sourceSettingsList.mindfulnessSetting == 'Apple'
        ) {
          arr.push('MindfulSession');
        }
        if (
          sourceSettingsList &&
          sourceSettingsList.nutritionSetting == 'Apple'
        ) {
          console.log('#####')
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
            'Water'
          );
        }
        if (arr.length == 0) {
          alert('You have to select permission at Source Settings')
          return;
        }
        let optionsPermission = {
          permissions: {
            read: arr,
          },
        };
        this.setState({ permissionOptions: optionsPermission });

        this.props.setAppleHealthSettings(optionsPermission);
        
        EmiiterHandlerSubscribe(optionsPermission);


            // let options_EnergyConsumed = {
            //   startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
            //   endDate: new Date().toISOString(),
            //   unit: "gram",
            //   type: "EnergyConsumed"
            // };
            // AppleHealthKit.getNutritionSamples(
            //   options_EnergyConsumed,
            //   (err: Object, results: Object) => {
            //     if (err) {
            //       return;
            //     }
            //     console.log("Nutrition EnergyConsumed==>");
            //     console.log(results);
            //   }
            // );

            // let options_Water = {
            //   startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
            //   endDate: new Date().toISOString(),
            //   unit: "gram",
            //   type: "Water"
            // };
            // AppleHealthKit.getNutritionSamples(
            //   options_Water,
            //   (err: Object, results: Object) => {
            //     if (err) {
            //       return;
            //     }
            //     console.log("Nutrition Water==>");
            //     console.log(results);
            //   }
            // );

      } else {
        showMessage({
          message: 'You have to click Apple Health button on iPhone device',
          type: 'warning',
        });
      }
    }
  }

  render() {
    const { isApple, isFitbit, isGoogleFit } = this.state;
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
          <TouchableOpacity onPress={() => this.clickedDevice('health')}>
            <View style={isApple ? styles.clickedView : styles.unClickedView}>
              <Image
                source={require('../../assets/images/redesign/applehealth_logo.png')}
                style={styles.iconImg}
              />
              <Text style={isApple ? styles.clickedTxt : styles.unClickedTxt}>
                Apple Health
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.clickedDevice('fitbit')}>
            <View style={isFitbit ? styles.clickedView : styles.unClickedView}>
              <Image
                source={require('../../assets/images/redesign/fitbit_logo.png')}
                style={styles.iconImg}
              />
              <Text style={isFitbit ? styles.clickedTxt : styles.unClickedTxt}>
                Fitbit
              </Text>
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
});

const mapStateToProps = state => ({
  sourceSettingsList: state.sourceSettings.sourceSettingsList,
  appleHealthPermission: state.devicesSettings.appleHealthPermission,
});

const mapDispatchToProps = dispatch => ({
  setAppleHealthSettings: data => dispatch(setAppleHealthSettings(data))
});

export default withSubscriptionActions(
  DeviceListSceen,
  mapStateToProps,
  mapDispatchToProps
);
