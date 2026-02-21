import http from "node:http";
import crypto from "node:crypto";
import { WebSocketServer } from "ws";
import { validateLead, hasErrors } from "../shared/validation/leadValidation.mjs";

const port = Number(process.env.MOCK_API_PORT || 4010);
const release = process.env.RELEASE_SHA || "local-dev";

const submissionsByIdempotencyKey = new Map();
const clientEvents = [];

const advisors = [
  { id: "adv-001", name: "Jordan Lee", availableSlots: 3 },
  { id: "adv-002", name: "Alex Ramirez", availableSlots: 5 },
  { id: "adv-003", name: "Samir Patel", availableSlots: 2 }
];

let advisorSeq = 0;
const advisorHistory = [];

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function parseRequestUrl(req) {
  return new URL(req.url || "/", `http://localhost:${port}`);
}

function parseLatency(url) {
  const queryLatency = Number(url.searchParams.get("latencyMs") || 0);
  const profile = process.env.MOCK_LATENCY_PROFILE || "normal";
  if (Number.isFinite(queryLatency) && queryLatency > 0) return queryLatency;

  if (profile === "slow") return randomInt(2000, 3500);
  if (profile === "jitter") return randomInt(150, 1800);
  return randomInt(80, 500);
}

function shouldFail(url, endpointTag) {
  const requested = url.searchParams.get("fail");
  const envFail = process.env.MOCK_FAIL_MODE;
  if (!requested && !envFail) return "";
  const failMode = requested || envFail;
  if (failMode === "all") return "server";
  if (failMode === endpointTag || failMode === "server" || failMode === "timeout" || failMode === "validation") return failMode;
  return "";
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function send(res, status, payload) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    "referrer-policy": "no-referrer",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type,x-scenario-id"
  });
  res.end(JSON.stringify(payload));
}

function sendText(res, status, text) {
  res.writeHead(status, {
    "content-type": "text/plain; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    "referrer-policy": "no-referrer",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type,x-scenario-id"
  });
  res.end(text);
}

