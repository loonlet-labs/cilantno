import { S3Client } from "bun";
import type { LeaderboardEntry } from "./types.ts";

const MAX_ENTRIES = 10;
const LEADERBOARD_KEY = "leaderboard.json";

const r2 = new S3Client({
  endpoint: process.env.R2_ENDPOINT!,
  region: "auto",
  accessKeyId: process.env.R2_ACCESS_KEY_ID!,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  bucket: process.env.R2_BUCKET_NAME!,
});

async function readLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const file = r2.file(LEADERBOARD_KEY);
    const text = await file.text();
    return JSON.parse(text) as LeaderboardEntry[];
  } catch {
    return [];
  }
}

async function writeLeaderboard(entries: LeaderboardEntry[]): Promise<void> {
  await r2.write(LEADERBOARD_KEY, JSON.stringify(entries));
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const entries = await readLeaderboard();
  return entries.sort((a, b) => b.score - a.score).slice(0, MAX_ENTRIES);
}

export function qualifiesForLeaderboard(
  entries: LeaderboardEntry[],
  score: number,
): boolean {
  if (score <= 0) return false;
  if (entries.length < MAX_ENTRIES) return true;
  const minScore = entries[entries.length - 1]?.score ?? 0;
  return score > minScore;
}

export async function submitScore(
  name: string,
  score: number,
  level: number,
): Promise<{ rank: number; entries: LeaderboardEntry[] }> {
  const entries = await readLeaderboard();

  const newEntry: LeaderboardEntry = {
    name: name.trim().slice(0, 50),
    score,
    level,
    date: new Date().toISOString(),
  };

  entries.push(newEntry);
  entries.sort((a, b) => b.score - a.score);
  const trimmed = entries.slice(0, MAX_ENTRIES);

  await writeLeaderboard(trimmed);

  const rank = trimmed.findIndex(
    (e) => e.name === newEntry.name && e.score === newEntry.score && e.date === newEntry.date,
  ) + 1;

  return { rank, entries: trimmed };
}
