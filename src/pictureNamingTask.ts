import { initJsPsych } from "jspsych";
import "jspsych/css/jspsych.css";
import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";
import SurveyHtmlFormPlugin from "@jspsych/plugin-survey-html-form";
import ImageKeyboardResponsePlugin from "@jspsych/plugin-image-keyboard-response";
import PreloadPlugin from "@jspsych/plugin-preload";
import { transformAndDownload } from "./dataMunger";
import { experimentSettings } from "./fetchAndParse";
import { imageDB } from "./fetchAndParse";
import prand from "pure-rand";
//****************************
//****EXPERIMENT_SETTINGS*****
//****************************
// variables for controlling advancementSchedule, regressionSchedule, and when the experiment is
// finished
let numberOfCorrectAnswers: number = 0;
let numberOfTrialsRun: number = 1;
// dynamically loading user experimentSettings
let totalNumberOfTrialsToRun = Number(
  experimentSettings.totalNumberOfTrialsToRun,
);
let advancementSchedule = Number(experimentSettings.advancementSchedule);
let regressionSchedule = Number(experimentSettings.regressionSchedule);
let language = experimentSettings.language;
let seed = experimentSettings.seed;

console.log(
  `Experiment will proceed with totalNumberOfTrialsToRun of ${totalNumberOfTrialsToRun}, an advancementSchedule of ${advancementSchedule}, and a regressionSchedule of ${regressionSchedule}`,
);

/*
functions for generating
experiment_stimuli
*/

const indiciesSelected = new Set();
let rng = prand.xoroshiro128plus(seed);

function getRandomElementWithSeed(array: any[]) {
  let randomIndex: number;
  let foundUnique = false;

  // if all images have been shown clear the set
  if (indiciesSelected.size === array.length) {
    indiciesSelected.clear();
  }

  do {
    const [newRandomIndex, newRng] = prand.uniformIntDistribution(
      0,
      array.length - 1,
      rng,
    );
    rng = newRng;
    randomIndex = newRandomIndex;

    if (!indiciesSelected.has(randomIndex)) {
      indiciesSelected.add(randomIndex);
      foundUnique = true;
    }
  } while (!foundUnique);

  console.log("Selected Index:", randomIndex);
  console.log("Selected Indices Set:", indiciesSelected);

  let result = [array[randomIndex]];
  console.log("***********************");
  console.log("Result from random index:");
  console.table(result);
  console.log("***********************");
  return result;
}

// draw an image at random from the bank depending on the difficulty_level selected
function createStimuli(
  difficultyLevel: number,
  language: string,
  clearSet: boolean,
) {
  if (clearSet === true) {
    indiciesSelected.clear();
  }
  try {
    let imgList = imageDB;
    imgList = imgList.filter(
      (image: any) =>
        Number(image.difficultyLevel) === difficultyLevel &&
        image.language === language,
    );
    console.log("filtered");
    console.log(imgList);
    let result = getRandomElementWithSeed(imgList);
    return result;
  } catch (error) {
    console.error("Error fetching and parsing data:", error);
  }
}

//****************************
//********EXPERIMENT**********
//****************************
// a timeline is a set of trials
// a trial is a single object eg htmlKeyboardResponse etc ...
const timeline: any[] = [];
export default function pictureNamingTask(difficultyLevelParam: number) {
  let experiment_stimuli = createStimuli(difficultyLevelParam, language, false);
  let currentDifficultyLevel: number = difficultyLevelParam;
  if (difficultyLevelParam) {
    const jsPsych = initJsPsych({
      on_finish: function() {
        transformAndDownload(jsPsych.data);
      },
    });

    const welcome = {
      type: HtmlKeyboardResponsePlugin,
      stimulus: "Welcome. Press any key to begin",
    };

    const preload = {
      type: PreloadPlugin,
      auto_preload: true,
      show_progress_bar: true,
      message: `<p>loading stimulus</p>`,
    };

    const blankPage = {
      type: HtmlKeyboardResponsePlugin,
      stimulus: "",
    };
    const showImg = {
      type: ImageKeyboardResponsePlugin,
      stimulus: jsPsych.timelineVariable("stimulus"),
    };

    const logging = {
      type: SurveyHtmlFormPlugin,
      preamble: function() {
        const html = `<h3>Correct response: </h3>
                    <p>${jsPsych.timelineVariable("correctResponse")}</p>
                    <img src="${jsPsych.timelineVariable("stimulus")}" width="300" height="300">`;

        return html;
      },
      html: `
    <h3>Log the response</h3>
    <input type="button" value="Correct" onclick="document.getElementById('result').value='Correct';">
    <input type="button" value="Incorrect" onclick="document.getElementById('result').value='Incorrect';">
    <br>
    <label for="result">The response was:</label>
    <input type="text" id="result" name="result" readonly>
    <hr>
    <input type="text" id="textBox" name="notes" placeholder="Log any other notes here">
    <p>Press any key to submit the response and continue</p>
  `,
      autofocus: "textBox",
      data: {
        difficultyLevel: jsPsych.timelineVariable("difficultyLevel"),
        correctResponse: jsPsych.timelineVariable("correctResponse"),
      },
    };
    const testProcedure = {
      timeline: [preload, blankPage, showImg, blankPage, logging],
      timeline_variables: experiment_stimuli,
      // to reload the experiment_stimuli after one repetition has been completed
      on_timeline_start: function() {
        this.timeline_variables = experiment_stimuli;
      },
    };
    timeline.push(testProcedure);

    const loop_node = {
      timeline: timeline,
      loop_function: function(data: any) {
        data = data;
        // tracking number of corret answers
        // need to access logging trial info
        let clearSet = false;
        if (numberOfTrialsRun < totalNumberOfTrialsToRun) {
          // getting the most recent logged result
          const loggingResponseArray: [] = jsPsych.data
            .get()
            .filter({ trial_type: "survey-html-form" })["trials"];
          const lastTrialIndex = loggingResponseArray.length - 1;
          const lastTrialResults =
            loggingResponseArray[lastTrialIndex]["response"];

          if (lastTrialResults["result"] === "Correct") {
            numberOfCorrectAnswers++;
            clearSet = false;
          } else if (lastTrialResults["result"] === "Incorrect") {
            numberOfCorrectAnswers = 0;
          }
          // difficulty level logic, <x> correct answers in a row, increase, <y> incorret answer decrease
          if (numberOfCorrectAnswers === advancementSchedule) {
            currentDifficultyLevel++;
            // need to reset as difficulty has changed
            numberOfCorrectAnswers = 0;
            clearSet = true;
          } else if (numberOfCorrectAnswers === regressionSchedule) {
            if (currentDifficultyLevel > 1) {
              currentDifficultyLevel--;
            }
          }
          experiment_stimuli = createStimuli(
            currentDifficultyLevel,
            language,
            clearSet,
          );
          numberOfTrialsRun++;
          console.log(`numberOfTrialsRun: ${numberOfTrialsRun}`);
          return true;
        } else if (numberOfTrialsRun === totalNumberOfTrialsToRun) {
          console.log("trial complete");
          return false;
        }
      },
    };

    jsPsych.run([welcome, loop_node]);
  }
}
