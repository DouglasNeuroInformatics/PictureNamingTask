import Papa from "papaparse";
import "./style.css";

async function fetchAndParse(path: string) {
  console.log('path')
  console.log(path)
  try {
    const response = await fetch(path, {
      headers: { Accept: "text/csv" },
      method: "GET",
    });
    if (!response.ok) {
      console.log(response)
      const container = document.createElement(`div`);
      const p = document.createElement("p");
      const msg = document.createElement(`h1`);
      container.appendChild(msg);
      container.appendChild(p);
      container.classList.add("container");
      document.body.appendChild(container);
      if (path === "/data.csv") {
        p.textContent =
          "Please ensure a .csv file named data.csv is placed in the same directory as this application is being run from";
        msg.textContent = `"data.csv" file not found`;
      }
      if (path === "/experimentSettings.csv") {
        p.textContent =
          "Please ensure a .csv file named experimentSettings.csv is placed in the same directory as this application is being run from";
        msg.textContent = `"experimentSettings.csv" file not found`;
      }
    }

    const responseText = await response.text();
    const data = Papa.parse(responseText, { header: true });
    console.log('fetch and parse got data')
    console.log(data);
    return data;
  } catch (error) {
    console.log('error:')
    console.log(error);
  }
}
const baseUrl = import.meta.env.BASE_URL;
const dataPath = baseUrl + 'data.csv'
const experimentSettingsPath = baseUrl + 'experimentSettings.csv'

const parsedImageDB = await fetchAndParse(dataPath);
if (!parsedImageDB) {
  throw new Error("Failed to fetch and parse the data.csv.");
} else {
  console.log('parsedImageDB')
  console.table(parsedImageDB);
}
const parsedExperimentSettings = await fetchAndParse(experimentSettingsPath)
if (!parsedExperimentSettings) {
  throw new Error('Failes to fetch and parse the experimentSettings.csv.')
} else {
  console.log('experimentSettings')
  console.table(parsedExperimentSettings)
}
interface ImageBank {
  stimulus: string;
  difficultyLevel: number;
  correctResponse: string;
  language: string;
}

interface Settings {
  totalNumberOfTrialsToRun: number | string;
  advancementSchedule: number | string;
  regressionSchedule: number | string;
  language: string;
  seed: number;
}

const experimentSettings: Settings = parsedExperimentSettings
  .data[0] as Settings;
const imageDB: ImageBank[] = parsedImageDB.data as ImageBank[];

export { imageDB, experimentSettings };
