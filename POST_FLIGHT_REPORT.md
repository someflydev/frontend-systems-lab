# Post-Flight Report

## 1. Repo Summary (What it is, what it promises, how to run)

### What it is (verified)

`frontend-systems-lab` is a constrained, documentation-heavy, production-simulated frontend systems repository centered on one canonical scenario (`SCN-001 Mortgage Refinance Lead Funnel`) with two implementations:

- `baseline-htmx` (server-first baseline) (`baseline-htmx/src/server.mjs`)
- `react-ts` (client-state-rich implementation) (`react-ts/src/App.tsx`)

The repo also includes:

- governance controls (`docs/governance/*.md`)
- a decision-engine scaffold (`docs/decision-engine/*`, `schemas/*`, `tools/frontend-lab/README.md`)
- release artifacts (`CHANGELOG.md`, `RELEASE_NOTES.md`, `VERSIONING.md`, `CONTRIBUTING.md`, `ROADMAP.md`, `docs/release/v1-freeze-decision.md`)
- public-facing positioning docs (`docs/public/*`)
- integration assumption/contracts docs (`docs/integration/*`)

### What it promises (verified via docs)

Core claims are stated in:

- `README.md`
- `docs/scenarios/canonical-scenario-spec.md`
- `docs/operations/smoke-checks.md`
- `docs/release/v1-freeze-decision.md`

Primary promise: one deep, production-simulated frontend case study with async resilience, accessibility, observability, and governance discipline.

### Repo inventory snapshot (verified)

- Prompt plan files: 8 (`.prompts/PROMPT_00_s.txt` … `.prompts/PROMPT_07_s.txt`)
- Docs markdown files: 44 (`find docs -type f -name '*.md'`)
- Schemas: 2 JSON (`schemas/scenario.schema.json`, `schemas/examples/scenario.example.json`)
- Test files: 4 total (`tests/unit`, `tests/component`, `tests/integration`, `tests/e2e` = 1 each)
- CI workflows: none (`NO_GITHUB_ACTIONS`, no `.github/workflows`)
- Lockfile: none (`package-lock.json` / `pnpm-lock.yaml` / `yarn.lock` not present)
- License file: none (`LICENSE*` not present)

### Primary entrypoints (verified)

Root scripts (`package.json`):

- `dev:mock-api` -> `node scripts/mock-api.mjs`
- `dev:htmx` -> `npm run dev --workspace baseline-htmx`
- `dev:react` -> `npm run dev --workspace react-ts`
- `verify:outputs` -> `bash scripts/verify-outputs.sh`
- `test`, `test:component`, `test:integration`, `test:e2e`
- `check:a11y`, `check:perf`

Implementation entrypoints:

- `baseline-htmx/src/server.mjs`
- `react-ts/src/main.tsx` -> `react-ts/src/App.tsx`
- `scripts/mock-api.mjs` (simulation backend + realtime feed)

### How to run locally (verified from docs/scripts; not fully executed here)

Documented path:

1. `npm install` (required; root depends on `ws`, `react-ts` depends on Vite/React toolchain) (`package.json`, `react-ts/package.json`)
2. `npm run dev:mock-api`
3. `npm run dev:htmx` and/or `npm run dev:react`
4. Run checks from `docs/operations/smoke-checks.md`

### Dependencies and services (verified)

- Node.js `>=20` (`package.json`)
- npm workspaces (`package.json`)
- Root runtime dependency: `ws` (`package.json`) for `scripts/mock-api.mjs`
- Browser runtime dependency on HTMX CDN in baseline (`baseline-htmx/src/server.mjs` loads `https://unpkg.com/htmx.org@1.9.12`)

### Demo / fixture mode (verified)

The repo has a synthetic demo/simulation mode via:

- `scripts/mock-api.mjs` endpoints and failure injection query params/env vars
- shared fixtures in `shared/fixtures/*.json`

### Runtime verification caveat (verified failure evidence)

