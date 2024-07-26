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
import i18n from "./services/i18n.ts";
/*
 * Translations
 */
i18n.init;

//****************************
//****EXPERIMENT_SETTINGS*****
//****************************
// variables for controlling advancementSchedule, regressionSchedule, and when the experiment is
// finished

let numberOfCorrectAnswers = 0;
let numberOfTrialsRun = 1;
const totalNumberOfTrialsToRun = Number(
  experimentSettings.totalNumberOfTrialsToRun,
);
let advancementSchedule = Number(experimentSettings.advancementSchedule);
let regressionSchedule = Number(experimentSettings.regressionSchedule);
let { language, seed } = experimentSettings
// add logic to initialize with initialDifficulty
// let intialDifficulty = Number(experimentSettings.initialDifficulty);

/*
functions for generating
experiment_stimuli
*/


const indiciesSelected = new Set();
let rng = prand.xoroshiro128plus(seed);

// closure
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

  return [array[randomIndex]];
}

// draw an image at random from the bank depending on the difficulty_level selected
// closure
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
  let currentDifficultyLevel = difficultyLevelParam;
  if (difficultyLevelParam) {
    const jsPsych = initJsPsych({
      on_finish: function() {
        transformAndDownload(jsPsych.data);
      },
    });

    const welcome = {
      type: HtmlKeyboardResponsePlugin,
      stimulus: i18n.t("welcome"),
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
      stimulus_height: 600,
      stimulus: jsPsych.timelineVariable("stimulus"),
    };

    const logging = {
      type: SurveyHtmlFormPlugin,
      preamble: function() {
        const html = `<h3>${i18n.t("correctResponse")}</h3>
                    <p>${jsPsych.evaluateTimelineVariable("correctResponse")}</p>
                    <img src="${jsPsych.evaluateTimelineVariable("stimulus")}" width="300" height="300">`;

        return html;
      },
      html: `
    <h3>${i18n.t("logResponse")}</h3>
    <input type="button" value="${i18n.t("correct")}" onclick="document.getElementById('result').value='${i18n.t("correct")}';">
    <input type="button" value="${i18n.t("incorrect")}" onclick="document.getElementById('result').value='${i18n.t("incorrect")}';">
    <br>
    <label for="result">${i18n.t("responseWas")}</label>
    <input type="text" id="result" name="result" readonly>
    <hr>
    <input type="text" id="textBox" name="notes" placeholder="${i18n.t("logResponse")}">
    <p>${i18n.t("logResponseToContinue")}</p>
  `,
      button_label: i18n.t("submit"),
      autofocus: "textBox",
      data: {
        difficultyLevel: jsPsych.evaluateTimelineVariable("difficultyLevel"),
        correctResponse: jsPsych.evaluateTimelineVariable("correctResponse"),
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
      timeline,
      loop_function: function() {
        // tracking number of corret answers
        // need to access logging trial info
        let clearSet = false;

        if (numberOfTrialsRun === totalNumberOfTrialsToRun) {
          return false
        }
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
        // difficulty level logic, <x> correct answers in a row, increase, <y> incorrect answer decrease
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
      },
    };
    jsPsych.run([welcome, loop_node]);
  }
}
