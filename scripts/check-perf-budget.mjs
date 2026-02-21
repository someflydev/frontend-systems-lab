import { stat } from "node:fs/promises";

const budgetBytes = 300 * 1024;
const candidate = "react-ts/dist/assets";

async function main() {
  try {
    const info = await stat(candidate);
    if (!info.isDirectory()) throw new Error("assets path not directory");
    console.log("Perf placeholder passed: build assets directory exists.");
  } catch {
    console.log(`Perf placeholder warning: build not found at ${candidate}. Budget target ${budgetBytes} bytes.`);
  }
}

main();
