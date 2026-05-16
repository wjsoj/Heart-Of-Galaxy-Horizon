// @vitest-environment jsdom
/**
 * Smoke test for the JSON locale layer:
 *
 *   - Every entry in legacy `cnItems` (zh/core.js) must also exist in some
 *     `locales/zh-CN/*.json` file with the same value. The JSON is allowed to
 *     contain ADDITIONAL entries (translations added after the split).
 *   - `_prefix.json` and `_postfix.json` are control files that augment
 *     `cnPrefix` / `cnPostfix`, not `cnItems`; they're excluded from this
 *     comparison.
 *
 * Guards against accidental drift while permitting new translations.
 */
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";

const repoRoot = resolve(__dirname, "../..");

function loadCnItems(): Record<string, unknown> {
	const src = readFileSync(resolve(repoRoot, "zh/core.js"), "utf8");
	vm.runInThisContext(src, { filename: "zh/core.js" });
	return (globalThis as any).cnItems;
}

function loadMergedLocales(): Record<string, string> {
	const dir = resolve(repoRoot, "locales/zh-CN");
	const files = readdirSync(dir).filter((f) => f.endsWith(".json") && f !== "manifest.json" && !f.startsWith("_"));
	const merged: Record<string, string> = {};
	for (const file of files) {
		const data = JSON.parse(readFileSync(resolve(dir, file), "utf8"));
		for (const [k, v] of Object.entries(data)) merged[k] = v as string;
	}
	return merged;
}

describe("locales/zh-CN/*.json covers legacy zh/core.js cnItems", () => {
	it("every legacy cnItems entry is present in JSON with the same value", () => {
		const cn = loadCnItems();
		const merged = loadMergedLocales();
		const missing: string[] = [];
		const mismatched: Array<[string, string, string]> = [];
		for (const [k, v] of Object.entries(cn)) {
			if (k === "_OTHER_") continue;
			if (!Object.prototype.hasOwnProperty.call(merged, k)) {
				missing.push(k);
				continue;
			}
			if (merged[k] !== v) mismatched.push([k, String(v), merged[k]]);
		}
		expect({ missing, mismatched }).toEqual({ missing: [], mismatched: [] });
	});
});
