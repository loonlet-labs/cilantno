import { test, expect, describe } from "bun:test";
import { LEVELS } from "./levels.ts";
import { qualifiesForLeaderboard } from "./leaderboard.ts";
import type { LeaderboardEntry } from "./types.ts";

describe("level configs", () => {
  test("there are 10 levels", () => {
    expect(LEVELS.length).toBe(10);
  });

  test("levels are numbered 1 through 10", () => {
    LEVELS.forEach((config, i) => {
      expect(config.level).toBe(i + 1);
    });
  });

  test("cilantro count increases each level", () => {
    for (let i = 1; i < LEVELS.length; i++) {
      expect(LEVELS[i]!.cilantroCount).toBeGreaterThanOrEqual(LEVELS[i - 1]!.cilantroCount);
    }
  });

  test("cilantro scale decreases over levels", () => {
    for (let i = 1; i < LEVELS.length; i++) {
      expect(LEVELS[i]!.cilantroScale).toBeLessThanOrEqual(LEVELS[i - 1]!.cilantroScale);
    }
  });

  test("clutter count increases each level", () => {
    for (let i = 1; i < LEVELS.length; i++) {
      expect(LEVELS[i]!.clutterCount).toBeGreaterThanOrEqual(LEVELS[i - 1]!.clutterCount);
    }
  });

  test("light intensity decreases over levels", () => {
    for (let i = 1; i < LEVELS.length; i++) {
      expect(LEVELS[i]!.lightIntensity).toBeLessThanOrEqual(LEVELS[i - 1]!.lightIntensity);
    }
  });

  test("parsley decoys appear from level 4", () => {
    expect(LEVELS[0]!.parsleyCount).toBe(0);
    expect(LEVELS[1]!.parsleyCount).toBe(0);
    expect(LEVELS[2]!.parsleyCount).toBe(0);
    expect(LEVELS[3]!.parsleyCount).toBeGreaterThan(0);
  });

  test("ingredient shift starts at level 6", () => {
    expect(LEVELS[4]!.ingredientShift).toBe(false);
    expect(LEVELS[5]!.ingredientShift).toBe(true);
  });
});

describe("scoring", () => {
  test("pick score calculation", () => {
    const level = 3;
    const timeRemaining = 45;
    const totalTime = 60;
    const score = Math.floor(100 * level * (timeRemaining / totalTime));
    expect(score).toBe(225);
  });

  test("completion bonus calculation", () => {
    const timeRemaining = 30;
    const level = 5;
    const bonus = Math.floor(timeRemaining * 50 * level);
    expect(bonus).toBe(7500);
  });

  test("pick score at max time is 100 * level", () => {
    const level = 7;
    const timeRemaining = 60;
    const totalTime = 60;
    const score = Math.floor(100 * level * (timeRemaining / totalTime));
    expect(score).toBe(700);
  });

  test("pick score at zero time is 0", () => {
    const level = 5;
    const timeRemaining = 0;
    const totalTime = 60;
    const score = Math.floor(100 * level * (timeRemaining / totalTime));
    expect(score).toBe(0);
  });

  test("higher levels give more points per pick", () => {
    const timeRemaining = 30;
    const totalTime = 60;
    const scoreL1 = Math.floor(100 * 1 * (timeRemaining / totalTime));
    const scoreL10 = Math.floor(100 * 10 * (timeRemaining / totalTime));
    expect(scoreL10).toBeGreaterThan(scoreL1);
    expect(scoreL10).toBe(500);
    expect(scoreL1).toBe(50);
  });
});

describe("leaderboard qualification", () => {
  const makeEntry = (name: string, score: number): LeaderboardEntry => ({
    name,
    score,
    level: 1,
    date: new Date().toISOString(),
  });

  test("qualifies when leaderboard is empty", () => {
    expect(qualifiesForLeaderboard([], 100)).toBe(true);
  });

  test("qualifies when leaderboard has fewer than 10 entries", () => {
    const entries = [makeEntry("Alice", 500)];
    expect(qualifiesForLeaderboard(entries, 100)).toBe(true);
  });

  test("qualifies when score beats the lowest on a full board", () => {
    const entries = Array.from({ length: 10 }, (_, i) =>
      makeEntry(`Player ${i}`, 1000 - i * 100),
    );
    // Lowest score is 100, so 200 should qualify
    expect(qualifiesForLeaderboard(entries, 200)).toBe(true);
  });

  test("does not qualify when score equals the lowest on a full board", () => {
    const entries = Array.from({ length: 10 }, (_, i) =>
      makeEntry(`Player ${i}`, 1000 - i * 100),
    );
    // Lowest score is 100
    expect(qualifiesForLeaderboard(entries, 100)).toBe(false);
  });

  test("does not qualify when score is lower than the lowest", () => {
    const entries = Array.from({ length: 10 }, (_, i) =>
      makeEntry(`Player ${i}`, 1000 - i * 100),
    );
    expect(qualifiesForLeaderboard(entries, 50)).toBe(false);
  });

  test("does not qualify with zero score", () => {
    expect(qualifiesForLeaderboard([], 0)).toBe(false);
  });

  test("does not qualify with negative score", () => {
    expect(qualifiesForLeaderboard([], -100)).toBe(false);
  });
});
