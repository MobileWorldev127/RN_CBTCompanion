import TextStyles from "../../common/TextStyles";
import ThemeStyle from "../../styles/ThemeStyle";

export default {
  container: {
    flex: 1,
    backgroundColor: ThemeStyle.pageContainer.backgroundColor
  },
  list: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 4
  },
  label: {
    fontFamily: TextStyles.SubHeaderBold.fontFamily,
    fontSize: 20,
    paddingVertical: 4,
    color: '#4191fb'
  },
  label2: {
    fontFamily: TextStyles.SubHeaderBold.fontFamily,
    fontSize: 18,
  },
  checkboxText: {
    fontSize: 16,
    fontFamily: TextStyles.GeneralText.fontFamily,
    marginLeft: 10,
    color: TextStyles.GeneralText.color,
    position: "relative"
  },
  floatingActionButton: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: ThemeStyle.mainColor,
    position: "absolute",
    bottom: 30,
    right: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  emptyScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 60,
    backgroundColor: ThemeStyle.pageContainer.backgroundColor
  },
  emptyTitle: {
    fontFamily: TextStyles.GeneralText.fontFamily,
    color: "#aaa",
    fontSize: 20,
    marginTop: 15
  },
  addBtn: {
    width: '100%',
    height: 50,
    backgroundColor: '#4191fb',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderRadius: 25,
  },
  addTxt: {
    color: 'white',
    fontSize: 20,
  }
};
