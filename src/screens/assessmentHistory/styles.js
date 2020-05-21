import ThemeStyle from "../../styles/ThemeStyle";
import TextStyles from "../../common/TextStyles";

export default (styles = {
  container: {
    flex: 1,
    backgroundColor: ThemeStyle.pageContainer.backgroundColor
  },
  wrapper: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    zIndex: 2
  },
  footerResultWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    zIndex: 2,
    paddingVertical: 0,
    paddingBottom: 20,
    height: "auto"
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
    height: "auto",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1
  },
  modalContent: {
    width: "100%",
    backgroundColor: "white",
    paddingVertical: 20,
    borderRadius: 5,
    justifyContent: "center",
    top: 0,
    bottom: 10,
    marginVertical: 20,
    verticalAlign: 15,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 0
  },
  resultModalContent: {
    width: "90%",
    backgroundColor: "white",
    height: "auto",
    paddingVertical: 20,
    borderRadius: 5,
    top: 10,
    bottom: 10
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 15
  },
  closeIcon: {
    position: "absolute",
    top: 0,
    right: 0,
    fontSize: 27
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
    fontSize: 20,
    paddingVertical: 16
  }
});
