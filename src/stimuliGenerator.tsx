/*
functions for generating
experiment_stimuli
*/

import { imageDB } from "./fetchAndParse";

// TODO this should be refactor as only one image is needed at a time need to add psudeo random seed too
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
  console.log(`result from createStimuli:`);
  console.log("***********************");
  console.dir(result);
  console.table(result);
  console.log("***********************");
  return result;
}

// draw an image at random from the bank depending on the difficulty_level selected
export default function createStimuli(
  difficultyLevel: number,
  language: string,
) {
  try {
    let imgList = imageDB
    console.log(imgList);
    imgList = imgList.filter(
      (image: any) =>
        Number(image.difficultyLevel) === difficultyLevel &&
        image.language === language,
    );
    console.log("filtered");
    console.log(imgList);
    let result = getRandomElementUnique(imgList, 1);
    return result;
  } catch (error) {
    console.error("Error fetching and parsing data:", error);
  }
}
