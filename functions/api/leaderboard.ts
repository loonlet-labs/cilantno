/// <reference types="@cloudflare/workers-types" />

interface LeaderboardEntry {
  name: string;
  score: number;
  level: number;
  date: string;
}

interface Env {
  LEADERBOARD: R2Bucket;
}

const MAX_ENTRIES = 10;
const LEADERBOARD_KEY = "leaderboard.json";

async function readLeaderboard(bucket: R2Bucket): Promise<LeaderboardEntry[]> {
  try {
    const obj = await bucket.get(LEADERBOARD_KEY);
    if (!obj) return [];
    const text = await obj.text();
    return JSON.parse(text) as LeaderboardEntry[];
  } catch {
    return [];
  }
}

async function writeLeaderboard(
  bucket: R2Bucket,
  entries: LeaderboardEntry[],
): Promise<void> {
  await bucket.put(LEADERBOARD_KEY, JSON.stringify(entries));
}

function qualifiesForLeaderboard(
  entries: LeaderboardEntry[],
  score: number,
): boolean {
  if (score <= 0) return false;
  if (entries.length < MAX_ENTRIES) return true;
  const minScore = entries[entries.length - 1]?.score ?? 0;
  return score > minScore;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    const entries = await readLeaderboard(env.LEADERBOARD);
    const sorted = entries
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_ENTRIES);
    return Response.json(sorted);
  } catch (err) {
    console.error("Failed to fetch leaderboard:", err);
    return Response.json([], { status: 500 });
  }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = await request.json();
    const { name, score, level } = body as {
      name: string;
      score: number;
      level: number;
    };

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }
    if (typeof score !== "number" || score <= 0) {
      return Response.json(
        { error: "Valid score is required" },
        { status: 400 },
      );
    }

    const entries = await readLeaderboard(env.LEADERBOARD);
    const sorted = entries
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_ENTRIES);

    if (!qualifiesForLeaderboard(sorted, score)) {
      return Response.json({ qualified: false, entries: sorted });
    }

    const newEntry: LeaderboardEntry = {
      name: name.trim().slice(0, 50),
      score,
      level: level ?? 0,
      date: new Date().toISOString(),
    };

    entries.push(newEntry);
    entries.sort((a, b) => b.score - a.score);
    const trimmed = entries.slice(0, MAX_ENTRIES);

    await writeLeaderboard(env.LEADERBOARD, trimmed);

    const rank =
      trimmed.findIndex(
        (e) =>
          e.name === newEntry.name &&
          e.score === newEntry.score &&
          e.date === newEntry.date,
      ) + 1;

    return Response.json({ qualified: true, rank, entries: trimmed });
  } catch (err) {
    console.error("Failed to submit score:", err);
    return Response.json(
      { error: "Failed to submit score" },
      { status: 500 },
    );
  }
};
