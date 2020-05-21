import React, { Component } from "react";
import {
  View,
  ScrollView,
  Platform,
  StatusBar,
  Dimensions
} from "react-native";
import styles from "./styles";
import * as Animatable from "react-native-animatable";
import ThemeStyle from "../../styles/ThemeStyle";
import TextStyles from "../../common/TextStyles";
import Header from "./../../components/Header";
import ReactNativeParallaxHeader from "react-native-parallax-header";
import { getLessonImage, getCloudIDFromImageURL } from "../../utils/ImageUtils";
import HTML from "react-native-render-html";
import CLImage from "../../components/CLImage";
import LottieLoader from "../../components/lottieLoader";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";
import Card from "../../components/Card";

export default class LessonCardScreen extends Component {
  componentDidMount() {
    recordScreenEvent(screenNames.lessons_card, {
      title: this.props.navigation.state.params.title
    });
  }

  render() {
    let params = this.props.navigation.state.params;
    let animationDelay = 0;
    return (
      <View style={ThemeStyle.pageContainer}>
        <StatusBar
          translucent={true}
          backgroundColor={"transparent"}
          barStyle={"light-content"}
          hidden={false}
        />
        <Header
          title={""}
          isBack={true}
          navBarStyle={{ backgroundColor: "#0000", borderColor: "#0000" }}
          goBack={() => {
            this.props.navigation.goBack(null);
          }}
        />
        <Animatable.Text
          animation="fadeInUp"
          delay={(animationDelay += 300)}
          style={[
            TextStyles.Header2,
            { marginHorizontal: 24, marginBottom: 12 }
          ]}
        >
          {params.title}
        </Animatable.Text>
        <ReactNativeParallaxHeader
          style={{ backgroundColor: ThemeStyle.backgroundColor }}
          headerMinHeight={20}
          headerMaxHeight={280}
          extraScrollHeight={20}
          navbarColor={ThemeStyle.backgroundColor}
          renderImage={() =>
            params.image && !params.image.endsWith(".json") ? (
              <Animatable.View animation="zoomIn">
                <Card style={{ marginHorizontal: 24 }}>
                  <CLImage
                    cloudId={getCloudIDFromImageURL(params.image)}
                    source={{ uri: getLessonImage(params.image) }}
                    style={{
                      width: "100%",
                      height: ((Dimensions.get("window").width - 48) * 3) / 4
                    }}
                  />
                </Card>
              </Animatable.View>
            ) : (
              <Animatable.View animation="zoomIn">
                <Card style={{ marginHorizontal: 24 }}>
                  <LottieLoader
                    source={""}
                    src={params.image}
                    dimensions={{ width: "100%", height: 240 }}
                  />
                </Card>
              </Animatable.View>
            )
          }
          backgroundImage={{
            uri: getLessonImage(params.image)
          }}
          backgroundImageScale={1.2}
          renderContent={() => (
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 24,
                backgroundColor: ThemeStyle.backgroundColor
              }}
            >
              <Animatable.View
                animation="fadeInUp"
                delay={(animationDelay += 120)}
                style={[styles.transcript]}
              >
                <HTML
                  html={params.description}
                  baseFontStyle={{
                    color: "#4F4F4F",
                    fontSize: 14,
                    lineHeight: 17
                  }}
                />
              </Animatable.View>
            </ScrollView>
          )}
        />
      </View>
    );
  }
}
