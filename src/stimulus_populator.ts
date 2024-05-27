import fs from "fs";
import path from "path";

// can be expanded or reduced according to image bank received

const imgTypeArray = ['.jpg', '.png', '.gif'];

export default function stimulusPopulator(difficultyLevel: number): { stimulus: string, difficultyLevel: number }[] {
  // as the imgs are in a a folder named level1, level2 etc ... 
  // corresponding to their difficultyLevel the only input required is which
  // difficultyLevel is to be used

  // set up the paths 
  const difficultyLevelPath = "level" + difficultyLevel;
  const imagePath = "../public/" + difficultyLevelPath;
  // read all files in a dir and then filter from the array provided
  const files = fs.readdirSync(imagePath);
  const imageFiles = files.filter(file => imgTypeArray.includes(path.extname(file).toLowerCase()));

  const testStims = imageFiles.map((file) => ({
    stimulus: path.join(imagePath, file),
    difficultyLevel: difficultyLevel
  }));

  return testStims;
}

// Example usage
const testStims = stimulusPopulator(1); // Adjust the difficulty level as needed
console.log(testStims);

