import ThemeStyle from "../../styles/ThemeStyle";
import TextStyles from "../../common/TextStyles";

export default (styles = {
  container: {
    flex: 1,
    backgroundColor: ThemeStyle.pageContainer.backgroundColor
  },
  wrapper: {
    paddingHorizontal: 16,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    zIndex: 2,
    minHeight: "95%"
  },
  modalContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
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
    width: "90%",
    backgroundColor: "white",
    height: "auto",
    borderRadius: 5,
    justifyContent: "center",
    top: 10,
    bottom: 10
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
    top: 25,
    right: 25,
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
    right: 0,
    width: 25
  },
  prevArrow: {
    position: "absolute",
    left: 0,
    width: 25
  },
  buttonText: {
    color: "#000",
    fontFamily: TextStyles.HeaderBold.fontFamily,
    letterSpacing: 0.8,
    fontSize: 16
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
    fontFamily: TextStyles.SubHeaderBold.fontFamily,
    fontSize: 20,
    letterSpacing: 1,
    color: "#454955",
    marginTop: 15,
    opacity: 1
  },
  tabBar: {
    flexDirection: "row",
    paddingTop: 0
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1
  }
});
