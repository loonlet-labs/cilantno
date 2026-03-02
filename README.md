# CILANTNO

Pick the cilantro. Save the salad.

A 3D web puzzle game where you pick cilantro out of a salad bowl across 10 progressively harder levels. Built with [Three.js](https://threejs.org/) and [Bun](https://bun.sh).

## Getting Started

```bash
bun install
bun run dev
```

Opens at [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server with HMR |
| `bun run build` | Bundle to `./dist` |
| `bun test` | Run tests |
| `bun run typecheck` | TypeScript type check |
| `bun run preview` | Build and serve locally |
| `bun run deploy` | Build and deploy to Cloudflare Pages |

## Deployment

Hosted on [Cloudflare Pages](https://pages.cloudflare.com/) with an [R2](https://developers.cloudflare.com/r2/) bucket for the leaderboard. Configuration is in `wrangler.toml`.

## License

MIT — made by [Loon Labs](https://github.com/loon-labs).
