import { Platform } from "react-native";
import ThemeStyle from "../../../styles/ThemeStyle";
import TextStyles from "../../../common/TextStyles";

export default {
  imageSelect: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginVertical: 25
  },
  input: {
    backgroundColor: "white",
    paddingRight: 10,
    paddingLeft: 50,
    color: "#333",
    borderWidth: 0.5,
    borderColor: "#ddd",
    marginVertical: 7,
    borderRadius: 40,
    ...Platform.select({
      ios: {
        paddingVertical: 15
      },
      android: {
        paddingVertical: 10
      }
    })
  },
  button: {
    backgroundColor: ThemeStyle.accentColor,
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    borderRadius: 40
  },
  buttonText: {
    color: "white",
    fontFamily: TextStyles.SubHeaderBold.fontFamily,
    letterSpacing: 0.8
  },
  singleInput: {
    position: "relative"
  },
  icon: {
    position: "absolute",
    top: 17,
    left: 20,
    zIndex: 2
  },
  iconRight: {
    position: "absolute",
    top: 17,
    right: 20,
    zIndex: 2
  },
  errorTextContainer: {
    height: 30,
    justifyContent: "center",
    marginLeft: 10
  },
  errorText: {
    fontSize: 14,
    color: "red"
  },
  wrapper: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    zIndex: 2
  },
  modalContainer: {
    position: "relative",
    flex: 1
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1
  },
  closeIcon: {
    position: "absolute",
    top: 0,
    right: 0
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    height: 250,
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: "center"
  },
  modalText: {
    textAlign: "center",
    paddingVertical: 10
  },
  verifyInput: {
    backgroundColor: "white",
    paddingRight: 10,
    paddingLeft: 15,
    color: "#333",
    borderWidth: 0.5,
    borderColor: "#ddd",
    marginVertical: 7,
    borderRadius: 40,
    ...Platform.select({
      ios: {
        paddingVertical: 15
      },
      android: {
        paddingVertical: 10
      }
    })
  },
  closeButton: {
    padding: 5,
    position: "absolute",
    top: 10,
    right: 15
  }
};
