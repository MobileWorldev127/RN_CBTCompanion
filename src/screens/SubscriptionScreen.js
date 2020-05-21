import React, { Component, Fragment } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Modal,
  Linking,
  StyleSheet
} from "react-native";
import { connect } from "react-redux";
import SafeAreaView from "react-native-safe-area-view";
import { buySubscription, hideSubscription } from "../actions/IAPActions";
import ThemeStyle from "../styles/ThemeStyle";
import LinearGradient from "react-native-linear-gradient";
import Icon from "../common/icons";
import TextStyles from "../common/TextStyles";
import { APP } from "../constants";
import { recordInteractionEvent, eventNames } from "../utils/AnalyticsUtils";

class SubscriptionScreen extends Component {
  constructor(props) {
    super(props);
    this.features = [
      {
        title: "All CBT Lessons",
        description:
          "Ready to dig into CBT? Unlock CBT Companion's entire library of lessons.",
        image: require("../assets/images/redesign/premium-lessons.png"),
        color: "#00486b"
      },
      {
        title: "EXERCISES",
        description:
          "Exercises helps reinforce CBT and develop positive beliefs and behaviors. Challenge automatic thoughts, track predictions etc.",
        image: require("../assets/images/redesign/premium-exercises.png"),
        color: "#b8507d"
      },
      {
        title: "SUMMARY",
        description:
          "Get motivated to do be on track with your CBT practice with the help of our beautiful charts.",
        image: require("../assets/images/redesign/premium-summary.png"),
        color: "#fb2e41"
      },
      {
        title: "CBT QUIZ",
        description:
          "Ready to take your CBT Skills to next level? Quiz helps to master all the CBT Content.",
        image: require("../assets/images/redesign/premium-quiz.png"),
        color: "#252a36"
      },
      {
        title: "SHARE PROGRESS",
        description:
          "Share your progress summary with your therapist or care team via email or our clinician portal.",
        image: require("../assets/images/redesign/premium-share.png"),
        color: "#643d6e"
      },
      {
        title: "SET REMINDERS",
        description:
          "Set reminders to checkin and practice your CBT Skills and Exercises. So that you don't miss a single day.",
        image: require("../assets/images/redesign/premium-reminder.png"),
        color: "#004656"
      },
      {
        title: "AFFIRMATIONS",
        description:
          "Get motivated with powerful Affirmations at any time of the day by setting reminders for them.",
        image: require("../assets/images/redesign/premium-affirmation.png"),
        color: "#634087"
      }
    ];
  }
  buy = id => {
    recordInteractionEvent(eventNames.iapInitiate, {
      itemID: id + ""
    });
    this.props.buySubscription(id);
  };
  shouldComponentUpdate(nextProps) {
    return JSON.stringify(nextProps) !== JSON.stringify(this.props);
  }
  render() {
    this.items = this.props.items;
    console.log(this.items);
    return (
      <Modal
        visible={this.props.isSubscriptionVisible}
        onRequestClose={this.props.hideSubscription}
        animationType="slide"
      >
        <SafeAreaView
          style={{ flex: 1, backgroundColor: ThemeStyle.mainColor }}
          forceInset={{ bottom: "never" }}
        >
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 144,
              backgroundColor: ThemeStyle.backgroundColor
            }}
          >
            <View style={styles.container}>
              <View
                style={{
                  backgroundColor: ThemeStyle.mainColor
                }}
              >
                <View style={styles.topSection}>
                  <TouchableOpacity
                    style={styles.close}
                    onPress={this.props.hideSubscription}
                  >
                    <Icon
                      family="Ionicons"
                      name="ios-close"
                      size={45}
                      color={ThemeStyle.disabledLight}
                    />
                  </TouchableOpacity>
                  <Text
                    style={[TextStyles.SubHeaderBold, styles.goPremiumText]}
                  >
                    Go Premium
                  </Text>
                  <View style={styles.trial}>
                    <Text style={[TextStyles.Header2, styles.freeTrial]}>
                      FREE TRIAL OF 3 DAYS
                    </Text>
                    <Text style={[TextStyles.GeneralText, styles.subText]}>
                      -- When you subscribe --
                    </Text>
                  </View>
                </View>
                <ScrollView
                  contentContainerStyle={{
                    paddingHorizontal: 12,
                    paddingVertical: 16
                  }}
                  snapToAlignment="center"
                  snapToInterval={284}
                  horizontal={true}
                  decelerationRate={0}
                >
                  {this.features.map(feature => (
                    <View
                      style={{
                        width: 264,
                        backgroundColor: "#fff",
                        alignItems: "center",
                        borderRadius: 24,
                        margin: 12,
                        padding: 24
                      }}
                    >
                      <Image
                        style={{
                          height: 124
                        }}
                        source={feature.image}
                        resizeMode={"contain"}
                      />
                      <Text
                        style={[
                          TextStyles.SubHeaderBold,
                          { textAlign: "center", color: ThemeStyle.mainColor }
                        ]}
                      >
                        {feature.title}
                      </Text>
                      <Text
                        style={[
                          TextStyles.GeneralText,
                          {
                            marginTop: 8,
                            textAlign: "center",
                            fontSize: 16,
                            lineHeight: 20
                          }
                        ]}
                      >
                        {feature.description}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.bottomSection}>
                {/* {Platform.OS == "ios" ? ( */}
                <View>
                  <Text style={styles.subscriptionText}>
                    Payment will be charged to iTunes Account at confirmation of
                    purchase
                  </Text>
                  <Text style={styles.subscriptionText}>
                    Subscription automatically renews unless auto-renew is
                    turned off at least 24-hours before the end of the current
                    period
                  </Text>
                  <Text style={styles.subscriptionText}>
                    Account will be charged for renewal within 24-hours prior to
                    the end of the current period
                  </Text>
                  <Text style={styles.subscriptionText}>
                    Subscriptions may be managed by the user and auto-renewal
                    may be turned off by going to the users Account Settings
                    after purchase
                  </Text>
                  <Text style={styles.subscriptionText}>
                    Any unused portion of a free trial period, if offered, will
                    be forfeited when the user purchases a subscription to that
                    publication, where applicable.
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingBottom: 20
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => Linking.openURL(APP.privacyPolicy)}
                    >
                      <Text
                        style={[
                          styles.subscriptionText,
                          { textDecorationLine: "underline" }
                        ]}
                      >
                        Privacy Policy{" "}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openURL(APP.tnc)}>
                      <Text
                        style={[
                          styles.subscriptionText,
                          { textDecorationLine: "underline" }
                        ]}
                      >
                        Terms of use{" "}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {/* ) : null} */}
              </View>
            </View>
          </ScrollView>
          <View
            style={{
              position: "absolute",
              bottom: 20,
              flexDirection: "row",
              paddingHorizontal: 8
            }}
          >
            {this.items.map((item, index) => {
              console.log("ITEM", index, index % 2);
              return (
                <React.Fragment>
                  <Package
                    key={index}
                    index={index}
                    title={item.title.split("(")[0]}
                    price={item.localizedPrice}
                    onPress={() => this.buy(item.productId)}
                    tag=""
                  />
                </React.Fragment>
              );
            })}
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}

