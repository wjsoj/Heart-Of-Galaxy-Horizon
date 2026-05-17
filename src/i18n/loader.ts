import type { I18nDictionary } from "../types/globals";

/**
 * Locale loader: merges all `locales/<locale>/*.json` files into the legacy
 * `window.cnItems` dictionary, leaving existing entries untouched.
 *
 * Why "additive" rather than "replace"?
 *   - `zh/core.js` is still the canonical runtime source today; the JSON
 *     files are an editor-friendly mirror produced by `scripts/split-locales.mjs`.
 *   - As translators add new entries to JSON, this loader picks them up at
 *     startup without anyone touching `zh/core.js`.
 *   - The legacy entries always win on conflict, preserving exact runtime
 *     behavior until we flip the source-of-truth in a later phase.
 */

interface LoaderOptions {
	locale?: string;
	/** When true, JSON entries overwrite existing cnItems entries. Default: false. */
	overwrite?: boolean;
	/** When true (default), uses Vite's import.meta.glob to bundle JSON. */
	useBundled?: boolean;
}

export interface LoadReport {
	locale: string;
	filesLoaded: number;
	entriesAdded: number;
	entriesSkipped: number;
}

/**
 * Eagerly resolve all JSON locale files at build time via Vite's `import.meta.glob`.
 * In test/node environments where `import.meta.glob` is undefined, returns `null`
 * and callers should fall back to a runtime fetch.
 */
function bundledLocaleFiles(locale: string): Record<string, unknown> | null {
	// `import.meta.glob` is a Vite-only API. We probe defensively so that
	// the same module is consumable from non-Vite environments (e.g. vitest
	// when not running through vite-node).
	const meta = import.meta as unknown as {
		glob?: (pattern: string, opts: { eager: true }) => Record<string, { default: unknown }>;
	};
	if (typeof meta.glob !== "function") return null;
	const modules = meta.glob("/locales/*/*.json", { eager: true });
	const prefix = `/locales/${locale}/`;
	const out: Record<string, unknown> = {};
	for (const [path, mod] of Object.entries(modules)) {
		if (!path.startsWith(prefix)) continue;
		if (path.endsWith("/manifest.json")) continue;
		out[path] = mod.default;
	}
	return out;
}

export async function loadLocale(options: LoaderOptions = {}): Promise<LoadReport> {
	const locale = options.locale ?? "zh-CN";
	const overwrite = options.overwrite ?? false;

	let modules = options.useBundled === false ? null : bundledLocaleFiles(locale);

	// Treat empty bundled result as "not available" so we fall through to fetch.
	if (modules && Object.keys(modules).length === 0) modules = null;

	if (!modules) {
		// Runtime fetch fallback (e.g. served from static hosting without bundling).
		// Honour Vite's BASE_URL so this works under GitHub Pages project sites
		// (`/<repo>/`) as well as root-domain deploys (`/`). Vite inlines this
		// at build time only when accessed via the literal `import.meta.env.X`
		// pattern, so DON'T factor it through a typed local first.
		let baseUrl = "/";
		try {
			// @ts-expect-error — Vite-injected at build time; absent under vitest/node
			const v = import.meta.env?.BASE_URL;
			if (typeof v === "string" && v.length > 0) baseUrl = v.endsWith("/") ? v : v + "/";
		} catch {
			/* non-Vite env: keep default */
		}
		const manifestRes = await fetch(`${baseUrl}locales/${locale}/manifest.json`);
		if (!manifestRes.ok) {
			throw new Error(`Failed to load manifest for locale ${locale}: HTTP ${manifestRes.status}`);
		}
		const manifest = (await manifestRes.json()) as { sections: Array<{ file: string }> };
		modules = {};
		for (const { file } of manifest.sections) {
			const res = await fetch(`${baseUrl}locales/${locale}/${file}`);
			if (!res.ok) continue;
			modules[`/locales/${locale}/${file}`] = await res.json();
		}
	}

	const win = window as unknown as {
		cnItems?: I18nDictionary;
		cnPrefix?: Record<string, string>;
		cnPostfix?: Record<string, string>;
	};
	const cnItems: I18nDictionary = (win.cnItems ??= { _OTHER_: [] } as I18nDictionary);
	const cnPrefix: Record<string, string> = (win.cnPrefix ??= {});
	const cnPostfix: Record<string, string> = (win.cnPostfix ??= {});

	let added = 0;
	let skipped = 0;
	for (const [path, data] of Object.entries(modules)) {
		if (!data || typeof data !== "object") continue;
		// Special files: _prefix.json / _postfix.json augment cnPrefix / cnPostfix
		// instead of cnItems. These power "prefix + dynamic content" patterns
		// (e.g. "[Enemy] PlayerName") where a whole-string match never fires.
		if (/\/_prefix\.json$/.test(path)) {
			for (const [k, v] of Object.entries(data as Record<string, string>)) {
				if (typeof v !== "string") continue;
				if (Object.prototype.hasOwnProperty.call(cnPrefix, k) && !overwrite) {
					skipped++;
					continue;
				}
				cnPrefix[k] = v;
				added++;
			}
			continue;
		}
		if (/\/_postfix\.json$/.test(path)) {
			for (const [k, v] of Object.entries(data as Record<string, string>)) {
				if (typeof v !== "string") continue;
				if (Object.prototype.hasOwnProperty.call(cnPostfix, k) && !overwrite) {
					skipped++;
					continue;
				}
				cnPostfix[k] = v;
				added++;
			}
			continue;
		}
		for (const [key, value] of Object.entries(data as Record<string, string>)) {
			if (typeof value !== "string") continue;
			const exists = Object.prototype.hasOwnProperty.call(cnItems, key);
			if (exists && !overwrite) {
				skipped++;
				continue;
			}
			(cnItems as Record<string, string | string[]>)[key] = value;
			added++;
		}
	}

	return { locale, filesLoaded: Object.keys(modules).length, entriesAdded: added, entriesSkipped: skipped };
}