I could not fully run integration/E2E in this sandbox because:

1. `node_modules` are not installed (`node scripts/mock-api.mjs` failed with `ERR_MODULE_NOT_FOUND: ws`)
2. the environment disallows local port binding (`listen EPERM` on local HTTP server tests)

This affects confidence in runnable claims but not artifact presence.

## 2. Prompt Intent Map (compressed)

### Prompt Intent Map

| Prompt ID | Declared goal | Promised artifacts / outputs | Implied dependencies / sequencing |
| --- | --- | --- | --- |
| `PROMPT_00_s` | Strategy blueprint for multi-framework frontend systems platform (no implementation) | Structured blueprint content (sections 0–9); no code/config edits in prompt itself | Must precede implementation prompts; establishes architecture and scenario catalog concepts |
| `PROMPT_01_s` | Minimal production-serious repo with one canonical scenario and two implementations (HTMX + React/Elm) | Repo tree, scenario definition, baseline implementation, SPA implementation, fixtures, tests, shipping model, `DESIGN_DECISIONS.md` | Depends on strategy decisions from `PROMPT_00_s`; creates canonical artifact names and scope contract |
| `PROMPT_02_s` | Frontend architecture decision engine (docs/schema/CLI scaffold) | `docs/decision-engine/*`, `schemas/*`, `tools/frontend-lab/README.md` | Explicitly provisional if run before hardening in `PROMPT_04_s`; references `docs/operations/smoke-checks.md` |
| `PROMPT_03_s` | Governance / anti-overengineering system | `docs/governance/*` | Builds on scope from `PROMPT_01_s`; constrains future prompts |
| `PROMPT_04_s` | Production-grade hardening of canonical scenario | `docs/scenarios/canonical-scenario-spec.md`, `docs/operations/*`, implementation hardening updates | Depends on canonical scenario from `PROMPT_01_s`; unlocks `PROMPT_02_s` non-provisional interpretation |
| `PROMPT_05_s` | Public authority extraction layer | README rewrite, `docs/public/*`; integration assumptions/contracts if external repos unavailable | Depends on production-grade implementation/docs from `PROMPT_04_s`; may append integration assumptions |
| `PROMPT_06_s` | v1.0 release hardening and freeze | `CHANGELOG.md`, `RELEASE_NOTES.md`, `VERSIONING.md`, `CONTRIBUTING.md`, `ROADMAP.md`, `docs/release/v1-freeze-decision.md` + implementation hardening tweaks | Depends on `PROMPT_04_s` operations docs and hardening; relies on existing public/governance signal |
| `PROMPT_07_s` | Cross-lab vertical-slice integration design | `docs/integration/cross-lab-scenario.md`, `docs/integration/system-diagrams.md`, integration contract docs, append `ASSUMPTIONS.md` if external repos unavailable | Depends on prior integration assumptions from `PROMPT_05_s`; must mark assumptions vs verified facts |

### Scope / vision extracted from prompts (compressed)

- Start as a constrained, artifact-first frontend systems lab.
- Go deep on one scenario before adding breadth.
- Preserve disciplined governance and explicit release gates.
- Add public-facing authority artifacts without dumbing down technical content.
- Extend into cross-lab integration via documented assumptions/contracts, not fabricated code.

### Non-goals / constraints repeatedly reinforced

- No framework zoo.
- No multiple scenarios (before hardening and proof).
- No tutorial simplification replacing production realism.
- No experimental abstractions without repeated use/value.

### Sequencing assumptions identified

1. `PROMPT_02_s` depends on `PROMPT_04_s` for non-provisional status (`docs/operations/smoke-checks.md`).
2. `PROMPT_04_s` depends on `PROMPT_01_s` canonical scenario and implementation directories.
3. `PROMPT_05_s` assumes production-grade implementation already exists.
4. `PROMPT_06_s` assumes prior hardening and release-gate docs exist.
5. `PROMPT_07_s` assumes integration assumptions may already exist and must be appended, not overwritten.

