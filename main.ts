// China in Figures — the entry program.
//
// Copies app/ and screenshots/ from this repository into the output
// directory and writes /output/dossier.json with buildDossier from
// vendor/makefun-frontend.ts. Node 22, standard library only, no network.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR || "/output");

if (outDir === "/" || outDir === repoRoot) {
  throw new Error("refusing to use " + outDir + " as the output directory");
}

function copyTree(name) {
  const from = join(repoRoot, name);
  if (!existsSync(from)) throw new Error("missing " + name + "/ in the repository");
  cpSync(from, join(outDir, name), { recursive: true });
}

// Clear the output directory's contents without ever deleting the
// directory itself: in the grader /output is a mounted volume, and
// removing the mount point fails. Delete each child individually.
mkdirSync(outDir, { recursive: true });
for (const entry of readdirSync(outDir)) {
  rmSync(join(outDir, entry), { recursive: true, force: true });
}

copyTree("app");
copyTree("screenshots");

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outDir, "dossier.json"), dossier);
console.log("wrote " + join(outDir, "dossier.json") + " (" + dossier.length + " bytes)");
