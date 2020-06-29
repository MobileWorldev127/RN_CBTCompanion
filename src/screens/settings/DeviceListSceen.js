import React, { Component, Fragment } from "react";
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
  Linking
} from "react-native";
import Icon from "../../common/icons";
import { Auth, Storage, Logger } from "aws-amplify";
import { NavigationActions } from "react-navigation";
import PhoneInput from "react-native-phone-input";
import validator from "validator";
import Header from "../../components/Header";
let moment = require("moment");
import ImagePicker from "react-native-image-picker";
import { withSubscriptionActions } from "../../utils/StoreUtils";
import { showMessage } from "react-native-flash-message";
import { errorMessage } from "../../utils";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";
import { requestCameraPermission } from "../../utils/PermissionUtils";
import ThemeStyle from "../../styles/ThemeStyle";
import Button from "../../components/Button";
import { Alert } from "react-native";
import TextStyles from "../../common/TextStyles";
import qs from "qs";
import config from "./../../constants/AppConfigs";
import AppleHealthKit from "rn-apple-healthkit";
import GoogleFit, { Scopes } from "react-native-google-fit";

const screenWidth = Dimensions.get("window").width;

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
      token: ""
    };
  }

  goack = () => this.props.navigation.dispatch(NavigationActions.back());

  clickedDevice(val) {
    if (val === "google_fit") {
      GoogleFit.checkIsAuthorized();
      const options = {
        scopes: [
          Scopes.FITNESS_ACTIVITY_READ_WRITE,
          Scopes.FITNESS_BODY_READ_WRITE
        ]
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
        isGoogleFit: true
      });
    } else if (val === "fitbit") {
      OAuth(config.Fitbit.client_id, access_token => {
        fetch("https://api.fitbit.com/1.2/user/-/sleep/date/2017-06-27.json", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`
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
              token: access_token
            });
          })
          .catch(err => {
            console.error("Error: ", err);
          });
      });
    } else {
      if (Platform.OS === "ios") {
        const { sourceSettingsList } = this.props;
        let arr = ["ActiveEnergyBurned"];
        if (
          sourceSettingsList &&
          sourceSettingsList.activitySetting == "Apple"
        ) {
          arr.push("StepCount", "DistanceWalkingRunning");
        }
        if (sourceSettingsList && sourceSettingsList.sleepSetting == "Apple") {
          arr.push("SleepAnalysis");
        }
        if (sourceSettingsList && sourceSettingsList.heartSetting == "Apple") {
          arr.push("HeartRate", "RestingHeartRate", "HeartRateVariability");
        }
        if (
          sourceSettingsList &&
          sourceSettingsList.mindfulnessSetting == "Apple"
        ) {
          arr.push("MindfulSession");
        }
        if (
          sourceSettingsList &&
          sourceSettingsList.nutritionSetting == "Apple"
        ) {
          arr.push(
            "Biotin",
            "Caffeine",
            "Calcium",
            "Carbohydrates",
            "Chloride",
            "Cholesterol",
            "Copper",
            "EnergyConsumed",
            "FatMonounsaturated",
            "FatPolyunsaturated",
            "FatSaturated",
            "FatTotal",
            "Fiber",
            "Folate",
            "Iodine",
            "Iron",
            "Magnesium",
            "Manganese",
            "Molybdenum",
            "Niacin",
            "PantothenicAcid",
            "Phosphorus",
            "Potassium",
            "Protein",
            "Riboflavin",
            "Selenium",
            "Sodium",
            "Sugar",
            "Thiamin",
            "VitaminA",
            "VitaminB12",
            "VitaminB6",
            "VitaminC",
            "VitaminD",
            "VitaminE",
            "VitaminK",
            "Zinc",
            "Water"
          );
        }
        let optionsPermission = {
          permissions: {
            read: arr
          }
        };
        
        

        AppleHealthKit.initHealthKit(optionsPermission, (err, results) => {
          if (err) {
            console.log("error initializing Healthkit: ", err);
            return;
          }
          let options = {
            startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(), 
            endDate: new Date().toISOString(),
            unit: "mile" 
          };
          if (
            sourceSettingsList &&
            sourceSettingsList.activitySetting == "Apple"
          ) {
           
            AppleHealthKit.getActiveEnergyBurned(
              options,
              (err: Object, results: Array<Object>) => {
                if (err) {
                  return;
                }
                console.log("Active Energy Burned==>");
                console.log(results);
              }
            );
  
            AppleHealthKit.getDistanceWalkingRunning(
              options,
              (err: Object, results: Array<Object>) => {
                if (err) {
                  return;
                }
                console.log("Active DistanceWalkingRunning==>");
                console.log(results);
              }
            );
            AppleHealthKit.getStepCount(
              options,
              (err: Object, results: Array<Object>) => {
                if (err) {
                  return;
                }
                console.log("Active Steps==>");
                console.log(results);
              }
            );
          }

          if (sourceSettingsList && sourceSettingsList.sleepSetting == "Apple") {
            AppleHealthKit.getSleepSamples(
              options,
              (err: Object, results: Array<Object>) => {
                if (err) {
                  return;
                }
                console.log("Sleep==>");
                console.log(results);
              }
            );
          }

          if (sourceSettingsList && sourceSettingsList.heartSetting == "Apple") {
            let options1 = {
              unit: "bpm",
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              ascending: false,
              limit: 10
            };
  
            AppleHealthKit.getHeartRateSamples(
              options1,
              (err: Object, results: Array<Object>) => {
                if (err) {
                  return;
                }
                console.log("Heart Rate==>");
                console.log(results);
              }
            );
  
            AppleHealthKit.getRestingHeartRateSamples(
              options1,
              (err: Object, results: Array<Object>) => {
                if (err) {
                  return;
                }
                console.log("Resting Heart Rate==>");
                console.log(results);
              }
            );
  
            AppleHealthKit.getHeartRateVariabilitySamples(
              options1,
              (err: Object, results: Array<Object>) => {
                if (err) {
                  return;
                }
                console.log("Heart Rate Variability==>");
                console.log(results);
              }
            );
          }

          if (
            sourceSettingsList &&
            sourceSettingsList.mindfulnessSetting == "Apple"
          ) {
            let options3 = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              limit: 10
            };
            AppleHealthKit.getMindfulSession(
              options3,
              (err: string, results: Object) => {
                if (err) {
                  console.log("error getting mindful session: ", err);
                  return;
                }
                console.log("Mindfulness==>");
                console.log(results);
              }
            );
          }
          
          if (
            sourceSettingsList &&
            sourceSettingsList.nutritionSetting == "Apple"
          ) {
            let options_fiber = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "Fiber"
            };
  
            AppleHealthKit.getNutritionSamples(
              options_fiber,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition Fiber==>");
                console.log(results);
              }
            );
  
            let options_calcium = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "Calcium"
            };
  
            AppleHealthKit.getNutritionSamples(
              options_calcium,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition Calcium==>");
                console.log(results);
              }
            );

            let options_Biotin = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "Biotin"
            };  
            AppleHealthKit.getNutritionSamples(
              options_Biotin,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition Biotin==>");
                console.log(results);
              }
            );

            let options_Caffeine = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "Caffeine"
            };  
            AppleHealthKit.getNutritionSamples(
              options_Caffeine,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition Caffeine==>");
                console.log(results);
              }
            );

            let options_Carbohydrates = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "Carbohydrates"
            };  
            AppleHealthKit.getNutritionSamples(
              options_Carbohydrates,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition Carbohydrates==>");
                console.log(results);
              }
            );

            let options_Chloride = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "Chloride"
            };  
            AppleHealthKit.getNutritionSamples(
              options_Chloride,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition Chloride==>");
                console.log(results);
              }
            );

            let options_Cholesterol = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "Cholesterol"
            };  
            AppleHealthKit.getNutritionSamples(
              options_Cholesterol,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition Cholesterol==>");
                console.log(results);
              }
            );

            let options_Copper = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "Copper"
            };  
            AppleHealthKit.getNutritionSamples(
              options_Copper,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition Copper==>");
                console.log(results);
              }
            );

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

            let options_FatMonounsaturated = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "FatMonounsaturated"
            };  
            AppleHealthKit.getNutritionSamples(
              options_FatMonounsaturated,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition FatMonounsaturated==>");
                console.log(results);
              }
            );

            let options_FatPolyunsaturated = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "FatPolyunsaturated"
            };  
            AppleHealthKit.getNutritionSamples(
              options_FatPolyunsaturated,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition FatPolyunsaturated==>");
                console.log(results);
              }
            );

            let options_FatSaturated = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "FatSaturated"
            };  
            AppleHealthKit.getNutritionSamples(
              options_FatSaturated,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition FatSaturated==>");
                console.log(results);
              }
            );

            let options_FatTotal = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "FatTotal"
            };  
            AppleHealthKit.getNutritionSamples(
              options_FatTotal,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition FatTotal==>");
                console.log(results);
              }
            );

            let options_Folate = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "Folate"
            };  
            AppleHealthKit.getNutritionSamples(
              options_Folate,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition Folate==>");
                console.log(results);
              }
            );

            let options_Iodine = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "Iodine"
            };  
            AppleHealthKit.getNutritionSamples(
              options_Iodine,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition Iodine==>");
                console.log(results);
              }
            );

            let options_Iron = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "Iron"
            };  
            AppleHealthKit.getNutritionSamples(
              options_Iron,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition Iron==>");
                console.log(results);
              }
            );

            let options_Magnesium = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "Magnesium"
            };  
            AppleHealthKit.getNutritionSamples(
              options_Magnesium,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition Magnesium==>");
                console.log(results);
              }
            );

            let options_Manganese = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "Manganese"
            };  
            AppleHealthKit.getNutritionSamples(
              options_Manganese,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition Manganese==>");
                console.log(results);
              }
            );

            let options_Molybdenum = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "Molybdenum"
            };  
            AppleHealthKit.getNutritionSamples(
              options_Molybdenum,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition Molybdenum==>");
                console.log(results);
              }
            );

            let options_Niacin = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "Niacin"
            };  
            AppleHealthKit.getNutritionSamples(
              options_Niacin,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition Niacin==>");
                console.log(results);
              }
            );

            let options_PantothenicAcid = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "PantothenicAcid"
            };  
            AppleHealthKit.getNutritionSamples(
              options_PantothenicAcid,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition PantothenicAcid==>");
                console.log(results);
              }
            );

            let options_Phosphorus = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "Phosphorus"
            };  
            AppleHealthKit.getNutritionSamples(
              options_Phosphorus,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition Phosphorus==>");
                console.log(results);
              }
            );

            let options_Potassium = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "Potassium"
            };  
            AppleHealthKit.getNutritionSamples(
              options_Potassium,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition Potassium==>");
                console.log(results);
              }
            );

            let options_Protein = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "Protein"
            };  
            AppleHealthKit.getNutritionSamples(
              options_Protein,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition Protein==>");
                console.log(results);
              }
            );

            let options_Riboflavin = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "Riboflavin"
            };  
            AppleHealthKit.getNutritionSamples(
              options_Riboflavin,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition Riboflavin==>");
                console.log(results);
              }
            );

            let options_Selenium = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "Selenium"
            };  
            AppleHealthKit.getNutritionSamples(
              options_Selenium,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition Selenium==>");
                console.log(results);
              }
            );

            let options_Sodium = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "Sodium"
            };  
            AppleHealthKit.getNutritionSamples(
              options_Sodium,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition Sodium==>");
                console.log(results);
              }
            );

            let options_Sugar = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "Sugar"
            };  
            AppleHealthKit.getNutritionSamples(
              options_Sugar,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition Sugar==>");
                console.log(results);
              }
            );

            let options_Thiamin = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "Thiamin"
            };  
            AppleHealthKit.getNutritionSamples(
              options_Thiamin,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition Thiamin==>");
                console.log(results);
              }
            );

            let options_VitaminA = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "VitaminA"
            };  
            AppleHealthKit.getNutritionSamples(
              options_VitaminA,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition VitaminA==>");
                console.log(results);
              }
            );

            let options_VitaminB12 = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "VitaminB12"
            };  
            AppleHealthKit.getNutritionSamples(
              options_VitaminB12,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition VitaminB12==>");
                console.log(results);
              }
            );

            let options_VitaminB6 = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "VitaminB6"
            };  
            AppleHealthKit.getNutritionSamples(
              options_VitaminB6,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition VitaminB6==>");
                console.log(results);
              }
            );

            let options_VitaminC = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "VitaminC"
            };  
            AppleHealthKit.getNutritionSamples(
              options_VitaminC,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition VitaminC==>");
                console.log(results);
              }
            );

            let options_VitaminD = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "VitaminD"
            };  
            AppleHealthKit.getNutritionSamples(
              options_VitaminD,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition VitaminD==>");
                console.log(results);
              }
            );

            let options_VitaminE = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "VitaminE"
            };  
            AppleHealthKit.getNutritionSamples(
              options_VitaminE,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition VitaminE==>");
                console.log(results);
              }
            );

            let options_VitaminK = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "VitaminK"
            };  
            AppleHealthKit.getNutritionSamples(
              options_VitaminK,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition VitaminK==>");
                console.log(results);
              }
            );

            let options_Zinc = {
              startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
              endDate: new Date().toISOString(),
              unit: "gram",
              type: "Zinc"
            };  
            AppleHealthKit.getNutritionSamples(
              options_Zinc,
              (err: Object, results: Object) => {
                if (err) {
                  return;
                }
                console.log("Nutrition Zinc==>");
                console.log(results);
              }
            );

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

          }

          this.setState({
            isApple: true,
            isFitbit: false,
            isGoogleFit: false
          });
        });
      } else {
        showMessage({
          message: "You have to click Apple Health button on iPhone device",
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
              style={{ position: "relative", top: 1, flexDirection: "row" }}
            >
              <TouchableOpacity
                style={{ marginLeft: 8, marginTop: 3 }}
                onPress={() => {
                  this.setState({
                    showInstructions: true,
                    instructions: this.exerciseData.instructions
                  });
                }}
              >
                <Icon
                  family={"EvilIcons"}
                  name={"question"}
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
            <View style={isApple ? styles.clickedView : styles.unClickedView}>
              <Image
                source={require("../../assets/images/redesign/applehealth_logo.png")}
                style={styles.iconImg}
              />
              <Text style={isApple ? styles.clickedTxt : styles.unClickedTxt}>
                Apple Health
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.clickedDevice("fitbit")}>
            <View style={isFitbit ? styles.clickedView : styles.unClickedView}>
              <Image
                source={require("../../assets/images/redesign/fitbit_logo.png")}
                style={styles.iconImg}
              />
              <Text style={isFitbit ? styles.clickedTxt : styles.unClickedTxt}>
                Fitbit
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.clickedDevice("google_fit")}>
            <View
              style={isGoogleFit ? styles.clickedView : styles.unClickedView}
            >
              <Image
                source={require("../../assets/images/redesign/googlefit_logo.png")}
                style={styles.iconImg}
              />
              <Text
                style={isGoogleFit ? styles.clickedTxt : styles.unClickedTxt}
              >
                {" "}
                Google Fit
              </Text>
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
    justifyContent: "space-between"
  },
  clickedView: {
    width: (screenWidth - 20) / 3 - 15,
    height: (screenWidth - 20) / 3 - 15,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "blue"
  },
  unClickedView: {
    width: (screenWidth - 20) / 3 - 15,
    height: (screenWidth - 20) / 3 - 15,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10
  },
  clickedTxt: {
    marginTop: 10,
    color: "blue",
    fontSize: 16
  },
  unClickedTxt: {
    marginTop: 10,
    color: "black",
    fontSize: 16
  },
  iconImg: {
    width: 30,
    height: 30,
    resizeMode: "contain"
  }
});

const mapStateToProps = state => ({
  sourceSettingsList: state.sourceSettings.sourceSettingsList
});

const mapDispatchToProps = dispatch => ({});

export default withSubscriptionActions(
  DeviceListSceen,
  mapStateToProps,
  mapDispatchToProps
);
