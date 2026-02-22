# Front-Facing Ideas

## 1. Audience Positioning Options (2–3)

### Option A — Systems Frontend Reference (primary)

- Audience: Staff+/senior frontend engineers, platform teams, tech leads.
- Positioning: A constraint-driven, production-simulated frontend reference repo that demonstrates async reliability, governance, and release discipline on one serious scenario.
- Strength: Highest credibility with engineering leadership and hiring loops.
- Risk: Can feel heavy to casual learners unless skim paths remain obvious.

### Option B — Frontend Reliability Lab

- Audience: Mid-level frontend developers moving into systems work.
- Positioning: A hands-on lab for learning how production concerns (retries, idempotency, observability, release gates) shape frontend implementation.
- Strength: Strong teaching surface without beginner framing.
- Risk: Must avoid sounding tutorial-first.

### Option C — Architecture-Backed OSS Case Study

- Audience: Founders, hiring managers, solution architects.
- Positioning: A public case study showing how one team would build and govern a production-grade frontend vertical slice with explicit scope control.
- Strength: Converts repo into credibility evidence quickly.
- Risk: Requires tight proof-point surfacing (tests, gates, release docs).

## 2. README Final-Copy Directions (2–3 variants)

### A) Hacker/Builder Version (quickstart-first, gritty credibility)

- Target audience: builders who want to inspect code quickly.
- One-liner value prop: One production-shaped funnel, two implementations, explicit failure handling, and release gates.

#### Why this is different

- One scenario only; depth over breadth.
- Async failure behavior is implemented, not hand-waved.
- HTMX baseline and React implementation share scenario contracts.
- Release freeze and smoke checks are documented in-repo.
- Governance rules exist before expansion.
- Cross-lab integration is specified with explicit assumptions/non-claims.

#### Demo story (3–6 steps)

1. Read `docs/public/case-study.md` (context and intent).
2. Open `react-ts/src/App.tsx` and inspect retry/WS/upload flows.
3. Open `scripts/mock-api.mjs` for failure simulation endpoints.
4. Run `npm run verify:outputs` and `npm run test`.
5. Run smoke checks from `docs/operations/smoke-checks.md`.

#### Proof points to include

- `docs/operations/smoke-checks.md`
- `docs/release/v1-freeze-decision.md`
- `tests/*` layout and commands
- `shared/contracts/*.json`
- `scripts/mock-api.mjs` endpoint surface

#### What NOT to promise yet

- Full CI automation (not present)
- Browser matrix automation
- Multi-scenario or multi-framework parity beyond current scope

### B) Enterprise/Platform Version (safety, operability, guarantees)

- Target audience: platform engineering, architecture review boards, hiring managers.
- One-liner value prop: A governance-backed frontend reference that treats UX reliability, async correctness, and release discipline as architecture concerns.

#### Why this is different

- Scope contract and rejection criteria are explicit (`docs/governance/SCOPE_CONTRACT.md`).
- Complexity budget and drift signals are documented (`docs/governance/COMPLEXITY_BUDGET.md`, `DRIFT_SIGNALS.md`).
- Release artifacts and freeze decision exist before scale-out (`CHANGELOG.md`, `RELEASE_NOTES.md`, `docs/release/v1-freeze-decision.md`).
- Failure scenarios and postmortem simulation are part of the repo (`docs/operations/postmortem-simulation.md`).
- Integration assumptions are clearly separated from verified facts (`docs/integration/ASSUMPTIONS.md`).

#### Demo story (3–6 steps)

1. Review `docs/release/v1-freeze-decision.md` for v1 boundary.
2. Review `docs/governance/*.md` for expansion control.
3. Review `docs/operations/*` for hardening and incident readiness.
4. Inspect implementation code paths for evidence.
5. Review cross-lab integration contracts and assumptions.

#### Proof points to include

- Governance threshold tables
- Smoke-check pass/fail gate table
- Security header/CORS checks in docs
- Changelog/release/versioning package

#### What NOT to promise yet

- Compliance certification
- Production SLOs backed by real telemetry
- Multi-team operational adoption evidence

### C) Educator/Community Version (learning journey, examples)

- Target audience: experienced developers learning systems/frontend rigor.
- One-liner value prop: Learn frontend systems engineering from a single, realistic case study with explicit tradeoffs and operational constraints.

