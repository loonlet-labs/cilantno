import type { LevelConfig } from "./types.ts";

export const LEVELS: LevelConfig[] = [
  { level: 1,  cilantroCount: 3,  cilantroScale: 1.2,  clutterCount: 8,  parsleyCount: 0,  hiddenCount: 0, ingredientShift: false, lightIntensity: 1.0,  wrongPenalty: 0 },
  { level: 2,  cilantroCount: 5,  cilantroScale: 1.0,  clutterCount: 12, parsleyCount: 0,  hiddenCount: 0, ingredientShift: false, lightIntensity: 1.0,  wrongPenalty: 1 },
  { level: 3,  cilantroCount: 6,  cilantroScale: 1.0,  clutterCount: 18, parsleyCount: 0,  hiddenCount: 1, ingredientShift: false, lightIntensity: 0.9,  wrongPenalty: 1 },
  { level: 4,  cilantroCount: 8,  cilantroScale: 0.9,  clutterCount: 22, parsleyCount: 2,  hiddenCount: 1, ingredientShift: false, lightIntensity: 0.85, wrongPenalty: 2 },
  { level: 5,  cilantroCount: 10, cilantroScale: 0.85, clutterCount: 28, parsleyCount: 3,  hiddenCount: 2, ingredientShift: false, lightIntensity: 0.8,  wrongPenalty: 2 },
  { level: 6,  cilantroCount: 12, cilantroScale: 0.8,  clutterCount: 32, parsleyCount: 4,  hiddenCount: 3, ingredientShift: true,  lightIntensity: 0.75, wrongPenalty: 2 },
  { level: 7,  cilantroCount: 14, cilantroScale: 0.75, clutterCount: 38, parsleyCount: 5,  hiddenCount: 4, ingredientShift: true,  lightIntensity: 0.7,  wrongPenalty: 3 },
  { level: 8,  cilantroCount: 16, cilantroScale: 0.7,  clutterCount: 42, parsleyCount: 6,  hiddenCount: 5, ingredientShift: true,  lightIntensity: 0.65, wrongPenalty: 3 },
  { level: 9,  cilantroCount: 18, cilantroScale: 0.65, clutterCount: 48, parsleyCount: 8,  hiddenCount: 6, ingredientShift: true,  lightIntensity: 0.55, wrongPenalty: 4 },
  { level: 10, cilantroCount: 20, cilantroScale: 0.6,  clutterCount: 55, parsleyCount: 10, hiddenCount: 8, ingredientShift: true,  lightIntensity: 0.45, wrongPenalty: 5 },
];
