# Postmortem Simulation

Incident ID: `INC-SCN001-2026-02-21-WS-GAP`

Scenario ID: `SCN-001`  
Scenario Name: `Mortgage Refinance Lead Funnel`

## Incident Summary

At 10:14 UTC, advisor availability panel began showing stale slot counts after websocket reconnect events. Funnel submission still worked, but advisor panel trust indicators became incorrect.

## Root Cause

1. websocket service restarted and dropped clients.
2. client reconnected successfully but accepted first post-reconnect event without sequence-gap validation.
3. one missed event caused local advisor state drift.

## User Impact

1. Applicants saw outdated advisor slot counts for up to 7 minutes.
2. Some users selected callback timing based on stale availability assumptions.
3. Core lead submission path remained functional.

## Detection

1. spike in `async_failure` events with `panel=advisor_feed`.
2. mismatch between `/api/advisor-availability/resync` sequence and client reported sequence in telemetry.

## Immediate Fix

1. enforce monotonic sequence check on websocket events.
2. trigger explicit resync when incoming sequence exceeds `lastSeq + 1`.
3. show reconnect/resync status in UI.

## Preventative Improvements

1. add smoke check asserting resync behavior after forced disconnect.
2. add metric alert: advisor sequence gap count > 0 for 3 minutes.
3. keep panel isolation so stale advisor state cannot block funnel submission.

## Recovery Validation

Pass criteria:

1. forced websocket disconnect recovers advisor state within 10 seconds.
2. no sequence gap telemetry after fix under normal load simulation.
3. submit conversion path unaffected during reconnect cycle.
