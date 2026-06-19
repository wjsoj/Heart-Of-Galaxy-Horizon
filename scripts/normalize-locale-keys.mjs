// Normalize locale dictionary keys to the form the runtime actually looks up, and
// drop cross-file duplicate keys.
//
// The runtime translator `cnItem()` (zh/core.js) strips affixes from a text node
// BEFORE matching the dictionary, then re-attaches the *translated* affixes:
//
//     output = prefixTrans + cnItems[strippedKey] + regExclude + postfixTrans
//
// So a dictionary entry whose key still carries those affixes (e.g. `" and enough "`)
// NEVER matches — the lookup uses `"and enough"`. Prior translation passes added many
// such affix-padded keys, so they silently did nothing. This script rewrites every
// `locales/<locale>/*.json` entry to its stripped lookup key (adjusting the value so
// the rendered string is unchanged), leaves affix-pathological entries untouched, and
// removes keys that duplicate one already owned by an earlier file in manifest order
// (the loader merges all files into one dict, so duplicates are dead weight). The
// transform is idempotent.
//
// Usage: node scripts/normalize-locale-keys.mjs [--locale=zh-CN] [--check]
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadAffixConfig, normalizeEntry } from "./lib/affix.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const args = Object.fromEntries(
	process.argv.slice(2).map((a) => {
		const m = /^--([^=]+)=(.+)$/.exec(a);
		return m ? [m[1], m[2]] : [a.replace(/^--/, ""), true];
	})
);
const locale = String(args.locale ?? "zh-CN");
const checkOnly = Boolean(args.check);
const localesDir = resolve(repoRoot, "locales", locale);
const cfg = loadAffixConfig(repoRoot, localesDir);

// Process files in manifest order so duplicate ownership is deterministic.
const SKIP = new Set(["manifest.json", "_prefix.json", "_postfix.json"]);
let fileOrder;
try {
	const manifest = JSON.parse(readFileSync(join(localesDir, "manifest.json"), "utf8"));
	fileOrder = manifest.sections.map((s) => s.file).filter((f) => !SKIP.has(f));
} catch {
	fileOrder = readdirSync(localesDir).filter((f) => f.endsWith(".json") && !SKIP.has(f));
}
// Include any on-disk files the manifest forgot, appended after the known ones.
for (const f of readdirSync(localesDir)) {
	if (f.endsWith(".json") && !SKIP.has(f) && !fileOrder.includes(f)) fileOrder.push(f);
}

const seen = new Map(); // key -> owning file
let totalRekeyed = 0;
let totalDeduped = 0;
const collisions = [];
const skipped = [];

for (const file of fileOrder) {
	const fp = join(localesDir, file);
	let obj;
	try {
		obj = JSON.parse(readFileSync(fp, "utf8"));
	} catch {
		continue;
	}
	const out = {};
	let rekeyed = 0;
	let deduped = 0;
	for (const [rawKey, value] of Object.entries(obj)) {
		const r = normalizeEntry(rawKey, value, cfg);
		// Affix-pathological: keep the original entry untouched (won't round-trip).
		const key = r.ok ? r.key : rawKey;
		const val = r.ok ? r.value : value;
		if (!r.ok && r.changed) skipped.push({ file, rawKey });
		// Cross-file de-duplication: an earlier file already owns this key.
		if (seen.has(key) && seen.get(key) !== file) {
			deduped++;
			continue;
		}
		if (key in out && out[key] !== val) collisions.push({ file, key, kept: out[key], dropped: val });
		if (!(key in out)) {
			out[key] = val;
			seen.set(key, file);
		}
		if (r.ok && r.changed && key !== rawKey) rekeyed++;
	}
	totalRekeyed += rekeyed;
	totalDeduped += deduped;
	if (rekeyed || deduped) {
		const bits = [];
		if (rekeyed) bits.push(`re-keyed ${rekeyed}`);
		if (deduped) bits.push(`deduped ${deduped}`);
		console.log(`${file}: ${bits.join(", ")} (${Object.keys(out).length} total)`);
	}
	if (!checkOnly) writeFileSync(fp, JSON.stringify(out, null, 2) + "\n");
}

console.log(`\nTotal: re-keyed ${totalRekeyed}, deduped ${totalDeduped}${checkOnly ? " (check only, no writes)" : ""}`);
if (skipped.length) {
	console.log(`\n${skipped.length} affix-pathological entr${skipped.length === 1 ? "y" : "ies"} left untouched (won't round-trip cleanly):`);
	for (const s of skipped.slice(0, 40)) console.log(`  [${s.file}] ${JSON.stringify(s.rawKey)}`);
}
if (collisions.length) {
	console.log(`\n⚠ ${collisions.length} in-file key collision(s) — kept first:`);
	for (const c of collisions.slice(0, 30)) {
		console.log(`  [${c.file}] ${JSON.stringify(c.key)}: kept ${JSON.stringify(c.kept)} / dropped ${JSON.stringify(c.dropped)}`);
	}
}
