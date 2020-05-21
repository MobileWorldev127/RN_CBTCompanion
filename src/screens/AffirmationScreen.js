import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  Switch,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
  TouchableHighlight,
  FlatList,
  Modal,
  TextInput,
  Platform,
  ImageBackground
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import ThemeStyle from "../styles/ThemeStyle";
import Icon from "../common/icons";
import DatePicker from "react-native-datepicker";
import Header from "./../components/Header";
import TextStyles from "../common/TextStyles";

const { width, height } = Dimensions.get("window");

const STATUSBAR_HEIGHT = 15;
const NAVBAR_HEIGHT = 64 - STATUSBAR_HEIGHT;

export default class AffirmationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    var tabSwitch =
      this.state.switch == true
        ? { backgroundColor: "#DEFDEC" }
        : { backgroundColor: "lightgrey" };

    var AffirmationsCardView = [];
    for (i = 0; i < 3; i++) {
      AffirmationsCardView.push(
        <ImageBackground
          source={require("../src/activity.png")}
          resizeMode="cover"
          style={{
            width: null,
            height: 160,
            borderRadius: 5,
            overflow: "hidden",
            marginBottom: 12
          }}
        >
          <LinearGradient
            colors={[ThemeStyle.mainColor, "#53a4adbb", "#80d6a1bb"]}
            style={styles.linearGradient}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingTop: 15,
                paddingHorizontal: 16
              }}
            >
              <Text
                style={[
                  TextStyles.SubHeaderBold,
                  { fontSize: 16, color: "#fff" }
                ]}
              >
                Morning Affirmations
              </Text>
              <Icon
                name="delete"
                family="MaterialCommunityIcons"
                color="#d4d6d5"
                size={26}
              />
            </View>
            <View style={{ flexDirection: "row", paddingHorizontal: 16, alignItems: "center" }}>
              <Icon name="clock" family="Feather" color="#FFF" size={22} />
              <Text
                style={[
                  TextStyles.GeneralText,
                  {
                    fontSize: 20,
                    color: "#fff",
                    marginLeft: 6
                  }
                ]}
              >
                8.30 AM
              </Text>
            </View>

            <View style={styles.rowWeek}>
              <TouchableOpacity style={styles.weekContainer}>
                <Text style={styles.textWeek}>SUN</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.weekContainer}>
                <Text style={styles.textWeek}>MON</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.weekContainer}>
                <Text style={styles.textWeek}>TUE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.weekContainer}>
                <Text style={styles.textWeek}>WED</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.weekContainer}>
                <Text style={styles.textWeek}>THU</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.weekContainer}>
                <Text style={styles.textWeek}>FRI</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.weekContainer}>
                <Text style={styles.textWeek}>SAT</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ImageBackground>
      );
    }
    return (
      <View style={ThemeStyle.pageContainer}>
        <StatusBar
          translucent={true}
          backgroundColor={"transparent"}
          barStyle={"light-content"}
          hidden={false}
        />
        {/* Top Nav Bar*/}
        <Header
          title="Affirmations"
          goBack={() => {
            this.props.navigation.goBack(null);
          }}
        />
        {/* <View style={{height:64}}>
          <LinearGradient colors={['#4897B0','#53a4ad','#80d6a1' ]} style={styles.linearGradient}>
            <View style={{height:STATUSBAR_HEIGHT}} />
            <View style={{height:NAVBAR_HEIGHT, flexDirection:'row'}}>
              <TouchableHighlight underlayColor='#74cc95' onPress={() => this.props.navigation.goBack()}
                style={{flex:0.8,alignItems:'center',justifyContent:'center'}}>
                <Icon name="arrow-left" family="Feather" color="#FFF" size={28} />
              </TouchableHighlight>
              <View style={{flex:3,alignItems:'center',justifyContent:'center'}}>
                <Text style={{textAlign:'center',fontSize:16,color:'#fff',fontWeight:'bold'}}>Affirmations</Text>
              </View>
              <TouchableHighlight underlayColor='#74cc95' onPress={this.onSaveButtonPress}
                style={{flex:0.8,alignItems:'center',justifyContent:'center'}}>
                <Icon name="md-add" family="Ionicons" color="#FFF" size={28} />
              </TouchableHighlight>
            </View>
          </LinearGradient>
        </View> */}

        <ScrollView>
          <View style={styles.outerContainer}>{AffirmationsCardView}</View>
        </ScrollView>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  linearGradient: {
    flex: 1
  },
  outerContainer: {
    marginTop: 12,
    marginHorizontal: 12
  },
  rowWeek: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 0
  },
  textWeek: {
    color: "#000",
    fontSize: 10,
    textAlign: "center",
    fontWeight: "bold"
  },
  weekContainer: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 2
  }
});
