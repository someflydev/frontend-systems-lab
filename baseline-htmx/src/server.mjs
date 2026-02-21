import http from "node:http";
import crypto from "node:crypto";
import { validateContact, validateLoan, validateConsent } from "../../shared/validation/leadValidation.mjs";

const PORT = Number(process.env.HTMX_PORT || 3001);
const API_BASE = process.env.HTMX_API_BASE || "http://localhost:4010";
const SCENARIO_ID = "SCN-001";
const SCENARIO_VERSION = "1.0.0";

const page = (body) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SCN-001 Refinance Funnel (HTMX Baseline)</title>
  <script src="https://unpkg.com/htmx.org@1.9.12"></script>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; padding: 1.5rem; background: #f8fafc; color: #0f172a; }
    main { max-width: 760px; margin: 0 auto; background: white; border-radius: 12px; padding: 1.25rem; box-shadow: 0 8px 30px rgba(15,23,42,.08); }
    label { display: block; margin-top: .75rem; font-weight: 600; }
    input, select { width: 100%; padding: .6rem; margin-top: .35rem; border: 1px solid #cbd5e1; border-radius: 8px; }
    .actions { margin-top: 1rem; display: flex; gap: .5rem; flex-wrap: wrap; }
    button { padding: .65rem .9rem; border-radius: 8px; border: 1px solid #0f172a; background: #0f172a; color: #fff; cursor: pointer; }
    button.secondary { background: #fff; color: #0f172a; }
    .error { color: #b91c1c; font-size: .9rem; margin-top: .2rem; }
    .banner { padding: .75rem; border-radius: 8px; background: #fef2f2; color: #991b1b; margin-bottom: .75rem; }
    .summary { border: 1px solid #ef4444; background: #fff1f2; border-radius: 8px; padding: .75rem; margin-bottom: .75rem; }
    .meta { color: #475569; font-size: .9rem; }
  </style>
</head>
<body>
  <main>
    <h1>Mortgage Refinance Check</h1>
    <p class="meta">Scenario: ${SCENARIO_ID} v${SCENARIO_VERSION}</p>
    <div id="funnel-root">${body}</div>
  </main>
</body>
</html>`;

function esc(value = "") {
  return String(value).replace(/[&<>\"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function collectErrorSummary(errors = {}) {
  const items = Object.values(errors).map((msg) => `<li>${esc(msg)}</li>`).join("");
  if (!items) return "";
  return `<div class="summary" role="alert"><strong>Fix the following:</strong><ul>${items}</ul></div>`;
}

function errorLine(errors, key) {
  return errors[key] ? `<div class="error" role="alert">${esc(errors[key])}</div>` : "";
}

function contactStep(values = {}, errors = {}) {
  return `${collectErrorSummary(errors)}
  <form method="post" action="/steps/contact" hx-post="/steps/contact" hx-target="#funnel-root" hx-swap="innerHTML">
    <label for="fullName">Full Name</label>
    <input id="fullName" name="fullName" autocomplete="name" value="${esc(values.fullName)}" required />
    ${errorLine(errors, "fullName")}

    <label for="email">Email</label>
    <input id="email" name="email" type="email" autocomplete="email" value="${esc(values.email)}" required />
    ${errorLine(errors, "email")}

    <label for="phone">Phone (10 digits)</label>
    <input id="phone" name="phone" inputmode="numeric" value="${esc(values.phone)}" required />
    ${errorLine(errors, "phone")}

    <label for="zip">ZIP</label>
    <input id="zip" name="zip" inputmode="numeric" value="${esc(values.zip)}" required />
    ${errorLine(errors, "zip")}

    <div class="actions"><button type="submit">Continue</button></div>
  </form>`;
}

function loanStep(contact, values = {}, errors = {}) {
  return `${collectErrorSummary(errors)}
  <form method="post" action="/steps/loan" hx-post="/steps/loan" hx-target="#funnel-root" hx-swap="innerHTML">
    <input type="hidden" name="fullName" value="${esc(contact.fullName)}" />
    <input type="hidden" name="email" value="${esc(contact.email)}" />
    <input type="hidden" name="phone" value="${esc(contact.phone)}" />
    <input type="hidden" name="zip" value="${esc(contact.zip)}" />

    <label for="homeValue">Estimated Home Value</label>
    <input id="homeValue" name="homeValue" type="number" value="${esc(values.homeValue)}" required />
    ${errorLine(errors, "homeValue")}

    <label for="currentBalance">Current Loan Balance</label>
    <input id="currentBalance" name="currentBalance" type="number" value="${esc(values.currentBalance)}" required />
    ${errorLine(errors, "currentBalance")}

    <label for="creditRange">Credit Range</label>
    <select id="creditRange" name="creditRange" required>
      <option value="">Select one</option>
      <option value="760+" ${values.creditRange === "760+" ? "selected" : ""}>760+</option>
      <option value="720-759" ${values.creditRange === "720-759" ? "selected" : ""}>720-759</option>
      <option value="680-719" ${values.creditRange === "680-719" ? "selected" : ""}>680-719</option>
      <option value="below-680" ${values.creditRange === "below-680" ? "selected" : ""}>Below 680</option>
    </select>
    ${errorLine(errors, "creditRange")}

    <div class="actions">
      <button class="secondary" type="button" onclick="window.location.href='/';">Back</button>
      <button type="submit">Continue</button>
    </div>
  </form>`;
}

function consentStep(payload, errors = {}, banner = "") {
  const idempotencyKey = payload.idempotencyKey || crypto.randomUUID();
  return `${banner ? `<div class="banner">${esc(banner)}</div>` : ""}
  ${collectErrorSummary(errors)}
  <form method="post" action="/submit" hx-post="/submit" hx-target="#funnel-root" hx-swap="innerHTML">
    <input type="hidden" name="idempotencyKey" value="${esc(idempotencyKey)}" />
    <input type="hidden" name="fullName" value="${esc(payload.contact.fullName)}" />
    <input type="hidden" name="email" value="${esc(payload.contact.email)}" />
    <input type="hidden" name="phone" value="${esc(payload.contact.phone)}" />
    <input type="hidden" name="zip" value="${esc(payload.contact.zip)}" />
    <input type="hidden" name="homeValue" value="${esc(payload.loan.homeValue)}" />
    <input type="hidden" name="currentBalance" value="${esc(payload.loan.currentBalance)}" />
    <input type="hidden" name="creditRange" value="${esc(payload.loan.creditRange)}" />

    <p>Review complete. We use this data only for refinance eligibility.</p>
    <label for="agreed"><input id="agreed" type="checkbox" name="agreed" value="yes" ${payload.consent?.agreed ? "checked" : ""}/> I agree to be contacted.</label>
    ${errorLine(errors, "agreed")}

    <div class="actions">
      <button class="secondary" type="button" onclick="history.back()">Back</button>
      <button type="submit">Submit</button>
    </div>
  </form>`;
}

function successView(trackingId, deduplicated) {
  return `<section>
    <h2>Thanks, you're in.</h2>
    <p>Your request was received. Tracking ID: <strong>${esc(trackingId)}</strong></p>
    ${deduplicated ? '<p class="meta">Existing submission was reused via idempotency key.</p>' : ""}
  </section>`;
}

function sendHtml(res, status, html) {
  res.writeHead(status, { "content-type": "text/html; charset=utf-8" });
  res.end(html);
}

function readBody(req) {
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      resolve(raw);
    });
  });
}

function parseForm(raw) {
  const params = new URLSearchParams(raw);
  return Object.fromEntries(params.entries());
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetriableStatus(status) {
  return status === 408 || status === 429 || status >= 500;
}

async function postLeadWithRetry(payload) {
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    try {
      const res = await fetch(`${API_BASE}/api/leads/submit`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      if (res.ok) {
        const json = await res.json();
        return { ok: true, json };
      }
      if (!isRetriableStatus(res.status)) {
        return { ok: false, reason: `http_${res.status}` };
      }
    } catch {
      // Retry on network or timeout.
    } finally {
      clearTimeout(timeout);
    }

    if (attempt < maxAttempts) {
      await wait(Math.min(350 * 2 ** (attempt - 1), 2000));
    }
  }
  return { ok: false, reason: "retry_exhausted" };
}

function logClientEvent(eventType, details = {}) {
  const payload = {
    scenarioId: SCENARIO_ID,
    scenarioVersion: SCENARIO_VERSION,
    eventType,
    timestamp: new Date().toISOString(),
    details
  };

  fetch(`${API_BASE}/api/client-events`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  }).catch(() => {
    // Non-blocking log path.
  });
}

async function handleRequest(req, res) {
  const { method, url } = req;

  if (method === "GET" && url === "/") {
    logClientEvent("funnel_view", { step: 1, implementation: "baseline-htmx" });
    return sendHtml(res, 200, page(contactStep()));
  }

  if (method === "GET" && url === "/steps/contact") {
    return sendHtml(res, 200, contactStep());
  }

  if (method === "POST" && url === "/steps/contact") {
    const form = parseForm(await readBody(req));
    const contact = {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      zip: form.zip
    };
    const errors = validateContact(contact);
    if (Object.keys(errors).length) {
      logClientEvent("validation_failed", { step: 1, fields: Object.keys(errors) });
      return sendHtml(res, 422, contactStep(contact, errors));
    }
    logClientEvent("step_advanced", { toStep: 2 });
    return sendHtml(res, 200, loanStep(contact));
  }

  if (method === "POST" && url === "/steps/loan") {
    const form = parseForm(await readBody(req));
    const contact = {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      zip: form.zip
    };
    const loan = {
      homeValue: form.homeValue,
      currentBalance: form.currentBalance,
      creditRange: form.creditRange
    };
    const errors = validateLoan(loan);
    if (Object.keys(errors).length) {
      logClientEvent("validation_failed", { step: 2, fields: Object.keys(errors) });
      return sendHtml(res, 422, loanStep(contact, loan, errors));
    }
    logClientEvent("step_advanced", { toStep: 3 });
    return sendHtml(
      res,
      200,
      consentStep({ contact, loan, consent: { agreed: false }, idempotencyKey: crypto.randomUUID() })
    );
  }

  if (method === "POST" && url === "/submit") {
    const form = parseForm(await readBody(req));
    const payload = {
      scenarioId: SCENARIO_ID,
      scenarioVersion: SCENARIO_VERSION,
      idempotencyKey: form.idempotencyKey || crypto.randomUUID(),
      contact: {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        zip: form.zip
      },
      loan: {
        homeValue: Number(form.homeValue),
        currentBalance: Number(form.currentBalance),
        creditRange: form.creditRange
      },
      consent: {
        agreed: form.agreed === "yes",
        timestamp: new Date().toISOString()
      }
    };

    const consentErrors = validateConsent(payload.consent);
    if (Object.keys(consentErrors).length) {
      logClientEvent("validation_failed", { step: 3, fields: Object.keys(consentErrors) });
      return sendHtml(res, 422, consentStep(payload, consentErrors));
    }

    const submission = await postLeadWithRetry(payload);
    if (!submission.ok) {
      logClientEvent("async_failure", { step: 3, reason: submission.reason });
      return sendHtml(
        res,
        502,
        consentStep(payload, {}, "Submission failed after retries. Please review and try again.")
      );
    }

    logClientEvent("lead_submitted", { step: 3, trackingId: submission.json.trackingId });
    return sendHtml(res, 200, successView(submission.json.trackingId, submission.json.deduplicated));
  }

  sendHtml(res, 404, "Not found");
}

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch(() => {
    sendHtml(res, 500, "Internal error");
  });
});

server.listen(PORT, () => {
  console.log(`[baseline-htmx] listening on http://localhost:${PORT}`);
});
