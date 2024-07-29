import { DataCollection } from "jspsych"

interface Response {
  notes: string
  result: string
}

interface Trial {
  trialType: string
}

interface LoggingTrial extends Trial {
  rt: number
  response: Response
  stimulus: string
  correctResponse: string
  difficultyLevel: string
  language: string
}

interface ExperimentResults extends Omit<LoggingTrial, 'response' | 'trialType'> {
  responseNotes: string;
  responseResult: string;
}

function dataMunger(data: DataCollection) {
  const rows: LoggingTrial[] = data
    .filter({ trial_type: "survey-html-form" })
    .values()

  const experimentResults: ExperimentResults[] = [];
  for (let row of rows) {
    experimentResults.push({
      rt: row.rt,
      responseNotes: row.response.notes,
      responseResult: row.response.result,
      stimulus: row.stimulus,
      correctResponse: row.correctResponse,
      difficultyLevel: row.difficultyLevel,
      language: row.language
    });
  }
  return experimentResults;
}

function arrayToCSV(array: ExperimentResults[]) {
  const header = Object.keys(array[0]).join(",");
  const rows = array
    .map((row) => Object.values(row).join(","))
    .join("\n");
  return `${header}\n${rows}`;
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
  const month = String(localTime.getMonth() + 1).padStart(2, '0');
  const day = String(localTime.getDate()).padStart(2, '0');
  const hours = String(localTime.getHours()).padStart(2, '0');
  const minutes = String(localTime.getMinutes()).padStart(2, '0');
  const seconds = String(localTime.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}
export function transformAndDownload(data: DataCollection) {
  const mungedData = dataMunger(data);
  const dataForCSV = arrayToCSV(mungedData);
  const currentDate = getLocalTime()
  downloadCSV(dataForCSV, `${currentDate}.csv`);
}
