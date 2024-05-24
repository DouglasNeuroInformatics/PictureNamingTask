import fs from "fs";
import path from "path";

export default function stimulusPopulator(diffiultyLevel: number) {
  const diffiultyLevelPath = "level" + diffiultyLevel;
  const imgPath = "../public/" + diffiultyLevelPath;
  fs.readdirSync;
}
