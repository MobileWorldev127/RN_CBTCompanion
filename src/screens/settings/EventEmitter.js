import { NativeAppEventEmitter } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import BackgroundFetch from 'react-native-background-fetch';
import AppleHealthKit from 'rn-apple-healthkit';
import { API } from "aws-amplify";
import Amplify from "aws-amplify";
import { logAppleDataMutation } from "../../queries/addEntry";

export async function EmiiterHandlerSubscribe(val_permissoin) {
  let permissionOptions = {
    permissions: {
      read: ['StepCount'],
    },
  }
  let indexSum = 0;
  let arr = [];
  const device = await AsyncStorage.getItem('DEVICE');
  const last_logged_time = await AsyncStorage.getItem('LAST_BACKGROUND_TIME');
  if (device == 'APPLEHEALTH') {
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
      'ActiveEnergyBurned',
      'StepCount', 'DistanceWalkingRunning', 'SleepAnalysis', 'HeartRate', 'RestingHeartRate', 'HeartRateVariability', 'MindfulSession'
    );

  permissionOptions = {
    permissions: {
      read: arr,
    },
  };

  AppleHealthKit.initHealthKit(permissionOptions, err => {
    if (err) {
      console.log("error initializing Healthkit: ", err);
      return;
    }
    AppleHealthKit.setObserver({ type: "Walking" });
    AppleHealthKit.setObserver({ type: "Running" });
    AppleHealthKit.setObserver({ type: "Sleep" });
    AppleHealthKit.setObserver({ type: "ActiveEnergyBurned" });
    AppleHealthKit.setObserver({ type: "HeartRate" });
    AppleHealthKit.setObserver({ type: "RestingHeartRate" });
    AppleHealthKit.setObserver({ type: "HeartRateVariability" });
    AppleHealthKit.setObserver({ type: "MindfulSession" });
    AppleHealthKit.setObserver({ type: "Biotin" });
    AppleHealthKit.setObserver({ type: "Caffeine" });
    AppleHealthKit.setObserver({ type: "Calcium" });
    AppleHealthKit.setObserver({ type: "Carbohydrates" });
    AppleHealthKit.setObserver({ type: "Chloride" });
    AppleHealthKit.setObserver({ type: "Cholesterol" });
    AppleHealthKit.setObserver({ type: "Copper" });
    AppleHealthKit.setObserver({ type: "EnergyConsumed" });
    AppleHealthKit.setObserver({ type: "FatMonounsaturated" });
    AppleHealthKit.setObserver({ type: "FatPolyunsaturated" });
    AppleHealthKit.setObserver({ type: "FatSaturated" });
    AppleHealthKit.setObserver({ type: "FatTotal" });
    AppleHealthKit.setObserver({ type: "Fiber" });
    AppleHealthKit.setObserver({ type: "Folate" });
    AppleHealthKit.setObserver({ type: "Iodine" });
    AppleHealthKit.setObserver({ type: "Iron" });
    AppleHealthKit.setObserver({ type: "Magnesium" });
    AppleHealthKit.setObserver({ type: "Manganese" });
    AppleHealthKit.setObserver({ type: "Molybdenum" });
    AppleHealthKit.setObserver({ type: "HeartRate" });
    AppleHealthKit.setObserver({ type: "Niacin" });
    AppleHealthKit.setObserver({ type: "PantothenicAcid" });
    AppleHealthKit.setObserver({ type: "Phosphorus" });
    AppleHealthKit.setObserver({ type: "Potassium" });
    AppleHealthKit.setObserver({ type: "Protein" });
    AppleHealthKit.setObserver({ type: "Riboflavin" });
    AppleHealthKit.setObserver({ type: "Selenium" });
    AppleHealthKit.setObserver({ type: "Sodium" });
    AppleHealthKit.setObserver({ type: "Sugar" });
    AppleHealthKit.setObserver({ type: "Thiamin" });
    AppleHealthKit.setObserver({ type: "VitaminA" });
    AppleHealthKit.setObserver({ type: "VitaminB12" });
    AppleHealthKit.setObserver({ type: "VitaminB6" });
    AppleHealthKit.setObserver({ type: "VitaminC" });
    AppleHealthKit.setObserver({ type: "VitaminD" });
    AppleHealthKit.setObserver({ type: "VitaminE" });
    AppleHealthKit.setObserver({ type: "VitaminK" });
    AppleHealthKit.setObserver({ type: "Zinc" });
    AppleHealthKit.setObserver({ type: "Water" });

    NativeAppEventEmitter.addListener("observer", () => {
      
      indexSum = 0;
      let options = {
        startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
        endDate: new Date().toISOString(),
        limit: 1000
      };

      // let options = {
      //   startDate: new Date(new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString().setHours(0, 0, 0, 0)).toISOString(),
      //   endDate: new Date().toISOString(),
      //   limit: 1000
      // };

      
      // console.log('$$$$$', new Date(new Date(new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString()).setHours(0,0,0)).toISOString())
      // console.log(new Date())

      AppleHealthKit.getMindfulSession(
        options,
        (err: Object, results_mindfulness: Array<Object>) => {
          if (err) {
            console.log('####', err)
            return;
          }
          console.log('Mindfulness==>');
          console.log(results_mindfulness);
          
          let options_heart = {
            unit: "bpm",
            startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
            endDate: new Date().toISOString(),
            ascending: false,
            limit: 1000
          };
          AppleHealthKit.getHeartRateSamples(
            options_heart,
            (err: Object, results_heartRate: Array<Object>) => {
              if (err) {
                return;
              }
              console.log("HeartRate==>");
              console.log(results_heartRate);
              AppleHealthKit.getRestingHeartRateSamples(
                options_heart,
                (err: Object, results_restingHeartRate: Array<Object>) => {
                  if (err) {
                    return;
                  }
                  console.log("Resting Heart Rate==>");
                  console.log(results_restingHeartRate);
                  AppleHealthKit.getHeartRateVariabilitySamples(
                    options_heart,
                    (err: Object, results_heartRateVariability: Array<Object>) => {
                      if (err) {
                        return;
                      }
                      console.log("Heart Rate Variability==>");
                      console.log(results_heartRateVariability);
                      let options_steps = {
                        startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                        endDate: new Date().toISOString(),
                      };
                      AppleHealthKit.getStepCount(
                        options_steps,
                        (err: Object, results_steps: Object) => {
                          if (err) {
                            console.log(err)
                          }
                          console.log("Steps==>");
                          console.log(results_steps);
                          AppleHealthKit.getActiveEnergyBurned(
                            (options_steps: Object),
                            (err: Object, results_activeEnergy: Object) => {
                              if (err) {
                                console.log(err)
                              }
                              console.log("Active Energy==>");
                              console.log(results_activeEnergy);
                              let options_active = {
                                startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                endDate: new Date().toISOString(),
                                unit: "mile"
                              };
                              AppleHealthKit.getDistanceWalkingRunning(
                                options_active,
                                (err: Object, results_distanceWalkingRunning: Object) => {
                                  if (err) {
                                    console.log(err)
                                  }
                                  console.log("Walking + Running Distnace==>");
                                  console.log(results_distanceWalkingRunning);
                                  AppleHealthKit.getSleepSamples(
                                    options,
                                    (err: Object, results_sleep: Array<Object>) => {
                                      if (err) {
                                        return;
                                      }
                                      console.log("Sleep==>");
                                      console.log(results_sleep);
                                          let options_Biotin = {
                                                startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                endDate: new Date().toISOString(),
                                                unit: "gram",
                                                type: "Biotin"
                                              };
                                          AppleHealthKit.getNutritionSamples(
                                            options_Biotin,
                                            (err: Object, results_Biotin: Object) => {
                                              if (err) {
                                                return;
                                              }
                                              console.log("Nutrition Biotin==>");
                                              console.log(results_Biotin);
                                              let options_Caffeine = {
                                                startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                endDate: new Date().toISOString(),
                                                unit: "gram",
                                                type: "Caffeine"
                                              };
                                              AppleHealthKit.getNutritionSamples(
                                                options_Caffeine,
                                                (err: Object, results_caffeine: Object) => {
                                                  if (err) {
                                                    return;
                                                  }
                                                  console.log("Nutrition Caffeine==>");
                                                  console.log(results_caffeine);
                                                  let options_calcium = {
                                                    startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                    endDate: new Date().toISOString(),
                                                    unit: "gram",
                                                    type: "Calcium"
                                                  };                                        
                                                  AppleHealthKit.getNutritionSamples(
                                                    options_calcium,
                                                    (err: Object, results_calcium: Object) => {
                                                      if (err) {
                                                        return;
                                                      }
                                                      console.log("Nutrition Calcium==>");
                                                      console.log(results_calcium);
                                                      let options_Carbohydrates = {
                                                        startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                        endDate: new Date().toISOString(),
                                                        unit: "gram",
                                                        type: "Carbohydrates"
                                                      };
                                                      AppleHealthKit.getNutritionSamples(
                                                        options_Carbohydrates,
                                                        (err: Object, results_carbohydrates: Object) => {
                                                          if (err) {
                                                            return;
                                                          }
                                                          console.log("Nutrition Carbohydrates==>");
                                                          console.log(results_carbohydrates);
                                                          let options_Chloride = {
                                                            startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                            endDate: new Date().toISOString(),
                                                            unit: "gram",
                                                            type: "Chloride"
                                                          };
                                                          AppleHealthKit.getNutritionSamples(
                                                            options_Chloride,
                                                            (err: Object, results_chloride: Object) => {
                                                              if (err) {
                                                                return;
                                                              }
                                                              console.log("Nutrition Chloride==>");
                                                              console.log(results_chloride);
                                                              let options_Copper = {
                                                                startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                endDate: new Date().toISOString(),
                                                                unit: "gram",
                                                                type: "Copper"
                                                              };
                                                              AppleHealthKit.getNutritionSamples(
                                                                options_Copper,
                                                                (err: Object, results_copper: Object) => {
                                                                  if (err) {
                                                                    return;
                                                                  }
                                                                  console.log("Nutrition Copper==>");
                                                                  console.log(results_copper);
                                                                  let options_Cholesterol = {
                                                                    startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                    endDate: new Date().toISOString(),
                                                                    unit: "gram",
                                                                    type: "Cholesterol"
                                                                  };
                                                                  AppleHealthKit.getNutritionSamples(
                                                                    options_Cholesterol,
                                                                    (err: Object, results_cholesterol: Object) => {
                                                                      if (err) {
                                                                        return;
                                                                      }
                                                                      console.log("Nutrition Cholesterol==>");
                                                                      console.log(results_cholesterol);
                                                                      let options_Sugar = {
                                                                        startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                        endDate: new Date().toISOString(),
                                                                        unit: "gram",
                                                                        type: "Sugar"
                                                                      };
                                                                      AppleHealthKit.getNutritionSamples(
                                                                        options_Sugar,
                                                                        (err: Object, results_sugar: Object) => {
                                                                          if (err) {
                                                                            return;
                                                                          }
                                                                          console.log("Nutrition Sugar==>");
                                                                          console.log(results_sugar);
                                                                          let options_fiber = {
                                                                            startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                            endDate: new Date().toISOString(),
                                                                            unit: "gram",
                                                                            type: "Fiber"
                                                                          };
                                                                          AppleHealthKit.getNutritionSamples(
                                                                            options_fiber,
                                                                            (err: Object, results_fiber: Object) => {
                                                                              if (err) {
                                                                                return;
                                                                              }
                                                                              console.log("Nutrition Fiber==>");
                                                                              console.log(results_fiber);
                                                                              let options_Folate = {
                                                                                startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                                endDate: new Date().toISOString(),
                                                                                unit: "gram",
                                                                                type: "Folate"
                                                                              };
                                                                              AppleHealthKit.getNutritionSamples(
                                                                                options_Folate,
                                                                                (err: Object, results_folate: Object) => {
                                                                                  if (err) {
                                                                                    return;
                                                                                  }
                                                                                  console.log("Nutrition Folate==>");
                                                                                  console.log(results_folate);
                                                                                  let options_Iodine = {
                                                                                    startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                                    endDate: new Date().toISOString(),
                                                                                    unit: "gram",
                                                                                    type: "Iodine"
                                                                                  };
                                                                                  AppleHealthKit.getNutritionSamples(
                                                                                    options_Iodine,
                                                                                    (err: Object, results_iodine: Object) => {
                                                                                      if (err) {
                                                                                        return;
                                                                                      }
                                                                                      console.log("Nutrition Iodine==>");
                                                                                      console.log(results_iodine);
                                                                                      let options_Iron = {
                                                                                        startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                                        endDate: new Date().toISOString(),
                                                                                        unit: "gram",
                                                                                        type: "Iron"
                                                                                      };
                                                                                      AppleHealthKit.getNutritionSamples(
                                                                                        options_Iron,
                                                                                        (err: Object, results_iron: Object) => {
                                                                                          if (err) {
                                                                                            return;
                                                                                          }
                                                                                          console.log("Nutrition Iron==>");
                                                                                          console.log(results_iron);
                                                                                          let options_Magnesium = {
                                                                                            startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                                            endDate: new Date().toISOString(),
                                                                                            unit: "gram",
                                                                                            type: "Magnesium"
                                                                                          };
                                                                                          AppleHealthKit.getNutritionSamples(
                                                                                            options_Magnesium,
                                                                                            (err: Object, results_magnesium: Object) => {
                                                                                              if (err) {
                                                                                                return;
                                                                                              }
                                                                                              console.log("Nutrition Magnesium==>");
                                                                                              console.log(results_magnesium);
                                                                                              let options_Molybdenum = {
                                                                                                startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                                                endDate: new Date().toISOString(),
                                                                                                unit: "gram",
                                                                                                type: "Molybdenum"
                                                                                              };
                                                                                              AppleHealthKit.getNutritionSamples(
                                                                                                options_Molybdenum,
                                                                                                (err: Object, results_molybdenum: Object) => {
                                                                                                  if (err) {
                                                                                                    return;
                                                                                                  }
                                                                                                  console.log("Nutrition Molybdenum==>");
                                                                                                  console.log(results_molybdenum);
                                                                                                  let options_FatMonounsaturated = {
                                                                                                    startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                                                    endDate: new Date().toISOString(),
                                                                                                    unit: "gram",
                                                                                                    type: "FatMonounsaturated"
                                                                                                  };
                                                                                                  AppleHealthKit.getNutritionSamples(
                                                                                                    options_FatMonounsaturated,
                                                                                                    (err: Object, results_monounsaturated: Object) => {
                                                                                                      if (err) {
                                                                                                        return;
                                                                                                      }
                                                                                                      console.log("Nutrition FatMonounsaturated==>");
                                                                                                      console.log(results_monounsaturated);
                                                                                                      let options_Niacin = {
                                                                                                        startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                                                        endDate: new Date().toISOString(),
                                                                                                        unit: "gram",
                                                                                                        type: "Niacin"
                                                                                                      };
                                                                                                      AppleHealthKit.getNutritionSamples(
                                                                                                        options_Niacin,
                                                                                                        (err: Object, results_niacin: Object) => {
                                                                                                          if (err) {
                                                                                                            return;
                                                                                                          }
                                                                                                          console.log("Nutrition Niacin==>");
                                                                                                          console.log(results_niacin);
                                                                                                          let options_PantothenicAcid = {
                                                                                                            startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                                                            endDate: new Date().toISOString(),
                                                                                                            unit: "gram",
                                                                                                            type: "PantothenicAcid"
                                                                                                          };
                                                                                                          AppleHealthKit.getNutritionSamples(
                                                                                                            options_PantothenicAcid,
                                                                                                            (err: Object, results_pantothenicAcid: Object) => {
                                                                                                              if (err) {
                                                                                                                return;
                                                                                                              }
                                                                                                              console.log("Nutrition PantothenicAcid==>");
                                                                                                              console.log(results_pantothenicAcid);
                                                                                                              let options_Phosphorus = {
                                                                                                                startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                                                                endDate: new Date().toISOString(),
                                                                                                                unit: "gram",
                                                                                                                type: "Phosphorus"
                                                                                                              };
                                                                                                              AppleHealthKit.getNutritionSamples(
                                                                                                                options_Phosphorus,
                                                                                                                (err: Object, results_phosphorus: Object) => {
                                                                                                                  if (err) {
                                                                                                                    return;
                                                                                                                  }
                                                                                                                  console.log("Nutrition Phosphorus==>");
                                                                                                                  console.log(results_phosphorus);
                                                                                                                  let options_FatPolyunsaturated = {
                                                                                                                    startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                                                                    endDate: new Date().toISOString(),
                                                                                                                    unit: "gram",
                                                                                                                    type: "FatPolyunsaturated"
                                                                                                                  };
                                                                                                                  AppleHealthKit.getNutritionSamples(
                                                                                                                    options_FatPolyunsaturated,
                                                                                                                    (err: Object, results_polyunsaturatedFat: Object) => {
                                                                                                                      if (err) {
                                                                                                                        return;
                                                                                                                      }
                                                                                                                      console.log("Nutrition FatPolyunsaturated==>");
                                                                                                                      console.log(results_polyunsaturatedFat);
                                                                                                                      let options_Potassium = {
                                                                                                                        startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                                                                        endDate: new Date().toISOString(),
                                                                                                                        unit: "gram",
                                                                                                                        type: "Potassium"
                                                                                                                      };
                                                                                                                      AppleHealthKit.getNutritionSamples(
                                                                                                                        options_Potassium,
                                                                                                                        (err: Object, results_potassium: Object) => {
                                                                                                                          if (err) {
                                                                                                                            return;
                                                                                                                          }
                                                                                                                          console.log("Nutrition Potassium==>");
                                                                                                                          console.log(results_potassium);
                                                                                                                          let options_Protein = {
                                                                                                                            startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                                                                            endDate: new Date().toISOString(),
                                                                                                                            unit: "gram",
                                                                                                                            type: "Protein"
                                                                                                                          };
                                                                                                                          AppleHealthKit.getNutritionSamples(
                                                                                                                            options_Protein,
                                                                                                                            (err: Object, results_protein: Object) => {
                                                                                                                              if (err) {
                                                                                                                                return;
                                                                                                                              }
                                                                                                                              console.log("Nutrition Protein==>");
                                                                                                                              console.log(results_protein);
                                                                                                                              let options_Riboflavin = {
                                                                                                                                startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                                                                                endDate: new Date().toISOString(),
                                                                                                                                unit: "gram",
                                                                                                                                type: "Riboflavin"
                                                                                                                              };
                                                                                                                              AppleHealthKit.getNutritionSamples(
                                                                                                                                options_Riboflavin,
                                                                                                                                (err: Object, results_riboflavin: Object) => {
                                                                                                                                  if (err) {
                                                                                                                                    return;
                                                                                                                                  }
                                                                                                                                  console.log("Nutrition Riboflavin==>");
                                                                                                                                  console.log(results_riboflavin);
                                                                                                                                  let options_FatSaturated = {
                                                                                                                                    startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                                                                                    endDate: new Date().toISOString(),
                                                                                                                                    unit: "gram",
                                                                                                                                    type: "FatSaturated"
                                                                                                                                  };
                                                                                                                                  AppleHealthKit.getNutritionSamples(
                                                                                                                                    options_FatSaturated,
                                                                                                                                    (err: Object, results_fatSaturated: Object) => {
                                                                                                                                      if (err) {
                                                                                                                                        return;
                                                                                                                                      }
                                                                                                                                      console.log("Nutrition FatSaturated==>");
                                                                                                                                      console.log(results_fatSaturated);
                                                                                                                                      let options_Selenium = {
                                                                                                                                        startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                                                                                        endDate: new Date().toISOString(),
                                                                                                                                        unit: "gram",
                                                                                                                                        type: "Selenium"
                                                                                                                                      };
                                                                                                                                      AppleHealthKit.getNutritionSamples(
                                                                                                                                        options_Selenium,
                                                                                                                                        (err: Object, results_selenium: Object) => {
                                                                                                                                          if (err) {
                                                                                                                                            return;
                                                                                                                                          }
                                                                                                                                          console.log("Nutrition Selenium==>");
                                                                                                                                          console.log(results_selenium);
                                                                                                                                          let options_Sodium = {
                                                                                                                                            startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                                                                                            endDate: new Date().toISOString(),
                                                                                                                                            unit: "gram",
                                                                                                                                            type: "Sodium"
                                                                                                                                          };
                                                                                                                                          AppleHealthKit.getNutritionSamples(
                                                                                                                                            options_Sodium,
                                                                                                                                            (err: Object, results_sodium: Object) => {
                                                                                                                                              if (err) {
                                                                                                                                                return;
                                                                                                                                              }
                                                                                                                                              console.log("Nutrition Sodium==>");
                                                                                                                                              console.log(results_sodium);
                                                                                                                                              let options_Thiamin = {
                                                                                                                                                startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                                                                                                endDate: new Date().toISOString(),
                                                                                                                                                unit: "gram",
                                                                                                                                                type: "Thiamin"
                                                                                                                                              };
                                                                                                                                              AppleHealthKit.getNutritionSamples(
                                                                                                                                                options_Thiamin,
                                                                                                                                                (err: Object, results_thiamin: Object) => {
                                                                                                                                                  if (err) {
                                                                                                                                                    return;
                                                                                                                                                  }
                                                                                                                                                  console.log("Nutrition Thiamin==>");
                                                                                                                                                  console.log(results_thiamin);
                                                                                                                                                  let options_FatTotal = {
                                                                                                                                                    startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                                                                                                    endDate: new Date().toISOString(),
                                                                                                                                                    unit: "gram",
                                                                                                                                                    type: "FatTotal"
                                                                                                                                                  };
                                                                                                                                                  AppleHealthKit.getNutritionSamples(
                                                                                                                                                    options_FatTotal,
                                                                                                                                                    (err: Object, results_fatTotal: Object) => {
                                                                                                                                                      if (err) {
                                                                                                                                                        return;
                                                                                                                                                      }
                                                                                                                                                      console.log("Nutrition FatTotal==>");
                                                                                                                                                      console.log(results_fatTotal);
                                                                                                                                                      let options_VitaminA = {
                                                                                                                                                        startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                                                                                                        endDate: new Date().toISOString(),
                                                                                                                                                        unit: "gram",
                                                                                                                                                        type: "VitaminA"
                                                                                                                                                      };
                                                                                                                                                      AppleHealthKit.getNutritionSamples(
                                                                                                                                                        options_VitaminA,
                                                                                                                                                        (err: Object, results_vitaminA: Object) => {
                                                                                                                                                          if (err) {
                                                                                                                                                            return;
                                                                                                                                                          }
                                                                                                                                                          console.log("Nutrition VitaminA==>");
                                                                                                                                                          console.log(results_vitaminA);
                                                                                                                                                          let options_VitaminB12 = {
                                                                                                                                                            startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                                                                                                            endDate: new Date().toISOString(),
                                                                                                                                                            unit: "gram",
                                                                                                                                                            type: "VitaminB12"
                                                                                                                                                          };
                                                                                                                                                          AppleHealthKit.getNutritionSamples(
                                                                                                                                                            options_VitaminB12,
                                                                                                                                                            (err: Object, results_vatiaminB12: Object) => {
                                                                                                                                                              if (err) {
                                                                                                                                                                return;
                                                                                                                                                              }
                                                                                                                                                              console.log("Nutrition VitaminB12==>");
                                                                                                                                                              console.log(results_vatiaminB12);
                                                                                                                                                              let options_VitaminB6 = {
                                                                                                                                                                startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                                                                                                                endDate: new Date().toISOString(),
                                                                                                                                                                unit: "gram",
                                                                                                                                                                type: "VitaminB6"
                                                                                                                                                              };
                                                                                                                                                              AppleHealthKit.getNutritionSamples(
                                                                                                                                                                options_VitaminB6,
                                                                                                                                                                (err: Object, results_vitaminB6: Object) => {
                                                                                                                                                                  if (err) {
                                                                                                                                                                    return;
                                                                                                                                                                  }
                                                                                                                                                                  console.log("Nutrition VitaminB6==>");
                                                                                                                                                                  console.log(results_vitaminB6);
                                                                                                                                                                  let options_VitaminC = {
                                                                                                                                                                    startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                                                                                                                    endDate: new Date().toISOString(),
                                                                                                                                                                    unit: "gram",
                                                                                                                                                                    type: "VitaminC"
                                                                                                                                                                  };
                                                                                                                                                                  AppleHealthKit.getNutritionSamples(
                                                                                                                                                                    options_VitaminC,
                                                                                                                                                                    (err: Object, results_vitaminC: Object) => {
                                                                                                                                                                      if (err) {
                                                                                                                                                                        return;
                                                                                                                                                                      }
                                                                                                                                                                      console.log("Nutrition VitaminC==>");
                                                                                                                                                                      console.log(results_vitaminC);
                                                                                                                                                                      let options_VitaminD = {
                                                                                                                                                                        startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                                                                                                                        endDate: new Date().toISOString(),
                                                                                                                                                                        unit: "gram",
                                                                                                                                                                        type: "VitaminD"
                                                                                                                                                                      };
                                                                                                                                                                      AppleHealthKit.getNutritionSamples(
                                                                                                                                                                        options_VitaminD,
                                                                                                                                                                        (err: Object, results_vitaminD: Object) => {
                                                                                                                                                                          if (err) {
                                                                                                                                                                            return;
                                                                                                                                                                          }
                                                                                                                                                                          console.log("Nutrition VitaminD==>");
                                                                                                                                                                          console.log(results_vitaminD);
                                                                                                                                                                          let options_VitaminE = {
                                                                                                                                                                            startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                                                                                                                            endDate: new Date().toISOString(),
                                                                                                                                                                            unit: "gram",
                                                                                                                                                                            type: "VitaminE"
                                                                                                                                                                          };
                                                                                                                                                                          AppleHealthKit.getNutritionSamples(
                                                                                                                                                                            options_VitaminE,
                                                                                                                                                                            (err: Object, results_vitaminE: Object) => {
                                                                                                                                                                              if (err) {
                                                                                                                                                                                return;
                                                                                                                                                                              }
                                                                                                                                                                              console.log("Nutrition VitaminE==>");
                                                                                                                                                                              console.log(results_vitaminE);
                                                                                                                                                                              let options_VitaminK = {
                                                                                                                                                                                startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                                                                                                                                endDate: new Date().toISOString(),
                                                                                                                                                                                unit: "gram",
                                                                                                                                                                                type: "VitaminK"
                                                                                                                                                                              };
                                                                                                                                                                              AppleHealthKit.getNutritionSamples(
                                                                                                                                                                                options_VitaminK,
                                                                                                                                                                                (err: Object, results_vitaminK: Object) => {
                                                                                                                                                                                  if (err) {
                                                                                                                                                                                    return;
                                                                                                                                                                                  }
                                                                                                                                                                                  console.log("Nutrition VitaminK==>");
                                                                                                                                                                                  console.log(results_vitaminK);
                                                                                                                                                                                  let options_Zinc = {
                                                                                                                                                                                    startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                                                                                                                                    endDate: new Date().toISOString(),
                                                                                                                                                                                    unit: "gram",
                                                                                                                                                                                    type: "Zinc"
                                                                                                                                                                                  };
                                                                                                                                                                                  AppleHealthKit.getNutritionSamples(
                                                                                                                                                                                    options_Zinc,
                                                                                                                                                                                    (err: Object, results_zinc: Object) => {
                                                                                                                                                                                      if (err) {
                                                                                                                                                                                        return;
                                                                                                                                                                                      }
                                                                                                                                                                                      console.log("Nutrition Zinc==>");
                                                                                                                                                                                      console.log(results_zinc);
                                                                                                                                                                                      let options_Water = {
                                                                                                                                                                                        startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                                                                                                                                        endDate: new Date().toISOString(),
                                                                                                                                                                                        unit: "gram",
                                                                                                                                                                                        type: "Water"
                                                                                                                                                                                      };
                                                                                                                                                                                      AppleHealthKit.getNutritionSamples(
                                                                                                                                                                                        options_Water,
                                                                                                                                                                                        (err: Object, results_water: Object) => {
                                                                                                                                                                                          if (err) {
                                                                                                                                                                                            return;
                                                                                                                                                                                          }
                                                                                                                                                                                          console.log("Nutrition Water==>");
                                                                                                                                                                                          console.log(results_water);
                                                                                                                                                                                          let options_EnergyConsumed = {
                                                                                                                                                                                            startDate: new Date(new Date(last_logged_time).setHours(0,0,0)).toISOString(),
                                                                                                                                                                                            endDate: new Date().toISOString(),
                                                                                                                                                                                            type: "EnergyConsumed"
                                                                                                                                                                                          };
                                                                                                                                                                                          AppleHealthKit.getNutritionSamples(
                                                                                                                                                                                            options_EnergyConsumed,
                                                                                                                                                                                            (err: Object, results_dietaryEnergy: Object) => {
                                                                                                                                                                                              if (err) {
                                                                                                                                                                                                return;
                                                                                                                                                                                              }
                                                                                                                                                                                              console.log("Nutrition EnergyConsumed==>");
                                                                                                                                                                                              console.log(results_dietaryEnergy);
                                                                                                                                                                                              let variables = {
                                                                                                                                                                                                Mindfulness: results_mindfulness.length > 0 ? results_mindfulness : null,
                                                                                                                                                                                                HeartRate: results_heartRate.length > 0 ? results_heartRate : null,
                                                                                                                                                                                                RestingHeartRate: results_restingHeartRate.length > 0 ? results_restingHeartRate : null,
                                                                                                                                                                                                HeartRateVariability: results_heartRateVariability.length > 0 ? results_heartRateVariability : null,
                                                                                                                                                                                                Steps: results_steps? results_steps : null ,
                                                                                                                                                                                                TotalCalories: results_activeEnergy ? results_activeEnergy : null,
                                                                                                                                                                                                WalkingRunning: results_distanceWalkingRunning ? results_distanceWalkingRunning : null,
                                                                                                                                                                                                Sleep: results_sleep.length > 0 ? results_sleep : null,
                                                                                                                                                                                                Biotin: results_Biotin.length > 0 ? results_Biotin : null,
                                                                                                                                                                                                Caffeine: results_caffeine.length > 0 ? results_caffeine : null,
                                                                                                                                                                                                Calcium: results_calcium.length > 0 ? results_calcium : null,
                                                                                                                                                                                                Carbohydrates: results_carbohydrates.length > 0? results_carbohydrates : null,
                                                                                                                                                                                                Chloride: results_chloride.length > 0 ? results_chloride : null,
                                                                                                                                                                                                Copper: results_copper.length > 0 ? results_copper : null,
                                                                                                                                                                                                DietaryCholesterol: results_cholesterol.length > 0 ? results_cholesterol : null,
                                                                                                                                                                                                DietaryEnergy: results_dietaryEnergy.length > 0 ? results_dietaryEnergy : null,
                                                                                                                                                                                                DietarySugar: results_sugar.length > 0 ? results_sugar : null,
                                                                                                                                                                                                Fibre: results_fiber.length > 0 ? results_fiber : null,
                                                                                                                                                                                                Folate: results_folate.length > 0 ? results_folate : null,
                                                                                                                                                                                                Iodine: results_iodine.length > 0 ? results_iodine : null,
                                                                                                                                                                                                Iron: results_iron.length > 0 ? results_iron : null,
                                                                                                                                                                                                Magnesium: results_magnesium.length > 0 ? results_magnesium : null,
                                                                                                                                                                                                Molybdenum: results_molybdenum.length > 0 ? results_molybdenum : null,
                                                                                                                                                                                                MonounsaturatedFat: results_monounsaturated.length > 0 ? results_monounsaturated : null,
                                                                                                                                                                                                Niacin: results_niacin.length > 0 ? results_niacin : null,
                                                                                                                                                                                                PantothenicAcid: results_pantothenicAcid.length > 0 ? results_pantothenicAcid : null,
                                                                                                                                                                                                Phosphorus: results_phosphorus.length > 0 ? results_phosphorus : null,
                                                                                                                                                                                                PolyunsaturatedFat: results_polyunsaturatedFat.length > 0 ? results_polyunsaturatedFat : null,
                                                                                                                                                                                                Potassium: results_potassium.length > 0 ? results_potassium : null,
                                                                                                                                                                                                Protein: results_protein.length > 0 ? results_protein : null,
                                                                                                                                                                                                Riboflavin: results_riboflavin.length > 0 ? results_riboflavin : null,
                                                                                                                                                                                                SaturatedFat: results_fatSaturated.length > 0 ? results_fatSaturated : null,
                                                                                                                                                                                                Selenium: results_selenium.length > 0 ? results_selenium : null,
                                                                                                                                                                                                Sodium: results_sodium.length > 0 ? results_sodium : null,
                                                                                                                                                                                                Thiamine: results_thiamin.length > 0 ? results_thiamin : null,
                                                                                                                                                                                                TotalFat: results_fatTotal.length > 0 ? results_fatTotal : null,
                                                                                                                                                                                                VitaminA: results_vitaminA.length > 0 ? results_vitaminA : null,
                                                                                                                                                                                                VitaminB12: results_vatiaminB12.length > 0 ? results_vatiaminB12 : null,
                                                                                                                                                                                                VitaminB6: results_vitaminB6.length > 0 ? results_vitaminB6 : null,
                                                                                                                                                                                                VitaminC: results_vitaminC.length > 0 ? results_vitaminC : null,
                                                                                                                                                                                                VitaminD: results_vitaminD.length > 0 ? results_vitaminD : null,
                                                                                                                                                                                                VitaminE: results_vitaminE.length > 0 ? results_vitaminE : null,
                                                                                                                                                                                                VitaminK: results_vitaminK.length > 0 ? results_vitaminK : null,
                                                                                                                                                                                                Zinc: results_zinc.length > 0 ? results_zinc : null,
                                                                                                                                                                                                Water: results_water.length > 0 ? results_water : null,
                                                                                                                                                                                            };
                                                                                                                                                                                            indexSum += 1;
                                                                                                                                                                                            if (indexSum == 46) {
                                                                                                                                                                                              console.log('###=>', variables);
                                                                                                                                                                                              API.graphql({
                                                                                                                                                                                                query: logAppleDataMutation,
                                                                                                                                                                                                variables: {
                                                                                                                                                                                                  input: variables
                                                                                                                                                                                                }
                                                                                                                                                                                              })
                                                                                                                                                                                                .then(data => {
                                                                                                                                                                                                  console.log('%%%%%%%%%=>', data)
                                                                                                                                                                                                })
                                                                                                                                                                                                .catch(err => {
                                                                                                                                                                                                  console.log(err);
                                                                                                                                                                                                })
                                                                                                                                                                                            }                                                                                                                                                                        
                                                                                                                                                                                            
                                                                                                                                                                                            }
                                                                                                                                                                                          ); 
                                                                                                                                                                                        }
                                                                                                                                                                                      );
                                                                                                                                                                                    }
                                                                                                                                                                                  );
                                                                                                                                                                                }
                                                                                                                                                                              );
                                                                                                                                                                            }
                                                                                                                                                                          );
                                                                                                                                                                        }
                                                                                                                                                                      );
                                                                                                                                                                    }
                                                                                                                                                                  );
                                                                                                                                                                }
                                                                                                                                                              );
                                                                                                                                                            }
                                                                                                                                                          );
                                                                                                                                                        }
                                                                                                                                                      );
                                                                                                                                                    }
                                                                                                                                                  );
                                                                                                                                                }
                                                                                                                                              );
                                                                                                                                            }
                                                                                                                                          );
                                                                                                                                        }
                                                                                                                                      );
                                                                                                                                    }
                                                                                                                                  );
                                                                                                                                }
                                                                                                                              );
                                                                                                                            }
                                                                                                                          );
                                                                                                                        }
                                                                                                                      );
                                                                                                                    }
                                                                                                                  );
                                                                                                                }
                                                                                                              );
                                                                                                            }
                                                                                                          );
                                                                                                        }
                                                                                                      );
                                                                                                    }
                                                                                                  );
                                                                                                }
                                                                                              );
                                                                                            }
                                                                                          );
                                                                                        }
                                                                                      );
                                                                                    }
                                                                                  );
                                                                                }
                                                                              );
                                                                            }
                                                                          );
                                                                        }
                                                                      );
                                                                    }
                                                                  );
                                                                }
                                                              );
                                                            }
                                                          );
                                                        }
                                                      );
                                                    }
                                                  );
                                                }
                                              );
                                            }
                                      );
                                    }
                                  );
                                }
                              );
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  });
  } else {
    return
  }
}