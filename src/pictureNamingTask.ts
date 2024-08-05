import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";
import ImageKeyboardResponsePlugin from "@jspsych/plugin-image-keyboard-response";
import PreloadPlugin from "@jspsych/plugin-preload";
import SurveyHtmlFormPlugin from "@jspsych/plugin-survey-html-form";
import { initJsPsych } from "jspsych";
import prand from "pure-rand";

import { transformAndDownload } from "./dataMunger";
import { experimentSettings } from "./fetchAndParse";
import { imageDB } from "./fetchAndParse";
import i18n from "./services/i18n";

import type { LoggingTrial } from "./dataMunger";
import type { ParticipantResponse } from "./dataMunger";
import type { ExperimentImage } from "./fetchAndParse";

import "jspsych/css/jspsych.css";
//****************************
//****EXPERIMENT_SETTINGS*****
//****************************
// variables for controlling advancementSchedule, regressionSchedule, and when the experiment is
let numberOfCorrectAnswers = 0;
let numberOfTrialsRun = 1;
const totalNumberOfTrialsToRun = Number(
  experimentSettings.totalNumberOfTrialsToRun,
);
let advancementSchedule = Number(experimentSettings.advancementSchedule);
let regressionSchedule = Number(experimentSettings.regressionSchedule);
let { language, seed, numberOfLevels } = experimentSettings;

/*
functions for generating
experimentStimuli
*/

const indiciesSelected = new Set();
let rng = prand.xoroshiro128plus(seed);

// closure
function getRandomElementWithSeed(array: ExperimentImage[]): ExperimentImage[] {
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

  const result = [array[randomIndex]!];
  return result;
}

// draw an image at random from the bank depending on the difficulty_level selected
// closure
function createStimuli(
  difficultyLevel: number,
  language: string,
  clearSet: boolean,
): ExperimentImage[] {
  if (clearSet === true) {
    indiciesSelected.clear();
  }
  let imgList: ExperimentImage[] = imageDB;
  imgList = imgList.filter(
    (image) =>
      Number(image.difficultyLevel) === difficultyLevel &&
      image.language === language,
  );
  let result = getRandomElementWithSeed(imgList);
  return result;
}

//****************************
//********EXPERIMENT**********
//****************************
// a timeline is a set of trials
// a trial is a single object eg htmlKeyboardResponse etc ...
// @ts-expect-error the trials have different structures
const timeline = [];
export default function pictureNamingTask(difficultyLevelParam: number) {
  let experimentStimuli = createStimuli(difficultyLevelParam, language, false);
  let currentDifficultyLevel = difficultyLevelParam;
  if (difficultyLevelParam) {
    const jsPsych = initJsPsych({
      on_finish: function() {
        const data = jsPsych.data.get();
        transformAndDownload(data);
      },
    });

    const welcome = {
      stimulus: i18n.t("welcome"),
      type: HtmlKeyboardResponsePlugin,
    };

    const preload = {
      auto_preload: true,
      message: `<p>loading stimulus</p>`,
      show_progress_bar: true,
      type: PreloadPlugin,
    };

    const blankPage = {
      stimulus: "",
      type: HtmlKeyboardResponsePlugin,
    };
    const showImg = {
      stimulus: jsPsych.timelineVariable("stimulus"),
      stimulus_height: 600,
      type: ImageKeyboardResponsePlugin,
    };

    const logging = {
      autofocus: "textBox",
      button_label: i18n.t("submit"),
      data: {
        correctResponse: jsPsych.timelineVariable("correctResponse"),
        difficultyLevel: jsPsych.timelineVariable("difficultyLevel"),
        language: jsPsych.timelineVariable("language"),
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
      preamble: function() {
        const html = `<h3>${i18n.t("correctResponse")}</h3>
                    <p>${jsPsych.evaluateTimelineVariable("correctResponse")}</p>
                    <img src="${jsPsych.evaluateTimelineVariable("stimulus")}" width="300" height="300">`;

        return html;
      },
      type: SurveyHtmlFormPlugin,
    };
    const testProcedure = {
      // to reload the experimentStimuli after one repetition has been completed
      on_timeline_start: function() {
        this.timeline_variables = experimentStimuli;
      },
      timeline: [preload, blankPage, showImg, blankPage, logging],
      timeline_variables: experimentStimuli,
    };
    timeline.push(testProcedure);

    const loop_node = {
      loop_function: function() {
        // tracking number of corret answers
        // need to access logging trial info
        let clearSet = false;

        if (numberOfTrialsRun === totalNumberOfTrialsToRun) {
          return false;
        }
        // getting the most recent logged result
        const loggingResponseArray = jsPsych.data
          .get()
          // @ts-expect-error .trials is private to DataCollection
          .filter({ trial_type: "survey-html-form" }).trials as LoggingTrial[];
        const lastTrialIndex = loggingResponseArray.length - 1;

        const lastTrialResults: ParticipantResponse =
          loggingResponseArray[lastTrialIndex]!.response;

        if (lastTrialResults.result === "Correct") {
          numberOfCorrectAnswers++;
          clearSet = false;
        } else if (lastTrialResults.result === "Incorrect") {
          numberOfCorrectAnswers = 0;
        }
        // difficulty level logic, <x> correct answers in a row, increase, <y> incorrect answer decrease
        if (numberOfCorrectAnswers === advancementSchedule) {
          if (numberOfCorrectAnswers <= numberOfLevels) {
            currentDifficultyLevel++;
            // need to reset as difficulty has changed
            numberOfCorrectAnswers = 0;
            clearSet = true;
          }
        } else if (numberOfCorrectAnswers === regressionSchedule) {
          if (currentDifficultyLevel > 1) {
            currentDifficultyLevel--;
          }
        }
        experimentStimuli = createStimuli(
          currentDifficultyLevel,
          language,
          clearSet,
        );
        numberOfTrialsRun++;
        return true;
      },
      //@ts-expect-error timeline contains trials of different structures
      timeline,
    };
    void jsPsych.run([welcome, loop_node]);
  }
}
