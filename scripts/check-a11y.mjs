import { readFile } from "node:fs/promises";

async function main() {
  const source = await readFile("baseline-htmx/src/server.mjs", "utf8");

  const checks = [
    { name: "has main landmark", ok: source.includes("<main>") },
    { name: "has form labels", ok: source.includes("<label") },
    { name: "has viewport meta", ok: source.includes("name=\"viewport\"") },
    { name: "has page heading", ok: source.includes("<h1>") }
  ];

  const failed = checks.filter((c) => !c.ok);
  if (failed.length) {
    throw new Error(`A11y static check failed: ${failed.map((f) => f.name).join(", ")}`);
  }

  console.log("A11y static check passed");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