const Package = props => (
  <TouchableOpacity
    style={[
      styles.list,
      {
        backgroundColor:
          props.index % 2 === 0
            ? ThemeStyle.accentColor
            : ThemeStyle.accentColor2
      }
    ]}
    onPress={props.onPress}
  >
    <Text style={[TextStyles.HeaderBold, { color: "#fff" }]}>
      {props.price || "650"}
    </Text>
    <Text
      style={[
        TextStyles.GeneralText,
        { color: "#fff", fontSize: 16, textAlign: "center" }
      ]}
    >
      {props.title}
    </Text>
    {props.tag.length > 0 && (
      <Text
        style={[TextStyles.GeneralText, { color: "#fff", textAlign: "center" }]}
      >
        {props.tag}
      </Text>
    )}
    {/* <Text style={styles.rightSubTitle}>PER MONTH</Text> */}
  </TouchableOpacity>
);

const dispatchToProps = dispatch => ({
  buySubscription: id => dispatch(buySubscription(id)),
  hideSubscription: () => dispatch(hideSubscription())
});

const styles = StyleSheet.flatten({
  container: {
    flex: 1,
    backgroundColor: ThemeStyle.pageContainer.backgroundColor
  },
  topSection: {
    // backgroundColor: theme.primaryColor,
    position: "relative",
    // justifyContent: 'center',
    alignItems: "center",
    marginTop: 12
  },
  close: {
    position: "absolute",
    right: 30
  },
  premiumIcon: {
    width: 30,
    height: 30,
    marginTop: 20
  },
  goPremiumText: {
    color: "#fff",
    marginTop: 12,
    fontSize: 24
    // fontFamily: theme.boldFont,
  },
  mainText: {
    color: "white",
    // fontFamily: theme.boldFont,
    marginTop: 15,
    fontSize: 30,
    letterSpacing: 1
  },
  subText: {
    paddingHorizontal: 10,
    color: "#fff",
    textAlign: "center",
    marginTop: 10
    // fontFamily: theme.semiBoldFont,
  },
  trial: {
    marginTop: 24,
    width: "80%",
    justifyContent: "center",
    alignItems: "center"
    // position: 'absolute',
    // bottom: -50,
    // height: 50,
    // paddingHorizontal: 50,
    // backgroundColor: theme.primaryColor,
    // borderBottomLeftRadius: 10,
    // borderBottomRightRadius: 10
  },
  freeTrial: {
    color: "white"
    // fontFamily: theme.semiBoldFont,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginTop: 5
  },
  list: {
    marginHorizontal: 4,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  subscriptionText: {
    marginTop: 12,
    ...TextStyles.GeneralText
  }
});

export default connect(
  state => ({
    items: state.iap.items,
    isSubscribed: state.iap.isSubscribed,
    purchases: state.iap.purchases,
    isSubscriptionVisible: state.iap.isSubscriptionVisible
  }),
  dispatchToProps
)(SubscriptionScreen);