## 3. Traceability: Prompt -> Artifact Delivery Table

| Prompt ID | Intended artifacts | Found artifacts | Status | Notes | Suggested follow-up |
| --- | --- | --- | --- | --- | --- |
| `PROMPT_00_s` | Strategy blueprint (sections 0–9), no implementation changes | `docs/frontends-foundry-blueprint/README.md`, `00-09-*.md` | Delivered | Blueprint exists as sectioned artifacts rather than only chat output; aligns with later user request to persist artifacts. | None; optionally add index links from root README (already partially linked via `docs/README.md`). |
| `PROMPT_01_s` | Initial repo structure, canonical scenario, HTMX baseline, React/Elm impl, fixtures, tests, shipping docs, `DESIGN_DECISIONS.md` | `docs/`, `scenarios/SCN-001-*`, `shared/*`, `baseline-htmx/*`, `react-ts/*`, `tests/*`, `scripts/*`, `DESIGN_DECISIONS.md` | Partial | Core artifacts exist and are coherent. “Everything must be runnable” is only partially verified in this environment due missing installed deps and port restrictions; also no lockfile/CI. | Add lockfile + CI smoke path; confirm `react-ts` build compiles in clean environment. |
| `PROMPT_02_s` | Decision engine docs/schema/CLI scaffold | `docs/decision-engine/*`, `schemas/*`, `tools/frontend-lab/README.md` | Partial | Expected artifacts exist. Docs remain explicitly `provisional` even after `docs/operations/smoke-checks.md` now exists. | Revisit decision-engine docs to graduate/confirm provisional status after hardening validation. |
| `PROMPT_03_s` | Governance docs with explicit thresholds/gates | `docs/governance/*` | Delivered | All required governance docs exist and include numeric thresholds/gates. | Add automated enforcement hooks (CI) to match the governance level claimed. |
| `PROMPT_04_s` | Production-grade hardening docs + implementation updates for canonical scenario | `docs/scenarios/canonical-scenario-spec.md`, `docs/operations/*`, `react-ts/src/App.tsx`, `scripts/mock-api.mjs`, `baseline-htmx/src/server.mjs`, `tests/component/react-contract.test.mjs` | Partial | Depth artifacts exist and scenario scope preserved. Some checks are smoke/static rather than runtime (e.g., `scripts/check-a11y.mjs`, `tests/component/react-contract.test.mjs` source scanning). Runtime verification blocked here and CI absent. | Add runtime a11y/component tests and deterministic integration/E2E execution path. |
| `PROMPT_05_s` | Public authority layer (README rewrite + `docs/public/*`) + integration assumptions/contracts if external repos unavailable | `README.md`, `docs/public/*`, `docs/integration/ASSUMPTIONS.md`, `docs/integration/contracts/*stub.md` | Delivered | Public docs are strong and cite internal artifacts. Assumption stubs clearly marked. | Add screenshots/recorded flows once CI/demo environment exists. |
| `PROMPT_06_s` | v1.0 release artifacts + freeze decision + hardening improvements | `CHANGELOG.md`, `RELEASE_NOTES.md`, `VERSIONING.md`, `CONTRIBUTING.md`, `ROADMAP.md`, `docs/release/v1-freeze-decision.md`; versions bumped in package manifests | Partial | Release artifacts exist and align. Packaging/distribution remains incomplete (no lockfile/license/CI), which weakens release reproducibility. | Add `LICENSE`, lockfile, and CI verification matrix before public tag. |
| `PROMPT_07_s` | Cross-lab integration scenario + diagrams + API/error/realtime contracts + append assumptions if external repos unavailable | `docs/integration/cross-lab-scenario.md`, `docs/integration/system-diagrams.md`, `docs/integration/contracts/api-contract.md`, `error-taxonomy.md`, `realtime-channel.md`, appended `docs/integration/ASSUMPTIONS.md` | Delivered | Assumptions vs verified facts are clearly separated and explicit non-claims are present. | Add cross-repo validation checklist once `data-storage-zoo` is available. |

