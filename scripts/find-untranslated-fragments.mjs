// Fragment-level untranslated scanner.
//
// The runtime translator (`zh/core.js`) walks DOM **text nodes** and feeds each
// whole text node through `cnItem()`. An HTML string literal like
//   "<br>Every <span>Foundry</span> needs 2 <span>Fuel</span> but you only ..."
// is therefore split by the browser into separate text nodes — "Every ",
// "Foundry", " needs 2 ", "Fuel", " but you only ...", etc. — and EACH chunk
// must independently be a dictionary key, or it renders in English.
//
// The legacy `find-untranslated.mjs` compares whole string literals against the
// dictionary, so it cannot see these per-fragment holes. This script splits HTML
// literals into text-node fragments and replays cnItem() faithfully to report
// exactly which fragments fall through untranslated.
//
// Usage: node scripts/find-untranslated-fragments.mjs [--json]
import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "acorn";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const asJson = process.argv.includes("--json");

// ---------------------------------------------------------------------------
// 1. Load the runtime translation config from zh/core.js (object literals only,
//    extracted statically so we never execute its DOM-bound IIFE).
// ---------------------------------------------------------------------------
const coreSrc = readFileSync(resolve(repoRoot, "zh/core.js"), "utf8");
const coreAst = parse(coreSrc, { ecmaVersion: 2020, sourceType: "script" });

function literalSlice(node) {
	return coreSrc.slice(node.start, node.end);
}
const decls = {};
for (const node of coreAst.body) {
	if (node.type !== "VariableDeclaration") continue;
	for (const d of node.declarations) {
		if (!d.init) continue;
		if (["cnItems", "cnPrefix", "cnPostfix", "cnExcludeWhole", "cnExcludePostfix"].includes(d.id.name)) {
			// eslint-disable-next-line no-eval
			decls[d.id.name] = eval("(" + literalSlice(d.init) + ")");
		}
	}
}

const cnItems = decls.cnItems ?? {};
const cnPrefix = decls.cnPrefix ?? {};
const cnPostfix = decls.cnPostfix ?? {};
const cnExcludeWhole = decls.cnExcludeWhole ?? [];
const cnExcludePostfix = decls.cnExcludePostfix ?? [];

// Merge JSON locale entries (additive — legacy keys already present win, but for
// detection we only need the union of recognised keys + values).
const localesDir = resolve(repoRoot, "locales/zh-CN");
for (const file of readdirSync(localesDir)) {
	if (!file.endsWith(".json") || file === "manifest.json") continue;
	const obj = JSON.parse(readFileSync(resolve(localesDir, file), "utf8"));
	if (file === "_prefix.json") {
		Object.assign(cnPrefix, obj);
		continue;
	}
	if (file === "_postfix.json") {
		Object.assign(cnPostfix, obj);
		continue;
	}
	for (const [k, v] of Object.entries(obj)) if (!(k in cnItems)) cnItems[k] = v;
}

// ---------------------------------------------------------------------------
// 2. Faithful reimplementation of cnItem(): returns { translated: boolean }.
// ---------------------------------------------------------------------------
function cnItem(input) {
	if (!input) return { translated: true }; // empty -> nothing to translate
	let text = input;
	let hadAffix = false;
	for (const prefix in cnPrefix) {
		if (text.substr(0, prefix.length) === prefix) {
			text = text.substr(prefix.length);
			hadAffix = true;
		}
	}
	for (const postfix in cnPostfix) {
		if (postfix.length && text.substr(-postfix.length) === postfix) {
			text = text.substr(0, text.length - postfix.length);
			hadAffix = true;
		}
	}
	for (const reg of cnExcludePostfix) {
		const result = text.match(reg);
		if (result) text = text.substr(0, text.length - result[0].length);
	}
	for (const reg of cnExcludeWhole) {
		if (reg.test(text)) return { translated: true }; // excluded by design
	}
	for (const i in cnItems) {
		if (text === i || (text === cnItems[i] && cnItems[i] !== "")) return { translated: true };
	}
	// Fell through the whole-string lookup. If the affix-stripped core no longer
	// contains any English (only a dynamic-interpolation sentinel, digits, or
	// punctuation remain), then a matched prefix/postfix already translated the only
	// language-bearing part — the runtime renders e.g. "[Planet] 已被征服！". Treat
	// that as handled. A core that still carries Latin letters is a real hole.
	if (!/[A-Za-z]/.test(text)) return { translated: true };
	const stripped = text;
	return { translated: false, stripped, hadAffix };
}

// ---------------------------------------------------------------------------
// 3. Split an HTML literal into text-node fragments the way the DOM would.
// ---------------------------------------------------------------------------
const ENTITIES = { "&nbsp;": " ", "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" };
function decodeEntities(s) {
	return s.replace(/&[a-z]+;|&#\d+;/gi, (m) => ENTITIES[m] ?? m);
}
function htmlToTextFragments(html) {
	// Drop <script>/<style> bodies, then split on any tag.
	const noScript = html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, "");
	return noScript
		.split(/<[^>]*>/)
		.map(decodeEntities)
		.filter((s) => s.length > 0);
}

