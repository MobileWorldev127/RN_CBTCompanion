import { StyleSheet } from "react-native";
import TextStyles from "../../common/TextStyles";

export default StyleSheet.create({
  emptyContainer: {
    justifyContent: "center",
    flex: 1
  },
  emptyText: {
    fontFamily: TextStyles.SubHeaderBold.fontFamily,
    color: "#444",
    padding: 24,
    textAlign: "center"
  },
  itemContainer: {
    marginHorizontal: 16,
    marginVertical: 8
  },
  itemTitle: {
    ...TextStyles.GeneralTextBold
  },
  homeworkItemImage: {
    width: 64
  },
  tabBar: {
    flexDirection: "row",
    paddingTop: 0,
    paddingBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: ThemeStyle.mainColorLight,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    overflow: "hidden"
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    backgroundColor: ThemeStyle.mainColor,
    borderRadius: 24,
    marginHorizontal: 8
  }
});
