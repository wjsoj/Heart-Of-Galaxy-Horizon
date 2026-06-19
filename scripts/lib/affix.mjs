// Shared affix model for the i18n dictionary.
//
// The runtime translator `cnItem()` (zh/core.js) strips affixes from a text node
// before matching the dictionary and re-attaches the *translated* affixes around
// the looked-up value:
//
//     output = prefixTrans + cnItems[strippedKey] + regExclude + postfixTrans
//
// Both the key-normalization script and the locale smoke test need an identical,
// faithful model of that stripping, so it lives here.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "acorn";

/** Load cnPrefix/cnPostfix/cnExcludePostfix from zh/core.js, merging locale JSON affix files. */
export function loadAffixConfig(repoRoot, localesDir) {
	const coreSrc = readFileSync(join(repoRoot, "zh/core.js"), "utf8");
	const ast = parse(coreSrc, { ecmaVersion: 2020, sourceType: "script" });
	const D = {};
	for (const n of ast.body) {
		if (n.type !== "VariableDeclaration") continue;
		for (const d of n.declarations) {
			if (d.init && ["cnPrefix", "cnPostfix", "cnExcludePostfix"].includes(d.id.name)) {
				// Data-only object/array literals from a trusted in-repo source; eval avoids
				// re-implementing a JS literal parser and never runs the file's DOM IIFE.
				// eslint-disable-next-line no-eval
				D[d.id.name] = eval("(" + coreSrc.slice(d.init.start, d.init.end) + ")");
			}
		}
	}
	const cnPrefix = { ...D.cnPrefix };
	const cnPostfix = { ...D.cnPostfix };
	const cnExcludePostfix = D.cnExcludePostfix ?? [];
	if (localesDir) {
		try {
			Object.assign(cnPrefix, JSON.parse(readFileSync(join(localesDir, "_prefix.json"), "utf8")));
		} catch {
			/* none */
		}
		try {
			Object.assign(cnPostfix, JSON.parse(readFileSync(join(localesDir, "_postfix.json"), "utf8")));
		} catch {
			/* none */
		}
	}
	return { cnPrefix, cnPostfix, cnExcludePostfix };
}

/** Replica of cnItem's affix stripping (prefix/postfix use last-match-wins overwrite). */
export function analyze(text, { cnPrefix, cnPostfix, cnExcludePostfix }) {
	let prefixTrans = "";
	let postfixTrans = "";
	const preKeys = [];
	const postKeys = [];
	for (const p in cnPrefix) {
		if (p.length && text.substr(0, p.length) === p) {
			prefixTrans = cnPrefix[p];
			preKeys.push(p);
			text = text.substr(p.length);
		}
	}
	for (const p in cnPostfix) {
		if (p.length && text.substr(-p.length) === p) {
			postfixTrans = cnPostfix[p];
			postKeys.push(p);
			text = text.substr(0, text.length - p.length);
		}
	}
	let regExclude = "";
	for (const r of cnExcludePostfix) {
		const m = text.match(r);
		if (m) {
			regExclude = m[0] + regExclude;
			text = text.substr(0, text.length - m[0].length);
		}
	}
	return { key: text, prefixTrans, postfixTrans, regExclude, preKeys, postKeys };
}

// Width-tolerant punctuation normalization (full-width CJK ↔ half-width ASCII) plus
// whitespace removal — for comparing renders up to cosmetic punctuation/spacing.
const FW2HW = { "（": "(", "）": ")", "：": ":", "，": ",", "。": ".", "！": "!", "？": "?", "；": ";", "　": " " };
export const norm = (s) => String(s).replace(/[（）：，。！？；　]/g, (c) => FW2HW[c]).replace(/\s+/g, "");

/**
 * Peel the affix punctuation a key's affixes represent off the translator's value
 * (width-tolerant), so the runtime re-attaches them cleanly. Inverts the render
 * order `prefix + core + regExclude + postfix`.
 */
export function deriveCore(value, info, cfg) {
	const { preKeys, postKeys, regExclude } = info;
	let v = String(value).trim();
	const hasPre = (set) => preKeys.some((k) => set.includes(k.trim()));
	const hasPost = (set) => postKeys.some((k) => set.includes(k.trim()));
	if (hasPost([")"])) v = v.replace(/[)）]+$/, "");
	if (hasPost(["%"])) v = v.replace(/[%％]+\s*$/, "");
	if (hasPost([":", "："])) v = v.replace(/[:：\s]+$/, "");
	v = v.trim();
	if (regExclude) {
		const re = new RegExp(regExclude.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*$");
		if (re.test(v)) v = v.replace(re, "");
	}
	v = v.trim();
	if (hasPre(["(", "(-", "(+"])) v = v.replace(/^[(（]+\s*/, "");
	for (const pk of preKeys) {
		const t = (cfg.cnPrefix[pk] ?? "").trim();
		if (t && /[一-鿿]/.test(t) && v.startsWith(t)) v = v.slice(t.length).trim();
	}
	return v.trim();
}

/**
 * Compute the normalized (runtime-lookup) key + core value for a raw dictionary
 * entry, plus whether the rewrite round-trips cleanly. Pathological entries (e.g.
 * multiple postfix matches mangling "Time (0.3): ") return ok:false and should be
 * left untouched.
 */
export function normalizeEntry(rawKey, value, cfg) {
	const info = analyze(rawKey, cfg);
	if (!info.key || info.key === rawKey || typeof value !== "string") {
		return { ok: info.key === rawKey, key: rawKey, value, changed: false };
	}
	const core = deriveCore(value, info, cfg);
	const reassembled = info.prefixTrans + core + info.regExclude + info.postfixTrans;
	// The new key must reproduce the value through one affix pass (round-trip) AND be
	// a fixed point of stripping. The runtime strips affixes exactly once, so a key
	// that is itself still strippable (e.g. "Use %  " with extra trailing spaces, or
	// a residual paren/colon) is "messy": re-running would over-strip it and it would
	// no longer match what the runtime looks up. Leave such entries untouched.
	const roundTrips = norm(reassembled) === norm(value);
	const fixedPoint = analyze(info.key, cfg).key === info.key;
	return { ok: roundTrips && fixedPoint, key: info.key, value: core, changed: true };
}
