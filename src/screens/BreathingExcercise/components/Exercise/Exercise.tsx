import React, { FC, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import KeepAwake from "react-native-keep-awake";
import { useAppContext } from "../../context/AppContext";
import { animate } from "../../utils/animate";
import { buildExerciseSteps } from "../../utils/buildExerciseSteps";
import { buttonAnimatorContentHeight } from "../ButtonAnimator/ButtonAnimator";
import { ExerciseCircle } from "./ExerciseCircle";
import { ExerciseComplete } from "./ExerciseComplete";
import { ExerciseInterlude } from "./ExerciseInterlude";
import { ExerciseTimer } from "./ExerciseTimer";
import { useOnMount } from "../../hooks/useOnMount";
import { initializeAudio, releaseAudio, playSound } from "../../services/sound";
import { addBreathingEntry } from "../../../../actions/BreathingActions"
import { withSafeAreaActions } from "../../../../utils/StoreUtils";
import { connect } from 'react-redux'
let moment = require("moment");


type Status = "interlude" | "running" | "completed";

type Props = {};

const unmountAnimDuration = 300;

export const Exercise: FC<Props> = ({
  navigation
}) => {

  const {
    technique,
    timerDuration,
    guidedBreathingMode,
    stepVibrationFlag,
    guidedBreathingFlag
  } = useAppContext();
  const [status, setStatus] = useState<Status>("interlude");
  const [unmountContentAnimVal] = useState(new Animated.Value(1));
  const steps = buildExerciseSteps(technique.durations);

  const unmountContentAnimation = animate(unmountContentAnimVal, {
    toValue: 0,
    duration: unmountAnimDuration
  });

  useOnMount(() => {
    if (guidedBreathingMode !== "disabled") initializeAudio();
    return () => {
      if (guidedBreathingMode !== "disabled") releaseAudio();
    };
  });

  const handleInterludeComplete = () => {
    setStatus("running");
  };

  const handleTimeLimitReached = (limit) => {
    unmountContentAnimation.start(({ finished }) => {
      if (finished) {
        if (guidedBreathingMode !== "disabled") playSound("endingBell");
        setStatus("completed");
        var entry = {
          title: "Breathing",
          totalMinutes: limit/1000/60
        }
        let dateTime = moment().format("YYYY-MM-DD");
        addBreathingEntry(entry, dateTime, onAdded => {
          console.log('Success', onAdded)
        })
      }
    });
  };

  const contentAnimatedStyle = {
    opacity: unmountContentAnimVal
  };

  

  return (
    <View style={styles.container}>
      {status === "interlude" && (
        <ExerciseInterlude onComplete={handleInterludeComplete} />
      )}
      {status === "running" && (
        <Animated.View style={[styles.content, contentAnimatedStyle]}>
          <ExerciseTimer
            limit={timerDuration}
            onLimitReached={handleTimeLimitReached}
          />
          <ExerciseCircle
            steps={steps}
            guidedBreathingMode={guidedBreathingMode}
            vibrationEnabled={stepVibrationFlag}
            guidedBreathingEnabled={guidedBreathingFlag}
          />
        </Animated.View>
      )}
      {status === "completed" && <ExerciseComplete />}
      <KeepAwake />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: buttonAnimatorContentHeight
  },
  content: {
    height: buttonAnimatorContentHeight
  }
});
