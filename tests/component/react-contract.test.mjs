import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("react app includes accessibility and resilience contract markers", async () => {
  const source = await readFile("react-ts/src/App.tsx", "utf8");

  assert.equal(source.includes("role=\"status\""), true, "missing live status region");
  assert.equal(source.includes("role=\"alert\""), true, "missing alert region");
  assert.equal(source.includes("aria-invalid"), true, "missing field-level aria-invalid usage");
  assert.equal(source.includes("MAX_SUBMIT_ATTEMPTS"), true, "missing bounded retry configuration");
  assert.equal(source.includes("/ws/advisor-availability"), true, "missing websocket feed integration");
});
