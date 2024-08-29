import Papa from "/runtime/v1/papaparse@5.x";

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
  numberOfLevels: number;
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

const dataPath = baseUrl + "data.csv";
const experimentSettingsPath = baseUrl + "experimentSettings.csv";

const parsedImageDB = await fetchAndParse(dataPath);
const parsedExperimentSettings = await fetchAndParse(experimentSettingsPath);
const experimentSettingsCSV = parsedExperimentSettings.data[0] as Settings;
const imageDbCSV = parsedImageDB.data as ExperimentImage[];

export { experimentSettingsCSV, imageDbCSV };
