// @vitest-environment jsdom
/**
 * Smoke test for the JSON locale layer.
 *
 * Every entry in legacy `cnItems` (zh/core.js) must be COVERED by the merged
 * `locales/zh-CN/*.json` dictionary. "Covered" accounts for key normalization:
 * `scripts/normalize-locale-keys.mjs` rewrites affix-padded keys (e.g.
 * `" and enough "`) to the stripped form the runtime actually looks up
 * (`"and enough"`), adjusting the value so the rendered string is unchanged.
 * So for each legacy entry we apply the SAME normalization and assert the merged
 * JSON contains the resulting key with a render-equal value. Affix-pathological
 * legacy entries (which normalization deliberately leaves untouched) are matched
 * verbatim.
 *
 * `_prefix.json` / `_postfix.json` augment `cnPrefix` / `cnPostfix`, not
 * `cnItems`, and are excluded. Guards against accidental drift while permitting
 * new translations and the documented key normalization.
 */
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import vm from "node:vm";
import { loadAffixConfig, normalizeEntry, norm } from "../../scripts/lib/affix.mjs";

const repoRoot = resolve(__dirname, "../..");
const localesDir = resolve(repoRoot, "locales/zh-CN");
const cfg = loadAffixConfig(repoRoot, localesDir);

function loadCnItems(): Record<string, unknown> {
	const src = readFileSync(resolve(repoRoot, "zh/core.js"), "utf8");
	vm.runInThisContext(src, { filename: "zh/core.js" });
	return (globalThis as any).cnItems;
}

function loadMergedLocales(): Record<string, string> {
	const files = readdirSync(localesDir).filter(
		(f) => f.endsWith(".json") && f !== "manifest.json" && !f.startsWith("_")
	);
	const merged: Record<string, string> = {};
	for (const file of files) {
		const data = JSON.parse(readFileSync(join(localesDir, file), "utf8"));
		for (const [k, v] of Object.entries(data)) if (!(k in merged)) merged[k] = v as string;
	}
	return merged;
}

describe("locales/zh-CN/*.json covers legacy zh/core.js cnItems", () => {
	it("every legacy cnItems entry is covered (after key normalization) with a render-equal value", () => {
		const cn = loadCnItems();
		const merged = loadMergedLocales();
		const missing: Array<[string, string]> = []; // [normalizedKey, legacyKey]
		const mismatched: Array<[string, string, string]> = []; // [key, expected, got]
		for (const [k, v] of Object.entries(cn)) {
			if (k === "_OTHER_" || typeof v !== "string") continue;
			const r = normalizeEntry(k, v, cfg);
			const key = r.ok ? (r.key as string) : k;
			const want = r.ok ? (r.value as string) : v;
			if (!Object.prototype.hasOwnProperty.call(merged, key)) {
				missing.push([key, k]);
				continue;
			}
			if (norm(merged[key]) !== norm(want)) mismatched.push([key, want, merged[key]]);
		}
		expect({ missing, mismatched }).toEqual({ missing: [], mismatched: [] });
	});
});