## 4. Completeness Score (0–100) + Rubric Breakdown

### Overall score: **76 / 100**

### Rubric breakdown

#### A) Core Functionality (0–25): **20 / 25**

Evidence:

- Core scenario and implementations exist (`scenarios/SCN-001-mortgage-refinance-funnel/scenario.json`, `baseline-htmx/src/server.mjs`, `react-ts/src/App.tsx`).
- Mock backend supports realistic endpoints and failure injection (`scripts/mock-api.mjs`).
- Happy-path and resilience behavior are implemented in code.

Score reduction reasons:

- End-to-end runtime path could not be verified here due missing installed `ws` dependency (`scripts/mock-api.mjs` import) and sandbox port restrictions.
- `react-ts` build plausibly fails typecheck due `import.meta.env` usage without `vite-env.d.ts` or `vite/client` types (`react-ts/src/App.tsx:52`, missing `react-ts/src/vite-env.d.ts`).

#### B) Developer Experience (0–20): **14 / 20**

Evidence:

- Root `README.md` is unusually clear and audience-specific.
- Root scripts are well named (`package.json`).
- Repo layout is explicit and documented (`docs/repo-structure.md`, `docs/README.md`).

Score reduction reasons:

- No lockfile (reproducibility gap).
- No CI workflow (`NO_GITHUB_ACTIONS`).
- Root `npm test` only runs unit tests (`package.json`), while deeper checks are separate and easy to skip.
- No lint/format/typecheck root scripts despite docs/governance emphasis.

#### C) Tests + Quality Gates (0–15): **8 / 15**

Evidence:

- Unit/integration/E2E/component test files exist.
- Smoke checks and performance gate docs exist (`docs/operations/smoke-checks.md`).
- `scripts/verify-outputs.sh` enforces artifact integrity and scenario scope.

Score reduction reasons:

- “Component test” is source scanning, not rendered component behavior (`tests/component/react-contract.test.mjs`).
- Accessibility check is static source grep, not runtime audit (`scripts/check-a11y.mjs`).
- No CI automation for gates.
- Integration/E2E rely on local port binding and installed deps without fallback harness.

#### D) Docs + Examples (0–15): **15 / 15**

Evidence:

- Extensive docs coverage (44 markdown files under `docs/`).
- Strong public, governance, release, operations, and integration layers.
- Clear scenario specification and postmortem/release docs.

Minor caveat but not score-reducing here:

- High doc volume increases navigation overhead, but indexing is present.

#### E) Operability + Safety (0–15): **13 / 15**

Evidence:

- Idempotency and bounded retries in both implementations (`react-ts/src/App.tsx`, `baseline-htmx/src/server.mjs`).
- Runtime feature flags and config endpoint (`scripts/mock-api.mjs`, `react-ts/src/App.tsx`).
- Security headers on baseline HTML (`baseline-htmx/src/server.mjs`).
- No-store headers and CORS/preflight support in mock API (`scripts/mock-api.mjs`).
- Explicit smoke checks and production readiness checklist.

Score reduction reasons:

- Telemetry contract drift in HTMX baseline event payload shape (see issues below).
- No automated enforcement of smoke/perf/security checks in CI.

#### F) Packaging + Release Readiness (0–10): **6 / 10**

Evidence:

- Versioning and release artifacts exist and are coherent (`CHANGELOG.md`, `RELEASE_NOTES.md`, `VERSIONING.md`, `docs/release/v1-freeze-decision.md`).
- Package versions are bumped to `1.0.0` (`package.json`, `baseline-htmx/package.json`, `react-ts/package.json`).

Score reduction reasons:

- No `LICENSE` file.
- No lockfile.
- No CI release validation.
- No distribution/publish automation.

