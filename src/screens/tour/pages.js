import React from "react";
import { Image } from "react-native";
import styles from "./styles";
import ThemeStyle from "../../styles/ThemeStyle";

export default [

  {
    backgroundColor: ThemeStyle.pageContainer.backgroundColor,
    image: (
      <Image
        source={require("./../../src/tour-record.png")}
        style={styles.tourImage}
        resizeMode="contain"
      />
    ),
    title: "Record Mood",
    subtitle: "Record how you feel, emotions, challenge automatic thought, predict etc."
  },
  {
    backgroundColor: ThemeStyle.pageContainer.backgroundColor,
    image: (
      <Image
        source={require("./../../src/tour-emotion-intensity.png")}
        style={styles.tourImage}
        resizeMode="contain"
      />
    ),
    title: "Emotion intensity",
    subtitle: "Select the emotions you feel and the intensity."
  },
  {
    backgroundColor: ThemeStyle.pageContainer.backgroundColor,
    image: (
      <Image
        source={require("./../../src/tour-exercises.png")}
        style={styles.tourImage}
        resizeMode="contain"
      />
    ),
    title: "Exercises",
    subtitle: "You can select from a comprehensive list of CBT Exercises."
  },
  {
    backgroundColor: ThemeStyle.pageContainer.backgroundColor,
    image: (
      <Image
        source={require("./../../src/tour-exercise-by-module.png")}
        style={styles.tourImage}
        resizeMode="contain"
      />
    ),
    title: "Exercise",
    subtitle: "User friendly step-wise flow for recording exercise."
  },
  {
    backgroundColor: ThemeStyle.pageContainer.backgroundColor,
    image: (
      <Image
        source={require("./../../src/tour-exercise-review.png")}
        style={styles.tourImage}
        resizeMode="contain"
      />
    ),
    title: "Exercise detail",
    subtitle: "Previw the exercise in a beautiful format."
  },
  {
    backgroundColor: ThemeStyle.pageContainer.backgroundColor,
    image: (
      <Image
        source={require("./../../src/tour-journal.png")}
        style={styles.tourImage}
        resizeMode="contain"
      />
    ),
    title: "Journal",
    subtitle:
      "Record your journal for the day. Also upload images, audios or any kind of files you want."
  },
  {
    backgroundColor: ThemeStyle.pageContainer.backgroundColor,
    image: (
      <Image
        source={require("./../../src/tour-entries.png")}
        style={styles.tourImage}
        resizeMode="contain"
      />
    ),
    title: "Entries",
    subtitle:
      "View all your entries for the month in a user-friendly timeline view."
  },
  {
    backgroundColor: ThemeStyle.pageContainer.backgroundColor,
    image: (
      <Image
        source={require("./../../src/tour-share-invitation.png")}
        style={styles.tourImage}
        resizeMode="contain"
      />
    ),
    title: "Share securely",
    subtitle: "Share your data securely with your clinician or care team."
  },
  {
    backgroundColor: ThemeStyle.pageContainer.backgroundColor,
    image: (
      <Image
        source={require("./../../src/tour-lessons.png")}
        style={styles.tourImage}
        resizeMode="contain"
      />
    ),
    title: "CBT Lessons",
    subtitle: "Learn about CBT in detail through interactive lessons."
  },
  {
    backgroundColor: ThemeStyle.pageContainer.backgroundColor,
    image: (
      <Image
        source={require("./../../src/tour-lesson.png")}
        style={styles.tourImage}
        resizeMode="contain"
      />
    ),
    title: "Intuitive lesson content",
    subtitle:
      "Learn CBT with a combination of videos, fun cards and rich content."
  },
  {
    backgroundColor: ThemeStyle.pageContainer.backgroundColor,
    image: (
      <Image
        source={require("./../../src/tour-engagement.png")}
        style={styles.tourImage}
        resizeMode="contain"
      />
    ),
    title: "More features",
    subtitle:
      "Peer support groups, Assessments, Quiz, Meditations etc."
  },
  {
    backgroundColor: ThemeStyle.pageContainer.backgroundColor,
    image: (
      <Image
        source={require("./../../src/tour-favorites.png")}
        style={styles.tourImage}
        resizeMode="contain"
      />
    ),
    title: "Favorites",
    subtitle: "Add exercises, lessons, meditations etc. to your favorties for easy access."
  }
];
