// Post-build step: copy the legacy script/style/asset directories into `dist/`
// so the static index.html in `dist/index.html` (still referencing classic
// `<script src="core/script/...">` tags) can be served standalone.
//
// Once those legacy files are migrated to ES modules and imported from
// `src/main.ts`, this script can be deleted.

import { cpSync, existsSync, mkdirSync, copyFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const distDir = resolve(repoRoot, "dist");

if (!existsSync(distDir)) {
	console.error("dist/ does not exist — run `bun run build` first.");
	process.exit(1);
}

const dirs = ["core", "zh", "img", "ui", "z", "locales"];
for (const d of dirs) {
	const from = resolve(repoRoot, d);
	const to = resolve(distDir, d);
	if (!existsSync(from)) continue;
	mkdirSync(dirname(to), { recursive: true });
	cpSync(from, to, { recursive: true, force: true });
	console.log(`copied  ${d}/`);
}

const files = ["favicon.png"];
for (const f of files) {
	const from = resolve(repoRoot, f);
	if (!existsSync(from)) continue;
	copyFileSync(from, resolve(distDir, f));
	console.log(`copied  ${f}`);
}

console.log("legacy assets copied into dist/");
