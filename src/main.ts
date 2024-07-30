import pictureNamingTask from "./pictureNamingTask";

async function checkFilesExists(baseUrl: string, filePath: string) {
  const path = baseUrl + filePath;
  try {
    const response = await fetch(path, {
      headers: { Accept: "text/csv" },
      method: "HEAD",
    });

    if (!response.ok) {
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
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
// Immediatly invoked function expresssion to check files exist
void (async () => {
  const baseUrl = import.meta.env.BASE_URL || "/";
  const dataPath = "data.csv";
  const experimentSettingsPath = "experimentSettings.csv";

  const parsedImageDB = await checkFilesExists(baseUrl, dataPath);
  if (!parsedImageDB) {
    throw new Error("Failed to fetch and parse the data.csv.");
  }

  const parsedExperimentSettings = await checkFilesExists(
    baseUrl,
    experimentSettingsPath,
  );
  if (!parsedExperimentSettings) {
    throw new Error("Failed to fetch and parse the experimentSettings.csv.");
  }

  if (parsedImageDB && parsedExperimentSettings) {
    pictureNamingTask(1);
  }
})();
