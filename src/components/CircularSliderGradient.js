import React, { Component } from "react";
import { PanResponder, View, Dimensions, Animated } from "react-native";
import Svg, {
  Path,
  Circle,
  G,
  Text,
  Image,
  ClipPath,
  Defs,
  Stop,
  LinearGradient
} from "react-native-svg";
import { PanGestureHandler } from "react-native-gesture-handler";
import { arc } from "d3-shape";
import range from "lodash/range";
import { moodImages, Moods, moodColors } from "../constants";
import ThemeStyle from "../styles/ThemeStyle";

function calculateStopColor(i) {
  // return [
  //   Math.round(beginColor[0] + ((endColor[0] - beginColor[0]) * i) / noOfSeg),
  //   Math.round(beginColor[1] + ((endColor[1] - beginColor[1]) * i) / noOfSeg),
  //   Math.round(beginColor[2] + ((endColor[2] - beginColor[2]) * i) / noOfSeg)
  // ];
  return moodColors[i];
}

const beginColor = [0x37, 0xba, 0xd6];
const endColor = [0x90, 0x53, 0x87];
// const startColors = ["rgb(10,170,50)","rgb(10,170,50)","rgb(249,244,99)","rgb(232,193,88)","rgb(220,234,114)"];
// const stopColors = ["rgb(191,216,2)","rgb(249,244,99)","rgb(232,193,88)","rgb(220,234,114)","rgb(232,69,4)"];
const startColors = [
  "rgb(0, 53, 0)",
  "rgb(10, 188, 50)",
  "rgb(190, 247, 69)",
  "rgb(249, 198, 69)",
  "rgb(249, 156, 69)"
];
const stopColors = [
  "rgb(10, 188, 50)",
  "rgb(190, 247, 69)",
  "rgb(249, 198, 69)",
  "rgb(249, 156, 69)",
  "rgb(211, 60, 23)"
];

const noOfSeg = 5;
const LINEAR_GRADIENT_PREFIX_ID = "gradientRing";

