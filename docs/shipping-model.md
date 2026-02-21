# Shipping Model (Initial)

## Build commands

- Baseline HTMX: `npm run dev:htmx`
- React TS dev: `npm run dev:react`
- React TS production build: `npm run build --workspace react-ts`

## Production bundle behavior

- HTMX baseline ships server-rendered HTML + minimal static CSS/JS.
- React TS uses Vite code-splitting and hashed output assets.

## Asset hashing

- Vite output in `react-ts/dist/assets` uses content hashes.
- HTMX static assets should be versioned by filename when introduced.

## Image handling

- Initial phase uses lightweight static assets only.
- Rule for expansion: add responsive variants and `srcset` before image-heavy scenarios.

## CDN cache strategy

- HTML: short TTL or no-cache depending on personalization.
- Hashed assets: long immutable TTL.
- API responses: scenario-specific cache policy, no-cache for mutation endpoints.

## Environment handling

- Keep secrets out of build artifacts.
- Use `.env.example` for required variables.
- React public config via `VITE_*` variables.
- Server-side config via process env.
