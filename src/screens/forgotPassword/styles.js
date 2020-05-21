import ThemeStyle from "../../styles/ThemeStyle";
import TextStyles from "../../common/TextStyles";

export default {
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    paddingVertical: 48,
    paddingHorizontal: 24,
    justifyContent: "space-around"
  },
  title: {
    color: "#fff",
    fontSize: 30,
    textAlign: "center",
    letterSpacing: 3,
    paddingBottom: 48
  },
  singleInput: {
    padding: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#fff3",
    borderRadius: 24,
    marginBottom: 12
  },
  input: {
    fontSize: 15,
    color: "#fff",
    paddingLeft: 12,
    fontFamily: TextStyles.GeneralText.fontFamily
  },
  button: {
    paddingVertical: 15,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 24
  },
  header: {
    marginVertical: 24,
    marginHorizontal: 24
  },
  form: {
    marginTop: 45
  },
  button: {
    paddingVertical: 15,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: TextStyles.GeneralText.fontFamily
  },
  loginButton: {
    backgroundColor: ThemeStyle.mainColor
  },
  facebookButton: {
    backgroundColor: "#465EA9",
    marginBottom: 20
  },
  googleButton: {
    backgroundColor: "#CD5542"
  },
  forgotPassword: {
    textAlign: "center",
    fontSize: 13,
    marginTop: 10,
    marginBottom: 10
  },
  orText: {
    textAlign: "center",
    marginVertical: 10
  },
  bottomText: {
    color: "#000",
    textAlign: "center",
    fontSize: 13,
    fontFamily: TextStyles.GeneralText.fontFamily,
    marginTop: 30,
    marginBottom: 20
  },
  confirmText: {
    fontSize: 20,
    textAlign: "center",
    color: "#fff",
    fontFamily: TextStyles.GeneralText.fontFamily,
    marginTop: 10,
    marginBottom: -30
  },
  error: {
    color: "red",
    fontSize: 13,
    textAlign: "center",
    marginTop: -10,
    marginBottom: 10
  },
  errorTextContainer: {
    height: 30,
    justifyContent: "center",
    marginBottom: 10
  },
  resendCodeContainer: {
    height: 50,
    alignItems: "center",
    width: "100%"
  },
  resetCodeButton: {
    padding: 10
  },
  resendCode: {
    color: "#000"
  }
};
