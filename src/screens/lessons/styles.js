import { StyleSheet } from "react-native";
import TextStyles from "../../common/TextStyles";
import ThemeStyle from "../../styles/ThemeStyle";

export default StyleSheet.create({
  childContainer: {
    marginVertical: 20,
    marginRight: 20
  },
  childImage: {
    width: 160,
    height: 120,
    borderRadius: 5
    // borderWidth : 2,
    // borderColor : "#ccc"
  },
  childTitle: {
    textAlign: "center",
    paddingVertical: 10,
    paddingHorizontal: 6,
    justifyContent:"center",
    alignItems:"center",
    width: 160,
    minHeight: 60
  },
  transcript: {
    fontFamily: TextStyles.ContentText.fontFamily,
    marginTop: 20
  },
  mainImage: {
    height: 220,
    width: "100%"
  },
  closeButton: {
    position: "absolute",
    right: 30,
    top: 40
  },
  cardImage: {
    width: "100%",
    height: 200
  },
  cartTitleSection: {
    backgroundColor: "white",
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52
  },
  cardTitle: {
    textAlign: "center",
    color: ThemeStyle.mainColor
  }
});
