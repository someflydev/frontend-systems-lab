# Section 6 - Packaging, Shipping, and Assets

## Core Deployment System

### Bundling and splitting

- What it is: route/feature split output with minification and tree-shaking.
- Why it matters: lower startup cost and scalable updates.
- How it fails: monolithic bundles and blocking third-party scripts.
- How we test it: bundle budget CI checks and startup profiling.

### Hashing and cache busting

- What it is: immutable hashed asset names.
- Why it matters: safe long TTL with deterministic invalidation.
- How it fails: stale JS/CSS after deployment.
- How we test it: cache policy integration tests and forced version rollout.

### CDN policy and purge strategy

- What it is: HTML short TTL, static immutable long TTL, targeted purge tags.
- Why it matters: high cache hit ratio without stale correctness issues.
- How it fails: broad purges causing origin overload or stale legal copy.
- How we test it: cache hit metrics and purge rehearsal.

### Image pipeline

- What it is: generated variants by width and format (`avif`, `webp`, `jpeg`), `srcset` and lazy loading.
- Why it matters: largest practical impact on LCP.
- How it fails: oversized originals served to mobile.
- How we test it: per-breakpoint image byte assertions and visual diff.

### Font strategy

- What it is: subset fonts, preload critical faces, swap display behavior.
- Why it matters: stable rendering and reduced blocking time.
- How it fails: FOIT and oversized font payload.
- How we test it: render timing and font transfer budget checks.

### Security baseline

- What it is: CSP, output escaping, CSRF defenses, safe auth token handling.
- Why it matters: protects core trust and data integrity.
- How it fails: XSS vectors and token leakage.
- How we test it: security header tests and static checks.

### Environment strategy

- What it is: build-time public config plus runtime mutable config endpoint.
- Why it matters: deployment flexibility without rebuild churn.
- How it fails: environment drift and accidental secret exposure.
- How we test it: env parity checks and config contract tests.

## Stack Tooling Notes

- React/Svelte/Vue: Vite-first pipelines; SSR only when justified.
- Elm: elm optimize builds integrated with host asset pipeline.
- Flutter Web: web build profiling early for payload/perf guardrails.
- HTMX: minimal JS stack with strong server template and cache discipline.

## Where gRPC Fits (and does not)

- Realistic fit: internal typed APIs with existing gateway support.
- Poor fit: SEO-heavy public pages and simple browser forms where REST is simpler.
- Rule: use gRPC-web only when contract guarantees and existing infra justify added complexity.

## WebSocket Deployment Notes

1. Auth refresh and handshake policy.
2. Heartbeat and idle timeout tuning.
3. Reconnect backoff with jitter.
4. Replay endpoint for missed data recovery.
5. Shared broker strategy for horizontal scaling.
