export function dataMunger(data: any) {
  //console.table(data.get());

  const rows = data
    .get()
    .filter({ trial_type: "survey-html-form" })
    .json()
    .split("\n");
  //console.table(rows);
  const experimentResults = [];

  for (let row of rows) {
    row = JSON.parse(row);
    console.log("row");
    console.log(row);
    for (const element of row) {
      console.log("element");
      console.log(element);
      const rt = element["rt"];
      const result = element["response"]["result"];
      const notes = element["response"]["notes"];
      // TODO add these
      //
      //
      //const correctResponse = element["response"]["correctReponse"];
      //const stimuli = element["response"]["stimuli"];
      console.log(`rt ${rt}`);
      experimentResults.push({ rt, result, notes });
    }
  }
  console.table(experimentResults);
  return experimentResults;
}

function arrayToCSV(array: any[]) {
  const header = Object.keys(array[0]).join(",");
  const rows = array
    .slice(1)
    .map((row) => Object.values(row).join(","))
    .join("\n");
  return `${header}\n${rows}`;
}

function downloadCSV(dataForCSV: any, filename: string) {
  const blob = new Blob([dataForCSV], { type: "text/csv;charset=utf8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function transformAndDownload(data: any) {
  const mungedData = dataMunger(data);
  console.table(mungedData);
  const dataForCSV = arrayToCSV(mungedData);
  console.table(dataForCSV);
  // no timezone offset
  const currentDate = String(
    new Date().toJSON().slice(0, 19).replace(/T/g, "-"),
  );
  downloadCSV(dataForCSV, `${currentDate}.csv`);
  console.table(dataForCSV);
}
