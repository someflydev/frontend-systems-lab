# frontend-lab CLI Scaffold (Provisional)

Status: `provisional` until PROMPT_04 hardening gate is confirmed via `docs/operations/smoke-checks.md`.

## Command

```bash
frontend-lab decide scenario.json
```

## Purpose

Turn a scenario constraint file into a ranked framework recommendation with traceable tradeoffs.

## Expected Inputs

- `scenario.json` conforming to `schemas/scenario.schema.json`

## Expected Output Shape

```json
{
  "scenario_id": "SCN-001",
  "confidence": 0.86,
  "ranked_frameworks": [
    {
      "framework": "React + TS",
      "score": 0.82,
      "reasons": ["strong async handling", "mature testing ecosystem"],
      "risk_warnings": ["higher cognitive load"]
    }
  ],
  "tradeoff_summary": [
    "Top candidate has better realtime ergonomics but higher deployment complexity"
  ],
  "migration_notes": [
    "Keep API/event contracts stable if moving from winner to runner-up"
  ]
}
```

## Minimal Folder Structure

```text
tools/frontend-lab/
  README.md
```

## Future Extension Ideas

1. `frontend-lab validate scenario.json` for schema and completeness checks.
2. Penalty-rule profiles by domain (`marketing`, `regulated`, `realtime`).
3. Decision history snapshots for trend analysis.
4. CI mode to fail when architecture choice and constraints diverge.
