import TextStyles from "../../common/TextStyles";
import ThemeStyle from "../../styles/ThemeStyle";

export default {
  container: {
    paddingBottom: 50,
  },
  therapistIdHeading: {
    fontSize: 16,
    textAlign: "justify",
    fontFamily: TextStyles.GeneralText.fontFamily
  },
  therapistIdText: {
    fontSize: 23,
    textAlign: "justify",
    marginTop: 8,
    fontFamily: TextStyles.SubHeaderBold.fontFamily,
  },
  button: {
    backgroundColor: ThemeStyle.accentColor,
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 12,
    borderRadius: 50,
    marginHorizontal: 20,
    width: 100,
    alignSelf: "flex-end"
  },
  buttonText: {
    color: "white",
    fontFamily: TextStyles.SubHeaderBold.fontFamily,
    fontSize: 16
  },
  errorTextContainer: {
    height: 30,
    justifyContent: "center"
  },
  errorText: {
    fontSize: 14,
    color: "red"
  },
  checkboxText: {
    fontFamily: TextStyles.GeneralText.fontFamily,
    marginLeft: 4,
    position: "relative"
  },
  prefHeader: {
    fontSize: 16,
    fontFamily: TextStyles.GeneralText.fontFamily
  },
  prefHeaderContainer: {
    marginBottom: 16
  },
  prefContainer: {
    padding: 16,
    paddingTop: 5,
  },
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    borderWidth: 1,
    borderColor: 'darkgray',
    padding: 15,
    paddingBottom: 20,
    borderRadius: 10,
  },
  boxInnerContainerStyle: {
    paddingTop: 10,
    paddingBottom: 0
  },
  boxStyle: {
    flex: null
  }
};
