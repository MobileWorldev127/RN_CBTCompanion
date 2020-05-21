import { Platform, PixelRatio, Dimensions } from "react-native";
import { isIphoneX } from "react-native-iphone-x-helper";


const { width, height } = Dimensions.get("window");

export default class DeviceUiInfo {
  static platform = Platform.OS;
  static screenSize = { width, height };
  static screenSizeWithPixelRatio = {
    width: width * PixelRatio.get(),
    height: height * PixelRatio.get()
  };
  static guidelineBaseWidth = 350;
  static guidelineBaseHeight = 680;
  static isIphonex = isIphoneX();

  static init() {
    this.screenSize = { width, height: height - softBarHeight };
  }

  static getPlatform() {
    return this.platform;
  }
  static getScreenSize() {
    return this.screenSize;
  }
  static getScreenSizeWithPixelRatio() {
    return this.screenSizeWithPixelRatio;
  }

  static scale(size) {
    return (this.screenSize.width / this.guidelineBaseWidth) * size;
  }

  static verticalScale(size) {
    return (
      ((this.screenSize.height - this.softBarHeight) /
        this.guidelineBaseHeight) *
      size
    );
  }

  static moderateScale(size, factor = 0.4) {
    return size + (this.scale(size) - size) * factor;
  }

  static widthPercentageToDP(widthPercent) {
    const screenWidth = width;
    // Convert string input to decimal number
    const elemWidth = parseFloat(widthPercent);
    return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
  }

  static heightPercentageToDP(heightPercent) {
    const screenHeight = height;
    // Convert string input to decimal number
    const elemHeight = parseFloat(heightPercent);
    return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
  }
}
