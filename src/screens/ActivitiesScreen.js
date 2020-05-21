import React, { Component } from 'react';
import {View,Text,StyleSheet,TouchableOpacity,Image,ScrollView,Dimensions,FlatList,StatusBar,SafeAreaView,Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { StackActions} from 'react-navigation';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

import CustomMarker from './CustomMarker';
import Icon from '../common/icons';
import ThemeStyle from '../styles/ThemeStyle';
import TextRangeSlider from '../common/TextRangeSlider';

const {width, height} = Dimensions.get('window');

export default class ActivitiesScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      elements:
      [
        {
          id    : 1,
          name  : 'Running',
          color : '#F9D377',
        },
        {
          id    : 2,
          name  : 'Hiking',
          color : '#F9D377',
        },
        {
          id    : 3,
          name  : 'Jogging',
          color : '#F9D377',
        },
        {
          id    : 4,
          name  : 'Music',
          color : '#9BF475',
        },
        {
          id    : 5,
          name  : 'Hiking Mountains',
          color : '#9BF475',
        },
        {
          id    : 6,
          name  : 'Photography',
          color : '#9BF475',
        },
        {
          id    : 7,
          name  : 'Reading',
          color : '#92D2F9',
        },
        {
          id    : 8,
          name  : 'Internet',
          color : '#92D2F9',
        },
        {
          id    : 9,
          name  : 'Driving',
          color : '#92D2F9',
        },
      ],
      modalVisible : false,
      value:0,
      sliderOneChanging: false,
      sliderOneValue: [5],
      multiSliderValue: [15, 0],
    }
  }

  modalOpen = () => {
    this.setState({modalVisible: true})
  };

  closeModal = () => {
    this.setState({modalVisible: false})
  };

  change(value) {
    this.setState(() => {
      return {
        value: parseFloat(value),
      };
    });
  }

  sliderOneValuesChangeStart = () => {
    this.setState({
      sliderOneChanging: true,
    });
  }

  sliderOneValuesChange = (values) => {
    let newValues = [0];
    newValues[0] = values[0];
    this.setState({
      sliderOneValue: newValues,
    });
  }

  sliderOneValuesChangeFinish = () => {
    this.setState({
      sliderOneChanging: false,
    });
  }

  multiSliderValuesChange = (values) => {
    this.setState({
      multiSliderValue: values,
    });
  }


  render() {
    let elementsList = [];
    if(this.state.elements.length > 0){
      this.state.elements.map(data=>{
        elementsList.push(
          <TouchableOpacity key={data.id} style={{borderWidth: 1, marginHorizontal: 3,marginBottom: 10, borderRadius: 25, paddingVertical: 7, borderColor: data.color}} onPress={this.modalOpen}>
            <Text style={{fontSize: 14, color: data.color,paddingHorizontal: 15, textAlign:'center'}}>{data.name}</Text>
          </TouchableOpacity>
        )
      });
    }
    const {value} = this.state;

    return (
        <View style={[ThemeStyle.pageContainer,{backgroundColor:'#fff',paddingHorizontal:5}]}>
            <View style={{backgroundColor:'#fff', height:54, justifyContent:'center', flexDirection:'row', alignItems:'center',borderBottomWidth:0.5,borderColor:'lightgrey'}}>
                <TouchableOpacity style={{marginLeft:10, flex:0.5}} onPress={() => this.props.navigation.goBack()}>
                    <Icon name="keyboard-backspace" family="MaterialIcons" size={25} color={ThemeStyle.mainColor}/>
                </TouchableOpacity>
                <View style={{flex:5,alignItems:'center',justifyContent:'center', }}>
                    <Text style={{color:'black',textAlign:'center',fontSize:18, fontWeight:'bold',}}>Activity</Text>
                </View>
                <View style={{flex:1}} />
            </View>
            <View style={{flex:1.5,marginTop:10}}>
                <Text style={{fontSize:16,color:ThemeStyle.mainColor,paddingVertical:12,paddingHorizontal:12}}>Activities</Text>
                <View style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', marginHorizontal: 10}}>
                    {elementsList}
                </View>

                {/*Activites choosen*/}
                <View style={{borderColor:'#d67ef8', borderRadius:15, borderWidth:2, paddingLeft:10, paddingRight:10,marginTop:10, marginLeft:10, marginRight:10}} >

                  <Text style={{paddingVertical:10, borderColor:'#EEEDEE', borderBottomWidth:1,color:'#d67ef8', fontSize:16, fontWeight:'bold'}} >RUNNING</Text>
                  <View style={{paddingTop:10, paddingBottom:10}}>
                    <View style={{flexDirection:'row', marginBottom:5}}>
                      <View style={{borderColor:'#d67ef8', borderRadius:15, borderWidth:2, marginRight:5}} >
                        <Text style={{fontSize:13,paddingVertical:5, paddingHorizontal:10, color:'#d67ef8'}} >Activity Type: Pleasurable</Text>
                      </View>
                      <View style={{borderColor:'#d67ef8', borderRadius:15, borderWidth:2}} >
                        <Text style={{fontSize:13,paddingVertical:5, paddingHorizontal:10, color:'#d67ef8'}} >Achievement: 5/10</Text>
                      </View>
                    </View>
                    <View style={{flexDirection:'row', marginBottom:5 }}>
                      <View style={{borderColor:'#d67ef8', borderRadius:15, borderWidth:2, marginRight:5}} >
                        <Text style={{fontSize:13,paddingVertical:5, paddingHorizontal:10, color:'#d67ef8'}} >Closeness: 5/10</Text>
                      </View>
                      <View style={{borderColor:'#d67ef8', borderRadius:15, borderWidth:2}} >
                        <Text style={{fontSize:13,paddingVertical:5, paddingHorizontal:10, color:'#d67ef8'}} >Activity Type: 5/10</Text>
                      </View>
                    </View>
                    <View style={{flexDirection:'row', }}>
                      <View style={{borderColor:'#d67ef8', borderRadius:15, borderWidth:2}} >
                        <Text style={{fontSize:13,paddingVertical:5, paddingHorizontal:10, color:'#d67ef8'}} >Difficulty: Medium</Text>
                      </View>
                    </View>
                  </View>

                </View>
            </View>
            <View style={{flex:0.2,alignItems:'flex-end',margin:20}}>
              <TouchableOpacity style={{paddingVertical:10,paddingHorizontal:25,}}>
                <Text style={{fontSize:16,color:ThemeStyle.mainColor,fontWeight:'bold'}}>DONE</Text>
              </TouchableOpacity>
            </View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    alert('Modal has been closed.');
                }}>
                <View style={{flex:1,backgroundColor: 'rgba(255,255,255,0.12)'}}>
                    <View style={{flex:1,position:'absolute',bottom:0,left:0,right:0}}>
                        {/* <View style={{height:100, backgroundColor:'#fff'}} /> */}
                        <View style={{backgroundColor: '#fff',shadowColor:'grey',shadowOffset:{width:15,height:5},
                        shadowOpacity:0.5,shadowRadius:10, elevation:50,padding:10}}>
                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                <Text style={{fontSize:14,fontWeight:'bold',color:'#414141'}}>DETAILS</Text>
                                <TouchableOpacity onPress={this.closeModal}>
                                    <Icon name='ios-close' family='Ionicons' size={45} color='#224275'/>
                                </TouchableOpacity>
                            </View>
                            {/* Activity Type */}
                            <View style={{borderWidth:2,borderColor:'#dc93f9',borderRadius:15,padding:10, marginBottom:5}}>
                                <Text style={{fontSize:13,fontWeight:'bold',color:'#d380f6',paddingVertical:5,
                                  }}>Activity Type</Text>
                                <View style={{flexDirection:'row', justifyContent:'space-around',paddingVertical:5,}} >
                                  <View style={{paddingHorizontal:13, paddingVertical:3,borderRadius:30, borderWidth:2, borderColor:'#d380f6', flexDirection:'row', alignItems:'center', justifyContent:'center'}} >
                                      <Icon name='circle-o' family='FontAwesome' size={12} color='#d380f6'/>
                                      <Text style={{marginLeft:3, color:'#d380f6', fontSize:13}}>Routine</Text>
                                  </View>
                                  <View style={{paddingHorizontal:13, paddingVertical:3,backgroundColor:'#d380f6',borderRadius:30, borderWidth:2, borderColor:'#d380f6', flexDirection:'row', alignItems:'center', justifyContent:'center'}} >
                                      <Icon name='md-checkmark-circle' family='Ionicons' size={12} color='#fff'/>
                                      <Text style={{marginLeft:3, color:'#fff', fontSize:13}}>Pleasurable</Text>
                                  </View>
                                  <View style={{paddingHorizontal:13, paddingVertical:3,borderRadius:30, borderWidth:2, borderColor:'#d380f6', flexDirection:'row', alignItems:'center', justifyContent:'center'}} >
                                      <Icon name='circle-o' family='FontAwesome' size={12} color='#d380f6'/>
                                      <Text style={{marginLeft:3, color:'#d380f6', fontSize:13}}>Necessary</Text>
                                  </View>
                                </View>
                            </View>

                            {/* Routine, Closeness, Enjoyment */}
                            <View style={{borderWidth:2,borderColor:'#dc93f9',borderRadius:15,padding:10, marginBottom:5}}>
                                <View>
                                  <Text style={{fontSize:14,fontWeight:'bold',color:'#d380f6',
                                  }}>Routine</Text>
                                  <MultiSlider
                                    selectedStyle={{backgroundColor: '#D67EF8',}}
                                    unselectedStyle={{backgroundColor: '#DCDCDC',}}
                                    // values={[5]}
                                    containerStyle={{height:30,margin:5,paddingTop:5}}
                                    trackStyle={{height:6,backgroundColor: 'red',}}
                                    touchDimensions={{height: 100,width: 40,borderRadius: 20,slipDisplacement: 40,}}
                                    values={[this.state.multiSliderValue[0]]}
                                    onValuesChange={this.multiSliderValuesChange}
                                    customMarker={() => <CustomMarker value={`${this.state.multiSliderValue[0]} %`}/>}
                                    max={100}
                                    sliderLength={300}
                                    >
                                  </MultiSlider>
                                </View>
                                <View>
                                  <Text style={{fontSize:14,fontWeight:'bold',color:'#d380f6',
                                  }}>Closeness</Text>
                                  <MultiSlider
                                    selectedStyle={{backgroundColor: '#D67EF8',}}
                                    unselectedStyle={{backgroundColor: '#DCDCDC',}}
                                    // values={[5]}
                                    containerStyle={{height:30,margin:5,paddingTop:5}}
                                    trackStyle={{height:6,backgroundColor: 'red',}}
                                    touchDimensions={{height: 100,width: 40,borderRadius: 20,slipDisplacement: 40,}}
                                    values={[this.state.multiSliderValue[0]]}
                                    onValuesChange={this.multiSliderValuesChange}
                                    customMarker={() => <CustomMarker value={`${this.state.multiSliderValue[0]} %`}/>}
                                    max={100}
                                    sliderLength={300}
                                    >
                                  </MultiSlider>
                                </View>
                                <View>
                                  <Text style={{fontSize:14,fontWeight:'bold',color:'#d380f6',paddingVertical:5,
                                  }}>Enjoyment</Text>
                                  <MultiSlider
                                    selectedStyle={{backgroundColor: '#D67EF8',}}
                                    unselectedStyle={{backgroundColor: '#DCDCDC',}}
                                    // values={[5]}
                                    containerStyle={{height:30,margin:5,paddingTop:5}}
                                    trackStyle={{height:6,backgroundColor: 'red',}}
                                    touchDimensions={{height: 100,width: 40,borderRadius: 20,slipDisplacement: 40,}}
                                    values={[this.state.multiSliderValue[0]]}
                                    onValuesChange={this.multiSliderValuesChange}
                                    customMarker={() => <CustomMarker value={`${this.state.multiSliderValue[0]} %`}/>}
                                    max={100}
                                    sliderLength={300}
                                    >
                                  </MultiSlider>
                                </View>
                            </View>

                            <View style={{borderWidth:2,borderColor:'#dc93f9',borderRadius:15,padding:10, marginBottom:5}}>
                                <Text style={{fontSize:14,fontWeight:'bold',color:'#dc93f9'}}>Difficulty</Text>
                                <TextRangeSlider labels={["Hard","Medium","Easy"]} onValuesChange={(text) => {console.log(text)}}/>
                                {/* <MultiSlider
                                  selectedStyle={{backgroundColor: '#dc93f9',}}
                                  unselectedStyle={{backgroundColor: 'silver',}}
                                  // values={[5]}
                                  containerStyle={{height:40,margin:5}}
                                  trackStyle={{height:6,backgroundColor: 'red',}}
                                  touchDimensions={{height: 100,width: 40,borderRadius: 20,slipDisplacement: 40,}}
                                  values={[this.state.multiSliderValue[0]]}
                                  onValuesChange={this.multiSliderValuesChange}
                                  customMarker={() => <CustomMarker value={this.state.multiSliderValue[0]}/>}
                                  max={100}
                                  sliderLength={300}
                                  >
                                </MultiSlider>
                                <View style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:15}}>
                                  <Text style={styles.textStyle}>Hard</Text>
                                  <Text style={styles.textStyle}>Medium</Text>
                                  <Text style={styles.textStyle}>Easy</Text>
                                </View> */}
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  sliderValue: {
    fontSize: 14,
    textAlign: 'center',
    color:'red'
  },
  textStyle: {
      fontSize:14,
      color:'black',
      transform: [{ rotate: '-50deg'}],
      textAlign:'justify',
      alignSelf:'flex-end'
  }
});
