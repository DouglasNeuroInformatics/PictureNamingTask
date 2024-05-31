import { initJsPsych } from "jspsych";
import "jspsych/css/jspsych.css";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import imageKeyboardResponse from "@jspsych/plugin-image-keyboard-response";
import surveyText from "@jspsych/plugin-survey-text";
import imageButtonResponse from "@jspsych/plugin-image-button-response";
import createStimuli from "./StimuliGenerator";
import htmlButtonResponse from "@jspsych/plugin-html-button-response";

//****************************
//********EXPERIMENT**********
//****************************
// a timeline is a set of trials
// a trial is a single object eg htmlKeyboardResponse etc ...
const timeline = [];
let imgUrl: string;

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
      // to reload the experiment_stimuli after one repetition has been completed
      on_timeline_start: function () {
        this.timeline_variables = experiment_stimuli;
      },
    };
    timeline.push(test_procedure);

    const repeat = {
      type: htmlButtonResponse,
      stimulus: `<p> Repeat?</p>`,
      choices: ["Repeat", "End"],
    };
    timeline.push(repeat);

    const loop_node = {
      timeline: timeline,
      loop_function: function (data) {
        console.log(data.values);
        // check if repeat button was presssed
        if (
          jsPsych.pluginAPI.compareKeys(
            String(data.values()[data.values().length - 1].response),
            "0",
          )
        ) {
          const correctResults = jsPsych.data
            .get()
            .filter({ trial_type: "image-button-response", response: 0 })
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
