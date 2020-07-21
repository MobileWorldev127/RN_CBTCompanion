import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet
} from "react-native";
import Icon from "../../common/icons";
import Header from "../../components/Header";
import { showMessage } from "react-native-flash-message";
import ThemeStyle from "../../styles/ThemeStyle";
import { withSafeAreaActions } from "../../utils/StoreUtils";
import { getSourceSettings } from "../../actions/SourceSettings";
import Amplify from 'aws-amplify';
import { API } from 'aws-amplify';
import { getAmplifyConfig, getEnvVars } from './../../constants';
import {
  upsertHealthKitSourceSettings1
} from '../../queries/addEntry';
import  { getHealthKitSourceSettings } from '../../queries/getHealthKitSourceSettings';

const screenWidth = Dimensions.get("window").width;

class SourceSettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activity_value: '',
      sleep_value: '',
      heart_rate_value:'',
      mindfulness_value: '',
      nutrition_value: ''
    };
  }

  componentDidMount() {
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
            this.setState({ activity_value: item.source })
          }
          if (item.sourceType == 'Sleep') {
            this.setState({ sleep_value: item.source })
          }
          if (item.sourceType == 'HeartRate') {
            this.setState({ heart_rate_value: item.source })
          }
          if (item.sourceType == 'MindfulnessMinutes') {
            this.setState({ mindfulness_value: item.source })
          }
          if (item.sourceType == 'Nutrition') {
            this.setState({ nutrition_value: item.source })
          }
        })
      })
      .catch(err => {
        this.props.setLoading(false);
        console.log(err);
      });
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
    showMessage({
      message:'Source settings have been saved sucessfully.',
      type: "success"
    });

    let data = {};
    data.activitySetting = this.state.activity_value;
    data.sleepSetting = this.state.sleep_value;
    data.heartSetting = this.state.heart_rate_value;
    data.mindfulnessSetting = this.state.mindfulness_value;
    data.nutritionSetting = this.state.nutrition_value;

    Amplify.configure(
      getAmplifyConfig(getEnvVars().SWASTH_COMMONS_ENDPOINT_URL)
    );
    API.graphql({
      query: upsertHealthKitSourceSettings1,
      variables: {
        settings: [
          {
            sourceType: 'Nutrition',
            source: data.nutritionSetting,
          },
          {
            sourceType: 'Exercise',
            source: data.activitySetting,
          },
          {
            sourceType: 'Sleep',
            source: data.sleepSetting,
          },
          {
            sourceType: 'HeartRate',
            source: data.heartSetting,
          },
          {
            sourceType: 'MindfulnessMinutes',
            source: data.mindfulnessSetting,
          },
        ]
      },
    })
      .then(data => {
        this.props.getSourceSettings(data);
        this.props.navigation.goBack(null);
      })
      .catch(err => {
        console.log(err);
      });
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
      <View style={{flex: 1}}>
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
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(0, 'APPLEHEALTH')}>
                  <View style={styles.rowCellView}>
                    <View style={activity_value === 'APPLEHEALTH'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Apple Health</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(0, 'GOOGLEFIT')}>
                  <View style={styles.rowCellView}>
                    <View style={activity_value === 'GOOGLEFIT'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Google Fit</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.rowView}>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(0, 'FITBIT')}>
                  <View style={styles.rowCellView}>
                    <View style={activity_value === 'FITBIT'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Fitbit</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(0, 'MANUAL')}>
                  <View style={styles.rowCellView}>
                    <View style={activity_value === 'MANUAL'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Manual</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.itemView}>
              <Text style={styles.label1}>Sleep</Text>
              <View style={styles.rowView}>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(1, 'APPLEHEALTH')}>
                  <View style={styles.rowCellView}>
                    <View style={sleep_value === 'APPLEHEALTH'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Apple Health</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(1, 'GOOGLEFIT')}>
                  <View style={styles.rowCellView}>
                    <View style={sleep_value === 'GOOGLEFIT'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Google Fit</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.rowView}>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(1, 'FITBIT')}>
                  <View style={styles.rowCellView}>
                    <View style={sleep_value === 'FITBIT'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Fitbit</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(1, 'MANUAL')}>
                  <View style={styles.rowCellView}>
                    <View style={sleep_value === 'MANUAL'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Manual</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.itemView}>
              <Text style={styles.label1}>Heart Rate</Text>
              <View style={styles.rowView}>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(2, 'APPLEHEALTH')}>
                  <View style={styles.rowCellView}>
                    <View style={heart_rate_value === 'APPLEHEALTH'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Apple Health</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(2, 'GOOGLEFIT')}>
                  <View style={styles.rowCellView}>
                    <View style={heart_rate_value === 'GOOGLEFIT'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Google Fit</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.rowView}>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(2, 'FITBIT')}>
                  <View style={styles.rowCellView}>
                    <View style={heart_rate_value === 'FITBIT'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Fitbit</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(2, 'MANUAL')}>
                  <View style={styles.rowCellView}>
                    <View style={heart_rate_value === 'MANUAL'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Manual</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.itemView}>
              <Text style={styles.label1}>Mindfulness</Text>
              <View style={styles.rowView}>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(3, 'APPLEHEALTH')}>
                  <View style={styles.rowCellView}>
                    <View style={mindfulness_value === 'APPLEHEALTH'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Apple Health</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(3, 'GOOGLEFIT')}>
                  <View style={styles.rowCellView}>
                    <View style={mindfulness_value === 'GOOGLEFIT'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Google Fit</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.rowView}>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(3, 'FITBIT')}>
                  <View style={styles.rowCellView}>
                    <View style={mindfulness_value === 'FITBIT'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Fitbit</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(3, 'MANUAL')}>
                  <View style={styles.rowCellView}>
                    <View style={mindfulness_value === 'MANUAL'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Manual</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.itemView}>
              <Text style={styles.label1}>Nutrition</Text>
              <View style={styles.rowView}>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(4, 'APPLEHEALTH')}>
                  <View style={styles.rowCellView}>
                    <View style={nutrition_value === 'APPLEHEALTH'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Apple Health</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(4, 'GOOGLEFIT')}>
                  <View style={styles.rowCellView}>
                    <View style={nutrition_value === 'GOOGLEFIT'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Google Fit</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.rowView}>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(4, 'FITBIT')}>
                  <View style={styles.rowCellView}>
                    <View style={nutrition_value === 'FITBIT'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Fitbit</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{width: '50%'}} onPress = {() => this.onClickSetting(4, 'MANUAL')}>
                  <View style={styles.rowCellView}>
                    <View style={nutrition_value === 'MANUAL'? styles.clickedBtn : styles.unClickedBtn}/>
                    <Text style={styles.label2}>  Manual</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={this.addSourceSettings}>
          <Text style={styles.addTxt}>Save</Text>
        </TouchableOpacity>
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
    paddingBottom: 60,
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
    width: 300,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f7992a',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    position: 'absolute',
    left: (screenWidth-300)/2,
    bottom: 25
  },
  addTxt: {
    color: 'white',
    fontSize: 20
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

