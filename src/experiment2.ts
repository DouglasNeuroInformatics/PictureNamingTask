import { initJsPsych } from "jspsych";
import "jspsych/css/jspsych.css";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import imageKeyboardResponse from "@jspsych/plugin-image-keyboard-response";
import PreloadPlugin from "@jspsych/plugin-preload";
import surveyText from "@jspsych/plugin-survey-text";
import IMG_BANK from "./imgBank";

function getRandomElementUnique(array, numberElements) {
  const indiciesSelected = [];
  // needs a to return an error when array is empty
  // currently will be an infinite loop
  function getAnElement() {
    const randomIndex = Math.floor(Math.random() * array.length);
    if (!indiciesSelected.includes(randomIndex)) {
      indiciesSelected.push(randomIndex);
      return array[randomIndex];
    } else {
      // recursion, baby!
      return getAnElement();
    }
  }

  let result = [];
  while (result.length < numberElements) {
    result.push(getAnElement());
  }
  return result;
}

// draw 5 images at random from the bank depending on the difficulty_level selected
let test_stimuli = function (difficultyLevelSelected: Number) {
  let imgList = imgBank.filter(
    (image) => image.difficulty_level === difficultyLevelSelected,
  );
  // default number of images to do is 5
  // can be changed later if need be
  let result = getRandomElementUnique(imgList, 5);
  return result;
};

//****************************
//********EXPERIMENT**********
//****************************
const imgBank = IMG_BANK;
let difficultyLevel: Number;
let experiment_stimuli;
const timeline = [];
let imgUrl: String;

const jsPsych = initJsPsych({
  on_finish: function () {
    // first argument is the format, second is the filename.
    // the format can be either 'csv' or 'json'.
    //no timezone offset
    let currentDate = String(
      new Date().toJSON().slice(0, 19).replace(/T/g, "-"),
    );
    jsPsych.data.get().localSave("csv", `${currentDate}.csv`);
  },
});

const welcome = {
  type: htmlKeyboardResponse,
  stimulus: "Welcome. Press any key to begin",
};
timeline.push(welcome);

const showImg = {
  type: imageKeyboardResponse,
  prompt: `<p>Press any key to proceed</p>`,
  stimulus: jsPsych.timelineVariable("stimulus"),
};
const logging = {
  type: surveyText,
  on_start: function (trial) {
    imgUrl = JSON.stringify(jsPsych.timelineVariable("stimulus"));
    //console.log(imgUrl)
    trial.preamble = `<img src=${imgUrl} style='width:400px'></img>`;
  },
  questions: [{ prompt: "Enter participant response" }],
};

const test_procedure = {
  timeline: [showImg, logging],
  timeline_variables: test_stimuli(1),
  // currently repetitions will just show the exact same set of timelineVariables again
  repetitions: 1,
};
timeline.push(test_procedure);

export default function experiment1() {
  jsPsych.run(timeline);
}
