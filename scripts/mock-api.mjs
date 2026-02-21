import http from "node:http";
import crypto from "node:crypto";
import { validateLead, hasErrors } from "../shared/validation/leadValidation.mjs";

const port = Number(process.env.MOCK_API_PORT || 4010);

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
  });
}

function send(res, status, payload) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(payload));
}

const server = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url?.startsWith("/api/leads/submit")) {
    const url = new URL(req.url, `http://localhost:${port}`);
    const latencyMs = Number(url.searchParams.get("latencyMs") || 0);
    const fail = url.searchParams.get("fail");

    if (latencyMs > 0) {
      await new Promise((r) => setTimeout(r, latencyMs));
    }

    if (fail === "timeout") {
      return;
    }
    if (fail === "server") {
      return send(res, 500, { error: "simulated_server_error" });
    }

    try {
      const payload = await readJson(req);
      const errors = validateLead(payload);
      if (fail === "validation" || hasErrors(errors)) {
        return send(res, 422, { error: "validation_failed", errors });
      }
      return send(res, 200, {
        trackingId: `trk_${crypto.randomBytes(4).toString("hex")}`,
        acceptedAt: new Date().toISOString()
      });
    } catch {
      return send(res, 400, { error: "invalid_json" });
    }
  }

  if (req.method === "GET" && req.url === "/health") {
    return send(res, 200, { ok: true });
  }

  send(res, 404, { error: "not_found" });
});

server.listen(port, () => {
  console.log(`[mock-api] listening on http://localhost:${port}`);
});
