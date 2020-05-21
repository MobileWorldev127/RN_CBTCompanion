import React, {Component} from 'react';
import { StyleSheet,Text,Image,View,ScrollView,TouchableOpacity,Dimensions,Switch,Alert,TouchableHighlight,FlatList,Modal,StatusBar,Platform} from 'react-native';
import { StackActions} from 'react-navigation';
import Icon from '../common/icons';
import ThemeStyle from '../styles/ThemeStyle';

const {width, height} = Dimensions.get('window');

export default class StartScreen extends Component{
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  onPressed = () => {
    console.log('presssss');
  }

  render () {
    return(
      <View style={ThemeStyle.pageContainer}>
        <StatusBar
          translucent={false}
          backgroundColor={'rgb(42, 45, 124)'}
          barStyle={'light-content'}
          hidden={false}
        />
        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
          <Text style={{fontSize:26}}>StartScreen</Text>
        </View>

      </View>
    );
  }
}


const styles = StyleSheet.create({

});
