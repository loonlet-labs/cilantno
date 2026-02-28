export type GameStateType = "menu" | "playing" | "levelComplete" | "gameOver" | "victory";

export interface LevelConfig {
  level: number;
  cilantroCount: number;
  cilantroScale: number;
  clutterCount: number;
  parsleyCount: number;
  hiddenCount: number;
  ingredientShift: boolean;
  lightIntensity: number;
  wrongPenalty: number;
}

export interface GameState {
  state: GameStateType;
  level: number;
  score: number;
  totalScore: number;
  timeRemaining: number;
  cilantroRemaining: number;
  cilantroTotal: number;
}

export type IngredientType = "cilantro" | "lettuce" | "tomato" | "cucumber" | "crouton" | "parsley" | "onion";

export interface LeaderboardEntry {
  name: string;
  score: number;
  level: number;
  date: string;
}
