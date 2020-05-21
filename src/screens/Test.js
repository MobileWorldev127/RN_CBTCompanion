import React, {Component} from 'react';
import { StyleSheet,Text,Image,View,ScrollView,TouchableOpacity,Dimensions,StatusBar,Alert,TouchableHighlight,FlatList,Modal} from 'react-native';
import { StackNavigator} from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import ThemeStyle from '../styles/ThemeStyle';
import CircleTransition from './CircleTransition';
import Icon from '../common/icons';

const {width, height} = Dimensions.get('window');

export default class Test extends Component{
    constructor(props){
    super(props);
    this.state = {
      visible:false,
    };
  }




  render () {

    return(
        <View style={ThemeStyle.pageContainer}>
          <StatusBar
            translucent={false}
            backgroundColor={'#122ACC'}
            barStyle={'light-content'}
            hidden={false}
          />
           <View style={{}}>
          <View style={{backgroundColor:'#fff', height:54, justifyContent:'center', flexDirection:'row', alignItems:'center',borderBottomWidth:0.5,borderColor:'lightgrey'}}>
              <TouchableOpacity style={{marginLeft:10, flex:0.5}} onPress={() => this.props.navigation.openDrawer()}>
                  <Icon name="menu" family="SimpleLineIcons" size={20} color='#000000'/>
              </TouchableOpacity>
              <View style={{flex:5,alignItems:'center',justifyContent:'center', }}>
                  <Text style={{color:'black',textAlign:'center',fontSize:16, fontWeight:'bold',}}>Test</Text>
              </View>
              <View style={{flex:1}} />
          </View>

            <LinearGradient colors={['#80d6a1', '#53a4ad']} style={styles.linearGradient}>
              <Text style={{fontSize:22,fontWeight:'bold',color:'#fff'}}>Psychological Survey</Text>
            </LinearGradient>
            </View>
            
        </View>
    );
  }
}

var styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center'
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});
