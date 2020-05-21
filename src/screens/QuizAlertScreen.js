import React, {Component} from 'react';
import { StyleSheet,Text,Image,View,ScrollView,Switch,TouchableOpacity,Dimensions,StatusBar,
  Alert,TouchableHighlight,FlatList,Modal,Platform} from 'react-native';
import { StackNavigator} from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import ThemeStyle from '../styles/ThemeStyle';
import Icon from '../common/icons';

const {width, height} = Dimensions.get('window');

export default class QuizAlertScreen extends Component{
    constructor(props){
    super(props);
    this.state = {

    };
  }

  onPressed = () => {
    console.log('-------');
  }

  onPressedYes = () => {
    console.log('-------');
    //this.props.navigation.navigate('QuizConfirmationScreen');
  }

  render () {
    return(
      <View style={ThemeStyle.pageContainer}>
        <StatusBar translucent={true} backgroundColor={'#298db5'}
          barStyle={'light-content'} hidden={false}
        />
        <LinearGradient colors={['#4897B0','#53a4ad','#80d6a1' ]} style={styles.linearGradient}>
          <View style={{paddingTop:20,alignSelf:'flex-end'}}>
            <TouchableHighlight underlayColor="rgba(0,0,0,0.42)" onPress={() => this.props.navigation.goBack()}
               style={{padding:10}}>
              <Icon name="x" color="#fff" size={28} family="Feather" />
            </TouchableHighlight>
          </View>

          <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
            <View style={styles.mainContainer}>
              <View style={{paddingHorizontal:60}}>
                <Text style={{color:'#000',fontSize:20,textAlign:'center'}}>Do you want to take DBT Quiz?</Text>
              </View>
              <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                <TouchableHighlight underlayColor="#f4894b" onPress={this.onPressed} style={[styles.buttonContainer,{backgroundColor:'#e50d14'}]}>
                  <Text style={{color:'#FFF',fontSize:16,textAlign:'center'}}>No</Text>
                </TouchableHighlight>
                <TouchableHighlight underlayColor="#f4894b" onPress={this.onPressedYes} style={styles.buttonContainer}>
                  <Text style={{color:'#FFF',fontSize:16,textAlign:'center'}}>Yes</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>

        </LinearGradient>

      </View>
    );
  }
}

var styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    paddingHorizontal:15
  },
  mainContainer:{
    backgroundColor:'#fff',
    width:null,
    height:250,
    borderRadius:5,
    overflow:'hidden',
    justifyContent:'space-around',
    elevation:5,
    shadowOffset:{width:1,height:0},
    shadowOpacity:0.2,
    shadowColor:'lightgrey'
  },
  buttonContainer:{
    paddingHorizontal:35,
    paddingVertical:12,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#53cc93',
    borderRadius:25,
    marginHorizontal:8
  },

});
