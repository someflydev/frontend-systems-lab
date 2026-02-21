import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const assetsDir = "react-ts/dist/assets";
const maxEntryJsBytes = 230 * 1024;
const maxTotalJsBytes = 360 * 1024;

async function fileSize(filePath) {
  const buf = await readFile(filePath);
  return buf.length;
}

async function main() {
  let files = [];
  try {
    files = await readdir(assetsDir);
  } catch {
    console.log(`Perf gate skipped: build assets not found at ${assetsDir}. Run build first.`);
    process.exit(0);
  }

  const jsFiles = files.filter((f) => f.endsWith(".js"));
  if (jsFiles.length === 0) {
    console.log("Perf gate skipped: no JS assets found.");
    process.exit(0);
  }

  const sizes = [];
  for (const file of jsFiles) {
    const fullPath = path.join(assetsDir, file);
    sizes.push({ file, bytes: await fileSize(fullPath) });
  }

  sizes.sort((a, b) => b.bytes - a.bytes);

  const largest = sizes[0];
  const total = sizes.reduce((sum, item) => sum + item.bytes, 0);

  console.log(`Largest JS asset: ${largest.file} (${largest.bytes} bytes)`);
  console.log(`Total JS assets size: ${total} bytes`);

  if (largest.bytes > maxEntryJsBytes) {
    console.error(`Perf gate failed: largest JS asset exceeds ${maxEntryJsBytes} bytes.`);
    process.exit(1);
  }

  if (total > maxTotalJsBytes) {
    console.error(`Perf gate failed: total JS size exceeds ${maxTotalJsBytes} bytes.`);
    process.exit(1);
  }

  console.log("Perf gate passed.");
}

main().catch((err) => {
  console.error(`Perf gate error: ${err.message}`);
  process.exit(1);
});
