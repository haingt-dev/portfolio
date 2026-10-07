# haingt.dev

Personal site of Nguyen Thanh Hai, founder of [Disa Games](https://disagames.com): a one-screen founder card (hero line, gear drawing with four chapters, links).

## Where things live

- Copy: the `STORY` export in `src/data/site.ts` (a draft scaffold; edit there).
- Page markup: `src/components/FounderCard.astro`; gear drawing: `src/components/GearTrain.astro`.
- Fonts: self-hosted in `public/fonts/`.

## Tech

- [Astro](https://astro.build/) 6, static output, vanilla CSS/JS
- Deployed to Cloudflare Workers (static assets), see `wrangler.jsonc`

## Development

```sh
pnpm install
pnpm dev        # local dev server at localhost:4321
pnpm build      # production build to ./dist/ (assets in dist/client)
pnpm preview    # preview production build locally
```

## Deployment

A push to `master` deploys. Design system, constraints and quality gates: `AGENTS.md`.
