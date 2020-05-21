import React, {Component} from 'react';
import { View, Animated, Dimensions, Image, Easing } from 'react-native'

const { width, height } = Dimensions.get('window')

const animCount = 0

export default class CenterCircleTransition extends Component{

  constructor() {
    super()
    this.state = {
      anim: new Animated.Value(0),
      anim2: new Animated.Value(0)
    }
  }

  // componentDidMount() {
  //   this.startAnimation()
  // }

  startAnimation = () => {
    if (animCount === 3) {
      this.secondAnimation()
      return
    }
    animCount++;
    this.state.anim.setValue(0)
    Animated.timing(this.state.anim, {
      duration: 1000,
      toValue: 1,
      easing: Easing.elastic(0.04),
    }).start(this.startAnimation)
  }

  secondAnimation = () => {
    this.state.anim.setValue(2)
    Animated.timing(this.state.anim, {
      duration: 1000,
      toValue: 3,
      easing: Easing.elastic(0.04),
      useNativeDriver: true
    }).start(() => this.props.onComplete())
  }


  render() {
    const translateY = this.state.anim.interpolate({
      inputRange: [0, 0.5, 1, 2, 2.75, 3],
      outputRange: [0, -40, 0, 0, -150, 70],
      extrapolate: 'clamp'
    })
    const opacity = this.state.anim.interpolate({
      inputRange: [2.8, 2.99, 3],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp'
    })
    return (
      <Animated.View
        style={{
          opacity,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          width,
          height,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'red',
          zIndex:-1,
        }} >

      </Animated.View>
    )
  }
}