### Single biggest reason the score is not higher

**The runtime verification story is weaker than the documentation/gating story.** The repo documents strong smoke checks and release gates, but there is no CI and the local runnable path is not reproducibly pinned (no lockfile), while integration/E2E depend on local ports and installed deps.

### Highest-leverage improvement to raise the score fastest

**Add a minimal CI pipeline + lockfile that runs `verify:outputs`, unit tests, component contract test, and a deterministic integration/E2E smoke harness.** This immediately increases confidence in core functionality, DX, quality gates, and release readiness.

## 5. General Excellence Rating (1–10) + Evidence

### Rating: **8 / 10** (solid, credible project)

### Evidence

1. Strong scope restraint is visible and consistently enforced (`docs/governance/SCOPE_CONTRACT.md`, `docs/release/v1-freeze-decision.md`).
2. Canonical scenario identity is consistent across code/docs (`SCN-001` appears in scenario docs, implementations, release docs, smoke checks).
3. Async realism is unusually strong for a reference repo (`react-ts/src/App.tsx` includes retry/backoff, SWR, websocket reconnect/resync, upload progress/cancel, offline handling).
4. Baseline-vs-rich implementation contrast is intentional and useful (`baseline-htmx/src/server.mjs` vs `react-ts/src/App.tsx`).
5. Operational thinking is represented as artifacts, not hand-wavy claims (`docs/operations/smoke-checks.md`, `production-readiness-checklist.md`, `postmortem-simulation.md`).
6. Release discipline is documented with explicit freeze reasoning (`docs/release/v1-freeze-decision.md`).
7. Public-facing packaging is strong without dumbing down (`README.md`, `docs/public/*`).
8. Governance/decision-engine docs create a coherent “systems” posture beyond code samples (`docs/governance/*`, `docs/decision-engine/*`).
9. Artifact verification script enforces scenario count and identifier consistency (`scripts/verify-outputs.sh`).
10. Weaknesses are mostly verification/reproducibility (CI, lockfile, runtime tests), not lack of thought.

## 6. Priority Issues (P0–P3) (Prompt ID, Problem, Impact, Suggested Fix)

### P0

#### ISSUE-P0-01
- Priority: `P0`
- Prompt ID: `PROMPT_04_s`, `PROMPT_06_s`
- Problem: Likely React build/typecheck failure due missing Vite env typings.
- Evidence: `react-ts/src/App.tsx:52` uses `import.meta.env.VITE_API_BASE`; `react-ts/src/vite-env.d.ts` is missing; no `vite/client` types configured in `react-ts/tsconfig.json`.
- Impact: `npm run build --workspace react-ts` (a required smoke gate in `docs/operations/smoke-checks.md`) may fail in a clean environment.
- Suggested fix: Add `react-ts/src/vite-env.d.ts` with `/// <reference types="vite/client" />` (or add `types: ["vite/client"]` in tsconfig).

### P1

#### ISSUE-P1-01
- Priority: `P1`
- Prompt ID: `PROMPT_01_s`, `PROMPT_04_s`, `PROMPT_06_s`
- Problem: No lockfile for reproducible installs.
- Evidence: root inventory shows no `package-lock.json`, `pnpm-lock.yaml`, or `yarn.lock`.
- Impact: First public `v1.0.0` release cannot guarantee dependency resolution reproducibility; weakens release credibility.
- Suggested fix: Generate and commit a lockfile (`package-lock.json`) from root workspace install.

#### ISSUE-P1-02
- Priority: `P1`
- Prompt ID: `PROMPT_04_s`, `PROMPT_06_s`
- Problem: No CI workflow despite smoke checks and release gating claims.
- Evidence: no `.github/workflows`; `README.md` and `docs/operations/smoke-checks.md` define gates but no automation exists.
- Impact: Release/readiness signals are documentation-only; regressions can slip unnoticed.
- Suggested fix: Add minimal GitHub Actions workflow running `verify:outputs`, unit tests, component contract test, and artifact checks.