// Only fragments containing a Latin letter are translation candidates.
// Reject JS-code noise: a handful of `desc` fields concatenate a runtime
// variable into the middle of an eval'd code string, so AST literal extraction
// yields half-code chunks like `" construction"; if (this.level `. Real rendered
// text never contains these tokens.
const CODE_NOISE = /(\bstr\s*\+?=|\breturn\s+str\b|\bvar\s+str\b|this\.level|Math\.|\bif\s*\(|=\\?"|\\";|\+\\?")/;
function isCandidate(frag) {
	if (!/[A-Za-z]/.test(frag)) return false;
	if (CODE_NOISE.test(frag)) return false;
	return true;
}

// ---------------------------------------------------------------------------
// 4. Collect HTML-bearing string literals from the source files.
// ---------------------------------------------------------------------------
const SOURCES = ["core/script/cfg.js", "core/script/sall.js"];
const holes = new Map(); // fragment -> { count, files:Set }

for (const rel of SOURCES) {
	const src = readFileSync(resolve(repoRoot, rel), "utf8");
	const ast = parse(src, { ecmaVersion: 2020, sourceType: "script" });
	const literals = [];

	// Runtime concatenations like `"<img src='" + UI_FOLDER + "/t.png'/> click"`
	// produce a SINGLE DOM string at runtime, so we must fold the `+` chain into
	// one string before splitting on tags — otherwise the path/attr leaks into the
	// text fragment. Unknown (non-string) operands collapse to a sentinel that
	// lives harmlessly inside a tag or is stripped from the final fragment.
	const SENTINEL = "";
	const isStr = (n) =>
		(n.type === "Literal" && typeof n.value === "string") ||
		n.type === "TemplateLiteral" ||
		(n.type === "BinaryExpression" && n.operator === "+" && (isStr(n.left) || isStr(n.right)));
	function fold(n) {
		if (n.type === "Literal" && typeof n.value === "string") return n.value;
		if (n.type === "TemplateLiteral") return n.quasis.map((q) => q.value.cooked ?? "").join(SENTINEL);
		if (n.type === "BinaryExpression" && n.operator === "+") return fold(n.left) + fold(n.right);
		return SENTINEL; // identifier / call / member / number — unknown at scan time
	}

	(function walk(node, parent) {
		if (!node || typeof node !== "object") return;
		if (Array.isArray(node)) return node.forEach((n) => walk(n, parent));
		// Fold a whole string-concatenation expression once, at its top, and don't
		// descend into the operands (they're already captured by the fold).
		const parentIsConcat = parent && parent.type === "BinaryExpression" && parent.operator === "+";
		if (!parentIsConcat && isStr(node)) {
			literals.push(fold(node));
			return;
		}
		for (const k of Object.keys(node)) {
			if (["type", "loc", "range", "start", "end"].includes(k)) continue;
			walk(node[k], node);
		}
	})(ast, null);

	// Some `desc` fields store JS *source* that is eval'd at runtime to build HTML
	// (`var str=""; if (this.level<=7) str+="<br>...HTML..."; return str;`). The
	// code scaffolding is never rendered — only the inner string literals are. So
	// when a literal looks like that, re-parse it as JS and expand it into its own
	// inner string literals before splitting into text fragments.
	function expandCodeStrings(lit) {
		if (!/\b(str\s*\+?=|return\s+str|this\.level|var\s+str)\b/.test(lit)) return [lit];
		try {
			const inner = parse(lit, { ecmaVersion: 2020, sourceType: "script" });
			const out = [];
			(function w(n) {
				if (!n || typeof n !== "object") return;
				if (Array.isArray(n)) return n.forEach(w);
				if (n.type === "Literal" && typeof n.value === "string") out.push(n.value);
				for (const k of Object.keys(n)) {
					if (["type", "loc", "range", "start", "end"].includes(k)) continue;
					w(n[k]);
				}
			})(inner);
			return out.length ? out : [lit];
		} catch {
			return [lit]; // not parseable as JS — treat verbatim
		}
	}

	const expanded = literals.flatMap(expandCodeStrings);
	for (const lit of expanded) {
		if (!/<[a-z!/]/i.test(lit)) continue; // only literals that contain HTML markup
		for (const frag of htmlToTextFragments(lit)) {
			if (!isCandidate(frag)) continue;
			const verdict = cnItem(frag);
			if (verdict.translated) continue;
			const entry = holes.get(frag) ?? { count: 0, files: new Set() };
			entry.count++;
			entry.files.add(rel);
			holes.set(frag, entry);
		}
	}
}

// ---------------------------------------------------------------------------
// 5. Report.
// ---------------------------------------------------------------------------
const sorted = [...holes.entries()].sort((a, b) => a[0].localeCompare(b[0]));
if (asJson) {
	// Emit only "clean" static fragments (no dynamic-interpolation sentinel). These
	// are directly fixable by adding one dictionary key each. Sentinel fragments
	// ("") are dynamic-glue cases handled via prefix/postfix rules instead.
	const out = {};
	for (const [frag] of sorted) {
		if (frag.includes("")) continue;
		out[frag] = "";
	}
	process.stdout.write(JSON.stringify(out, null, 2) + "\n");
} else {
	console.log(`Untranslated text-node fragments: ${sorted.length}\n`);
	for (const [frag, info] of sorted) {
		console.log(`  ${JSON.stringify(frag)}  (x${info.count}, ${[...info.files].map((f) => f.split("/").pop()).join(",")})`);
	}
}
