# Stage-2 Prompt Manifest (Post-Flight Remediation + Excellence Push)

## Stage-2 Goals

Raise `frontend-systems-lab` from the post-flight audit baseline toward:

- Completeness: `76 -> 90+`
- General excellence: `8 -> 8.5/9`

Without changing scope:

- Keep exactly one canonical scenario (`SCN-001`)
- Keep exactly two implementations (`baseline-htmx`, `react-ts`)
- No new frameworks, scenarios, or abstraction layers

## Stage-2 Inputs (from `POST_FLIGHT_REPORT.md`)

- P0: React/Vite env typings gap likely breaks build (`react-ts/src/vite-env.d.ts` missing)
- P1: No lockfile
- P1: No CI workflow
- P1: `npm test` under-scopes actual quality expectations
- P1: “component test” and a11y check are static source scans
- P1: Missing `LICENSE`
- Highest-leverage improvement: minimal CI + lockfile + deterministic smoke harness

## Definition of Done for Stage-2 (DoD-S2)

All items should be verifiable by command output or file evidence.

- [ ] `react-ts/src/vite-env.d.ts` exists and `npm run build --workspace react-ts` exits `0`
- [ ] Root `package-lock.json` exists and `npm ci` exits `0`
- [ ] Root scripts include honest test naming (`test:unit`, `test:quick`, and/or explicit `test` semantics)
- [ ] Deterministic smoke harness exists (`scripts/smoke-stack.mjs`) and exits `0` on happy path
- [ ] `.github/workflows/ci.yml` exists and runs at least `npm ci`, `verify:outputs`, `test:unit`, `test:component`, `check:a11y`
- [ ] At least one runtime-rendered component test exists and runs under `node --test`
- [ ] `check:a11y` validates runtime-generated output (not only source text), or explicitly aggregates static+runtime checks
- [ ] HTMX baseline telemetry includes top-level `step` and contract check automation exists (`check:contracts`)
- [ ] `LICENSE` exists and is referenced in public/release docs
- [ ] `npm run verify:outputs` still passes and scenario count remains exactly one

## Planned Prompt Sequence (and Why)

1. `PROMPT_08.txt` — Capstone wiring + deterministic smoke harness
   - Fixes the P0 build-risk item and establishes reproducible local/CI execution.

2. `PROMPT_09.txt` — Minimal CI baseline
   - Converts documented gates into automated evidence using the Stage-2A wiring.

3. `PROMPT_10.txt` — Runtime validation upgrade
   - Replaces misleading source-grep checks with minimal real runtime checks.

4. `PROMPT_11.txt` — Contract integrity + telemetry alignment
   - Closes known drift and adds lightweight automation for shared-contract credibility.

5. `PROMPT_12.txt` — Release hygiene + status alignment
   - Closes legal/docs/status gaps after core verification improvements land.

## Stop Condition (Mandatory)

If any prompt fails its stated acceptance criteria:

1. Stop the Stage-2 sequence.
2. Record:
   - command run
   - exact failure output
   - files touched
   - rollback or follow-up plan
3. Do **not** continue to later prompts until the failed prompt is corrected or explicitly deferred by a new prompt.

## Overengineering Control (Stage-2 Wide)

- Prefer minimal viable patches over refactors.
- No new frameworks, no new scenarios, no frontend marketing/site work.
- No generalized orchestration/testing/platform layers unless a direct acceptance criterion is otherwise impossible.
- If a prompt requires a new dependency, justify it in the diff summary and keep it minimal.