#### ISSUE-P1-03
- Priority: `P1`
- Prompt ID: `PROMPT_04_s`
- Problem: “Component test” and a11y test are static source scans, not runtime behavior validation.
- Evidence: `tests/component/react-contract.test.mjs` reads `react-ts/src/App.tsx` as text; `scripts/check-a11y.mjs` reads `baseline-htmx/src/server.mjs` source and checks string presence.
- Impact: High risk of false confidence on accessibility and UI behavior regressions.
- Suggested fix: Add one actual rendered component test and one runtime page-level a11y test (even a minimal DOM render + assertions).

#### ISSUE-P1-04
- Priority: `P1`
- Prompt ID: `PROMPT_01_s`, `PROMPT_04_s`
- Problem: Root `npm test` runs only unit tests, while repo messaging implies broader quality gating.
- Evidence: `package.json` `test` script is `node --test tests/unit/*.test.mjs`; other checks are separate scripts.
- Impact: Contributors may assume they ran “tests” when integration/component/E2E were skipped.
- Suggested fix: Either rename to `test:unit` and add aggregate `test:all`, or make `test` invoke unit+component at minimum.

#### ISSUE-P1-05
- Priority: `P1`
- Prompt ID: `PROMPT_06_s`
- Problem: No `LICENSE` file for a public v1.0 open-source release.
- Evidence: `LICENSE*` absent in repo root.
- Impact: Public consumption and contribution posture is ambiguous; blocks organizational adoption in many cases.
- Suggested fix: Add explicit license (e.g., MIT/Apache-2.0) and reference it in `README.md` and `RELEASE_NOTES.md`.

### P2

#### ISSUE-P2-01
- Priority: `P2`
- Prompt ID: `PROMPT_04_s`
- Problem: HTMX baseline telemetry payload shape diverges from shared analytics contract (missing top-level `step` field).
- Evidence: `baseline-htmx/src/server.mjs` `logClientEvent(eventType, details)` creates payload without `step`; shared contract lists required fields including `step` (`shared/contracts/analytics-events.contract.json`, `requiredFields`).
- Impact: Contract drift undermines “shared contract” claim and can break downstream event consumers.
- Suggested fix: Include `step` in baseline `logClientEvent` payload and align all event calls to shared contract.

#### ISSUE-P2-02
- Priority: `P2`
- Prompt ID: `PROMPT_04_s`
- Problem: `react-ts/src/App.tsx` has become a monolithic component (~979 LOC).
- Evidence: `wc -l react-ts/src/App.tsx` -> 979 lines.
- Impact: Increases change risk, review difficulty, and test granularity limitations.
- Suggested fix: Extract bounded modules by concern (quote panel hook, websocket feed hook, upload handler, telemetry utility) without changing framework/scope.

#### ISSUE-P2-03
- Priority: `P2`
- Prompt ID: `PROMPT_04_s`
- Problem: `scripts/mock-api.mjs` combines many concerns in one file (~327 LOC) with API, WS, metrics, simulation, and storage state.
- Evidence: `wc -l scripts/mock-api.mjs` -> 327 lines.
- Impact: Harder to reason about failure simulation correctness and endpoint behavior changes.
- Suggested fix: Split internal modules under `scripts/mock-api/` (handlers, realtime, fixtures) while keeping CLI entrypoint unchanged.

#### ISSUE-P2-04
- Priority: `P2`
- Prompt ID: `PROMPT_02_s`
- Problem: Decision-engine docs remain provisional after hardening artifacts now exist.
- Evidence: `docs/decision-engine/*` marked provisional; `docs/operations/smoke-checks.md` now exists and is the specified prerequisite artifact.
- Impact: Public readers may interpret mature docs as intentionally incomplete; weakens authority signal.
- Suggested fix: Add a validation note or upgrade status section based on current hardening gate existence/outcomes.

