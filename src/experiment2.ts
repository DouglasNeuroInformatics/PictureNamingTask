import { initJsPsych } from "jspsych";
import "jspsych/css/jspsych.css";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import imageKeyboardResponse from "@jspsych/plugin-image-keyboard-response";
import PreloadPlugin from "@jspsych/plugin-preload";
import surveyText from "@jspsych/plugin-survey-text";

const jsPsych = initJsPsych({
  on_finish: function() {
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
  stimulus: "Welcome. Press any key to begin",
};
timeline.push(welcome);


// need to make a script to do this
const img_bank = [
  { stimulus: '../public/level1/art-containes.jpg', difficulty_level: 1, correct_response: 'art-containes' },
  { stimulus: '../public/level1/art-drawing.jpg', difficulty_level: 1, correct_response: 'art-drawing' },
  { stimulus: '../public/level1/art-letters.jpg', difficulty_level: 1, correct_response: 'art-letters' },
  { stimulus: '../public/level1/art-moss.jpg', difficulty_level: 1, correct_response: 'art-moss' },
  { stimulus: '../public/level1/art-portrait-human.jpg', difficulty_level: 1, correct_response: 'art-portrait-human' },
  { stimulus: '../public/level1/art-roller-skates.jpg', difficulty_level: 1, correct_response: 'art-roller-skates' },
  { stimulus: '../public/level1/art-wolf-sheep.jpg', difficulty_level: 1, correct_response: 'art-wolf-sheep' },
  { stimulus: '../public/level1/astronaut.jpg', difficulty_level: 1, correct_response: 'astronaut' },
  { stimulus: '../public/level1/bird.jpg', difficulty_level: 1, correct_response: 'bird' },
  { stimulus: '../public/level2/cheese.jpg', difficulty_level: 2, correct_response: 'cheese' },
  { stimulus: '../public/level2/coastal-town.jpg', difficulty_level: 2, correct_response: 'coastal-town' },
  { stimulus: '../public/level2/columns.jpg', difficulty_level: 2, correct_response: 'columns' },
  { stimulus: '../public/level2/conduit.jpg', difficulty_level: 2, correct_response: 'conduit' },
  { stimulus: '../public/level2/ice.jpg', difficulty_level: 2, correct_response: 'ice' },
  { stimulus: '../public/level2/leaf.jpg', difficulty_level: 2, correct_response: 'leaf' },
  { stimulus: '../public/level2/llama.jpg', difficulty_level: 2, correct_response: 'llama' },
  { stimulus: '../public/level2/mice.jpg', difficulty_level: 2, correct_response: 'mice' },
  { stimulus: '../public/level3/motorbike-dirt.jpg', difficulty_level: 3, correct_response: 'motorbike-dirt' },
  { stimulus: '../public/level3/nature.jpg', difficulty_level: 3, correct_response: 'nature' },
  { stimulus: '../public/level3/old-brick.jpg', difficulty_level: 3, correct_response: 'old-brick' },
  { stimulus: '../public/level3/old-car.jpg', difficulty_level: 3, correct_response: 'old-car' },
  { stimulus: '../public/level3/old-flower.jpg', difficulty_level: 3, correct_response: 'old-flower' },
  { stimulus: '../public/level3/pub.jpg', difficulty_level: 3, correct_response: 'pub' },
  { stimulus: '../public/level3/puddle.jpg', difficulty_level: 3, correct_response: 'puddle' },
  { stimulus: '../public/level3/record-player.jpg', difficulty_level: 3, correct_response: 'record-player' },
  { stimulus: '../public/level3/skydivers.jpg', difficulty_level: 3, correct_response: 'skydivers' },
  { stimulus: '../public/level3/teeth.jpg', difficulty_level: 3, correct_response: 'teeth' }
];


function getRandomElementUnique(array, numberElements) {
  const indiciesSelected = []

  function getAnElement() {
    const randomIndex = Math.floor(Math.random() * array.length)
    if (!indiciesSelected.includes(randomIndex)) {
      indiciesSelected.push(randomIndex)
      return array[randomIndex]
    } else {
      // recursion, baby!
      return getAnElement()
    }
  }

  let result = []
  while (result.length < numberElements) {
    result.push(getAnElement())
  }
  return result

}


// draw 5 images at random from the bank depending on the difficulty_level selected 
let test_stimuli = function(difficultyLevelSelected) {

  let imgList = img_bank.filter(image => image.difficulty_level === difficultyLevelSelected)
  // default number of images to do is 5
  // can be changed later if need be
  let result = getRandomElementUnique(imgList, 5)
  console.log(imgList)
  return result
}

const test = {
  type: imageKeyboardResponse,
  stimulus: jsPsych.timelineVariable("stimulus"),
  data: {
    task: "response",
    correct_response: jsPsych.timelineVariable("correct_response"),
  },
  on_finish: function(data) {
    data.correct = jsPsych.pluginAPI.compareKeys(
      data.response,
      data.correct_response,
    );
  },
};

let imgUrl = ''
const logging = {
  type: surveyText,
  on_start: function(trial) {
    imgUrl = JSON.stringify(jsPsych.timelineVariable('stimulus'));
    //console.log(imgUrl)
    trial.preamble = `<img src=${imgUrl}></img>`;
  },
  questions: [{ prompt: 'Enter participant response' }],
};
const test_procedure = {
  timeline: [logging],
  timeline_variables: test_stimuli(1),
  //randomize_order: true,
  // currently repetitions will just show the exact same set of timelineVariables again
  repetitions: 1,
};
timeline.push(test_procedure);

const debrief_block = {
  type: htmlKeyboardResponse,
  stimulus: function() {
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
