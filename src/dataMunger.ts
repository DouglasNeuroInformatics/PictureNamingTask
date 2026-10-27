import { $ExperimentResults, $ParticipantIDTrial } from "./schemas.ts";

import type {
  ExperimentResults,
  LoggingTrial,
  ParticipantIDResult,
  ParticipantIDTrial,
  Settings,
} from "./schemas.ts";
import type { DataCollection } from "/runtime/v1/jspsych@8.x";

import { DOMPurify } from "/runtime/v1/dompurify@3.x";

function dataMunger(
  data: DataCollection,
): (ExperimentResults | ParticipantIDResult)[] {
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
  const trialResults = trials.map((trial) => {
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

// quote fields per RFC 4180 and neutralise spreadsheet formula injection
// (free-text notes / participant IDs starting with = + - @ are executed by Excel)
function escapeCSVField(value: boolean | number | string | undefined): string {
  if (value === undefined) return "";
  let field = String(value);
  if (typeof value === "string" && /^[=+\-@\t\r]/.test(field)) {
    field = "'" + field;
  }
  if (/[",\r\n]/.test(field)) {
    field = `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

function arrayToCSV(
  array: (ExperimentResults | ParticipantIDResult)[],
): string {
  let csvContent = "";
  const first = array[0];
  if (first && "participantID" in first) {
    csvContent += "participantID\n";
    csvContent += escapeCSVField(first.participantID) + "\n";
  }
  const trialResults = array.filter(
    (item): item is ExperimentResults => "stimulus" in item,
  );
  if (trialResults.length === 0) {
    return csvContent;
  }
  // headers
  csvContent += Object.keys(trialResults[0]!).join(",") + "\n";
  // append results to csv
  for (const item of trialResults) {
    csvContent += Object.values(item).map(escapeCSVField).join(",") + "\n";
  }

  return csvContent;
}

function settingsToCSV(settings: Settings): string {
  const headers = Object.keys(settings).join(",");
  const values = Object.values(settings).map(escapeCSVField).join(",");

  return headers + "\n" + values + "\n";
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

function exportToJsonSerializable(
  data: ExperimentResults[],
  settings: Settings,
): {
  [key: string]: unknown;
} {
  return {
    version: "1.1",
    timestamp: getLocalTime(),
    settings: {
      advancementSchedule: settings.advancementSchedule,
      downloadOnFinish: settings.downloadOnFinish,
      initialDifficulty: settings.initialDifficulty,
      language: settings.language,
      numberOfLevels: settings.numberOfLevels,
      regressionSchedule: settings.regressionSchedule,
      optionalSeed: settings.seed,
      totalNumberOfTrialsToRun: settings.totalNumberOfTrialsToRun,
    },
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
  const dataForCSV = arrayToCSV(mungedData);
  const settingsDataForCsv = settingsToCSV(settings);
  const currentDate = getLocalTime();
  downloadCSV(dataForCSV, `${currentDate}.csv`);
  downloadCSV(settingsDataForCsv, `${currentDate}-Settings.csv`);
}
export function transformAndExportJson(
  data: DataCollection,
  settings: Settings,
): any {
  const mungedData = dataMunger(data) as ExperimentResults[];
  const jsonSerializableData = exportToJsonSerializable(mungedData, settings);
  return JSON.parse(JSON.stringify(jsonSerializableData));
}
