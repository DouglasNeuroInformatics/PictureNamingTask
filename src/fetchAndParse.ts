import Papa from "papaparse";

import "./style.css";

export type ExperimentImage = {
  correctResponse: string;
  difficultyLevel: number;
  language: string;
  stimulus: string;
};

type Settings = {
  advancementSchedule: number | string;
  initialDifficulty: number | string;
  language: string;
  regressionSchedule: number | string;
  seed: number;
  totalNumberOfTrialsToRun: number | string;
};

async function fetchAndParse(path: string) {
  //  try {
  const response = await fetch(path, {
    headers: { Accept: "text/csv" },
    method: "GET",
  });
  //    if (!response.ok) {
  //      console.log(response);
  //     const container = document.createElement(`div`);
  //    const p = document.createElement("p");
  //   const msg = document.createElement(`h1`);
  //  container.appendChild(msg);
  // container.appendChild(p);
  //container.classList.add("container");
  //      document.body.appendChild(container);
  //      if (path === "/data.csv") {
  //       p.textContent =
  //          "Please ensure a .csv file named data.csv is placed in the same directory as this application is being run from";
  //       msg.textContent = `"data.csv" file not found`;
  //      }
  //      if (path === "/experimentSettings.csv") {
  //       p.textContent =
  //          "Please ensure a .csv file named experimentSettings.csv is placed in the same directory as this application is being run from";
  //      msg.textContent = `"experimentSettings.csv" file not found`;
  //   }
  //}

  const responseText = await response.text();
  const data = Papa.parse(responseText, { header: true });
  return data;
}

// TODO: new new URL ...
const baseUrl = import.meta.env.BASE_URL;
const dataPath = baseUrl + "data.csv";
const experimentSettingsPath = baseUrl + "experimentSettings.csv";
const parsedImageDB = await fetchAndParse(dataPath);
const parsedExperimentSettings = await fetchAndParse(experimentSettingsPath);
const experimentSettings = parsedExperimentSettings.data[0] as Settings;
const imageDB = parsedImageDB.data as ExperimentImage[];

export { experimentSettings, imageDB };
