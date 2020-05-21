import React, { Component } from 'react';
import {
  StyleSheet,
  Image, View, Text
} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

import CustomMarker from '../screens/CustomMarker';

export default class TextRangeSlider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sliderValue: 0,
      multiSliderValue: [15, 0],
    }
  }

  multiSliderValuesChange = (values) => {
    this.setState({
      multiSliderValue: values,
    });

    var textLabels = this.props.labels || ["Hard", "Medium", "Easy"];
    var totalPartition = textLabels.length -1;
    var totalPercentage = 100;
    var individualLabelPercentageOffset = totalPercentage/totalPartition;

    var selectedValue = "";
    var labelView = [];

    textLabels.map((item, index) => {
      if(values[0] >= (index*individualLabelPercentageOffset)) {
        selectedValue = item;
      }
    })
    this.props.onValuesChange(selectedValue);
  }

  render() {
    var textLabels = this.props.labels || ["Hard", "Medium", "Easy"];
    var totalPartition = textLabels.length -1;
    var totalPercentage = 100;
    var individualLabelPercentageOffset = totalPercentage/totalPartition;

    var selectedValue = "";
    var labelView = [];

    textLabels.map((item, index) => {
      if(this.state.multiSliderValue[0] >= (index*individualLabelPercentageOffset)) {
        selectedValue = item;
      }
      labelView.push(<Text style={styles.textStyle}>{item}</Text>);
    })

    return (
      <View style={{}}>
        <MultiSlider
          selectedStyle={{backgroundColor: '#dc93f9',}}
          unselectedStyle={{backgroundColor: 'silver',}}
          // values={[5]}
          containerStyle={{height:40,margin:5}}
          trackStyle={{height:6,backgroundColor: 'red',}}
          touchDimensions={{height: 100,width: 40,borderRadius: 20,slipDisplacement: 40,}}
          values={[this.state.multiSliderValue[0]]}
          onValuesChange={this.multiSliderValuesChange}
          customMarker={() => <CustomMarker value={selectedValue}/>}
          max={100}
          sliderLength={300}
          >
        </MultiSlider>
        {/* <Text>{this.state.multiSliderValue[0]}</Text> */}
        <View style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:15}}>
          {labelView}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    height: 30,
    width: 60
  },
  textStyle: {
      fontSize:14,
      color:'black',
      transform: [{ rotate: '-50deg'}],
      textAlign:'justify',
      alignSelf:'flex-end'
  }
});
