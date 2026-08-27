import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const kitDir = join(repoRoot, "packages", "ctrl-ui");
const tarballPath = join(kitDir, "ctrlds-0.0.0.tgz");
const proofDir = mkdtempSync(join(tmpdir(), "ctrlds-pack-"));

try {
  execFileSync("pnpm", ["pack"], { cwd: kitDir, stdio: "inherit" });
  writeFileSync(
    join(proofDir, "package.json"),
    `${JSON.stringify({ name: "ctrlds-pack-proof", private: true, type: "module" })}\n`,
  );
  execFileSync("pnpm", ["add", tarballPath], { cwd: proofDir, stdio: "inherit" });

  const require = createRequire(join(proofDir, "package.json"));
  const cssPath = require.resolve("ctrlds/variables.css");
  const css = readFileSync(cssPath, "utf8");

  if (!css.includes(":root, [data-scheme='light']") || !css.includes("--color-action:")) {
    throw new Error("packed ctrlds/variables.css is missing the token contract");
  }
} finally {
  rmSync(proofDir, { recursive: true, force: true });
  rmSync(tarballPath, { force: true });
}
