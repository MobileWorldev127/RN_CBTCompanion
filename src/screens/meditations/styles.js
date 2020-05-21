import ThemeStyles from "./../../styles/ThemeStyle";

export const meditationPlay = {
  container: {
    flex: 1
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  media: {
    flex: 1,
    alignItems: "center"
  },
  controls: {
    marginBottom: 120
  },
  mediaImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderColor:"#fff",
    borderWidth: 4,
  },
  mediaImageSection: {
    shadowColor: "#333",
    shadowOffset: { width: 2, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 2,
    marginTop: 80
  },
  mediaTitle: {
    marginTop: 40,
    marginBottom: 14,
    color: "white",
    // fontFamily: theme.semiBoldFont,
    paddingHorizontal: 24,
    textAlign: "center",
  },
  mediaAuthor: {
    // fontFamily: theme.semiBoldFont,
    color: "#eee",
    textAlign: "center",
  },
  buttons: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    flexDirection: "row"
  },
  mediaButton: {
    borderWidth: 2,
    borderColor: "white",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 15
  },
  playPause: {
    width: 72,
    height: 72,
    borderRadius: 36
  }
};

export const mainStyles = {
  container: {
    flex: 1,
    backgroundColor: ThemeStyles.pageContainer.backgroundColor
  }
};

export const meditationStyles = {
  list: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#fff"
  },
  author: {
    // fontFamily: theme.regularFont,
    color: "#777",
    fontSize: 14
  }
};

export const authorStyles = {
  authors: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 15,
  },
  author: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10
  }
};

export const themeStyles = {
  container: {
    flex: 1
  },
  box: {
    position: "relative",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2
  },
  gridView: {
    paddingVertical: 25,
    flex: 1,
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 2,
    opacity: 0.2,
    borderRadius: 5
  },
  content: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 3,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ThemeStyles.accentColor + "44"
  },
  imageTitle: {
    color: "white",
    // fontFamily: theme.boldFont,
    fontSize: 19,
    textAlign: "center"
  }
};
