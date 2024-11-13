import { $ExperimentResults, $ParticipantIDTrial, $Settings } from "./schemas.ts";

import type {
  ExperimentResults,
  LoggingTrial,
  ParticipantIDResult,
  ParticipantIDTrial,
  Settings,
} from "./schemas.ts";
import type { DataCollection } from "/runtime/v1/jspsych@8.x";

import { DOMPurify } from "/runtime/v1/dompurify@3.x";

function dataMunger(data: DataCollection): (ExperimentResults | ParticipantIDResult)[] {
  const trials = data
    .filter({ trial_type: "survey-html-form" })
    .values() as LoggingTrial[];
  const idTrials = data
    .filter({ trial_type: "survey-text" })
    .values() as ParticipantIDTrial[];
  const idTrial = idTrials[0] ?? undefined;

  const results: (ExperimentResults | ParticipantIDResult)[] = [];

  if (idTrial) {
    const participantResult = $ParticipantIDTrial.parse({
      trial_type: idTrial.trial_type,
      response: idTrial.response,
    });
    results.push({
      participantID: DOMPurify.sanitize(String(participantResult.response.Q0)),
    });
  }
  const trialResults = trials.map(trial => {
    return $ExperimentResults.parse({
      stimulus: trial.stimulus,
      correctResponse: trial.correctResponse,
      difficultyLevel: trial.difficultyLevel,
      language: trial.language,
      rt: trial.rt,
      responseResult: trial.response.result,
      responseNotes: DOMPurify.sanitize(trial.response.notes),
      responseResultAsNumber: trial.response.resultAsNumber,
    });
  });

  results.push(...trialResults);

  return results;
}

function arrayToCSV(array: (ExperimentResults | ParticipantIDResult)[]): string {

  let csvContent = '';
  // check for ID, need to fix error here. .participantID does exsits on this 
  if (array[0].participantID!) {
    csvContent += 'participantID\n';
    csvContent += array[0].participantID + '\n';
  }
  // headers
  csvContent += Object.keys(array[array.length - 1]!).join(',') + '\n';
  // append results to csv
  for (let item of array) {
    if ('stimulus' in item) {
      const results = Object.values(item).map(result => {
        // incase notes contain commas
        if (typeof result === 'string' && result.includes((','))) {
          return `"${result}"`
        }
        return result
      })
      const row = results.join(',')
      csvContent += row + '\n'
    }
  }

  return csvContent;
}
function settingsDataMunger(settings: Settings) {

  return $Settings.parse({
    advancementSchedule: settings.advancementSchedule,
    downloadOnFinish: settings.downloadOnFinish,
    initialDifficulty: settings.initialDifficulty,
    language: settings.language,
    numberOfLevels: settings.numberOfLevels,
    regressionSchedule: settings.regressionSchedule,
    optionalSeed: settings.optionalSeed,
    totalNumberOfTrialsToRun: settings.totalNumberOfTrialsToRun,
  });

}

function settingsToCSV(settings: Settings): string {

  const headers = Object.keys(settings[0]).join(',');
  let csvContent = headers + '\n';

  for (const setting of settings) {
    const row = Object.values(setting).map(value => {
      if (value === undefined) {
        return '';
      }
      if (typeof value === 'boolean') {
        return value.toString();
      }
      // Handle string values that might contain commas
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`;
      }
      return value;
    }).join(',');

    csvContent += row + '\n';
  }
  return csvContent;
}
function downloadCSV(dataForCSV: string, filename: string) {
  const blob = new Blob([dataForCSV], { type: "text/csv;charset=utf8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
function getLocalTime() {
  const localTime = new Date();

  const year = localTime.getFullYear();
  // months start at 0 so add 1
  const month = String(localTime.getMonth() + 1).padStart(2, "0");
  const day = String(localTime.getDate()).padStart(2, "0");
  const hours = String(localTime.getHours()).padStart(2, "0");
  const minutes = String(localTime.getMinutes()).padStart(2, "0");
  const seconds = String(localTime.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

function exportToJsonSerializable(data: ExperimentResults[]): {
  [key: string]: unknown;
} {
  return {
    version: "1.0",
    timestamp: getLocalTime(),
    experimentResults: data
      .filter((result): result is ExperimentResults => "stimulus" in result)
      .map((result) => ({
        stimulus: result.stimulus,
        correctResponse: result.correctResponse,
        difficultyLevel: result.difficultyLevel,
        language: result.language,
        rt: result.rt,
        responseResult: result.responseResult,
        responseNotes: result.responseNotes,
        responseResultAsNumber: result.responseResultAsNumber,
      })),
  };
}

export function transformAndDownload(data: DataCollection, settings: Settings) {
  const mungedData = dataMunger(data) as ExperimentResults[];
  const mungedSettings = settingsDataMunger(settings);
  const dataForCSV = arrayToCSV(mungedData);
  const settingsDataForCsv = settingsToCSV(mungedSettings)
  const currentDate = getLocalTime();
  downloadCSV(dataForCSV, `${currentDate}.csv`);
  downloadCSV(settingsDataForCsv, `${currentDate}Settings.csv`)
}
export function transformAndExportJson(data: DataCollection): any {
  const mungedData = dataMunger(data) as ExperimentResults[];
  const jsonSerializableData = exportToJsonSerializable(mungedData);
  return JSON.parse(JSON.stringify(jsonSerializableData));
}
