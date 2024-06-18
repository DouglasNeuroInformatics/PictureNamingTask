// set the number of images to be shown
export const totalNumberOfTrialsToRun: number = 5
/*
 set the number of correct responses to advance to the next difficulty level
 example: advancementSchedule = 2
 2 correct response in row increases difficulty level by 1
 */
export const advancementSchedule: number = 2
/*
 set the number of correct responses to advance to the next difficulty level
 example: advancementSchedule = 2
 2 correct response in row increases difficulty level by 1
*/
export const regressionSchedule: number = 0
/*
 an array of objects that contain the information for the experiments
 all field are required 
 'stimulus' - realtive path where to find the image
 'difficultyLevel' - the difficulty level that has been assigned to the image
 'correctResponse' - what the correct response for the image will be
*/
export const IMG_BANK: object[] = [

  {
    stimulus: "../public/level1/art-containes.jpg",
    difficultyLevel: 1,
    correctResponse: "art-containes",
  },
  {
    stimulus: "../public/level1/art-drawing.jpg",
    difficultyLevel: 1,
    correctResponse: "art-drawing",
  },
  {
    stimulus: "../public/level1/art-letters.jpg",
    difficultyLevel: 1,
    correctResponse: "art-letters",
  },
  {
    stimulus: "../public/level1/art-moss.jpg",
    difficultyLevel: 1,
    correctResponse: "art-moss",
  },
  {
    stimulus: "../public/level1/art-portrait-human.jpg",
    difficultyLevel: 1,
    correctResponse: "art-portrait-human",
  },
  {
    stimulus: "../public/level1/art-roller-skates.jpg",
    difficultyLevel: 1,
    correctResponse: "art-roller-skates",
  },
  {
    stimulus: "../public/level1/art-wolf-sheep.jpg",
    difficultyLevel: 1,
    correctResponse: "art-wolf-sheep",
  },
  {
    stimulus: "../public/level1/astronaut.jpg",
    difficultyLevel: 1,
    correctResponse: "astronaut",
  },
  {
    stimulus: "../public/level1/bird.jpg",
    difficultyLevel: 1,
    correctResponse: "bird",
  },
  {
    stimulus: "../public/level2/cheese.jpg",
    difficultyLevel: 2,
    correctResponse: "cheese",
  },
  {
    stimulus: "../public/level2/coastal-town.jpg",
    difficultyLevel: 2,
    correctResponse: "coastal-town",
  },
  {
    stimulus: "../public/level2/columns.jpg",
    difficultyLevel: 2,
    correctResponse: "columns",
  },
  {
    stimulus: "../public/level2/conduit.jpg",
    difficultyLevel: 2,
    correctResponse: "conduit",
  },
  {
    stimulus: "../public/level2/ice.jpg",
    difficultyLevel: 3,
    correctResponse: "ice",
  },
  {
    stimulus: "../public/level2/leaf.jpg",
    difficultyLevel: 3,
    correctResponse: "leaf",
  },
  {
    stimulus: "../public/level2/llama.jpg",
    difficultyLevel: 4,
    correctResponse: "llama",
  },
  {
    stimulus: "../public/level2/mice.jpg",
    difficultyLevel: 4,
    correctResponse: "mice",
  },
  {
    stimulus: "../public/level3/motorbike-dirt.jpg",
    difficultyLevel: 5,
    correctResponse: "motorbike-dirt",
  },
  {
    stimulus: "../public/level3/nature.jpg",
    difficultyLevel: 5,
    correctResponse: "nature",
  },
  {
    stimulus: "../public/level3/old-brick.jpg",
    difficultyLevel: 6,
    correctResponse: "old-brick",
  },
  {
    stimulus: "../public/level3/old-car.jpg",
    difficultyLevel: 6,
    correctResponse: "old-car",
  },
  {
    stimulus: "../public/level3/old-flower.jpg",
    difficultyLevel: 7,
    correctResponse: "old-flower",
  },
  {
    stimulus: "../public/level3/pub.jpg",
    difficultyLevel: 7,
    correctResponse: "pub",
  },
  {
    stimulus: "../public/level3/puddle.jpg",
    difficultyLevel: 8,
    correctResponse: "puddle",
  },
  {
    stimulus: "../public/level3/record-player.jpg",
    difficultyLevel: 8,
    correctResponse: "record-player",
  },
  {
    stimulus: "../public/level3/skydivers.jpg",
    difficultyLevel: 9,
    correctResponse: "skydivers",
  },
  {
    stimulus: "../public/level3/teeth.jpg",
    difficultyLevel: 9,
    correctResponse: "teeth",
  },
];
