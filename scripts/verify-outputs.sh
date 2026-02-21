#!/usr/bin/env bash
set -euo pipefail

required_dirs=(docs scenarios shared baseline-htmx tests scripts)
for d in "${required_dirs[@]}"; do
  [[ -d "$d" ]] || { echo "missing dir: $d"; exit 1; }
  [[ -f "$d/README.md" ]] || { echo "missing README in: $d"; exit 1; }
done

[[ -f "DESIGN_DECISIONS.md" ]] || { echo "missing DESIGN_DECISIONS.md"; exit 1; }

required_docs=(
  "docs/scenarios/canonical-scenario-spec.md"
  "docs/operations/production-readiness-checklist.md"
  "docs/operations/postmortem-simulation.md"
  "docs/operations/smoke-checks.md"
)
for f in "${required_docs[@]}"; do
  [[ -f "$f" ]] || { echo "missing required doc: $f"; exit 1; }
done

react_exists=0
elm_exists=0
[[ -d "react-ts" ]] && react_exists=1
[[ -d "elm" ]] && elm_exists=1

if [[ "$react_exists" -eq 1 && "$elm_exists" -eq 1 ]]; then
  echo "invalid: both react-ts and elm exist"
  exit 1
fi
if [[ "$react_exists" -eq 0 && "$elm_exists" -eq 0 ]]; then
  echo "invalid: neither react-ts nor elm exists"
  exit 1
fi

if [[ "$react_exists" -eq 1 ]]; then
  [[ -f "react-ts/README.md" ]] || { echo "missing README in react-ts"; exit 1; }
fi
if [[ "$elm_exists" -eq 1 ]]; then
  [[ -f "elm/README.md" ]] || { echo "missing README in elm"; exit 1; }
fi

[[ -f "scenarios/SCN-001-mortgage-refinance-funnel/scenario.json" ]] || { echo "missing canonical scenario file"; exit 1; }

scenario_dir_count=$(find scenarios -mindepth 1 -maxdepth 1 -type d | wc -l | tr -d ' ')
if [[ "$scenario_dir_count" -ne 1 ]]; then
  echo "invalid: expected exactly one scenario directory, found $scenario_dir_count"
  exit 1
fi

if ! rg -q "SCN-001" docs/canonical-scenario.md docs/scenarios/canonical-scenario-spec.md baseline-htmx/src/server.mjs react-ts/src/App.tsx; then
  echo "SCN-001 reference consistency check failed"
  exit 1
fi

if ! rg -q "PASS|FAIL|Pass criteria|Fail criteria" docs/operations/smoke-checks.md; then
  echo "smoke checks missing explicit pass/fail criteria"
  exit 1
fi

echo "output verification passed"
