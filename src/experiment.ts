import { initJsPsych } from "jspsych";
import "jspsych/css/jspsych.css";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import imageKeyboardResponse from "@jspsych/plugin-image-keyboard-response";
import PreloadPlugin from "@jspsych/plugin-preload";

const jsPsych = initJsPsych();
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

const test_stimuli = [{ stimulus: "/blue.png" }, { stimulus: "/orange.png" }];
const fixation = {
  type: htmlKeyboardResponse,
  stimulus: '<div style="font-size:60px;">+</div>',
  choices: "NO_KEYS",
  trial_duration: 1000,
};

const test = {
  type: imageKeyboardResponse,
  stimulus: jsPsych.timelineVariable("stimulus"),
  choices: ["f", "j"],
};

const test_procedure = {
  timeline: [fixation, test],
  timeline_variables: test_stimuli,
};
timeline.push(test_procedure);
export default function experiment1() {
  jsPsych.run(timeline);
}