export default class CircleSlider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      angle: this.props.value,
      moodText: Moods[0].name,
      index: 1
      // initAnim: new Animated.Value(0),
    };
    this.r1 = 90;
    this.r2 = 100;
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gs) => true,
      onStartShouldSetPanResponderCapture: (e, gs) => true,
      onMoveShouldSetPanResponder: (e, gs) => true,
      onMoveShouldSetPanResponderCapture: (e, gs) => true,
      onPanResponderMove: (e, gs) => {
        // console.log("PAN RESPONDER", gs);

        let xOrigin =
          this.props.xCenter - (this.props.dialRadius + this.props.btnRadius);
        let yOrigin =
          this.props.yCenter - (this.props.dialRadius + this.props.btnRadius);
        let a = this.cartesianToPolar(gs.moveX - xOrigin, gs.moveY - yOrigin);
        this.handleChangeEvent(a);
        // this.setState({angle: a});
      }
    });
    this.r1 = this.props.dialRadius - this.props.dialWidth / 2;
    this.r2 = this.props.dialRadius + this.props.dialWidth / 2;
  }

  onHandlerStateChange = event => {
    // console.log("GESTURE HANDLER", event);
    if (event.nativeEvent.oldState === State.ACTIVE) {
      let xOrigin =
        this.props.xCenter - (this.props.dialRadius + this.props.btnRadius);
      let yOrigin =
        this.props.yCenter - (this.props.dialRadius + this.props.btnRadius);
      let a = this.cartesianToPolar(
        event.nativeEvent.translationX - xOrigin,
        event.nativeEvent.translationY - yOrigin
      );
      this.handleChangeEvent(a);
    }
  };

  renderLinearGradients() {
    let startColor = moodColors[1];
    let stopColor = calculateStopColor(1);

    // let startColor = startColors[0];
    // let stopColor = stopColors[0];
    let startAngle = 0;
    let stopAngle = (2 * Math.PI) / noOfSeg;

    return range(1, noOfSeg + 1).map(i => {
      // console.log("START COLOR " + startColor);
      // console.log("STOP COLOR " + stopColor);
      // console.log("LINEAR_GRADIENT_ID " + LINEAR_GRADIENT_PREFIX_ID + i);
      const linearGradient = (
        <LinearGradient
          id={LINEAR_GRADIENT_PREFIX_ID + i}
          key={LINEAR_GRADIENT_PREFIX_ID + i}
          // x1={this.r1 * Math.sin(startAngle)}
          // y1={-this.r1 * Math.cos(startAngle)}
          // x2={this.r1 * Math.sin(stopAngle)}
          // y2={-this.r1 * Math.cos(stopAngle)}
        >
          <Stop offset="1" stopColor={i > 4 ? stopColor : startColor} />
          <Stop offset="0" stopColor={i > 4 ? startColor : stopColor} />
          {/*<Stop offset="0%" stopColor={lastStartColor} />
          <Stop offset="150%" stopColor={stopColor} />*/}
        </LinearGradient>
      );
      startColor = stopColor;
      stopColor = calculateStopColor(i + 1);
      // startColor = startColors[i];
      // stopColor = stopColors[i];
      startAngle = stopAngle;
      stopAngle += (2 * Math.PI) / noOfSeg;

      return linearGradient;
    });
  }
  renderBackgroundPath() {
    const { backgroundColor } = this.props;
    const backgroundPath = arc()
      .innerRadius(this.r1)
      .outerRadius(this.r2)
      .startAngle(0)
      .endAngle(2 * Math.PI);
    var widthVal = (this.props.dialRadius + this.props.btnRadius) * 2;

    return (
      <Path
        x={widthVal / 2}
        y={widthVal / 2}
        d={backgroundPath()}
        fill={backgroundColor}
      />
    );
  } /*  */

  renderCirclePaths(fill) {
    var widthVal = (this.props.dialRadius + this.props.btnRadius) * 2;

    let numberOfPathsToDraw = Math.floor(
      (2 * Math.PI * (fill / 100)) / ((2 * Math.PI) / noOfSeg)
    );
    let rem = ((2 * Math.PI * (fill / 100)) / ((2 * Math.PI) / noOfSeg)) % 1;
    if (rem > 0) {
      numberOfPathsToDraw++;
    }
    let startAngle = 0;
    let stopAngle = (2 * Math.PI) / noOfSeg;

    return range(1, numberOfPathsToDraw + 1).map(i => {
      if (i === numberOfPathsToDraw && rem) {
        stopAngle = 2 * Math.PI * (fill / 100);
      }
      const circlePath = arc()
        .innerRadius(this.r1)
        .outerRadius(this.r2)
        .startAngle(startAngle)
        .endAngle(stopAngle - 0.005);
      // console.log(
      //   "FILL GRADIENT " + "url(#" + LINEAR_GRADIENT_PREFIX_ID + i + ")"
      // );
      const path = (
        <Path
          x={widthVal / 2}
          y={widthVal / 2}
          key={fill + i}
          d={circlePath()}
          fill={"url(#" + LINEAR_GRADIENT_PREFIX_ID + i + ")"}
        />
      );
      startAngle = stopAngle;
      stopAngle += (2 * Math.PI) / noOfSeg;

      return path;
    });
  }

  handleChangeEvent(angle) {
    console.log("HANDLE CHANGE EVENT", angle);
    var moodText = Moods[0].name;
    var index = 1;
    if (angle >= 0 && angle < 72) {
      moodText = Moods[0].name;
      index = 1;
    }
    if (angle > 72 && angle < 144) {
      moodText = Moods[1].name;
      index = 2;
    }
    if (angle > 144 && angle < 216) {
      moodText = Moods[2].name;
      index = 3;
    }
    if (angle > 216 && angle < 288) {
      moodText = Moods[3].name;
      index = 4;
    }
    if (angle > 288 && angle < 360) {
      moodText = Moods[4].name;
      index = 5;
    }
    if (angle != this.state.angle) {
      if (moodText != this.state.mood) {
        this.setState({ angle: angle, moodText: moodText, index });
        this.props.onValueChange(angle, moodText, index);
      } else {
        this.setState({ angle: angle });
      }
    }
  }

  // componentDidMount() {
  //   Animated.timing(
  //     // Animate over time
  //     this.state.initAnim,
  //     {
  //       toValue: 1,
  //       duration: 3000,
  //       useNativeDriver: false,
  //     }
  //   ).start();
  // }

  polarToCartesian(angle) {
    let r = this.props.dialRadius;
    let hC = this.props.dialRadius + this.props.btnRadius;
    let a = ((angle - 90) * Math.PI) / 180.0;

    let x = hC + r * Math.cos(a);
    let y = hC + r * Math.sin(a);
    return { x, y };
  }

  cartesianToPolar(x, y) {
    let hC = this.props.dialRadius + this.props.btnRadius;

    if (x === 0) {
      return y > hC ? 0 : 180;
    } else if (y === 0) {
      return x > hC ? 90 : 270;
    } else {
      return (
        Math.round((Math.atan((y - hC) / (x - hC)) * 180) / Math.PI) +
        (x > hC ? 90 : 270)
      );
    }
  }

  render() {
    let width = (this.props.dialRadius + this.props.btnRadius) * 2;
    let bR = this.props.btnRadius;
    let dR = this.props.dialRadius;
    let startCoord = this.polarToCartesian(0);
    let endCoord = this.polarToCartesian(this.state.angle);

    var imagePath = moodImages[1];
    var moodText = Moods[0].name;
    if (this.state.angle > 0 && this.state.angle < 72) {
      imagePath = moodImages[1];
      moodText = Moods[0].name;
    }
    if (this.state.angle > 72 && this.state.angle < 144) {
      imagePath = moodImages[2];
      moodText = Moods[1].name;
    }
    if (this.state.angle > 144 && this.state.angle < 216) {
      imagePath = moodImages[3];
      moodText = Moods[2].name;
    }
    if (this.state.angle > 216 && this.state.angle < 288) {
      imagePath = moodImages[4];
      moodText = Moods[3].name;
    }
    if (this.state.angle > 288 && this.state.angle < 360) {
      imagePath = moodImages[5];
      moodText = Moods[4].name;
    }
    // console.log("moodText", moodText);
    // console.log("Moods", Moods);
    // const { initAnim } = this.state;

    // let widthAnim = initAnim.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: ["10%", "90%"],
    // });
    const { rotation } = this.props;
    var fillColor = this.props.fillColor || "transparent";

    return (
      // <PanGestureHandler
      //   onHandlerStateChange={event => console.log("GESTURE", event)}
      // >
      <View style={{ overflow: "hidden" }}>
        <Svg
          ref="circleslider"
          width={width}
          height={width}
          // onPressIn={event => console.log("SVG EVENT", event)}
        >
          {/*<Defs>
            <Circle r={dR}
              cx={width/2}
              cy={width/2}
              stroke={this.props.meterColor}
              strokeWidth={this.props.dialWidth}
              fill='none'/>
        {/*</Defs>*/}

          <Defs>{this.renderLinearGradients()}</Defs>
          <G
            rotate={rotation - 90}
            // onPressIn={event => console.log("G EVENT", event)}
          >
            {this.renderBackgroundPath()}
            {/* {this.renderCirclePaths((this.state.angle * 100) / 360)} */}
            {this.renderCirclePaths(100)}
          </G>

          <Path
            stroke={fillColor}
            strokeWidth={this.props.dialWidth}
            fill="none"
            d={`M${startCoord.x} ${startCoord.y} A ${dR} ${dR} 0 ${
              this.state.angle > 180 ? 1 : 0
            } 1 ${endCoord.x} ${endCoord.y}`}
          />

          <G x={endCoord.x - bR} y={endCoord.y - bR}>
            <Circle
              r={bR}
              cx={bR}
              cy={bR}
              fill={this.props.meterColor}
              // onPressIn={event => console.log("CIRCLE EVENT", event)}
              {...this._panResponder.panHandlers}
            />
            {/* <Text
              x={bR}
              y={bR - this.props.textSize / 2}
              fontSize={this.props.textSize}
              fill={"transparent"}
              textAnchor="middle"
            >
              {this.props.onValueChange(
                this.state.angle,
                this.state.moodText,
                this.state.index
              ) + ""}
            </Text> */}
          </G>
        </Svg>
      </View>
      // </PanGestureHandler>
    );
  }
}

CircleSlider.defaultProps = {
  btnRadius: 15,
  dialRadius: 130,
  dialWidth: 5,
  meterColor: ThemeStyle.mainColor,
  textColor: "#fff",
  textSize: 10,
  value: 0,
  xCenter: Dimensions.get("window").width / 2,
  yCenter: Dimensions.get("window").height / 2,
  onValueChange: x => x,
  bgWidth: 15,
  bgColor: "grey",
  rotation: 90
};
