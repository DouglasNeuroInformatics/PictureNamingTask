// write a fuction to fetch the .csv,
//
// aysnc funv with a try catch
//
// h
//
import Papa from "papaparse";
import "./style.css";
import pictureNamingTask from "./pictureNamingTask";

async function fetchAndParse() {
  try {
    const response = await fetch("/data.csv", {
      headers: { Accept: "text/csv" },
      method: "GET",
    });
    if (!response.ok) {
      const container = document.createElement(`div`);
      const p = document.createElement("p");
      const msg = document.createElement(`h1`);
      container.appendChild(msg);
      container.appendChild(p);
      container.classList.add("container");
      document.body.appendChild(container);
      p.textContent =
        "Please ensure a .csv file named data.csv is placed in the same directory as this application is being run from";
      msg.textContent = `"data.csv" file not found`;
    }

    const responseText = await response.text();
    const data = Papa.parse(responseText, { header: true });
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}
const imgDB = await fetchAndParse();
export { imgDB };

pictureNamingTask(1);