#### Why this is different

- Teaches through one coherent system, not disconnected examples.
- Includes both implementation and governance artifacts.
- Shows failure paths, not just happy paths.
- Includes public case study and talk outlines for explanation practice.
- Includes decision-engine scaffolding and integration design for systems thinking.

#### Demo story (3–6 steps)

1. Start with `README.md` audience path and 5-minute skim.
2. Read `docs/scenarios/canonical-scenario-spec.md`.
3. Trace `baseline-htmx` then `react-ts` implementations.
4. Run selected tests/checks.
5. Review governance and release artifacts as “why” layer.

#### Proof points to include

- `docs/public/*` artifacts
- `docs/scenarios/canonical-scenario-spec.md`
- `tests/unit`, `tests/component`, `tests/integration`, `tests/e2e`
- `docs/governance/*`

#### What NOT to promise yet

- Beginner onboarding tutorial path
- Interactive hosted playground (not yet built)

## 3. Productized Demo Flows (how someone experiences value fast)

### Flow 1 — Reliability-first walkthrough (10 minutes)

1. Open `docs/public/case-study.md`.
2. Inspect `react-ts/src/App.tsx` for retry/backoff, WS resync, upload cancel.
3. Inspect `scripts/mock-api.mjs` for failure injection and realtime simulation.
4. Review `docs/operations/smoke-checks.md` to see release gating.
5. Review `docs/release/v1-freeze-decision.md` for scope discipline.

### Flow 2 — Architecture governance walkthrough (15 minutes)

1. Read `docs/governance/SCOPE_CONTRACT.md`.
2. Read `docs/governance/EXPANSION_GATES.md` and `COMPLEXITY_BUDGET.md`.
3. Compare these to actual repo scope (`scenarios/`, `baseline-htmx/`, `react-ts/`).
4. Review `docs/governance/DRIFT_SIGNALS.md` and `REFACTOR_OR_DELETE_POLICY.md`.

### Flow 3 — Cross-lab systems maturity walkthrough (15 minutes)

1. Read `docs/integration/cross-lab-scenario.md`.
2. Open `docs/integration/system-diagrams.md`.
3. Review `docs/integration/contracts/*.md`.
4. Confirm assumptions/non-claims in `docs/integration/ASSUMPTIONS.md`.

## 4. Frontend Vision (MVP + v2 + anti-scope)

Use the repo’s existing docs/contracts/scripts as content for a front-facing site. No new backend features required; start with generated static content plus optional local wrappers.

### MVP (1–2 weeks)

Goal: fast authority surface for public repo visitors.

Scope:

1. **Docs Explorer**
   - index major docs groups (`operations`, `governance`, `public`, `integration`, `release`)
   - render markdown with file metadata
2. **Scenario Viewer**
   - present `SCN-001` overview from:
     - `scenarios/SCN-001-mortgage-refinance-funnel/scenario.json`
     - `docs/scenarios/canonical-scenario-spec.md`
3. **Prompt Lineage Viewer**
   - ordered `.prompts/PROMPT_*_s.txt` list + summaries + produced artifacts links
4. **Artifact Map**
   - clickable architecture map of repo directories and key files

Implementation mode (feasible with current assets):

- Static site build consuming repository files at build time.
- Markdown parsing + syntax highlighting.
- Optional generated JSON manifest from a local build script.

### v2 (4–8 weeks)

Goal: interactive credibility engine without adding domain scope.

Scope:

1. **Runbook Viewer**
   - visual smoke-check matrix from `docs/operations/smoke-checks.md`
   - status import from CI artifacts (when CI exists)
2. **Contract Explorer**
   - schema/docs viewer for `shared/contracts/*.json`, `schemas/*.json`, `docs/integration/contracts/*.md`
3. **Failure Simulation Narratives**
   - incident cards sourced from `docs/operations/postmortem-simulation.md` and integration failure docs
4. **Traceability Dashboard**
   - prompt-to-artifact mapping built from `.prompts/*` and repo index

### Don’t Build Yet (explicit anti-scope)

1. Multi-scenario playground
2. Live code execution sandboxes
3. Authentication/multi-user features
4. Generic CMS/admin UI
5. New backend services beyond static content generation wrappers
6. Framework comparison dashboards (violates repo restraint posture)