#### ISSUE-P2-05
- Priority: `P2`
- Prompt ID: `PROMPT_06_s`
- Problem: Release freeze declares v1.0 readiness, but runtime integration/E2E execution is not automated and may fail without setup.
- Evidence: `docs/release/v1-freeze-decision.md` approves v1.0; no CI; runtime checks rely on local servers and installed deps; failed local attempts here due missing `ws` install and port restrictions.
- Impact: Release confidence is documentation-first rather than evidence-first.
- Suggested fix: Add CI evidence or explicitly downgrade freeze to conditional readiness until CI baseline exists.

### P3

#### ISSUE-P3-01
- Priority: `P3`
- Prompt ID: `PROMPT_01_s` onward
- Problem: Some placeholder/empty directories remain under-documented (`react-ts/public/`, `baseline-htmx/src/templates/fragments/`).
- Evidence: directories exist but no files beyond parent docs.
- Impact: Minor ambiguity for new contributors.
- Suggested fix: Add `.gitkeep` + short READMEs in intentionally-empty extension points or remove until needed.

#### ISSUE-P3-02
- Priority: `P3`
- Prompt ID: `PROMPT_00_s`, `PROMPT_01_s`, `PROMPT_04_s`
- Problem: Scenario information is duplicated across multiple docs and JSON files.
- Evidence: `docs/canonical-scenario.md`, `docs/scenarios/canonical-scenario-spec.md`, `scenarios/SCN-001-mortgage-refinance-funnel/scenario.json`.
- Impact: Drift risk over time as scenario evolves.
- Suggested fix: Declare one source-of-truth (likely `scenarios/.../scenario.json`) and add “derived from” notices in docs.

## 7. Overengineering / Complexity Risks (Complexity vs Value)

### Complexity vs Value (Top 10 hotspots)

| Hotspot | Evidence | Risk | Value delivered | Simplification recommendation |
| --- | --- | --- | --- | --- |
| Monolithic React app component | `react-ts/src/App.tsx` (~979 LOC) | High | Centralizes behavior; easy to inspect in one file for demos | Extract by concern (hooks/utilities/components) without adding new abstractions/frameworks |
| Single-file mock backend + WS simulator | `scripts/mock-api.mjs` (~327 LOC) | Medium | Powerful failure simulation and runtime config in one place | Split internal modules while preserving `scripts/mock-api.mjs` entrypoint |
| Governance + decision-engine + release docs volume | 44 docs markdown files | Medium | Strong authority and systems signal | Add doc maps and “core vs advanced” paths; avoid new docs until automation catches up |
| Static string-based a11y check labeled as smoke | `scripts/check-a11y.mjs` | Medium | Fast zero-dependency gate | Rename to `check:a11y:static` or add runtime counterpart |
| Source-grep “component test” | `tests/component/react-contract.test.mjs` | Medium | Validates presence of critical patterns cheaply | Add one real rendered test and relabel current test as contract/source check |
| Root `test` script under-scopes quality | `package.json` `test` | Medium | Fast feedback | Rename `test` -> `test:unit`; add `test:quick` and `test:all` |
| Multiple scenario definitions/docs | `docs/canonical-scenario.md`, `docs/scenarios/canonical-scenario-spec.md`, `scenarios/*/scenario.json` | Medium | Serves different audiences (summary/spec/data) | Add explicit canonical source + sync checklist |
| Decision engine “provisional” state persists | `docs/decision-engine/*` | Low | Honest sequencing note | Add status lifecycle table; mark current validation state explicitly |
| Integration contract stubs + cross-lab docs + assumptions | `docs/integration/*` | Low | Strong portfolio positioning | Keep assumption docs but avoid adding more stubs until external repos are available |
| Empty extension directories | `react-ts/public/`, `baseline-htmx/src/templates/fragments/` | Low | Signals intended growth points | Remove or annotate empties to reduce visual noise |

## 8. Naming / Structure / Consistency Findings

