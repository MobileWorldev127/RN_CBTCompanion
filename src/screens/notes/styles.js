import { StyleSheet } from "react-native";
import TextStyles from "../../common/TextStyles";
import ThemeStyle from "../../styles/ThemeStyle";

export default StyleSheet.create({
  input: {
    borderWidth: 0.5,
    minHeight: 50,
    borderColor: "#ccc",
    marginTop: 10,
    padding: 12,
    color: "#333",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 4,
    fontFamily: TextStyles.GeneralText.fontFamily
  },
  labelText: {
    color: "black",
    fontSize: 15,
    fontFamily: TextStyles.SubHeaderBold.fontFamily
  },
  button: {
    height: 43,
    marginBottom: 20,
    elevation: 10,
    backgroundColor: ThemeStyle.accentColor,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    fontFamily: TextStyles.SubHeaderBold.fontFamily,
    fontSize: 18,
    color: "#f7f7f7",
    marginLeft: 10
  }
});
