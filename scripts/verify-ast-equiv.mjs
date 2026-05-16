// Verify that two JS files are AST-equivalent (formatting-invariant comparison).
//
// Usage:  node scripts/verify-ast-equiv.mjs <original.js> <formatted.js> [more pairs...]
//
// Normalizes:
//   - source locations (start/end/loc/range)
//   - string literal quote style (raw)
//   - object key form: `{"foo": x}` vs `{foo: x}` (equivalent)
//   - stray EmptyStatements (semicolons that do nothing)
//
// Used to guarantee prettier reformatting does not change program semantics.
import { readFileSync } from "node:fs";
import { parse } from "acorn";

function ast(code) {
	return parse(code, { ecmaVersion: 2020, sourceType: "script", locations: false, ranges: false });
}

const SKIP_KEYS = new Set(["start", "end", "loc", "range", "raw", "directive"]);

// Normalize object/property keys: `{"foo": x}` and `{foo: x}` are equivalent.
function normalizeKey(key) {
	if (!key || typeof key !== "object") return key;
	if (key.type === "Identifier") return { type: "Key", name: key.name };
	if (key.type === "Literal" && (typeof key.value === "string" || typeof key.value === "number")) {
		return { type: "Key", name: String(key.value) };
	}
	return key;
}

function strip(node) {
	if (Array.isArray(node)) return node.filter((n) => !(n && n.type === "EmptyStatement")).map(strip);
	if (node && typeof node === "object") {
		const out = {};
		for (const k of Object.keys(node)) {
			if (SKIP_KEYS.has(k)) continue;
			let v = node[k];
			// Normalize Property / MethodDefinition keys (only when not computed)
			if (k === "key" && node.computed === false) v = normalizeKey(v);
			out[k] = strip(v);
		}
		return out;
	}
	return node;
}

function compare(originalPath, formattedPath) {
	const a = strip(ast(readFileSync(originalPath, "utf8")));
	const b = strip(ast(readFileSync(formattedPath, "utf8")));
	const sa = JSON.stringify(a);
	const sb = JSON.stringify(b);
	if (sa === sb) {
		console.log(`OK   ${formattedPath} <=> ${originalPath} (AST identical, ${sa.length} bytes)`);
		return true;
	}
	console.error(`FAIL ${formattedPath} differs (${sa.length} vs ${sb.length})`);

	// Walk to find first divergence
	let i = 0;
	while (i < sa.length && i < sb.length && sa[i] === sb[i]) i++;
	const ctx = 200;
	console.error(`     First diff at offset ${i}:`);
	console.error(`     ORIG: ...${sa.slice(Math.max(0, i - 60), i + ctx)}`);
	console.error(`     FMT : ...${sb.slice(Math.max(0, i - 60), i + ctx)}`);
	return false;
}

const args = process.argv.slice(2);
if (args.length < 2 || args.length % 2 !== 0) {
	console.error("Usage: node scripts/verify-ast-equiv.mjs <original> <formatted> [more pairs...]");
	process.exit(2);
}
const pairs = [];
for (let i = 0; i < args.length; i += 2) pairs.push([args[i], args[i + 1]]);

let allOk = true;
for (const [o, f] of pairs) if (!compare(o, f)) allOk = false;
process.exit(allOk ? 0 : 1);