### Findings (priority ordered)

#### ISSUE-NS-01
- Priority: `P0`
- Evidence: `react-ts/src/App.tsx` uses `import.meta.env` while `react-ts/src/vite-env.d.ts` is absent and tsconfig has no `vite/client` types.
- Impact: Build/typecheck likely breaks a documented release gate.
- Suggested fix: Add Vite env typings file.

#### ISSUE-NS-02
- Priority: `P1`
- Evidence: `package.json` `test` only covers unit tests; `README.md` and `docs/operations/smoke-checks.md` describe broader verification culture.
- Impact: Naming mismatch between command expectation and actual coverage.
- Suggested fix: Rename scripts for clarity (`test:unit`, `test:all`) or widen `test`.

#### ISSUE-NS-03
- Priority: `P1`
- Evidence: `tests/component/react-contract.test.mjs` is named as a component test but inspects source text, not rendered component behavior.
- Impact: Misleading test taxonomy reduces trust in coverage claims.
- Suggested fix: Rename to `react-source-contract.test.mjs` or add real component test and keep both.

#### ISSUE-NS-04
- Priority: `P2`
- Evidence: Shared analytics event contract requires `step` (`shared/contracts/analytics-events.contract.json`) but HTMX baseline logs omit top-level `step` in `baseline-htmx/src/server.mjs` `logClientEvent` payload.
- Impact: Cross-file contract inconsistency.
- Suggested fix: Align baseline event payload shape with shared contract.

#### ISSUE-NS-05
- Priority: `P2`
- Evidence: `docs/decision-engine/*` marked `provisional` while prerequisite artifact `docs/operations/smoke-checks.md` exists and v1 freeze docs exist.
- Impact: Status consistency ambiguity.
- Suggested fix: Add an explicit post-PROMPT_04 validation note or upgrade status.

#### ISSUE-NS-06
- Priority: `P2`
- Evidence: Release docs claim serious public v1.0 (`RELEASE_NOTES.md`, `docs/release/v1-freeze-decision.md`) but repo lacks `LICENSE` and CI.
- Impact: Public packaging inconsistency.
- Suggested fix: Add license and CI or soften release claims.

#### ISSUE-NS-07
- Priority: `P3`
- Evidence: Empty scaffold dirs (`react-ts/public/`, `baseline-htmx/src/templates/fragments/`) have no local annotations.
- Impact: Mild confusion on what is active vs planned.
- Suggested fix: Add `.gitkeep` + short note or remove.

#### ISSUE-NS-08
- Priority: `P3`
- Evidence: Several docs duplicate scenario content (`docs/canonical-scenario.md`, `docs/scenarios/canonical-scenario-spec.md`, `scenarios/.../scenario.json`).
- Impact: Drift risk and maintenance overhead.
- Suggested fix: Declare source-of-truth and link derivative docs.

## 9. Highest-Leverage Next Steps (Top 10) + Estimated Effort (S/M/L)

1. **Add Vite env typings (`react-ts/src/vite-env.d.ts`) and confirm `react-ts` build** — **S**
2. **Commit a root lockfile (`package-lock.json`)** — **S**
3. **Add minimal GitHub Actions CI for `verify:outputs`, unit tests, component contract, static a11y** — **M**
4. **Rename/split test scripts (`test:unit`, `test:all`) to match actual coverage** — **S**
5. **Fix HTMX telemetry payload to match `shared/contracts/analytics-events.contract.json` (`step` field)** — **S**
6. **Replace or supplement source-grep “component test” with one runtime-rendered test** — **M**
7. **Replace or supplement static a11y script with runtime DOM/page-level assertions** — **M**
8. **Add `LICENSE` and reference it in `README.md` and release docs** — **S**
9. **Refactor `react-ts/src/App.tsx` into bounded modules by concern without scope expansion** — **M**
10. **Split `scripts/mock-api.mjs` internals while keeping entrypoint stable** — **M**
