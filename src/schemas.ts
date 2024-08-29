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
  difficultyLevel: z.number(),
  language: $language,
  response: $participantResponse,
  rt: z.number(),
  stimulus: z.string(),
});
export const $experimentResults = $loggingTrial
  .omit({ response: true, trialType: true })
  .extend({
    responseNotes: z.string(),
    responseResult: z.string(),
  });

export type ParticipantResponse = z.infer<typeof $participantResponse>;
export type Trial = z.infer<typeof $trial>;
export type LoggingTrial = z.infer<typeof $loggingTrial>;
export type ExperimentResults = z.infer<typeof $experimentResults>;

export type ExperimentImage = {
  correctResponse: string;
  difficultyLevel: number;
  language: string;
  stimulus: string;
};

export type Settings = {
  advancementSchedule: number;
  downloadOnFinish: boolean;
  initialDifficulty: number;
  language: string;
  numberOfLevels: number;
  regressionSchedule: number;
  seed: number;
  totalNumberOfTrialsToRun: number;
};

