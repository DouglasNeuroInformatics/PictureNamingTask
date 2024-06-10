import IMG_BANK from "./imgBank";

/*
functions for generating
experiment_stimuli
*/

const imgBank = IMG_BANK;
function getRandomElementUnique(array: any[], numberElements: number) {
  const indiciesSelected: number[] = [];
  // needs a to return an error when array is empty
  // currently will be an infinite loop =O
  function getAnElement() {
    const randomIndex = Math.floor(Math.random() * array.length);
    if (!indiciesSelected.includes(randomIndex)) {
      indiciesSelected.push(randomIndex);
      return array[randomIndex];
    } else {
      // recursion, baby!
      return getAnElement();
    }
  }

  let result = [];
  while (result.length < numberElements) {
    result.push(getAnElement());
  }
  return result;
}

// draw 5 images at random from the bank depending on the difficulty_level selected
export default function createStimuli(difficultyLevel: number) {
  let imgList = imgBank.filter(
    (image) => image.difficulty_level === difficultyLevel,
  );
  // default number of images to do is 5
  // can be changed later if need be
  let result = getRandomElementUnique(imgList, 1);
  return result;
}
