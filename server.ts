import index from "./index.html";
import {
  getLeaderboard,
  submitScore,
  qualifiesForLeaderboard,
} from "./src/leaderboard.ts";

Bun.serve({
  port: 3000,
  routes: {
    "/": index,
    "/api/leaderboard": {
      GET: async () => {
        try {
          const entries = await getLeaderboard();
          return Response.json(entries);
        } catch (err) {
          console.error("Failed to fetch leaderboard:", err);
          return Response.json([], { status: 500 });
        }
      },
      POST: async (req) => {
        try {
          const body = await req.json();
          const { name, score, level } = body as { name: string; score: number; level: number };

          if (!name || typeof name !== "string" || name.trim().length === 0) {
            return Response.json({ error: "Name is required" }, { status: 400 });
          }
          if (typeof score !== "number" || score <= 0) {
            return Response.json({ error: "Valid score is required" }, { status: 400 });
          }

          const entries = await getLeaderboard();
          if (!qualifiesForLeaderboard(entries, score)) {
            return Response.json({ qualified: false, entries });
          }

          const result = await submitScore(name.trim(), score, level ?? 0);
          return Response.json({ qualified: true, ...result });
        } catch (err) {
          console.error("Failed to submit score:", err);
          return Response.json({ error: "Failed to submit score" }, { status: 500 });
        }
      },
    },
  },
  development: {
    hmr: true,
    console: true,
  },
});

console.log("Cilantno running at http://localhost:3000");
