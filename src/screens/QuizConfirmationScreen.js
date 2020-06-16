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
    
  }

  onPressedYes = () => {
    this.props.navigation.navigate('QuizConfirmationScreen');
  }

  render () {
    return(
      <View style={ThemeStyle.pageContainer}>
        <StatusBar translucent={true} backgroundColor={'#298db5'}
          barStyle={'light-content'} hidden={false}
        />
        <LinearGradient colors={['#4897B0','#53a4ad','#80d6a1' ]} style={styles.linearGradient}>
          {/* <View style={{paddingTop:20,alignSelf:'flex-end'}}>
            <TouchableHighlight underlayColor="rgba(0,0,0,0.42)" onPress={() => this.props.navigation.goBack()}
               style={{padding:12}}>
              <Icon name="x" color="#fff" size={28} family="Feather" />
            </TouchableHighlight>
          </View> */}

          <Image source={require('../src/sunrise.png')} style={{resizeMode:'stretch',width:null,height:300,marginTop:20}} />
          <Image source={require('../src/sparkles.png')} style={{top:20,position:'absolute',resizeMode:'cover',width:null,height:300}} />
          {/* <Image source={require('../src/cup.png')} style={{resizeMode:'cover',width:null,height:300}} /> */}

        </LinearGradient>

      </View>
    );
  }
}

var styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },

});