## 5. 5 Frontend Languages Considered (why + 2+ frameworks each)

Grounding note: this repo already contains React+TypeScript and HTMX implementations. The options below are for a **front-facing packaging site** that surfaces existing repo artifacts, not for replacing repository scope.

### 1) TypeScript

Why strong fit:

- Direct reuse of current repo ecosystem (`react-ts`, Vite, JSON/markdown docs artifacts).
- Strong tooling for content indexing, static generation, and UI polish.
- Lowest integration friction for parsing schemas/docs and optionally calling local CLI wrappers.

Frameworks (2+):

1. **Next.js** (SSR/SSG, route-based content delivery)
2. **Astro** (content-first static generation, islands for interactivity)
3. **Remix** (server-centric data loading, strong route contracts)
4. **Vite + React** (simple SPA/static build with custom routing)

Recommended TS stack candidate:

- **TypeScript + Astro** for docs/content-heavy packaging with selective interactive panels.

Integration with current repo:

- Static-first site consuming `docs/`, `.prompts/`, `schemas/`, `scenarios/` at build time.
- No auth required initially.
- Deploy on Netlify/Cloudflare Pages/Vercel static output.

### 2) Elm

Why strong fit:

- Excellent for trustworthy, deterministic UI state modeling (prompt lineage/traceability explorer, filterable artifact views).
- Strong signal alignment with the repo’s constraint-first philosophy.

Frameworks (2+):

1. **elm-pages** (SSG/SSR-oriented content sites)
2. **Lamdera** (full-stack Elm, realtime-capable; overkill for MVP but architecturally elegant)
3. **Elm Land** (structured app scaffolding for Elm apps)

Recommended Elm stack candidate:

- **Elm + elm-pages** for a statically generated artifact explorer with typed content models.

Integration with current repo:

- Best as static site generated from prebuilt JSON manifests (Node wrapper can export docs/prompts metadata).
- Avoid direct file parsing in Elm; use generated JSON artifacts.
- Deploy as static assets.

### 3) Dart (Flutter Web)

Why strong fit:

- Strong UI composition and polished interactions for artifact explorers, dashboards, and diagrams.
- Useful if portfolio branding later wants mobile/web parity across labs.

Frameworks (2+):

1. **Flutter Web** (primary production-grade option)
2. **Jaspr** (Dart web UI/SSR-oriented framework; smaller ecosystem but elegant for content apps)

Recommended Dart stack candidate:

- **Flutter Web** only if cross-portfolio UI parity with a future mobile surface becomes a hard requirement.

Integration with current repo:

- Better as static artifact viewer consuming generated JSON endpoints or baked assets.
- Poorer fit for SEO-first docs content compared to TS/Astro.
- Deploy as static web bundle, fronted by CDN.

### 4) Kotlin

Why strong fit:

- Strong type systems and architecture discipline; good fit for complex state UIs and contract viewers.
- Can project a systems-engineering identity aligned with the repo’s tone.

Frameworks (2+):

1. **Kobweb** (Kotlin full-stack/static site focus with Compose Web)
2. **fritz2** (functional-reactive Kotlin web framework)
3. **KVision** (component-heavy Kotlin/JS framework)
4. **Compose Multiplatform Web** (UI framework basis)

Recommended Kotlin stack candidate:

- **Kotlin + Kobweb** if the goal is a typed, polished docs/app hybrid and the team already uses Kotlin.

Integration with current repo:

- Prefer generated JSON manifests for repo content.
- Static deploy or Kotlin server wrapper if interactive search/indexing grows.
- No auth needed for v1 packaging site.

### 5) Rust

Why strong fit:

- Strong fit for a “systems” brand and high-performance client logic (graph/lineage visualizers).
- Good differentiator if the frontend experience becomes an interactive analysis tool.

Frameworks (2+):

1. **Leptos** (SSR + islands + strong ergonomics)
2. **Yew** (mature Rust/WASM component framework)
3. **Dioxus** (cross-platform UI framework including web)
4. **Seed** (Elm-ish Rust frontend architecture)

Recommended Rust stack candidate:

- **Leptos** if building a genuinely interactive systems dashboard and the team accepts higher complexity.

Integration with current repo:

