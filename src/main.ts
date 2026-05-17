// Modern entry point — loaded by index.html via <script type="module">.
//
// This runs AFTER the legacy scripts (cfg.js, sall.js, zh/core.js) finish
// executing, so it can safely read/write the globals they set up.
//
// Today this only augments the i18n dictionary from locales/zh-CN/*.json.
// Future modules (data validation, UI overlays, settings) will hook in here.

import { loadLocale } from "./i18n/loader";
import { initTooltips } from "./ui/tooltip";

async function bootstrap() {
	try {
		const report = await loadLocale({ locale: "zh-CN", overwrite: false });
		console.info(
			`[hog/i18n] locale=${report.locale}  files=${report.filesLoaded}  ` +
				`added=${report.entriesAdded}  skipped=${report.entriesSkipped}`
		);
	} catch (err) {
		console.warn("[hog/i18n] locale load failed:", err);
	}
	initTooltips();
}

bootstrap();
