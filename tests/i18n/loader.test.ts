// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { loadLocale } from "../../src/i18n/loader";

const repoRoot = resolve(__dirname, "../..");

function mockFetchFromDisk() {
	const localesDir = resolve(repoRoot, "locales/zh-CN");
	const files = readdirSync(localesDir);

	(globalThis as any).fetch = vi.fn(async (url: string) => {
		const m = url.match(/\/locales\/zh-CN\/(.+)$/);
		if (!m) return { ok: false, status: 404 } as Response;
		const filename = m[1];
		if (!files.includes(filename)) return { ok: false, status: 404 } as Response;
		const body = readFileSync(resolve(localesDir, filename), "utf8");
		return {
			ok: true,
			status: 200,
			json: async () => JSON.parse(body),
		} as Response;
	});
}

describe("loadLocale", () => {
	beforeEach(() => {
		(window as any).cnItems = { _OTHER_: [] };
		mockFetchFromDisk();
	});

	it("loads all manifest sections and populates cnItems", async () => {
		const report = await loadLocale({ locale: "zh-CN", useBundled: false });
		expect(report.locale).toBe("zh-CN");
		expect(report.filesLoaded).toBeGreaterThan(0);
		expect(report.entriesAdded).toBeGreaterThan(500);
		expect(report.entriesSkipped).toBe(0);

		const cn = (window as any).cnItems;
		expect(cn["Promision"]).toBe("普罗米森");
	});

	it("preserves existing entries by default (additive merge)", async () => {
		(window as any).cnItems["Promision"] = "已存在的翻译";
		const report = await loadLocale({ locale: "zh-CN", useBundled: false });
		expect(report.entriesSkipped).toBeGreaterThan(0);
		expect((window as any).cnItems["Promision"]).toBe("已存在的翻译");
	});

	it("overwrites when overwrite=true", async () => {
		(window as any).cnItems["Promision"] = "old";
		await loadLocale({ locale: "zh-CN", useBundled: false, overwrite: true });
		expect((window as any).cnItems["Promision"]).toBe("普罗米森");
	});

	it("throws when manifest is missing", async () => {
		(globalThis as any).fetch = vi.fn(async () => ({ ok: false, status: 404 }) as Response);
		await expect(loadLocale({ locale: "xx-YY", useBundled: false })).rejects.toThrow(/manifest/);
	});
});
