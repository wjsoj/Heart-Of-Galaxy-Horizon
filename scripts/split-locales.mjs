// Split `zh/core.js`'s `cnItems` dictionary into per-section JSON files
// under `locales/zh-CN/`. The section is identified by the most recent
// single-line comment preceding each entry inside the object literal.
//
// Usage:  node scripts/split-locales.mjs
//
// After running:
//   - Each section becomes `locales/zh-CN/<section>.json`
//   - The runtime `zh/core.js` is NOT modified — JSON is currently a
//     human-editable mirror. A future loader (Phase 4.1) will read these
//     JSON files and populate `cnItems` at startup.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "acorn";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const src = readFileSync(resolve(repoRoot, "zh/core.js"), "utf8");

// Map of section comment (in Chinese, from "//" line comments inside cnItems)
// to a slug used as the output filename.
const sectionSlugs = {
	设置: "settings",
	教程: "tutorial",
	飞船: "ships",
	贸易市场: "market",
	"资源：": "resources",
	资源: "resources",
	建筑: "buildings",
	科技: "research",
	星球: "planets",
};

const comments = [];
const ast = parse(src, {
	ecmaVersion: 2020,
	sourceType: "script",
	locations: false,
	ranges: true,
	onComment(block, text, start, end) {
		if (!block) comments.push({ text: text.trim(), start, end });
	},
});

// Find `var cnItems = { ... };`
let cnItemsObject = null;
for (const node of ast.body) {
	if (node.type !== "VariableDeclaration") continue;
	for (const d of node.declarations) {
		if (d.id.type === "Identifier" && d.id.name === "cnItems" && d.init && d.init.type === "ObjectExpression") {
			cnItemsObject = d.init;
			break;
		}
	}
	if (cnItemsObject) break;
}
if (!cnItemsObject) throw new Error("Could not find `var cnItems = {...}` in zh/core.js");

function commentBefore(pos) {
	// Find the latest comment ending before `pos`, but only within the object.
	let best = null;
	for (const c of comments) {
		if (c.end <= pos && c.start >= cnItemsObject.start) {
			if (!best || c.end > best.end) best = c;
		}
	}
	return best;
}

const sections = new Map(); // slug -> { sectionName, entries: Map<key,value> }
let unsectioned = 0;
let totalEntries = 0;

for (const prop of cnItemsObject.properties) {
	if (prop.type !== "Property") continue;
	let key;
	if (prop.key.type === "Identifier") key = prop.key.name;
	else if (prop.key.type === "Literal") key = String(prop.key.value);
	else continue;

	// Skip the `_OTHER_: []` runtime bucket — it's not a translation entry.
	if (key === "_OTHER_") continue;

	let value;
	if (prop.value.type === "Literal" && typeof prop.value.value === "string") {
		value = prop.value.value;
	} else if (prop.value.type === "ArrayExpression") {
		// Not expected for cnItems; bail loud rather than silently lose data.
		throw new Error(`Unexpected ArrayExpression value for key ${key}`);
	} else {
		throw new Error(`Unexpected value type ${prop.value.type} for key ${key}`);
	}

	const c = commentBefore(prop.start);
	const sectionName = c ? c.text : "misc";
	const slug = sectionSlugs[sectionName] || "misc";

	if (!sections.has(slug)) sections.set(slug, { sectionName, entries: {} });
	const bucket = sections.get(slug);
	if (Object.prototype.hasOwnProperty.call(bucket.entries, key)) {
		// Two definitions of the same key under the same section — keep the
		// later one (matches JS object literal semantics).
	}
	bucket.entries[key] = value;
	totalEntries++;
	if (slug === "misc") unsectioned++;
}

const outDir = resolve(repoRoot, "locales/zh-CN");
mkdirSync(outDir, { recursive: true });

const summary = [];
for (const [slug, { sectionName, entries }] of sections) {
	const path = resolve(outDir, `${slug}.json`);
	writeFileSync(path, JSON.stringify(entries, null, 2) + "\n", "utf8");
	summary.push({ slug, sectionName, count: Object.keys(entries).length });
}

// Write a manifest describing all locale files and their canonical load order
// (matches the original order of sections in zh/core.js).
const manifest = {
	locale: "zh-CN",
	sections: summary.map(({ slug, sectionName, count }) => ({
		file: `${slug}.json`,
		section: sectionName,
		count,
	})),
	totalEntries,
};
writeFileSync(resolve(outDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");

console.log(`Wrote ${summary.length} section files + manifest to locales/zh-CN/`);
console.log(`Total entries: ${totalEntries}${unsectioned ? ` (${unsectioned} fell into "misc")` : ""}`);
for (const s of summary) console.log(`  ${s.slug.padEnd(12)} ${String(s.count).padStart(4)}  (${s.sectionName})`);
