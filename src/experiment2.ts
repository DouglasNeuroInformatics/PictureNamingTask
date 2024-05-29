import { initJsPsych } from "jspsych";
import "jspsych/css/jspsych.css";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import imageKeyboardResponse from "@jspsych/plugin-image-keyboard-response";
import surveyText from "@jspsych/plugin-survey-text";
import IMG_BANK from "./imgBank";
import imageButtonResponse from "@jspsych/plugin-image-button-response";

/*
functions for generating
experiment_stimuli
*/

function getRandomElementUnique(array, numberElements) {
  const indiciesSelected = [];
  // needs a to return an error when array is empty
  // currently will be an infinite loop =O
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
  console.log(`calling test_stimuli with ${difficultyLevelSelected}`);
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
const timeline = [];
let imgUrl: String;

export default function experiment2(difficultyLevelParam: Number) {
  // setting up the stimuli
  let experiment_stimuli = test_stimuli(difficultyLevelParam);

  if (difficultyLevelParam) {
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
    const loggingCorrectOrIncorrect = {
      type: imageButtonResponse,
      stimulus: jsPsych.timelineVariable("stimulus"),
      prompt: `<p> Please log the response</p>`,
      choices: ["Correct", "Incorrect"],
    };
    const loggingResponse = {
      type: surveyText,
      on_start: function (trial) {
        imgUrl = JSON.stringify(jsPsych.timelineVariable("stimulus"));
        //console.log(imgUrl)
        trial.preamble = `<img src=${imgUrl} style='width:400px'></img>`;
      },
      questions: [{ prompt: "Enter participant response" }],
    };

    const test_procedure = {
      timeline: [showImg, loggingCorrectOrIncorrect, loggingResponse],
      timeline_variables: experiment_stimuli,
      // currently repetitions will just show the exact same set of timelineVariables again
      // repetitions: 1,
    };
    timeline.push(test_procedure);
    jsPsych.run(timeline);
  }
}
