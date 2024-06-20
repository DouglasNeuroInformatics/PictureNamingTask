import { initJsPsych } from "jspsych";
import "jspsych/css/jspsych.css";
import createStimuli from "./stimuliGenerator";
import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";
import SurveyHtmlFormPlugin from "@jspsych/plugin-survey-html-form";
import ImageKeyboardResponsePlugin from "@jspsych/plugin-image-keyboard-response";
import PreloadPlugin from "@jspsych/plugin-preload";
import { transformAndDownload } from "./dataMunger";
import { experimentSettings } from "./fetchAndParse";

//****************************
//********EXPERIMENT**********
//****************************
// a timeline is a set of trials
// a trial is a single object eg htmlKeyboardResponse etc ...
const timeline: any[] = [];
let numberOfCorrectAnswers: number = 0;
let numberOfTrialsRun: number = 1;
//let displayDifficultyLevel = ''
//let displayCorrectResponse = ''
let cr;

let settings = experimentSettings?.data;
let totalNumberOfTrialsToRun = Number(settings[0].totalNumberOfTrialsToRun);
let advancementSchedule = Number(settings[0].advancementSchedule);
let regressionSchedule = Number(settings[0].regressionSchedule);
let language = settings[0].language;
console.log(
  `Experiment will proceed with totalNumberOfTrialsToRun of ${totalNumberOfTrialsToRun}, an advancementSchedule of ${advancementSchedule}, and a regressionSchedule of ${regressionSchedule}`,
);
export default function pictureNamingTask(difficultyLevelParam: number) {
  // setting up the stimuli
  let experiment_stimuli = createStimuli(difficultyLevelParam, language);
  let currentDifficultyLevel: number = difficultyLevelParam;
  if (difficultyLevelParam) {
    const jsPsych = initJsPsych({
      on_finish: function () {
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
      preamble: function () {
        const html = `<h3>Correct response: </h3>
                    <p>${jsPsych.timelineVariable("correctResponse")}</p>
                    <img src="${jsPsych.timelineVariable("stimulus")}" width="300" height="300">`;

        return html;
      },
      //preamble: jsPsych.timelineVariable("correctResponse"),
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
      timeline: [preload, blankPage, showImg, blankPage, logging, blankPage],
      timeline_variables: experiment_stimuli,
      // to reload the experiment_stimuli after one repetition has been completed
      on_timeline_start: function () {
        this.timeline_variables = experiment_stimuli;
      },
    };
    timeline.push(testProcedure);

    const loop_node = {
      timeline: timeline,
      loop_function: function (data: any) {
        data = data;
        // tracking number of corret answers
        // need to access logging trial info
        cr = jsPsych.timelineVariable("correctResponse");
        console.dir(cr);
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
          } else if (lastTrialResults["result"] === "Incorrect") {
            numberOfCorrectAnswers = 0;
          }
          // difficulty level logic, 2 correct answers in a row, increase, one incorret answer decrease
          // not sure this makes sense
          if (numberOfCorrectAnswers === advancementSchedule) {
            currentDifficultyLevel++;
            // need to reset as difficulty has changed
            numberOfCorrectAnswers = 0;
          } else if (numberOfCorrectAnswers === regressionSchedule) {
            if (currentDifficultyLevel > 1) {
              currentDifficultyLevel--;
            }
          }
          experiment_stimuli = createStimuli(currentDifficultyLevel, language);
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