- Can serve generated JSON manifests and render SSR/SPA hybrid pages.
- More complex toolchain and slower iteration for docs-first content.
- Best deferred unless the frontend itself becomes a systems product.

## 6. Recommended Frontend Stack (one clear pick) + Integration Plan

### Recommended stack: **TypeScript + Astro (content-first) + small React islands**

Why this is the best fit now:

1. The repo is content-rich (44 docs markdown files, schemas, prompt files, contracts).
2. The main value is clarity and trust, not rich app complexity in the front-facing layer.
3. Astro is ideal for static-first documentation and artifact catalogs with selective interactivity.
4. Existing React/TypeScript knowledge and assets reduce integration overhead.

### Integration plan (grounded in current assets)

#### Rendering mode

- **Static site** for v1 packaging (SSG).
- Optional tiny server wrapper later only if repo file access needs to move off build time.

#### Content ingestion

- Build-time ingestion of:
  - `.prompts/PROMPT_*_s.txt`
  - `docs/**/*.md`
  - `scenarios/**/*.json`
  - `schemas/**/*.json`
  - `shared/contracts/*.json`
- Generate JSON manifests for:
  - prompt lineage
  - artifact inventory
  - cross-reference index

#### CLI integration

- If needed, call local repo scripts (`scripts/verify-outputs.sh`) during site build to surface status snapshots.
- Decision CLI (`tools/frontend-lab/README.md`) remains docs-only until executable CLI exists.

#### Auth/deployment

- **No auth** for v1 public site.
- Deploy static output to Netlify/Cloudflare Pages/Vercel.
- Optional preview deploys per PR once CI exists.

## 7. Assets/Artifacts to Showcase (what the repo already has)

### Highest-signal artifacts (already present)

1. `docs/scenarios/canonical-scenario-spec.md` — the core technical story.
2. `react-ts/src/App.tsx` — async resilience and UX maturity evidence.
3. `scripts/mock-api.mjs` — failure simulation and realtime surface.
4. `docs/operations/smoke-checks.md` — release gate discipline.
5. `docs/operations/postmortem-simulation.md` — operational maturity signal.
6. `docs/governance/*.md` — scope/complexity/expansion controls.
7. `docs/release/v1-freeze-decision.md` — explicit restraint and release boundary.
8. `docs/public/case-study.md` — one-page public narrative.
9. `.prompts/PROMPT_*_s.txt` — provenance and generation lineage.
10. `docs/integration/*` — portfolio-level systems thinking with explicit assumptions.

### Good visual candidates

1. Mermaid diagrams already in `README.md` and `docs/integration/system-diagrams.md`.
2. Smoke-check gate table (`docs/operations/smoke-checks.md`).
3. Governance threshold tables (`docs/governance/*.md`).
4. Traceability table (from the audit, if accepted into repo docs later).

## 8. Packaging Polish Checklist (screenshots, gifs, examples, site deploy)

### Content packaging checklist

1. Screenshot of React funnel in desktop split layout (`react-ts`).
2. Screenshot/GIF of offline banner + retry status + submit attempt messaging.
3. Screenshot/GIF of quote panel SWR stale marker and refresh behavior.
4. Screenshot/GIF of advisor WS reconnect indicator.
5. Screenshot of smoke-check gate table and freeze decision excerpts.
6. Screenshot of governance docs table (complexity or expansion gates).

### Demo evidence checklist

1. Terminal capture of `npm run verify:outputs` pass.
2. Terminal capture of `npm run test` and `npm run test:component` pass.
3. (Once environment supports it) integration/E2E run output.
4. (Once build runs) `npm run build --workspace react-ts` + `npm run check:perf` output.

### Site deployment checklist (for front-facing packaging site)

1. Static build pipeline with manifest generation.
2. Broken-link and missing-file checks across docs indexes.
3. Schema JSON pretty rendering and download links.
4. Source file deep links into Git hosting for evidence citations.
5. Version banner reflecting repo `package.json` version and `CHANGELOG.md` latest tag.

### Anti-overclaim checklist (must include)

1. Mark integration docs as assumption-based where external repos are unavailable.
2. Do not claim CI coverage badges until CI exists.
3. Do not claim cross-browser automation until artifacts exist.
4. Do not claim multi-scenario support in v1 front-facing copy.
