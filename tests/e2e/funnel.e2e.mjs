import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";

async function run() {
  const mock = spawn(process.execPath, ["scripts/mock-api.mjs"], {
    env: { ...process.env, MOCK_API_PORT: "4012" },
    stdio: "ignore"
  });

  const htmx = spawn(process.execPath, ["baseline-htmx/src/server.mjs"], {
    env: { ...process.env, HTMX_PORT: "3011", HTMX_API_BASE: "http://localhost:4012" },
    stdio: "ignore"
  });

  try {
    await wait(500);
    const res = await fetch("http://localhost:3011/");
    const html = await res.text();
    if (!html.includes("SCN-001") || !html.includes("Mortgage Refinance Check")) {
      throw new Error("E2E smoke failed: landing page did not render expected markers");
    }
    console.log("E2E smoke passed");
  } finally {
    htmx.kill();
    mock.kill();
  }
}

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