function readRaw(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function readJson(req) {
  const raw = await readRaw(req);
  if (!raw.length) return {};
  return JSON.parse(raw.toString("utf8"));
}

function computeQuote(params) {
  const homeValue = Number(params.get("homeValue") || 0);
  const currentBalance = Number(params.get("currentBalance") || 0);
  const creditRange = params.get("creditRange") || "";

  const ltv = homeValue > 0 ? currentBalance / homeValue : 1;
  const creditAdjust = {
    "760+": -0.35,
    "720-759": -0.1,
    "680-719": 0.2,
    "below-680": 0.65
  }[creditRange] ?? 0.7;

  const baseRate = 6.1;
  const ltvAdjust = ltv > 0.8 ? 0.55 : ltv > 0.65 ? 0.25 : 0.05;
  const estimatedRate = Number((baseRate + ltvAdjust + creditAdjust).toFixed(2));

  const monthlyRate = estimatedRate / 100 / 12;
  const termMonths = 360;
  const numerator = monthlyRate * currentBalance;
  const denominator = 1 - (1 + monthlyRate) ** -termMonths;
  const monthlyPayment = denominator > 0 ? Math.round(numerator / denominator) : 0;

  return {
    estimatedRate,
    monthlyPayment,
    refreshedAt: new Date().toISOString()
  };
}

function pushAdvisorEvent() {
  advisorSeq += 1;

  const idx = randomInt(0, advisors.length - 1);
  const delta = randomInt(-1, 2);
  advisors[idx].availableSlots = clamp(advisors[idx].availableSlots + delta, 0, 8);

  const payload = {
    type: "availability",
    seq: advisorSeq,
    advisors: advisors.map((a) => ({ ...a }))
  };

  advisorHistory.push(payload);
  if (advisorHistory.length > 300) {
    advisorHistory.shift();
  }

  return payload;
}

const server = http.createServer(async (req, res) => {
  const url = parseRequestUrl(req);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "content-type,x-scenario-id"
    });
    res.end();
    return;
  }

  if (req.method === "GET" && url.pathname === "/health") {
    return send(res, 200, { ok: true, release });
  }

  if (req.method === "GET" && url.pathname === "/api/runtime-config") {
    return send(res, 200, {
      release,
      featureFlags: {
        uploads: process.env.FLAG_UPLOADS !== "false",
        advisorFeed: process.env.FLAG_ADVISOR_FEED !== "false"
      }
    });
  }

  if (req.method === "POST" && url.pathname === "/api/client-events") {
    try {
      const payload = await readJson(req);
      clientEvents.push(payload);
      if (clientEvents.length > 500) clientEvents.shift();
      return send(res, 202, { accepted: true });
    } catch {
      return send(res, 400, { error: "invalid_json" });
    }
  }

  if (req.method === "GET" && url.pathname === "/api/panels/rate-quote") {
    const latencyMs = parseLatency(url);
    const fail = shouldFail(url, "quote");
    await sleep(latencyMs);

    if (fail === "timeout") return;
    if (fail === "server") return send(res, 503, { error: "quote_service_unavailable" });

    return send(res, 200, computeQuote(url.searchParams));
  }

  if (req.method === "GET" && url.pathname === "/api/advisor-availability/resync") {
    const after = Number(url.searchParams.get("after") || 0);
    const event = advisorHistory.find((item) => item.seq > after);
    if (event) {
      return send(res, 200, { seq: event.seq, advisors: event.advisors });
    }
    return send(res, 200, { seq: advisorSeq, advisors });
  }

  if (req.method === "POST" && url.pathname === "/api/uploads") {
    const latencyMs = parseLatency(url);
    const fail = shouldFail(url, "upload");
    const bytes = await readRaw(req);

    await sleep(latencyMs);

    if (fail === "timeout") return;
    if (fail === "server") return send(res, 503, { error: "upload_service_unavailable" });

    return send(res, 200, {
      fileId: `file_${crypto.randomBytes(5).toString("hex")}`,
      bytes: bytes.length,
      uploadedAt: new Date().toISOString()
    });
  }

  if (req.method === "POST" && url.pathname === "/api/leads/submit") {
    const latencyMs = parseLatency(url);
    const fail = shouldFail(url, "submit");
    await sleep(latencyMs);

    if (fail === "timeout") return;
    if (fail === "server") return send(res, 503, { error: "lead_service_unavailable" });

    try {
      const payload = await readJson(req);
      const errors = validateLead(payload);
      if (fail === "validation" || hasErrors(errors)) {
        return send(res, 422, { error: "validation_failed", errors });
      }

      const existing = submissionsByIdempotencyKey.get(payload.idempotencyKey);
      if (existing) {
        return send(res, 200, {
          trackingId: existing.trackingId,
          acceptedAt: existing.acceptedAt,
          deduplicated: true
        });
      }

      const record = {
        trackingId: `trk_${crypto.randomBytes(4).toString("hex")}`,
        acceptedAt: new Date().toISOString()
      };
      submissionsByIdempotencyKey.set(payload.idempotencyKey, record);

      return send(res, 200, {
        trackingId: record.trackingId,
        acceptedAt: record.acceptedAt,
        deduplicated: false
      });
    } catch {
      return send(res, 400, { error: "invalid_json" });
    }
  }

  if (req.method === "GET" && url.pathname === "/metrics") {
    return sendText(
      res,
      200,
      [
        `mock_api_client_events_total ${clientEvents.length}`,
        `mock_api_idempotent_records_total ${submissionsByIdempotencyKey.size}`,
        `mock_api_advisor_seq ${advisorSeq}`
      ].join("\n")
    );
  }

  return send(res, 404, { error: "not_found" });
});

const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (ws) => {
  ws.send(JSON.stringify({ type: "snapshot", seq: advisorSeq, advisors }));
});

server.on("upgrade", (req, socket, head) => {
  const url = parseRequestUrl(req);
  if (url.pathname !== "/ws/advisor-availability") {
    socket.destroy();
    return;
  }
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
});

setInterval(() => {
  const event = pushAdvisorEvent();
  const payload = JSON.stringify(event);

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });

  if (advisorSeq % 8 === 0) {
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.close(1012, "service_restart_simulation");
      }
    });
  }
}, 3000);

setInterval(() => {
  const heartbeat = JSON.stringify({ type: "heartbeat", ts: Date.now() });
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(heartbeat);
    }
  });
}, 10000);

server.listen(port, () => {
  console.log(`[mock-api] listening on http://localhost:${port}`);
});
