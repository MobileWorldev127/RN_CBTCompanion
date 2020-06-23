import React, { Component, Fragment } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
  StyleSheet,
  Linking,
} from 'react-native';
import Icon from '../../common/icons';
import { Auth, Storage, Logger } from 'aws-amplify';
import { NavigationActions } from 'react-navigation';
import PhoneInput from 'react-native-phone-input';
import validator from 'validator';
import Header from '../../components/Header';
import ImagePicker from 'react-native-image-picker';
import { withSubscriptionActions } from '../../utils/StoreUtils';
import { showMessage } from 'react-native-flash-message';
import { errorMessage } from '../../utils';
import { recordScreenEvent, screenNames } from '../../utils/AnalyticsUtils';
import { requestCameraPermission } from '../../utils/PermissionUtils';
import ThemeStyle from '../../styles/ThemeStyle';
import Button from '../../components/Button';
import { Alert } from 'react-native';
import TextStyles from '../../common/TextStyles';
import qs from "qs";
import config from "./config.js";
import AppleHealthKit from 'rn-apple-healthkit'
import GoogleFit, { Scopes } from 'react-native-google-fit'

const screenWidth = Dimensions.get('window').width;



function OAuth(client_id, cb) {
  Linking.addEventListener("url", handleUrl);
  function handleUrl(event) {
    console.log(event.url);
    Linking.removeEventListener("url", handleUrl);
    const [, query_string] = event.url.match(/\#(.*)/);
    console.log(query_string);
    const query = qs.parse(query_string);
    console.log(`query: ${JSON.stringify(query)}`);
    cb(query.access_token);
    
  }
  const oauthurl = `https://www.fitbit.com/oauth2/authorize?${qs.stringify({
    client_id,
    response_type: "token",
    scope: "heartrate activity activity profile sleep",
    redirect_uri: "CBTCompanion://fit",
    expires_in: "31536000"
  })}`;
  console.log(oauthurl);
  Linking.openURL(oauthurl).catch(err =>
    console.error("Error processing linking", err)
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
      token: ''
    };
  }

  goack = () => this.props.navigation.dispatch(NavigationActions.back());

  clickedDevice(val) {
    if (val === "google_fit") {
      GoogleFit.checkIsAuthorized()
      const options = {
        scopes: [
          Scopes.FITNESS_ACTIVITY_READ_WRITE,
          Scopes.FITNESS_BODY_READ_WRITE,
        ],
      }
      GoogleFit.authorize(options)
        .then(authResult => {
          if (authResult.success) {
            console.log('1---')
            console.log(authResult);
          } else {
            // dispatch("AUTH_DENIED", authResult.message);
            console.log('2---')
            console.log(authResult);
          }
        })
        .catch(() => {
          console.log('3---')
          // dispatch("AUTH_ERROR");
        })


      this.setState({
        isApple: false,
        isFitbit: false,
        isGoogleFit: true,
      });
    } else if (val === "fitbit") {
      OAuth(config.client_id, (access_token) => {
        fetch("https://api.fitbit.com/1.2/user/-/sleep/date/2017-06-27.json", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`,
          }
          // body: `root=auto&path=${Math.random()}`
        })
          .then(res => res.json())
          .then(res => {
            console.log(`res: ${JSON.stringify(res)}`);
            this.setState({
              isApple: false,
              isFitbit: true,
              isGoogleFit: false,
              token: access_token,
            });
          })
          .catch(err => {
            console.error("Error: ", err);
          });
      })
    } else {
      if (Platform.OS === 'ios'){
        const { sourceSettingsList } = this.props;
        // let arr = ['ActiveEnergyBurned', 'SleepAnalysis', 'HeartRate', 'MindfulSession', 'Fiber'];
        let arr = ["MindfulSession", "HeartRate", "RestingHeartRate", "HeartRateVariability", "StepCount", "BodyMassIndex", "Biotin", "Caffeine", "Calcium", "Carbohydrates", "Chloride", "Cholesterol", "Copper", "EnergyConsumed", "FatMonounsaturated", "FatPolyunsaturated", "FatSaturated", "FatTotal", "Fiber", "Folate", "Iodine", "Iron", "Magnesium", "Manganese", "Molybdenum", "Niacin", "PantothenicAcid", "Phosphorus", "Potassium", "Protein", "Riboflavin", "Selenium", "Sodium", "Sugar", "Thiamin", "VitaminA", "VitaminB12", "VitaminB6", "VitaminC", "VitaminD", "VitaminE", "VitaminK", "Zinc", "Workout"]
        if (sourceSettingsList && sourceSettingsList.activitySetting == 'Apple') {
          arr.push('ActiveEnergyBurned')
        }
        if (sourceSettingsList && sourceSettingsList.sleepSetting == 'Apple') {
          arr.push('SleepAnalysis')
        }
        if (sourceSettingsList && sourceSettingsList.heartSetting == 'Apple') {
          arr.push('HeartRate')
        }
        if (sourceSettingsList && sourceSettingsList.mindfulnessSetting == 'Apple') {
          arr.push('MindfulSession')
        }
        if (sourceSettingsList && sourceSettingsList.nutritionSetting == 'Apple') {
          arr.push('BasalEnergyBurned')
        }
        let options = {
          permissions: {
            read: arr,
          }
        };
  
        AppleHealthKit.initHealthKit(options, (err, results) => {
          if (err) {
            console.log("error initializing Healthkit: ", err);
            return;
          }
  
          let d = new Date(2016,1,1);
          let options = {
              startDate: (new Date(2020,5,1)).toISOString(), // required
              endDate: (new Date()).toISOString(), // optional; default now
          };
          console.log('->', options)
          AppleHealthKit.getActiveEnergyBurned(options, (err: Object, results: Array<Object>) => {
              if (err) {
                  return;
              }
              console.log('Active Energy Burned==>')
              console.log(results)
          });

          let options5 = {
            unit: 'mile', // optional; default 'meter'
            date: (new Date(2016,5,1)).toISOString(), // optional; default now
          };
          AppleHealthKit.getDistanceWalkingRunning(options5, (err: Object, results: Array<Object>) => {
            if (err) {
                return;
            }
            console.log('Active DistanceWalkingRunning==>')
            console.log(results)
          });
          AppleHealthKit.getActiveEnergyBurned(options, (err: Object, results: Array<Object>) => {
            if (err) {
                return;
            }
            console.log('Active Steps==>')
            console.log(results)
          });

          // AppleHealthKit.getSleepSamples(options, (err: Object, results: Array<Object>) => {
          //   if (err) {
          //     return;
          //   }
          //   console.log('Sleep==>')
          //   console.log(results)
          // });

          // let options2 = {
          //   startDate: (new Date(2020,5,1)).toISOString(), // required
          //   endDate: (new Date()).toISOString(),
          //   limit: 10
          // };
          // AppleHealthKit.getMindfulSession(options2, (err: string, results: Object) => {
          //   if (err) {
          //     console.log("error getting mindful session: ", err);
          //     return;
          //   }
          //   console.log('Mindfulness==>')
          //   console.log(results)
          // });

          // let options1 = {
          //   unit: 'bpm', 
          //   startDate: (new Date(2020,5,1)).toISOString(), 
          //   endDate: (new Date()).toISOString(), 
          //   ascending: false, 
          //   limit:10, 
          // };
          
          // AppleHealthKit.getHeartRateSamples(options1, (err: Object, results: Array<Object>) => {
          //   if (err) {
          //     return;
          //   }
          //   console.log('Heart Rate==>')
          //   console.log(results)
          // });

          // AppleHealthKit.getRestingHeartRateSamples(options1, (err: Object, results: Array<Object>) => {
          //   if (err) {
          //     return;
          //   }
          //   console.log('Resting Heart Rate==>')
          //   console.log(results)
          // });

          // AppleHealthKit.getHeartRateVariabilitySamples(options1, (err: Object, results: Array<Object>) => {
          //   if (err) {
          //     return;
          //   }
          //   console.log('Heart Rate Variability==>')
          //   console.log(results)
          // });

          // let options3 = {
          //   startDate: (new Date(2020,5,1)).toISOString(), 
          //   endDate: (new Date()).toISOString(),
          //   unit: 'gram' ,
          //   type: 'Fiber'
          // };

          // AppleHealthKit.getNutritionSamples(options3, (err: Object, results: Object) => {
          //   if (err) {
          //     return;
          //   }
          //   console.log('Nutrition Fiber==>')
          //   console.log(results)
          // });

          // let options4 = {
          //   startDate: (new Date(2020,5,1)).toISOString(), 
          //   endDate: (new Date()).toISOString(),
          //   unit: 'gram' ,
          //   type: 'Calcium'
          // };

          // AppleHealthKit.getNutritionSamples(options4, (err: Object, results: Object) => {
          //   if (err) {
          //     return;
          //   }
          //   console.log('Nutrition Calcium==>')
          //   console.log(results)
          // });

          this.setState({
            isApple: true,
            isFitbit: false,
            isGoogleFit: false
          });
      })
      
        
    }
    else {
      showMessage({
        message:'You have to click Apple Health button on iPhone device',
        type: "warning"
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
          <TouchableOpacity onPress={() => this.clickedDevice("health")}>
            <View style={isApple ? styles.clickedView:styles.unClickedView}>
              <Image source={require('../../assets/images/redesign/applehealth_logo.png')} style={styles.iconImg}/>
              <Text style={isApple ? styles.clickedTxt : styles.unClickedTxt}>Apple Health</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.clickedDevice("fitbit")}>
            <View style={isFitbit ? styles.clickedView:styles.unClickedView}>
              <Image source={require('../../assets/images/redesign/fitbit_logo.png')} style={styles.iconImg}/>
              <Text style={isFitbit ? styles.clickedTxt : styles.unClickedTxt}>Fitbit</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.clickedDevice("google_fit")}>
            <View
              style={isGoogleFit ? styles.clickedView : styles.unClickedView}
            >
              <Image source={require('../../assets/images/redesign/googlefit_logo.png')} style={styles.iconImg}/>
              <Text
                style={isGoogleFit ? styles.clickedTxt : styles.unClickedTxt}
              > Google Fit</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <Text 
          style={{
            marginTop: 50,
            marginHorizontal: 25
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
    flexDirection: "row",
    justifyContent: "space-between",
  },
  clickedView: {
    width: (screenWidth -  20) / 3 - 15,
    height: (screenWidth - 20) / 3 - 15,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "blue",
  },
  unClickedView: {
    width: (screenWidth -  20) / 3 - 15,
    height: (screenWidth - 20) / 3 - 15,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  clickedTxt: {
    marginTop: 10,
    color: "blue",
    fontSize: 16,
  },
  unClickedTxt: {
    marginTop: 10,
    color: "black",
    fontSize: 16,
  },
  iconImg: {
    width: 30,
    height: 30,
    resizeMode: 'contain'
  }
});


const mapStateToProps = state => ({
  sourceSettingsList: state.sourceSettings.sourceSettingsList
});

const mapDispatchToProps = dispatch => ({
});

export default withSubscriptionActions(
  DeviceListSceen,
  mapStateToProps,
  mapDispatchToProps
);
