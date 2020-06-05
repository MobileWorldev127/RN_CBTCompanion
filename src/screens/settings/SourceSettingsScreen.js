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
  StyleSheet
} from "react-native";
import Icon from "../../common/icons";
import { Auth, Storage, Logger } from "aws-amplify";
import { NavigationActions } from "react-navigation";
import PhoneInput from "react-native-phone-input";
import validator from "validator";
import Header from "../../components/Header";
import ImagePicker from "react-native-image-picker";
import { withStore } from "../../utils/StoreUtils";
import { showMessage } from "react-native-flash-message";
import { errorMessage } from "../../utils";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";
import { requestCameraPermission } from "../../utils/PermissionUtils";
import ThemeStyle from "../../styles/ThemeStyle";
import Button from "../../components/Button";
import { Alert } from "react-native";
import TextStyles from "../../common/TextStyles";
import { withSafeAreaActions } from "../../utils/StoreUtils";
import { getSourceSettings } from "../../actions/SourceSettings";

const screenWidth = Dimensions.get("window").width;

class SourceSettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activity_value: props.sourceSettingsList.activitySetting || 'Manual',
      sleep_value: props.sourceSettingsList.sleepSetting ||'Manual',
      heart_rate_value: props.sourceSettingsList.heartSetting ||'Manual',
      mindfulness_value: props.sourceSettingsList.mindfulnessSetting ||'Manual',
      nutrition_value: props.sourceSettingsList.nutritionSetting ||'Manual'
    };
  }

  onClickSetting(index, val) {
    if (index === 0) {
      this.setState({ activity_value: val });
    }
    if (index === 1) {
      this.setState({ sleep_value: val });
    }
    if (index === 2) {
      this.setState({ heart_rate_value: val });
    }
    if (index === 3) {
      this.setState({ mindfulness_value: val });
    }
    if (index === 4) {
      this.setState({ nutrition_value: val });
    }
  }

  addSourceSettings = () => {
    let data = {};
    data.activitySetting = this.state.activity_value;
    data.sleepSetting = this.state.sleep_value;
    data.heartSetting = this.state.heart_rate_value;
    data.mindfulnessSetting = this.state.mindfulness_value;
    data.nutritionSetting = this.state.nutrition_value;
    this.props.getSourceSettings(data);
    this.props.navigation.goBack(null)
  }

  render() {
    const {
      activity_value,
      sleep_value,
      heart_rate_value,
      mindfulness_value,
      nutrition_value
    } = this.state;
    return (
      <View style={ThemeStyle.pageContainer}>
        <Header
          title="Source Settings"
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
        <ScrollView>
          <View style={styles.mainView}>
            <View style={styles.itemView}>
              <Text style={styles.label1}>Activity</Text>
              <View style={styles.rowView}>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(0, 'Apple')}>
                  <View style={styles.rowCellView}>
                    <View style={activity_value === 'Apple'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Apple Health</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(0, 'Google')}>
                  <View style={styles.rowCellView}>
                    <View style={activity_value === 'Google'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Google Fit</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.rowView}>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(0, 'Fitbit')}>
                  <View style={styles.rowCellView}>
                    <View style={activity_value === 'Fitbit'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Fitbit</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(0, 'Manual')}>
                  <View style={styles.rowCellView}>
                    <View style={activity_value === 'Manual'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Manual</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.itemView}>
              <Text style={styles.label1}>Sleep</Text>
              <View style={styles.rowView}>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(1, 'Apple')}>
                  <View style={styles.rowCellView}>
                    <View style={sleep_value === 'Apple'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Apple Health</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(1, 'Google')}>
                  <View style={styles.rowCellView}>
                    <View style={sleep_value === 'Google'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Google Fit</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.rowView}>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(1, 'Fitbit')}>
                  <View style={styles.rowCellView}>
                    <View style={sleep_value === 'Fitbit'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Fitbit</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(1, 'Manual')}>
                  <View style={styles.rowCellView}>
                    <View style={sleep_value === 'Manual'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Manual</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.itemView}>
              <Text style={styles.label1}>Heart Rate</Text>
              <View style={styles.rowView}>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(2, 'Apple')}>
                  <View style={styles.rowCellView}>
                    <View style={heart_rate_value === 'Apple'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Apple Health</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(2, 'Google')}>
                  <View style={styles.rowCellView}>
                    <View style={heart_rate_value === 'Google'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Google Fit</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.rowView}>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(2, 'Fitbit')}>
                  <View style={styles.rowCellView}>
                    <View style={heart_rate_value === 'Fitbit'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Fitbit</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(2, 'Manual')}>
                  <View style={styles.rowCellView}>
                    <View style={heart_rate_value === 'Manual'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Manual</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.itemView}>
              <Text style={styles.label1}>Mindfulness</Text>
              <View style={styles.rowView}>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(3, 'Apple')}>
                  <View style={styles.rowCellView}>
                    <View style={mindfulness_value === 'Apple'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Apple Health</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(3, 'Google')}>
                  <View style={styles.rowCellView}>
                    <View style={mindfulness_value === 'Google'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Google Fit</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.rowView}>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(3, 'Fitbit')}>
                  <View style={styles.rowCellView}>
                    <View style={mindfulness_value === 'Fitbit'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Fitbit</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(3, 'Manual')}>
                  <View style={styles.rowCellView}>
                    <View style={mindfulness_value === 'Manual'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Manual</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.itemView}>
              <Text style={styles.label1}>Nutrition</Text>
              <View style={styles.rowView}>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(4, 'Apple')}>
                  <View style={styles.rowCellView}>
                    <View style={nutrition_value === 'Apple'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Apple Health</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(4, 'Google')}>
                  <View style={styles.rowCellView}>
                    <View style={nutrition_value === 'Google'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Google Fit</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.rowView}>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(4, 'Fitbit')}>
                  <View style={styles.rowCellView}>
                    <View style={nutrition_value === 'Fitbit'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Fitbit</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(4, 'Manual')}>
                  <View style={styles.rowCellView}>
                    <View style={nutrition_value === 'Manual'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Manual</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={this.addSourceSettings}>
              <Text style={styles.addTxt}>ADD</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding:20,
  },
  itemView: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#BBB',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginBottom: 20,
  },
  label1: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  label2: {
    fontSize: 16,
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  rowCellView: {
    flexDirection: 'row', 
    alignItems: 'center',
  },
  clickedBtn: {
    // borderWidth: 1,
    backgroundColor: '#00de5c',
    width: 16,
    height: 16,
    borderRadius: 8
  },
  unClickedBtn: {
    borderWidth: 1,
    borderColor: '#828282',
    width: 16,
    height: 16,
    borderRadius: 8
  },
  addBtn: {
    width: '100%',
    height: 40,
    backgroundColor: '#f7992a',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    borderRadius: 5,
  },
  addTxt: {
    color: 'white',
    fontSize: 18
  }
})

export default withSafeAreaActions(
  SourceSettingsScreen,
  state => ({
    sourceSettingsList: state.sourceSettings.sourceSettingsList,
    isEdit: state.record.isEdit,
    editEntry: state.record.editEntry,
  }),
  dispatch => ({
    getSourceSettings: data => dispatch(getSourceSettings(data))
  })
);

