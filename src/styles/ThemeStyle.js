let mainColor = "#4868C9";
let accentColor = "#6DD189";

const redesign = {
  mainColor: "#4E67C1",
  mainColorLight: "#D1DBFF",
  accentColor: "#9D77CB",
  accentColor2: "#3992B6",
  gradient: ["#A989D0", "#3997B1"]
};

export default ThemeStyle = {
  pageContainer: {
    flex: 1,
    backgroundColor: "#EDF0F9"
  },
  shadow: props => ({
    shadowColor: "rgba(78,103,193,0.1)",
    shadowOffset: { height: 6 },
    shadowOpacity: 1,
    shadowRadius: 13,
    elevation: 4,
    ...props
  }),
  appTheme: "#fff",
  layColor: "rgba(0,0,255,0.3)",
  backgroundColor: "#EDF0F9",
  mainColor: "#3992B6",
  mainColorLight: "#fff",
  accentColor: "#63DAA0",
  accentColor2: "#63DAA0",
  gradientColor: ["#3992B6", "#63DAA0"],
  gradientColor2: ["#63DAA0", "#3992B6"],
  accentColorTransparent: accentColor + "88",
  disabled: "#77869E",
  disabledLight: "#e0e0e0",
  textColor: "#333",
  text1: "#9BAEBC",
  text2: "#828282",
  text3: "#C9CFDF",
  gradientStart: "#3992B6",
  gradientEnd: "#63DAA0",
  red: "#FF5F58",
  green: "#63DAA0",
  exerciseColor: "#4ECDC4",
  meditationColor: "#B599C1",
  practiceIdeasColor: "#7474BF",
  summaryColor: "#84C4B4",
  homeworkColor: "#97CCDC",
  assessmentsColor: "#A0BFDC",
  quizColor: "#ABACCB",
  lessonColor: "#bd763b",
  favoriteColor: "#D1A9B1",
  communityColor: "#A9D193"
};

// export default (ThemeStyle = {
//   pageContainer: {
//     flex: 1,
//     backgroundColor: "#EDF0F9"
//   },
//   card: {
//     borderRadius: 10,
//     backgroundColor: "#fff",
//   },
//   appTheme: "#fff",
//   layColor: "rgba(0,0,255,0.3)",
//   // mainColor: "#4ba4c6",
//   // accentColor: "#38CB89",
//   // gradientColor: ["#4ba4c6", "#53a4ad", "#80d6a1", "#38CB89"]
//   mainColor: mainColor,
//   accentColor: accentColor,
//   accentColorTransparent: accentColor + "33",
//   textColor: "#333",
//   gradientStart: "#4868C9",
//   gradientEnd: "#A675CF",
//   gradientColor: ["#4868C9", "#786DCC", "#A675CF"],
//   exerciseColor: "#4ECDC4",
//   meditationColor: "#EB5757",
//   practiceIdeasColor: "#7474BF",
//   summaryColor: "#6fa33e",
//   homeworkColor: "#487fa7",
//   assessmentsColor: "#bd763b",
//   quizColor: "#487fa7",
//   lessonColor: "#bd763b",
//   favoriteColor: "#b83658",
//   communityColor: "#7474BF"
// });
