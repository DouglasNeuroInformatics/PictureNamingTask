import { z } from "/runtime/v1/zod@3.23.x";

const $Language = z.enum(["en", "fr"]);

const $ParticipantID = z.object({
  Q0: z.string(),
});
const $ParticipantResponse = z.object({
  notes: z.string(),
  result: z.string(),
});
const $Trial = z.object({
  // snake_case due to jsPsych
  trial_type: z.string(),
});
export const $ParticipantIDTrial = $Trial.extend({
  response: $ParticipantID,
});
const $LoggingTrial = $Trial.extend({
  correctResponse: z.string(),
  difficultyLevel: z.coerce.number().positive().int(),
  language: $Language,
  response: $ParticipantResponse,
  rt: z.coerce.number().positive().int(),
  stimulus: z.string(),
});
export const $ExperimentResults = $LoggingTrial
  .omit({ response: true, trial_type: true })
  .extend({
    responseNotes: z.string(),
    responseResult: z.string(),
  });
export const $ParticipantIDResult = z.object({
  participantID: z.string(),
});

export const $ExperimentResultsUnion = z.union([
  $ExperimentResults,
  $ParticipantIDResult,
]);
export const $Settings = z.object({
  advancementSchedule: z.coerce.number().positive().int(),
  downloadOnFinish: z.coerce.boolean(),
  initialDifficulty: z.coerce.number().positive().int(),
  language: z.string(),
  numberOfLevels: z.coerce.number().positive().int(),
  regressionSchedule: z.coerce.number().int(),
  seed: z.coerce.number().positive().int(),
  totalNumberOfTrialsToRun: z.coerce.number().positive().int(),
});

export const $ExperimentImage = z.object({
  correctResponse: z.string(),
  difficultyLevel: z.coerce.number().positive().int(),
  language: z.string(),
  stimulus: z.string(),
});

export type ParticipantIDTrial = z.infer<typeof $ParticipantIDTrial>;
export type SupportedLanguage = z.infer<typeof $Language>;
export type ParticipantResponse = z.infer<typeof $ParticipantResponse>;
export type Trial = z.infer<typeof $Trial>;
export type LoggingTrial = z.infer<typeof $LoggingTrial>;
export type ExperimentResults = z.infer<typeof $ExperimentResults>;
export type Settings = z.infer<typeof $Settings>;
export type ExperimentImage = z.infer<typeof $ExperimentImage>;
export type ExperimentResultsUnion = z.infer<typeof $ExperimentResultsUnion>;
