import { readFileSync } from "node:fs";
import { parse } from "acorn";

// Load all known JSON locale keys
const known = new Set();
for (const f of ["settings", "tutorial", "ships", "market", "resources", "buildings", "research", "planets", "ui"]) {
	try {
		const d = JSON.parse(readFileSync(`locales/zh-CN/${f}.json`, "utf8"));
		for (const k of Object.keys(d)) known.add(k);
	} catch {}
}
for (const f of ["_prefix", "_postfix"]) {
	const d = JSON.parse(readFileSync(`locales/zh-CN/${f}.json`, "utf8"));
	for (const k of Object.keys(d)) known.add(k);
}

const ast = parse(readFileSync("core/script/sall.js", "utf8"), { ecmaVersion: 2020 });
const counts = new Map();
const ctxs = new Map();

function walk(node, ctx) {
	if (!node || typeof node !== "object") return;
	if (Array.isArray(node)) return node.forEach((n) => walk(n, ctx));
	// Detect "drawToast" / "draw" / "drawInfo" calls; their first arg is HTML
	let nextCtx = ctx;
	if (node.type === "CallExpression" && node.callee?.type === "MemberExpression") {
		const name = node.callee.property?.name;
		if (/^draw(Info|Toast)?$/.test(name)) nextCtx = "popup/toast";
	}
	if (node.type === "Literal" && typeof node.value === "string") {
		const s = node.value;
		// Heuristic: looks like user-facing English
		if (s.length >= 4 && s.length <= 240 && /[A-Z][a-z]/.test(s) && /\s/.test(s)) {
			// strip HTML tags & inline html attrs for matching with key style
			const stripped = s.replace(/<[^>]+>/g, "").trim();
			if (stripped.length >= 4 && /^[A-Z]/.test(stripped) && /\s/.test(stripped)) {
				// skip if known
				if (known.has(stripped) || known.has(s)) return;
				// skip CSS-like, ids, etc
				if (/^[a-z]+:|^position:|^width:|^margin|^padding|^font-|^background/.test(s)) return;
				if (
					/__|<\/?(div|span|img|br|p|ul|li|a|input|select|option|td|tr|table)\b/.test(s) &&
					stripped.length < 6
				)
					return;
				counts.set(stripped, (counts.get(stripped) ?? 0) + 1);
				if (!ctxs.has(stripped)) ctxs.set(stripped, ctx);
			}
		}
	}
	for (const k of Object.keys(node)) {
		if (["type", "loc", "range", "start", "end"].includes(k)) continue;
		walk(node[k], nextCtx);
	}
}
walk(ast, "?");
const arr = [...counts.entries()].sort((a, b) => b[1] - a[1]);
console.log("# candidates:", arr.length);
for (const [s, c] of arr.slice(0, 100)) {
	console.log(`[x${String(c).padStart(3)}] (${ctxs.get(s)}) ${JSON.stringify(s.slice(0, 110))}`);
}
