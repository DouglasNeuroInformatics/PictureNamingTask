import type { Language } from "/runtime/v1/@opendatacapture/runtime-core";

import { experimentSettingsJson } from "./experimentSettings.ts";
import { pictureNamingTask } from "./pictureNamingTask.ts";
import { $ODCExport, $Settings } from "./schemas.ts";
import { translator } from "./translator.ts";

import "/runtime/v1/jspsych@8.x/css/jspsych.css";
import { z } from "/runtime/v1/zod@3.23.x";
const { defineInstrument } = await import(
  "/runtime/v1/@opendatacapture/runtime-core/index.js"
);

export default defineInstrument({
  kind: "INTERACTIVE",
  language: experimentSettingsJson.language as Language,
  internal: {
    edition: 1,
    name: "pictureNamingTask",
  },
  tags: ["interactive", "jsPsych", "pictureNamingTask"],
  content: {
    async render(done) {
      const settingsParseResult = $Settings.safeParse(experimentSettingsJson);

      // parse settings
      if (!settingsParseResult.success) {
        throw new Error("validation error, check experiment settings", {
          cause: settingsParseResult.error,
        });
      }

      translator.init();
      translator.changeLanguage(settingsParseResult.data.language);
      await pictureNamingTask(done);
    },
  },
  details: {
    description:
      "A digitial implementation of the Boston Naming Task with adaptive difficulty levels",
    estimatedDuration: 15,
    instructions: ["<PLACEHOLDER>"],
    license: "UNLICENSED",
    title: "Picture Naming Task",
  },
  measures: {},
  validationSchema: z.object({
    version: z.string(),
    timestamp: z.string(),
    experimentResults: z.array($ODCExport),
  }),
});
