// @vitest-environment jsdom
/**
 * Smoke test: load cfg.js into a jsdom environment and assert that the
 * top-level definitions are populated and well-formed.
 *
 * This is the canary for any refactor of cfg.js. If this test fails, the
 * change has altered observable game data.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";

declare const window: Window & typeof globalThis;

beforeAll(() => {
	// jsdom doesn't supply `game`, but cfg.js references it inside artifact
	// action closures. Those closures are only INVOKED at runtime; the global
	// reference at file-load time is fine — we still seed it to be safe.
	(window as any).game = { ships: [] };

	const cfgPath = resolve(__dirname, "../../core/script/cfg.js");
	const src = readFileSync(cfgPath, "utf8");
	// Evaluate the trusted, version-controlled config in the jsdom window context.
	// `var` declarations at the top level land on `window` (script scope), which
	// is exactly the runtime behavior the game relies on.
	vm.runInThisContext(src, { filename: "core/script/cfg.js" });
});

describe("cfg.js — top-level definitions", () => {
	it("declares magnitude constants", () => {
		expect((window as any).mi).toBe(1_000_000);
		expect((window as any).bi).toBe(1_000_000_000);
		expect((window as any).tri).toBe(1_000_000_000_000);
		expect((window as any).qad).toBe(1_000_000_000_000_000);
	});

	it("populates artifactsDefinition with id+name entries", () => {
		const arr = (window as any).artifactsDefinition as Array<{ id: string; name: string }>;
		expect(Array.isArray(arr)).toBe(true);
		expect(arr.length).toBeGreaterThan(10);
		for (const a of arr) {
			expect(typeof a.id).toBe("string");
			expect(typeof a.name).toBe("string");
		}
	});

	it("artifactsName indexes back into artifactsDefinition", () => {
		const def = (window as any).artifactsDefinition as Array<{ id: string }>;
		const idx = (window as any).artifactsName as Record<string, number>;
		for (const a of def) {
			expect(typeof idx[a.id]).toBe("number");
			expect(def[idx[a.id]].id).toBe(a.id);
		}
	});

	it("populates resourcesDefinition", () => {
		const arr = (window as any).resourcesDefinition as Array<{ name: string }>;
		expect(Array.isArray(arr)).toBe(true);
		expect(arr.length).toBeGreaterThan(20);
		const names = new Set(arr.map((r) => r.name));
		expect(names.has("iron")).toBe(true);
		expect(names.has("steel")).toBe(true);
	});

	it("populates planetsDefinition with named planets", () => {
		const arr = (window as any).planetsDefinition as Array<{ name: string }>;
		expect(Array.isArray(arr)).toBe(true);
		expect(arr.length).toBeGreaterThan(20);
		const names = new Set(arr.map((p) => p.name));
		expect(names.has("Promision")).toBe(true);
	});
});
