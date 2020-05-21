import ThemeStyle from "../../styles/ThemeStyle";
import TextStyles from "../../common/TextStyles";

// import theme from '../../theme';

export default (styles = {
  container: {
    flex: 1,
    backgroundColor: ThemeStyle.pageContainer.backgroundColor
  },
  wrapper: {
    marginHorizontal: 16,
    alignItems: "center",
    position: "relative",
    zIndex: 2,
    paddingVertical: 20,
    paddingBottom: 64,
    minWidth: "90%"
    // marginBottom: 130
  },
  modalContainer: {
    position: "relative",
    alignItems: "center",
    paddingBottom: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
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
  modalContent: {
    width: "90%",
    height: "auto",
    borderRadius: 10,
    justifyContent: "center",
    top: 10,
    bottom: 10
  },
  resultModalContent: {
    backgroundColor: "white",
    height: "auto",
    paddingVertical: 15,
    borderRadius: 5,
    top: 10
  },
  closeButton: {
    position: "absolute",
    top: 30,
    right: 15,
    fontSize: 30,
    fontWeight: "bold",
    zIndex: 10
  },
  closeIcon: {
    fontSize: 30,
    fontWeight: "bold"
  },
  nextArrow: {
    position: "absolute",

    right: 0
  },
  prevArrow: {
    position: "absolute",

    left: 0
  },
  buttonText: {
    color: "white",
    fontFamily: TextStyles.HeaderBold.fontFamily,
    letterSpacing: 0.8
  },
  title: {
    color: "white",
    fontSize: 25,
    top: 30
  },
  emptyScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 60,
    backgroundColor: ThemeStyle.pageContainer.backgroundColor
  },
  emptyTitle: {
    textAlign: "center",
    fontFamily: TextStyles.HeaderBold.fontFamily,
    fontSize: 20,
    letterSpacing: 1,
    color: "#454955",
    marginTop: 15,
    opacity: 1
  },
  button: {
    paddingVertical: 15,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    letterSpacing: 1,
    fontFamily: TextStyles.GeneralText.fontFamily
  },
  quizButton: {
    backgroundColor: ThemeStyle.mainColor,
    marginBottom: 15
  },
  trophyImage: {
    width: 150,
    height: 150,
    marginTop: 15,
    marginBottom: 15
  }
});
