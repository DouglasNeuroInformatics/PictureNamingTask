import { initJsPsych } from "jspsych";
import "jspsych/css/jspsych.css";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import imageKeyboardResponse from "@jspsych/plugin-image-keyboard-response";
import PreloadPlugin from "@jspsych/plugin-preload";

const jsPsych = initJsPsych({
  on_finish: function () {
    jsPsych.data.displayData();
  },
});
const timeline = [];
const preload = {
  type: PreloadPlugin,
  images: ["/blue.png", "/orange.png"],
};
timeline.push(preload);

const welcome = {
  type: htmlKeyboardResponse,
  stimulus: "Welcome to the experiment. Press any key to begin",
};
timeline.push(welcome);

const instructions = {
  type: htmlKeyboardResponse,
  stimulus: `
    <p>In this experiment, a circle will appear in the center 
    of the screen.</p><p>If the circle is <strong>blue</strong>, 
    press the letter F on the keyboard as fast as you can.</p>
    <p>If the circle is <strong>orange</strong>, press the letter J 
    as fast as you can.</p>
    <div style='width: 700px;'>
    <div style='float: left;'><img src='/blue.png'></img>
    <p class='small'><strong>Press the F key</strong></p></div>
    <div style='float: right;'><img src='/orange.png'></img>
    <p class='small'><strong>Press the J key</strong></p></div>
    </div>
    <p>Press any key to begin.</p>
  `,
  post_trial_gap: 2000,
};
timeline.push(instructions);

const test_stimuli = [
  { stimulus: "/blue.png", correct_response: "f" },
  { stimulus: "/orange.png", correct_response: "j" },
];

const fixation = {
  type: htmlKeyboardResponse,
  stimulus: '<div style="font-size:60px;">+</div>',
  choices: "NO_KEYS",
  trial_duration: function () {
    return jsPsych.randomization.sampleWithoutReplacement(
      [250, 500, 750, 1000, 1250, 1500, 1750, 2000],
      1,
    )[0];
  },
  data: { task: "fixation" },
};

const test = {
  type: imageKeyboardResponse,
  stimulus: jsPsych.timelineVariable("stimulus"),
  choices: ["f", "j"],
  data: {
    task: "response",
    correct_response: jsPsych.timelineVariable("correct_response"),
  },
  on_finish: function (data) {
    data.correct = jsPsych.pluginAPI.compareKeys(
      data.response,
      data.correct_response,
    );
  },
};

const test_procedure = {
  timeline: [fixation, test],
  timeline_variables: test_stimuli,
  randomize_order: true,
  repetitions: 5,
};
timeline.push(test_procedure);

const debrief_block = {
  type: htmlKeyboardResponse,
  stimulus: function () {
    const trials = jsPsych.data.get().filter({ task: "response" });
    const correct_trials = trials.filter({ correct: true });
    const accuracy = Math.round(
      (correct_trials.count() / trials.count()) * 100,
    );
    const rt = Math.round(correct_trials.select("rt").mean());

    return `<p>You responded correctly on ${accuracy}% of the trials.</p>
      <p>Your average response time was ${rt}ms.</p>
      <p>Press any key to complete the experiment. Thank you!</p>`;
  },
};
timeline.push(debrief_block);

export default function experiment1() {
  jsPsych.run(timeline);
}
