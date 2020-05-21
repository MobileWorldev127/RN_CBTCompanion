export default (json = {
  module: "Cognitive Restructuring",
  title: "All Exercise Components",
  sequence: 1,
  description: "",
  example: {
    "Event / Situation": "Supervisor at work is angry",
    Thought:
      "I must have made a mistake—now I’ve done it. They’ll fire for me sure",
    "Consequence / Behavior":
      "Feeling of sadness and anxiety. Spend time obsessing over mistakes",
    "Rational Counterstatement / Alternate Thought":
      "My supervisor could’ve been angry about anything. They are usually happy with my work, so even if I’ve made a mistake it isn’t a big deal."
  },
  details: [
    {
      question: "Situation / Event",
      placeholder: "What happened? Where? When? Who with? How?",
      type: "text",
      image: "Situation.jpg"
    },
    {
      type: "group",
      title: "Feelings and Emotions",
      image: "Emotions.jpg",
      details: [
        {
          question: "Emotions",
          placeholder: "What emotion did I feel at that time?",
          type: "multiSelectWithRating",
          source: "Emotion List",
          scale: {
            max: 100,
            min: 0,
            step: 1
          }
        },
        // {
        //   question: "How intense was your emotion?",
        //   type: "Rating",
        //   scale: {
        //     min: 0,
        //     max: 100,
        //     step: 1,
        //     start: 15
        //   },
        //   isText: true,
        //   placeholder: "Intensity",
        //   shouldShowPercentage: true
        // },
        {
          question: "Body Sensations",
          placeholder: "What did I notice in my body? Where did I feel it?",
          type: "text",
          image: "Sensations.jpg"
        }
      ]
    },
    {
      title: "Activity",
      type: "group",
      image: "Activity.jpg",
      details: [
        {
          question: "Activity",
          placeholder: "Select the kind of activity you engaged in",
          source: "Activity List",
          type: "multiSelect"
        },
        {
          question: "Achievement",
          type: "Rating",
          scale: {
            min: 0,
            max: 10,
            step: 1,
            start: 3
          },
          isText: false,
          placeholder: "Achievement"
        },
        {
          question: "Closeness",
          type: "Rating",
          scale: {
            min: 0,
            max: 10,
            step: 1,
            start: 3
          },
          isText: false,
          placeholder: "Closeness"
        },
        {
          question: "Enjoyment",
          type: "Rating",
          scale: {
            min: 0,
            max: 10,
            step: 1,
            start: 3
          },
          isText: false,
          placeholder: "Enjoyment"
        },
        {
          question: "Activity Type",
          placeholder: "Select the type of activity",
          type: "multiSelect",
          options: [
            {
              id: 1,
              name: "Routine",
              color: "#cd63f6"
            },
            {
              id: 2,
              name: "Pleasurable",
              color: "#4a7ef3"
            },
            {
              id: 3,
              name: "Necessary",
              color: "#ed7852"
            }
          ]
        },
        {
          question: "Difficulty",
          type: "RatingDiscrete",
          scale: {
            max: 5,
            min: 1,
            step: 2
          },
          options: [
            {
              title: "Hard",
              value: 5
            },
            {
              title: "Medium",
              value: 3
            },
            {
              title: "Easy",
              value: 1
            }
          ]
        }
      ]
    },
    {
      question: "Select of your negative core belief:",
      type: "singleSelect",
      source: "Negative Core Beliefs",
      image: "CB-Negative.jpg"
    }
  ]
});
