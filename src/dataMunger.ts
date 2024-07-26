function dataMunger(data: any) {
  //console.table(data.get());

  const rows: Record<string, any>[] = data
    .get()
    .filter({ trial_type: "survey-html-form" })
    .json()
    .split("\n");
  //console.table(rows);
  const experimentResults: Record<string, any>[] = [];

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
      const correctResponse = element["correctResponse"];
      const stimulus = element["stimulus"];
      const difficultyLevel = element['difficultyLevel']
      console.log(`rt ${rt}`);
      experimentResults.push({ rt, result, notes, stimulus, correctResponse, difficultyLevel });
    }
  }
  console.log('exp res')
  console.log(experimentResults)
  console.table(experimentResults);
  return experimentResults;
}

function arrayToCSV(array) {
  console.log(`array ${array}`)
  const header = Object.keys(array[0]).join(",");

  console.log(`header ${header}`)
  const rows = array
    .map((row) => Object.values(row).join(","))
    .join("\n");
  console.log(`rows, ${rows}`)
  console.log("%%%%%%%%%%%")
  return `${header}\n${rows}`;
}

function downloadCSV(dataForCSV: string, filename: string) {
  const blob = new Blob([dataForCSV], { type: "text/csv;charset=utf8" });
  console.log('blob')
  console.table(blob)
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function transformAndDownload(data) {
  const mungedData = dataMunger(data);
  console.log(`mungedData ${mungedData}`);
  console.table(mungedData);
  const dataForCSV = arrayToCSV(mungedData);
  console.log(`dataForCSV ${dataForCSV}`);
  console.table(dataForCSV);
  // no timezone offset
  const currentDate = String(
    new Date().toJSON().slice(0, 19).replace(/T/g, "-"),
  );
  downloadCSV(dataForCSV, `${currentDate}.csv`);
  console.table(dataForCSV);
}
