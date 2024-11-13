import { $ExperimentResults, $ParticipantIDTrial, $Settings } from "./schemas.ts";

import type {
  ExperimentResults,
  ExperimentResultsUnion,
  LoggingTrial,
  ParticipantIDTrial,
  Settings,
} from "./schemas.ts";
import type { DataCollection } from "/runtime/v1/jspsych@8.x";

import { DOMPurify } from "/runtime/v1/dompurify@3.x";

function dataMunger(data: DataCollection, settings: Settings) {
  const trials = data
    .filter({ trial_type: "survey-html-form" })
    .values() as LoggingTrial[];
  const idTrials = data
    .filter({ trial_type: "survey-text" })
    .values() as ParticipantIDTrial[];
  const idTrial = idTrials[0] ?? undefined;
  let experimentResults: ExperimentResults[] | ExperimentResultsUnion[];
  let participantResult: ParticipantIDTrial;
  if (idTrial) {
    experimentResults = [] as ExperimentResultsUnion[];
    participantResult = $ParticipantIDTrial.parse({
      trial_type: idTrial.trial_type,
      response: idTrial.response,
    });
    experimentResults.push({
      participantID: DOMPurify.sanitize(String(participantResult.response.Q0)),
    });
  } else {
    experimentResults = [] as ExperimentResults[];
  }

  for (let trial of trials) {
    const result = $ExperimentResults.parse({
      stimulus: trial.stimulus,
      correctResponse: trial.correctResponse,
      difficultyLevel: trial.difficultyLevel,
      language: trial.language,
      rt: trial.rt,
      responseResult: trial.response.result,
      responseNotes: DOMPurify.sanitize(trial.response.notes),
      responseResultAsNumber: trial.response.resultAsNumber,
    });
    experimentResults.push(result);
  }
  return {
    experimentResults,
    settings: settings
  };
}

function arrayToCSV(array: ExperimentResultsUnion[]) {
  const header = Object.keys(array[0]!).join(",");
  const trials = array
    .map((trial) => Object.values(trial).join(","))
    .join("\n");
  return `${header}\n${trials}`;
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
  const mungedData = dataMunger(data, settings);
  const dataForCSV = arrayToCSV(mungedData);
  const currentDate = getLocalTime();
  downloadCSV(dataForCSV, `${currentDate}.csv`);
}
export function transformAndExportJson(data: DataCollection, settings): any {
  const mungedData = dataMunger(data, settings) as ExperimentResults[];
  const jsonSerializableData = exportToJsonSerializable(mungedData);
  return JSON.parse(JSON.stringify(jsonSerializableData));
}
