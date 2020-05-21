import ThemeStyle from "../../../styles/ThemeStyle";
import TextStyles from "../../../common/TextStyles";

export default {
  singleReminder: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 15
  },
  reminderLeft: {
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  reminderMid: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderLeftWidth: 1,
    // borderRightWidth: 1,
    borderColor: "#ccc",
    flexDirection: "row",
    flexWrap: "wrap"
  },
  singleDay: {
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ThemeStyle.accentColor,
    marginRight: 7,
    marginBottom: 7,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 100
  },
  reminderRight: {
    paddingHorizontal: 10
  },
  reminderTime: {
    fontFamily: TextStyles.GeneralText.fontFamily,
    letterSpacing: 0.5,
    fontSize: 14
  },
  reminderDays: {
    fontFamily: TextStyles.GeneralText.fontFamily,
    letterSpacing: 0.5,
    fontSize: 10,
    color: ThemeStyle.accentColor
  },
  reminderSmall: {
    fontSize: 10
  },
  modalHeader: {
    flexDirection: "row",
    width: "auto",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderColor: "#ddd"
  },
  modalButton: {
    justifyContent: "center",
    alignItems: "center"
  },
  modalButtonText: {
    fontFamily: TextStyles.HeaderBold.fontFamily,
    fontSize: 15,
    color: ThemeStyle.mainColor,
    letterSpacing: 0.7
  },
  modalContent: {
    paddingBottom: 70
  },
  list: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 0.4,
    borderRadius: 4,
    borderColor: "#bbb",
    marginTop: 16
  },
  label: {
    fontFamily: TextStyles.GeneralText.fontFamily,
    letterSpacing: 1,
    fontSize: 14,
    paddingVertical: 4
  },
  subLabel: {
    fontFamily: TextStyles.HeaderBold.fontFamily,
    paddingLeft: 2,
    fontSize: 16,
    color: "#52575B"
  },
  dailyButton: {
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    borderColor: ThemeStyle.disabled,
    borderWidth: 1,
    margin: 15,
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 18
  },
  dailyButtonText: {
    fontFamily: TextStyles.HeaderBold.fontFamily,
    fontSize: 12,
    color: "#666",
    letterSpacing: 0.7
  },
  selectorDays: {
    paddingHorizontal: 10,
    marginTop: 10,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  daySelectButton: {
    borderColor: ThemeStyle.disabled,
    borderWidth: 1,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginRight: 10
  },
  activeDayButton: {
    backgroundColor: ThemeStyle.mainColor
  },
  activeDayButtonText: {
    color: "white"
  },
  dayButtonText: {
    color: "#666",
    fontSize: 12,
    fontFamily: TextStyles.GeneralText.fontFamily,
  },
  remindMe: {
    fontFamily: TextStyles.Header2.fontFamily,
    fontSize: 16,
    color: ThemeStyle.disabled
  },
  clearButton: {
    alignSelf: "flex-end",
    paddingVertical: 4,
    paddingHorizontal: 5
  },
  clearText: {
    color: ThemeStyle.mainColor,
    fontSize: 12,
    fontFamily: TextStyles.HeaderBold.fontFamily
  },
  trash: {
    alignSelf: "center",
    paddingRight: 10,
    paddingLeft: 10
    // width: 40,
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
    letterSpacing: 1,
    marginTop: 15
  }
};

export const card = {
  card: {
    marginHorizontal: 10,
    marginVertical: 10,
    zIndex: 9,
    borderRadius: 6,
    overflow: "hidden",
    height: "auto"
  },
  cardBg: {
    width: "100%"
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    // backgroundColor: theme.primaryColor,
    opacity: 0.8
    // zIndex: -1
  },
  content: {
    paddingHorizontal: 10,
    paddingVertical: 15
  },
  deleteButton: {
    position: "absolute",
    right: 10,
    top: 8,
    zIndex: 9
  },
  title: {
    color: "white",
    fontFamily: TextStyles.HeaderBold.fontFamily,
    fontSize: 15,
    letterSpacing: 0.9
  },
  time: {
    fontFamily: TextStyles.HeaderBold.fontFamily,
    color: "white",
    fontSize: 23,
    marginTop: 5
  },
  dayContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10
  },
  day: {
    marginTop: 15,
    paddingVertical: 2,
    paddingHorizontal: 9,
    backgroundColor: "white",
    marginHorizontal: 5,
    borderRadius: 20
  },
  dayText: {
    fontFamily: TextStyles.GeneralText.fontFamily,
    letterSpacing: 1,
    fontSize: 10
  }
};
