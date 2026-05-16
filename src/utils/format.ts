// Numeric formatting utilities. Pure functions, fully unit-tested.

const MI = 1_000_000;
const BI = 1_000 * MI;
const TRI = 1_000 * BI;
const QAD = 1_000 * TRI;

/**
 * Format a large number with k/M/B/T/Q suffixes (matches the magnitude
 * conventions used by the legacy `mi`/`bi`/`tri`/`qad` globals in `cfg.js`).
 */
export function formatShort(n: number, digits = 2): string {
	const abs = Math.abs(n);
	if (abs >= QAD) return (n / QAD).toFixed(digits) + "Q";
	if (abs >= TRI) return (n / TRI).toFixed(digits) + "T";
	if (abs >= BI) return (n / BI).toFixed(digits) + "B";
	if (abs >= MI) return (n / MI).toFixed(digits) + "M";
	if (abs >= 1_000) return (n / 1_000).toFixed(digits) + "k";
	return String(Math.round(n));
}

/** Clamp a number to the inclusive `[min, max]` range. */
export function clamp(n: number, min: number, max: number): number {
	if (n < min) return min;
	if (n > max) return max;
	return n;
}
