import Papa from "papaparse";

import "./style.css";

export type ExperimentImage = {
  correctResponse: string;
  difficultyLevel: number;
  language: string;
  stimulus: string;
};

type Settings = {
  advancementSchedule: number;
  initialDifficulty: number;
  language: string;
  regressionSchedule: number;
  seed: number;
  totalNumberOfTrialsToRun: number;
};

async function fetchAndParse(path: string) {
  // main.ts has logic to make sure the files exist
  const response = await fetch(path, {
    headers: { Accept: "text/csv" },
    method: "GET",
  });
  const responseText = await response.text();
  const data = Papa.parse(responseText, { header: true });
  return data;
}

const baseUrl = import.meta.env.BASE_URL;
let dataPath: string;
let experimentSettingsPath: string;
if (baseUrl === "/") {
  dataPath = baseUrl + "data.csv";
  experimentSettingsPath = baseUrl + "experimentSettings.csv";
} else {
  console.log(baseUrl);
  dataPath = new URL("data.csv", baseUrl).toString();
  experimentSettingsPath = new URL(
    "experimentSettings.csv",
    baseUrl,
  ).toString();
}

const parsedImageDB = await fetchAndParse(dataPath);
const parsedExperimentSettings = await fetchAndParse(experimentSettingsPath);
const experimentSettings = parsedExperimentSettings.data[0] as Settings;
const imageDB = parsedImageDB.data as ExperimentImage[];

export { experimentSettings, imageDB };
