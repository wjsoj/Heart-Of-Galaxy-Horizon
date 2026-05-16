// Find English string literals in core/script/sall.js that are not present
// as keys in any locales/zh-CN/*.json file. Output is a candidate list for
// translators — not a strict "missing translation" report (many strings are
// CSS classes, attribute names, or selectors that should NOT be translated).
//
// Usage:  node scripts/find-untranslated.mjs [--min-length=4] [--limit=200]
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "acorn";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const args = Object.fromEntries(
	process.argv.slice(2).map((a) => {
		const m = /^--([^=]+)=(.+)$/.exec(a);
		return m ? [m[1], m[2]] : [a.replace(/^--/, ""), true];
	})
);
const MIN_LENGTH = Number(args["min-length"] ?? 4);
const LIMIT = Number(args["limit"] ?? 200);
const OUT = args.out ? resolve(repoRoot, String(args.out)) : null;

// 1. Load the union of all translation keys.
const localesDir = resolve(repoRoot, "locales/zh-CN");
const known = new Set();
for (const file of readdirSync(localesDir)) {
	if (!file.endsWith(".json") || file === "manifest.json") continue;
	const obj = JSON.parse(readFileSync(resolve(localesDir, file), "utf8"));
	for (const k of Object.keys(obj)) known.add(k);
}

// 2. Walk sall.js AST and collect string literals.
const src = readFileSync(resolve(repoRoot, "core/script/sall.js"), "utf8");
const ast = parse(src, { ecmaVersion: 2020, sourceType: "script" });

const found = new Map(); // string -> occurrence count

function walk(node) {
	if (!node || typeof node !== "object") return;
	if (Array.isArray(node)) {
		for (const n of node) walk(n);
		return;
	}
	if (node.type === "Literal" && typeof node.value === "string") {
		const s = node.value;
		if (looksTranslatable(s)) found.set(s, (found.get(s) ?? 0) + 1);
	}
	for (const k of Object.keys(node)) {
		if (k === "type" || k === "loc" || k === "range" || k === "start" || k === "end") continue;
		walk(node[k]);
	}
}

function looksTranslatable(s) {
	if (s.length < MIN_LENGTH) return false;
	if (!/[A-Za-z]/.test(s)) return false;
	// selectors / paths / HTML / entities
	if (/^[#./<&]/.test(s)) return false;
	if (/\.(png|jpg|jpeg|gif|svg|mp3|js|css|html)(\?|$)/i.test(s)) return false;
	// single identifier-like tokens
	if (/^[A-Za-z_][A-Za-z0-9_-]*$/.test(s) && s.length < 16) return false;
	// numeric/measurement
	if (/^\d+(\.\d+)?[A-Za-z%]{0,3}$/.test(s)) return false;
	// no whitespace + short -> likely a token
	if (!/\s/.test(s) && s.length < 12) return false;
	return true;
}

walk(ast);

// 3. Filter out anything already translated.
const candidates = [];
for (const [s, count] of found) {
	if (known.has(s)) continue;
	candidates.push({ text: s, count });
}
candidates.sort((a, b) => b.count - a.count || a.text.localeCompare(b.text));

// 4. Report.
const total = candidates.length;
const top = candidates.slice(0, LIMIT);

if (OUT) {
	writeFileSync(OUT, JSON.stringify(candidates, null, 2) + "\n", "utf8");
	console.log(`Wrote ${total} candidates to ${OUT}`);
}

console.log(`Scanned core/script/sall.js`);
console.log(`Known translation keys:  ${known.size}`);
console.log(`Untranslated candidates: ${total} (showing top ${top.length})`);
console.log("");
for (const { text, count } of top) {
	const truncated = text.length > 90 ? text.slice(0, 87) + "..." : text;
	console.log(`  [x${String(count).padStart(3)}]  ${truncated}`);
}
