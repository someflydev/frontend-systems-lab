#!/usr/bin/env bash
set -euo pipefail

required_dirs=(docs scenarios shared baseline-htmx tests scripts)
for d in "${required_dirs[@]}"; do
  [[ -d "$d" ]] || { echo "missing dir: $d"; exit 1; }
  [[ -f "$d/README.md" ]] || { echo "missing README in: $d"; exit 1; }
done

[[ -f "DESIGN_DECISIONS.md" ]] || { echo "missing DESIGN_DECISIONS.md"; exit 1; }

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

if ! rg -q "SCN-001" docs/canonical-scenario.md baseline-htmx/src/server.mjs react-ts/src/App.tsx; then
  echo "SCN-001 reference consistency check failed"
  exit 1
fi

echo "output verification passed"
