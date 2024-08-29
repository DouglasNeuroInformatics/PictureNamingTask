import { experimentSettingsJson } from "./experimentSettings.ts";
import { setUseJsonToTrue, useJson } from "./globalState.ts";
import { pictureNamingTask } from "./pictureNamingTask.ts";
import { $experimentResults } from "./schemas.ts";

import type { Language } from "/runtime/v1/@opendatacapture/runtime-core";

import "/runtime/v1/jspsych@8.x/css/jspsych.css";

import { defineInstrument } from "/runtime/v1/@opendatacapture/runtime-core";

if (!useJson) {
  setUseJsonToTrue();
}

export default defineInstrument({
  kind: "INTERACTIVE",
  language: experimentSettingsJson.language as Language,
  internal: {
    edition: 1,
    name: "PictureNamingTask",
  },
  tags: ["interactive", "jsPysch", "PictureNamingTask"],
  content: {
    render(done) {
      pictureNamingTask(experimentSettingsJson.initialDifficulty, done);
    },
  },
  details: {
    description: "A jsPysch implementation of the Boston Naming Task",
    estimatedDuration: 1,
    instructions: ["<PLACEHOLDER>"],
    license: "UNLICENSED",
    title: "Picture Naming Task",
  },
  measures: {},
  validationSchema: $experimentResults,
});
