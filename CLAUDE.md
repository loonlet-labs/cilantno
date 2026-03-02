# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cilantno is a 3D web puzzle game ("Pick the cilantro. Save the salad.") built with Three.js, vanilla TypeScript DOM for UI, and Bun. Players pick cilantro from a salad bowl across 10 progressively harder levels. Deployed on Cloudflare Pages with an R2-backed leaderboard.

## Commands

- `bun run dev` — Start dev server with HMR (port 3000)
- `bun run build` — Bundle to `./dist` (HTML entry point: `index.html`)
- `bun test` — Run tests (`src/game.test.ts`)
- `bun run typecheck` — TypeScript check (`tsc --noEmit`)
- `bun run deploy` — Build + deploy to Cloudflare Pages

## Bun Conventions

Default to Bun instead of Node.js for everything:

- `bun <file>` not `node`/`ts-node`; `bun test` not jest/vitest; `bun install` not npm/yarn
- `Bun.serve()` with routes, not Express. HTML imports for bundling, not Vite.
- `Bun.file` over `node:fs`. `Bun.$\`cmd\`` over execa. Bun loads `.env` automatically.
- For Bun API details: `node_modules/bun-types/docs/**.md`

## Architecture

### Entry Points

- **`index.html`** — Frontend entry. Loads `src/main.ts` as `<script type="module">`. Contains all UI overlay markup (menus, HUD, modals).
- **`server.ts`** — Bun.serve() dev server. Serves `index.html` at `/` and `/api/leaderboard` (GET/POST). Uses `Bun.S3Client` for R2 in dev.
- **`functions/api/leaderboard.ts`** — Cloudflare Pages Function (production API). Same leaderboard logic but uses R2 bucket binding directly.

### Game Core (`src/game.ts`)

Central orchestrator using a state machine (`menu` → `playing` → `levelComplete` → `gameOver`/`victory`). Owns all managers and UI screens. The `Game` class wires everything together: scene setup, input callbacks, level progression, scoring.

### Manager Pattern

- **`src/scene/SceneManager.ts`** — Three.js scene, camera, renderer, lighting, bowl. Handles ingredient placement with procedural distribution (Poisson-disk-like). Manages raycasting targets.
- **`src/input/InputManager.ts`** — Mouse/touch raycasting for ingredient picking. Hover highlighting via emissive color.
- **`src/audio/AudioManager.ts`** — Web Audio API with fully synthesized sounds (no audio files). Each sound is a programmatic oscillator sequence.

### Ingredients (`src/scene/ingredients/`)

All inherit from abstract `Ingredient` base class. Each defines its own Three.js geometry. `Cilantro` is the target; `Parsley` is the decoy (introduced at level 4). Others are clutter: `Lettuce`, `Tomato`, `Cucumber`, `Crouton`, `Onion`.

### UI Screens (`src/ui/`)

Vanilla DOM manipulation — no framework. Each screen class manages a specific overlay: `MenuScreen`, `HUD`, `LevelCompleteScreen`, `GameOverScreen`, `VictoryScreen` (with confetti), `LeaderboardScreen`, `HighScoreModal`.

### Level Config (`src/levels.ts`)

Array of 10 `LevelConfig` objects controlling: cilantro count, scale, clutter count, parsley decoys, hidden ingredients, ingredient shifting, lighting dimness, and wrong-pick time penalties.

### Leaderboard (`src/leaderboard.ts`)

Reads/writes a JSON array to R2 storage. Maintains top 10 scores sorted descending. Shared logic between dev server and Cloudflare Pages Function.

## Deployment

Cloudflare Pages with R2 storage. Config in `wrangler.toml`. R2 bucket binding: `LEADERBOARD`. Required env vars for local dev: `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`.
