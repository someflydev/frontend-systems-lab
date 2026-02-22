# Prompt Manifest

This manifest records the prompt sequence used/planned for `frontend-systems-lab`.

## Stage 0/1 (Executed; archival prompts present)

| Prompt ID | File | Status | Role | Notes |
| --- | --- | --- | --- | --- |
| `PROMPT_00_s` | `.prompts/PROMPT_00_s.txt` | Executed | Strategy / blueprint | Foundation architecture + platform blueprint |
| `PROMPT_01_s` | `.prompts/PROMPT_01_s.txt` | Executed | Initial repo scaffold | Canonical scenario + baseline HTMX + React TS |
| `PROMPT_02_s` | `.prompts/PROMPT_02_s.txt` | Executed | Decision engine docs | Provisional until hardening validation |
| `PROMPT_03_s` | `.prompts/PROMPT_03_s.txt` | Executed | Governance / anti-overengineering | Scope contract + complexity gates |
| `PROMPT_04_s` | `.prompts/PROMPT_04_s.txt` | Executed | Production-grade hardening pass | SCN-001 realism + ops docs + smoke checks |
| `PROMPT_05_s` | `.prompts/PROMPT_05_s.txt` | Executed | Public authority extraction | README/public docs/integration assumptions |
| `PROMPT_06_s` | `.prompts/PROMPT_06_s.txt` | Executed | v1.0 freeze + release docs | Release boundary + freeze decision |
| `PROMPT_07_s` | `.prompts/PROMPT_07_s.txt` | Executed | Cross-lab integration scenario docs | Vertical-slice integration design (docs-only) |

## Stage 2 (Planned remediation + excellence push)

| Prompt ID | File | Status | Depends On | Primary targets |
| --- | --- | --- | --- | --- |
| `PROMPT_08` | `.prompts/PROMPT_08.txt` | Planned | `PROMPT_07_s`, `POST_FLIGHT_REPORT.md` | P0 build fix, lockfile, honest test scripts, deterministic smoke harness |
| `PROMPT_09` | `.prompts/PROMPT_09.txt` | Planned | `PROMPT_08` (preferred), can run standalone | Minimal CI automation for existing gates |
| `PROMPT_10` | `.prompts/PROMPT_10.txt` | Planned | `PROMPT_08` (preferred) | Runtime component + runtime a11y validation |
| `PROMPT_11` | `.prompts/PROMPT_11.txt` | Planned | `PROMPT_08`; `PROMPT_09` optional | Telemetry contract drift fix + contract automation |
| `PROMPT_12` | `.prompts/PROMPT_12.txt` | Planned | `PROMPT_09`..`PROMPT_11` preferred | License + release/docs/status alignment |

## Sequencing Rule

Run Stage-2 prompts in numeric order unless a prompt explicitly fails acceptance criteria. If a prompt fails, stop and remediate before continuing.

