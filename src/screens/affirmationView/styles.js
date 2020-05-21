import TextStyles from "../../common/TextStyles";

export default {
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative"
  },
  closeButton: {
    position: "absolute",
    top: 30,
    right: 20
  },
  mainText: {
    textAlign: "center",
    paddingHorizontal: 15,
    color: "white",
    fontFamily: TextStyles.SubHeaderBold.fontFamily,
    fontSize: 40
  }
};
