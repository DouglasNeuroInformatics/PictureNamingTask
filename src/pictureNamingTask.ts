import { initJsPsych } from "jspsych";
import "jspsych/css/jspsych.css";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import imageKeyboardResponse from "@jspsych/plugin-image-keyboard-response";
import surveyText from "@jspsych/plugin-survey-text";
import imageButtonResponse from "@jspsych/plugin-image-button-response";
import createStimuli from "./StimuliGenerator";
import htmlButtonResponse from "@jspsych/plugin-html-button-response";
import surveyHtmlForm from "@jspsych/plugin-survey-html-form";

//****************************
//********EXPERIMENT**********
//****************************
// a timeline is a set of trials
// a trial is a single object eg htmlKeyboardResponse etc ...
const timeline: any[] = [];
let imgUrl: string;
let numberOfCorrectAnswers: number = 0;
const totalNumberOfTrialsToRun: number = 5;
let numberOfTrialsRun: number = 1;
let advancementSchedule: number = 2;
let regressionSchedule: number = 0;

export default function pictureNamingTask(difficultyLevelParam: number) {
  // setting up the stimuli
  let experiment_stimuli = createStimuli(difficultyLevelParam);
  let currentDifficultyLevel: number = difficultyLevelParam;
  if (difficultyLevelParam) {
    const jsPsych = initJsPsych({
      on_finish: function () {
        // first argument is the format, second is the filename.
        // the format can be either 'csv' or 'json'.
        // no timezone offset
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

    const blankPage = {
      type: htmlKeyboardResponse,
      stimulus: "",
    };
    const showImg = {
      type: imageKeyboardResponse,
      prompt: `<p>Press any key to proceed</p>`,
      stimulus: jsPsych.timelineVariable("stimulus"),
    };
    const logging = {
      type: surveyHtmlForm,
      html: `
    <h3>Log the response</h3>
    <input type="button" value="Correct" onclick="document.getElementById('result').value='Correct';">
    <input type="button" value="Incorrect" onclick="document.getElementById('result').value='Incorrect';">
    <br>
    <label for="result">The response was:</label>
    <input type="text" id="result" name="result" readonly>
    <hr>
    <input type="text" id="textBox" name="extra_info" placeholder="Log any other notes here">
    <p>Press any key to submit the response and continue</p>
  `,
    };

    const testProcedure = {
      timeline: [blankPage, showImg, blankPage, logging, blankPage],
      timeline_variables: experiment_stimuli,
      // to reload the experiment_stimuli after one repetition has been completed
      on_timeline_start: function () {
        this.timeline_variables = experiment_stimuli;
      },
    };
    timeline.push(testProcedure);

    const repeat = {
      type: htmlButtonResponse,
      stimulus: `<p> Repeat?</p>`,
      choices: ["Repeat", "End"],
    };
    //    timeline.push(repeat);

    const loop_node = {
      timeline: timeline,
      loop_function: function (data: any) {
        // tracking number of corret answers
        // need to access logging trial info
        if (numberOfTrialsRun < totalNumberOfTrialsToRun) {
          // getting the most recent logged result
          const loggingResponseArray: [] = jsPsych.data
            .get()
            .filter({ trial_type: "survey-html-form" })["trials"];
          const lastTrialIndex = loggingResponseArray.length - 1;
          const lastTrialResults =
            loggingResponseArray[lastTrialIndex]["response"];
          console.log(numberOfTrialsRun);
          console.log(totalNumberOfTrialsToRun);
          console.log(lastTrialResults);
          console.log(numberOfCorrectAnswers);

          if (lastTrialResults["result"] === "Correct") {
            console.log("gwan ya boy ya");
            numberOfCorrectAnswers++;
            console.log(numberOfCorrectAnswers);
          } else if (lastTrialResults["result"] === "Incorrect") {
            numberOfCorrectAnswers = 0;
          }
          // difficulty level logic, 2 correct answers in a row, increase, one incorret answer decrease
          // not sure this makes sense
          if (numberOfCorrectAnswers === advancementSchedule) {
            currentDifficultyLevel++;
            console.log("difficulty++");
            console.log(currentDifficultyLevel);
            // need to reset as difficulty has changed
            numberOfCorrectAnswers = 0;
          } else if (numberOfCorrectAnswers === regressionSchedule) {
            if (currentDifficultyLevel > 1) {
              currentDifficultyLevel--;
              console.log("difficulty--");
              console.log(currentDifficultyLevel);
            }
          }
          experiment_stimuli = createStimuli(currentDifficultyLevel);
          numberOfTrialsRun++;
          console.log("number run");
          console.log(numberOfTrialsRun);

          return true;
        } else if (numberOfTrialsRun === totalNumberOfTrialsToRun) {
          return false;
        }
      },
    };

    const loop_node_old = {
      timeline: timeline,
      loop_function: function (data: any) {
        console.log(data.values);

        if (
          // checks if repeat was pressed
          jsPsych.pluginAPI.compareKeys(
            String(data.values()[data.values().length - 1].response),
            "0",
          )
        ) {
          const correctResults = jsPsych.data
            .get()
            .filter({ trial_type: "survey-html-form", response: "result" })
            .count();
          const numberTrials = jsPsych.data
            .get()
            .filter({ trial_type: "image-button-response" })
            .count();
          const score = (correctResults / numberTrials) * 100;
          console.log(correctResults);
          console.log(numberTrials);
          console.log(score);

          if (score >= 80) {
            currentDifficultyLevel++;
          }
          console.log("timeline data");
          console.log(jsPsych.data.getLastTimelineData());
          console.log("trial data");
          console.log(jsPsych.data.getLastTrialData());
          // reassign the experiment_stimuli
          experiment_stimuli = createStimuli(currentDifficultyLevel);
          return true;
        } else {
          return false;
        }
      },
    };

    jsPsych.run([loop_node]);
  }
}
