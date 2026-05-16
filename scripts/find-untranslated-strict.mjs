// Stricter version of find-untranslated.mjs: emits only strings that are very
// likely player-facing English prose (skip selectors, internal IDs, CSS, etc).
import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "acorn";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const knownKeys = new Set();
const knownValues = new Set();
for (const file of readdirSync(resolve(repoRoot, "locales/zh-CN"))) {
	if (!file.endsWith(".json") || file === "manifest.json") continue;
	const data = JSON.parse(readFileSync(resolve(repoRoot, "locales/zh-CN", file), "utf8"));
	for (const [k, v] of Object.entries(data)) {
		knownKeys.add(k);
		knownValues.add(v);
	}
}

const ast = parse(readFileSync(resolve(repoRoot, "core/script/sall.js"), "utf8"), {
	ecmaVersion: 2020,
	sourceType: "script",
});

const counts = new Map();
function walk(node) {
	if (!node || typeof node !== "object") return;
	if (Array.isArray(node)) return node.forEach(walk);
	if (node.type === "Literal" && typeof node.value === "string") {
		const s = node.value;
		if (likelyPlayerFacing(s)) counts.set(s, (counts.get(s) ?? 0) + 1);
	}
	for (const k of Object.keys(node)) {
		if (["type", "loc", "range", "start", "end"].includes(k)) continue;
		walk(node[k]);
	}
}

function likelyPlayerFacing(s) {
	if (s.length < 3 || s.length > 200) return false;
	if (!/[A-Za-z]/.test(s)) return false;
	if (knownKeys.has(s) || knownValues.has(s)) return false;
	// HTML / CSS / attribute fragments
	if (/<\/?[a-z]|class\s*=|style\s*=|src\s*=|id\s*=|href\s*=/i.test(s)) return false;
	if (/&[a-z]+;|&#\d+;/.test(s)) return false;
	if (/[<>{}]/.test(s)) return false;
	// Selector or path-like or property names
	if (/^[#./]/.test(s)) return false;
	if (/^[a-z][a-zA-Z0-9_]*$/.test(s) && s.length < 25) return false; // identifier
	if (/^[A-Z][a-zA-Z0-9_-]*$/.test(s) && s.length < 25 && !/\s/.test(s)) return false;
	if (/_text|_button|_list|_icon|_info|_content|_container|_interface|_menu|_check|_input|_select|_field|_image|_mini|_overlay|_dropdown|_canvas/i.test(s)) return false;
	if (/^(action_|edit_|empire_|planet_|total_|auto_|allshipres|advanced|engnotation|civis_|building|engineering|favori|notation|nameClass|profile|rename|test|wipe|shipyard|market|export|import|popup|topbar|downbar|loading)/i.test(s)) return false;
	if (/\.(png|jpg|jpeg|gif|svg|mp3|js|css|html|otf|ttf)(\?|$)/i.test(s)) return false;
	if (/\b\d+px\b|background-color|position\s*:|font-size|deg\)|transform:|absolute;|relative;/.test(s)) return false;
	if (/^https?:|^www\./i.test(s)) return false;
	// alphabet / character sets / token strings
	if (/^[A-Za-z0-9+/=$-]{20,}$/.test(s)) return false;
	if (/abcdef|ABCDEF|^bcdfghj|^alpha\s+beta\s+gamma|^ba bu bi/i.test(s)) return false;
	// must have at least one space OR be 5+ chars with multiple words feel
	const letters = (s.match(/[A-Za-z]/g) || []).length;
	if (letters < s.length * 0.5) return false;
	return true;
}

walk(ast);

const candidates = [...counts.entries()].map(([text, count]) => ({ text, count })).sort((a, b) => b.count - a.count);
console.log(`# Strict candidates: ${candidates.length}`);
for (const { text, count } of candidates) {
	const t = text.length > 120 ? text.slice(0, 117) + "..." : text;
	console.log(`[x${String(count).padStart(3)}] ${JSON.stringify(t)}`);
}
