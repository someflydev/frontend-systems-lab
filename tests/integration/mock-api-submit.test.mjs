import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { setTimeout as wait } from "node:timers/promises";

let proc;

async function readFixture() {
  const raw = await readFile("shared/fixtures/lead.valid.json", "utf8");
  return JSON.parse(raw);
}

test.before(async () => {
  proc = spawn(process.execPath, ["scripts/mock-api.mjs"], {
    env: { ...process.env, MOCK_API_PORT: "4011" },
    stdio: "ignore"
  });
  await wait(500);
});

test.after(() => {
  if (proc) proc.kill();
});

test("mock api accepts valid lead", async () => {
  const valid = await readFixture();
  const res = await fetch("http://localhost:4011/api/leads/submit", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(valid)
  });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(Boolean(json.trackingId), true);
});
