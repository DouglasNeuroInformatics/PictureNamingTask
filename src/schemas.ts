import { z } from "/runtime/v1/zod@3.23.x";

const $language = z.enum(["en", "fr"]);

const $participantResponse = z.object({
  notes: z.string(),
  result: z.string(),
});
const $trial = z.object({
  trialType: z.string(),
});
const $loggingTrial = $trial.extend({
  correctResponse: z.string(),
  difficultyLevel: z.coerce.number().positive().int(),
  language: $language,
  response: $participantResponse,
  rt: z.coerce.number().positive().int(),
  stimulus: z.string(),
});
export const $experimentResults = $loggingTrial
  .omit({ response: true, trialType: true })
  .extend({
    responseNotes: z.string(),
    responseResult: z.string(),
  });

export const $settings = z.object({
  advancementSchedule: z.coerce.number().positive().int(),
  downloadOnFinish: z.coerce.boolean(),
  initialDifficulty: z.coerce.number().positive().int(),
  language: z.string(),
  numberOfLevels: z.coerce.number().positive().int(),
  regressionSchedule: z.coerce.number().int(),
  seed: z.coerce.number().positive().int(),
  totalNumberOfTrialsToRun: z.coerce.number().positive().int(),
});

export const $experimentImage = z.object({
  correctResponse: z.string(),
  difficultyLevel: z.coerce.number().positive().int(),
  language: z.string(),
  stimulus: z.string(),
});

export type SupportedLanguage = z.infer<typeof $language>;
export type ParticipantResponse = z.infer<typeof $participantResponse>;
export type Trial = z.infer<typeof $trial>;
export type LoggingTrial = z.infer<typeof $loggingTrial>;
export type ExperimentResults = z.infer<typeof $experimentResults>;
export type Settings = z.infer<typeof $settings>;
export type ExperimentImage = z.infer<typeof $experimentImage>;
