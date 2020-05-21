import React, { Component, Fragment } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Modal,
  Platform
} from "react-native";
import styles from "./styles";
import Icon from "react-native-vector-icons/Ionicons";
import { Auth, Storage, Logger } from "aws-amplify";
import { NavigationActions } from "react-navigation";
import PhoneInput from "react-native-phone-input";
import validator from "validator";
import Header from "../../../components/Header";
import ImagePicker from "react-native-image-picker";
import { withStore } from "../../../utils/StoreUtils";
import { showMessage } from "react-native-flash-message";
import { errorMessage } from "../../../utils";
import { recordScreenEvent, screenNames } from "../../../utils/AnalyticsUtils";
import { requestCameraPermission } from "../../../utils/PermissionUtils";
import ThemeStyle from "../../../styles/ThemeStyle";
import Button from "../../../components/Button";
import { Alert } from "react-native";

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.phoneNoInput = null;
    this.therapistNoInput = null;
    this.state = {
      image: null,
      errorText: null,
      name: "",
      email: "",
      phone_no: "",
      therapist_no: "",
      showEmailModal: false,
      showPhoneModal: false,
      verificationCode: "",
      emailVerification: "",
      phone_number_verified: false,
      email_verified: false,
      imageData: null
    };
    this.isOTPSent = false;
    this.userInfo = {};
  }

  showModal = () => {
    this.setState({ showPhoneModal: true });
  };

  hideModal = () => {
    this.setState({ showPhoneModal: false });
  };

  pickImage = async () => {
    const options = {
      storageOptions: {
        skipBackup: true,
        path: "images"
      }
    };
    // ImagePicker.launchImageLibrary(options, image => {
    //   if (!image.cancelled) {
    //     this.setState({ image: image.uri, imageData: image });
    //   }
    // }).catch(err => {
    //   console.log(err);
    //   showMessage(
    //     errorMessage(
    //       "Unable to access photos. Please make sure you have granted the permissions"
    //     )
    //   );
    // });
    // console.log('=======>',this.state.permissionGrant)
    if (!this.state.permissionGrant) {
      showMessage(
        errorMessage(
          "Unable to access photos. Please make sure you have granted the permissions"
        )
      );
    }
    try {
      ImagePicker.launchImageLibrary(options, image => {
        if (image && image.error) {
          showMessage(
            errorMessage(
              image.error ||
                "Unable to access photos. Please make sure you have granted the permissions"
            )
          );
        } else if (image && image.uri) {
          this.setState({ image: image.uri, imageData: image });
        }
      });
    } catch (err) {
      console.log(err);
      showMessage(
        errorMessage(
          "Unable to access photos. Please make sure you have granted the permissions"
        )
      );
    }
  };

  componentDidMount = () => {
    recordScreenEvent(screenNames.profile);
    this.getData();
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props !== nextProps || this.state !== nextState) {
      return true;
    } else {
      return false;
    }
  }

  saveData = async () => {
    this.isOTPSent = false;
    if (!this.state.name) {
      this.setState({
        errorText: "Invalid Name."
      });
    } else if (
      !(
        this.state.email &&
        this.state.email !== "" &&
        validator.isEmail(this.state.email)
      )
    ) {
      this.setState({
        errorText: "Invalid Email"
      });
    } else if (!this.phoneNoInput.isValidNumber()) {
      this.setState({
        errorText: "Invalid Phone Number."
      });
    } else if (
      this.therapistNoInput.getValue() &&
      !this.therapistNoInput.isValidNumber()
    ) {
      this.setState({
        errorText: "Invalid Therapist's Number."
      });
    } else {
      let userDetails = {
        picture: this.state.image || "",
        name: this.state.name,
        phone_number: this.phoneNoInput
          .getValue()
          .replace(/\s/g, "")
          .replace(/-/g, ""),
        "custom:therapist_phone": this.therapistNoInput
          .getValue()
          .replace(/\s/g, "")
          .replace(/-/g, ""),
        email: this.state.email
      };

      this.saveUserData();
    }
  };

  getData = async () => {
    try {
      let user = await Auth.currentUserInfo();
      this.userInfo = user.attributes;
      let data = user.attributes;
      const name = data.name;
      const email = data.email;
      const phone_no = data.phone_number;
      const therapist_no = data["custom:therapist_phone"];
      this.imageName =
        data.picture && data.picture.indexOf(".xml") == -1 ? data.picture : "";
      const profileImage = data.picture
        ? await Storage.get(data.picture, { level: "protected" })
        : "";
      console.log(profileImage);
      const phone_number_verified = data.phone_number_verified;
      const email_verified = data.email_verified;
      console.log("GET USER DATA", user);
      this.setState({
        image: profileImage,
        name: name,
        email: email,
        phone_no: phone_no,
        therapist_no: therapist_no,
        email_verified: email_verified,
        phone_number_verified: phone_number_verified
      });
      this.checkPermission();
    } catch (error) {
      showMessage(
        errorMessage("Something went wrong, please try after sometime")
      );
      setTimeout(() => {
        this.goBack();
      }, 4100);
    }
  };

  checkPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await requestCameraPermission();
        if (
          granted["android.permission.WRITE_EXTERNAL_STORAGE"] == "granted" ||
          granted["android.permission.READ_EXTERNAL_STORAGE"] == "granted"
        ) {
          this.setState({ permissionGrant: true });
        } else if (
          granted["android.permission.WRITE_EXTERNAL_STORAGE"] ==
            "never_ask_again" ||
          granted["android.permission.READ_EXTERNAL_STORAGE"] ==
            "never_ask_again"
        ) {
          Alert.alert(
            "Permission",
            "You need to grant storage permission manually from device settings to do signature."
          );
        } else {
          Alert.alert("Permission", "You need to grant ");
        }
      } catch (err) {
        console.log(err);
        Alert.alert(
          "You need to grant storage permission manually from device settings to do signature."
        );
      }
    } else {
      this.setState({ permissionGrant: true });
    }
  };
  goBack = () => this.props.navigation.dispatch(NavigationActions.back());

  onSubmitVerification = () => {
    const { verificationCode } = this.state;
    if (verificationCode !== "") {
      Auth.verifyCurrentUserAttributeSubmit("phone_number", verificationCode)
        .then(res => {
          showMessage({
            type: "success",
            message: "Phone number verified successfully!"
          });
          this.setState({ phone_number_verified: true });
          this.isOTPSent = false;
          // this.saveData();
          this.getData();
          this.hideModal();
        })
        .catch(e => {
          console.log(e);
          this.setState({ phone_number_verified: false });
          showMessage(
            errorMessage(
              "Failed to verify Phone number, please try again later"
            )
          );
          this.showModal();
        });
    }
  };

  emailVerification = () => {
    const { emailVerification } = this.state;
    if (emailVerification !== "") {
      Auth.verifyCurrentUserAttributeSubmit("email", emailVerification)
        .then(res => {
          showMessage({
            type: "success",
            message: "Email verified successfully!"
          });
          this.setState({ showEmailModal: false, email_verified: true });
          this.isOTPSent = false;
          this.getData();
          // this.saveData();
        })
        .catch(e => {
          showMessage(
            errorMessage("Failed to verify Email, please try again later")
          );
          this.setState({ showEmailModal: true, email_verified: false });
        });
    }
  };

  saveUserData = async () => {
    let userDetails = {
      picture: this.state.image || "",
      name: this.state.name,
      phone_number: this.phoneNoInput
        .getValue()
        .replace(/\s/g, "")
        .replace(/-/g, ""),
      "custom:therapist_phone": this.therapistNoInput
        .getValue()
        .replace(/\s/g, "")
        .replace(/-/g, ""),
      email: this.state.email
    };
    console.log("SAVE USER DATA", userDetails);
    if (!this.therapistNoInput.isValidNumber()) {
      userDetails["custom:therapist_phone"] = "";
    }
    this.props.setLoading(true);
    let user = await Auth.currentAuthenticatedUser({
      bypassCache: true
    });
    if (
      this.state.image &&
      this.state.image.indexOf("profile-image-") == -1 &&
      this.state.image.indexOf(".xml") == -1
    ) {
      console.log(this.state.image);
      const fileName = `profile-image-${this.state.name}`;
      console.log(fileName);
      await Storage.put(
        fileName,
        new Buffer(this.state.imageData.data, "base64"),
        {
          contentType: this.state.imageData.type,
          level: "protected"
        }
      )
        .then(data => {
          console.log(data);
          userDetails.picture = data.key;
          return Auth.updateUserAttributes(user, userDetails);
        })
        .then(response => {
          this.verifyAttributesIfNeeded(user, userDetails);
          showMessage({
            type: "success",
            message: "Profile saved successfully"
          });
        })
        .catch(err => {
          showMessage(
            errorMessage("Failed to update profile, please try again later")
          );
        })
        .finally(() => {
          this.props.setLoading(false);
        });
    } else {
      userDetails.picture =
        user.attributes.picture && user.attributes.picture.indexOf(".xml") == -1
          ? user.attributes.picture
          : "";
      console.log("UPDATING USER ATTRIBUTES", userDetails);
      Auth.updateUserAttributes(user, userDetails)
        .then(response => {
          console.log("UPDATED USER ATTRIBUTES", response);
          this.verifyAttributesIfNeeded(user, userDetails);
          showMessage({
            type: "success",
            message: "Profile saved successfully!"
          });
        })
        .catch(err => {
          showMessage(
            errorMessage("Failed to update profile, try again later")
          );
        })
        .finally(() => {
          this.props.setLoading(false);
        });
    }
  };

  verifyAttributesIfNeeded = (user, userDetails) => {
    console.log(
      "VERIFY",
      this.isOTPSent,
      this.state.phone_number_verified,
      user.attributes.phone_number,
      userDetails.phone_number
    );
    if (
      !this.isOTPSent &&
      (user.attributes.phone_number !== userDetails.phone_number ||
        !this.state.phone_number_verified)
    ) {
      console.log("VERIFY PHONE NUMBER");
      Auth.verifyCurrentUserAttribute("phone_number")
        .then(res => {
          this.isOTPSent = true;
          this.showModal();
        })
        .catch(e => {
          console.log(e);
          showMessage(errorMessage("Failed to verify phone number"));
        });
    } else if (
      !this.isOTPSent &&
      (user.attributes.email !== userDetails.email ||
        !this.state.email_verified)
    ) {
      Auth.verifyCurrentUserAttribute("email")
        .then(res => {
          this.isOTPSent = true;
          this.setState({
            showEmailModal: true
          });
        })
        .catch(e => {
          showMessage(
            errorMessage("Failed to verify Email, please try again later")
          );
        });
    }
  };

  render() {
    const {
      image,
      name,
      email,
      phone_no,
      therapist_no,
      phone_number_verified,
      email_verified
    } = this.state;
    return (
      <View style={ThemeStyle.pageContainer}>
        <Header
          title="Profile"
          goBack={() => this.props.navigation.goBack(null)}
        />
        <KeyboardAvoidingView
          style={{ paddingHorizontal: 20, zIndex: -1 }}
          behavior="position"
          keyboardVerticalOffset={10}
        >
          <ScrollView>
            <TouchableOpacity
              style={{ alignSelf: "center" }}
              onPress={this.pickImage}
            >
              <Image
                source={
                  image
                    ? { uri: image, cache: "force-cache" }
                    : require("../../../src/avatar.jpg")
                }
                style={styles.imageSelect}
              />
            </TouchableOpacity>
            <View style={styles.singleInput}>
              <Icon
                name="ios-person"
                size={28}
                color="#bbb"
                style={styles.icon}
              />
              <TextInput
                onChangeText={name => this.setState({ name })}
                underlineColorAndroid="transparent"
                placeholder="Name"
                placeholderTextColor="#aaa"
                value={name}
                style={styles.input}
              />
            </View>
            <View style={styles.singleInput}>
              <Icon
                name="ios-mail"
                size={28}
                color="#bbb"
                style={styles.icon}
              />
              <TextInput
                keyboardType="email-address"
                onChangeText={email => {
                  email = email.trim();
                  this.setState({ email });
                  if (
                    this.userInfo.email == email &&
                    this.userInfo.email_verified
                  ) {
                    this.setState({ email_verified: true });
                  } else {
                    this.setState({ email_verified: false });
                  }
                }}
                underlineColorAndroid="transparent"
                placeholder="Email"
                placeholderTextColor="#aaa"
                autoCorrect={false}
                autoCapitalize="none"
                value={email}
                style={styles.input}
              />

              {email_verified ? (
                <Icon
                  name="ios-checkmark-circle-outline"
                  size={28}
                  color="#bbb"
                  style={[styles.iconRight, { color: "#008000" }]}
                />
              ) : (
                <Icon
                  name="ios-alert"
                  size={28}
                  color="#bbb"
                  style={[styles.iconRight, { color: "#ff0000" }]}
                />
              )}
            </View>
            <View style={styles.singleInput}>
              <Icon
                name="ios-phone-portrait"
                size={28}
                color="#bbb"
                style={styles.icon}
              />
              <PhoneInput
                ref={ref => {
                  this.phoneNoInput = ref;
                }}
                onPressFlag={this.onPressFlag}
                style={styles.input}
                value={phone_no}
                textStyle={{ color: "#333" }}
                textProps={{
                  onFocus: () => {
                    this.setState({ errorText: null });
                  },
                  placeholder: "Phone Number"
                }}
                autoFormat={true}
                onChangePhoneNumber={number => {
                  number = number.replace(/\s/g, "");
                  number = number.replace(/-/g, "");
                  this.setState({ phone_no: number });
                  if (
                    this.userInfo.phone_number == number &&
                    this.userInfo.phone_number_verified
                  ) {
                    this.setState({ phone_number_verified: true });
                  } else {
                    this.setState({ phone_number_verified: false });
                  }
                }}
              />
              {phone_number_verified ? (
                <Icon
                  name="ios-checkmark-circle-outline"
                  size={28}
                  color="#bbb"
                  style={[styles.iconRight, { color: "#008000" }]}
                />
              ) : (
                <Icon
                  name="ios-alert"
                  size={28}
                  color="#bbb"
                  style={[styles.iconRight, { color: "#ff0000" }]}
                />
              )}
            </View>
            <View style={styles.singleInput}>
              <Icon
                name="ios-call"
                size={28}
                color="#bbb"
                style={styles.icon}
              />
              <PhoneInput
                initialCountry={null}
                ref={ref => {
                  this.therapistNoInput = ref;
                }}
                onPressFlag={this.onPressFlag}
                style={styles.input}
                value={therapist_no}
                textStyle={{ color: "#333" }}
                textProps={{
                  onFocus: () => {
                    this.setState({ errorText: null });
                  },
                  placeholder: "Therapist's Number"
                }}
                autoFormat={true}
                onChangePhoneNumber={number => {
                  number = number.replace(/\s/g, "");
                  number = number.replace(/-/g, "");
                  this.setState({ therapist_no: number });
                }}
              />
            </View>
            <View style={styles.errorTextContainer}>
              <Text style={styles.errorText}>
                {this.state.errorText ? this.state.errorText : ""}
              </Text>
            </View>
            <Button name="Save Data" onPress={this.saveData} />
          </ScrollView>
        </KeyboardAvoidingView>
        <Modal
          animationType="fade"
          visible={this.state.showPhoneModal}
          transparent={true}
          onRequestClose={() => {}}
        >
          <View style={styles.modalContainer}>
            <View style={styles.overlay} />
            <View style={styles.wrapper}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>
                  Enter the verification code we sent to your phone number.
                </Text>
                <TextInput
                  placeholder={"Enter Code..."}
                  keyboardType={"numeric"}
                  onChangeText={verificationCode =>
                    this.setState({ verificationCode })
                  }
                  value={this.state.verificationCode}
                  style={styles.verifyInput}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.onSubmitVerification}
                >
                  <Text style={styles.buttonText}>VERIFY PHONE NUMBER</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => this.hideModal("showPhoneModal")}
                >
                  <Text>
                    <Icon
                      name="ios-close"
                      size={30}
                      color="#777"
                      style={styles.closeIcon}
                    />
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          visible={this.state.showEmailModal}
          transparent={true}
          onRequestClose={() => {}}
        >
          <View style={styles.modalContainer}>
            <View style={styles.overlay} />
            <View style={styles.wrapper}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>
                  Enter the verification code we sent to your Email.
                </Text>
                <TextInput
                  placeholder={"Enter Code..."}
                  keyboardType={"numeric"}
                  onChangeText={emailVerification =>
                    this.setState({ emailVerification })
                  }
                  value={this.state.emailVerification}
                  style={styles.verifyInput}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.emailVerification}
                >
                  <Text style={styles.buttonText}>VERIFY EMAIL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => this.setState({ showEmailModal: false })}
                >
                  <Text>
                    <Icon
                      name="ios-close"
                      size={30}
                      color="#777"
                      style={styles.closeIcon}
                    />
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

export default withStore(ProfileScreen);
