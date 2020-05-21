import { Platform } from "react-native";
import ThemeStyle from "../../styles/ThemeStyle";
import TextStyles from "../../common/TextStyles";
export default {
  container: {
    paddingHorizontal: 30,
    paddingVertical: 30,
  },
  input: {
    backgroundColor: "white",
    paddingRight: 10,
    paddingLeft: 25,
    color: "#333",
    borderWidth: 0.5,
    borderColor: "#ddd",
    marginVertical: 7,
    borderRadius: 40,
    fontSize: 16,
    ...Platform.select({
      ios: {
        paddingVertical: 15
      },
      android: {
        paddingVertical: 15
      }
    })
  },
  button: {
    backgroundColor: ThemeStyle.accentColor,
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    borderRadius: 40
  },
  buttonText: {
    color: "white",
    fontFamily: TextStyles.SubHeaderBold.fontFamily,
    fontSize: 16,
    letterSpacing: 0.8
  },
  singleInput: {
    position: "relative",
    marginVertical: 10
  },
  errorTextContainer: {
    height: 30,
    justifyContent: "center"
  },
  errorText: {
    fontSize: 14,
    color: "red"
  }
};
