/**
 * Sci-fi hover tooltip.
 *
 * Any element carrying `data-tooltip="..."` shows a styled popup on hover.
 * One shared DOM node, positioned by mouse coordinates and clamped to the
 * viewport. Styling lives in `core/style/style.css` (`#hog-tooltip`).
 *
 * Why not jQuery `.hover()` calls in src/main.ts? Event delegation here
 * means newly-injected legacy DOM nodes with `data-tooltip` work
 * automatically — no per-element bind step on each interface switch.
 */

const TOOLTIP_ID = "hog-tooltip";
const ATTR = "data-tooltip";
const SHOW_DELAY_MS = 160;
const HIDE_DELAY_MS = 60;
const OFFSET_X = 14;
const OFFSET_Y = 18;

interface TooltipState {
	el: HTMLDivElement;
	target: Element | null;
	showTimer: number | null;
	hideTimer: number | null;
}

let state: TooltipState | null = null;

function ensureTooltipElement(): HTMLDivElement {
	let el = document.getElementById(TOOLTIP_ID) as HTMLDivElement | null;
	if (!el) {
		el = document.createElement("div");
		el.id = TOOLTIP_ID;
		document.body.appendChild(el);
	}
	return el;
}

function clearTimers() {
	if (!state) return;
	if (state.showTimer !== null) {
		window.clearTimeout(state.showTimer);
		state.showTimer = null;
	}
	if (state.hideTimer !== null) {
		window.clearTimeout(state.hideTimer);
		state.hideTimer = null;
	}
}

function show(text: string, x: number, y: number) {
	if (!state) return;
	state.el.textContent = text;
	state.el.classList.add("visible");
	position(x, y);
}

function position(x: number, y: number) {
	if (!state) return;
	const el = state.el;
	// Render once to measure
	const rect = el.getBoundingClientRect();
	const vw = window.innerWidth;
	const vh = window.innerHeight;
	let left = x + OFFSET_X;
	let top = y + OFFSET_Y;
	if (left + rect.width > vw - 8) left = x - rect.width - OFFSET_X;
	if (top + rect.height > vh - 8) top = y - rect.height - OFFSET_Y;
	if (left < 4) left = 4;
	if (top < 4) top = 4;
	el.style.left = `${Math.round(left)}px`;
	el.style.top = `${Math.round(top)}px`;
}

function hide() {
	if (!state) return;
	state.target = null;
	state.el.classList.remove("visible");
}

function findTooltipHost(start: Element | null): Element | null {
	let cur: Element | null = start;
	while (cur && cur.nodeType === 1) {
		if (cur.hasAttribute?.(ATTR)) return cur;
		cur = cur.parentElement;
	}
	return null;
}

function onPointerOver(ev: PointerEvent) {
	if (!state) return;
	const host = findTooltipHost(ev.target as Element | null);
	if (!host || host === state.target) return;
	state.target = host;
	const text = host.getAttribute(ATTR) ?? "";
	if (!text) return;
	clearTimers();
	state.showTimer = window.setTimeout(() => show(text, ev.clientX, ev.clientY), SHOW_DELAY_MS);
}

function onPointerMove(ev: PointerEvent) {
	if (!state) return;
	if (state.target && state.el.classList.contains("visible")) {
		position(ev.clientX, ev.clientY);
	}
}

function onPointerOut(ev: PointerEvent) {
	if (!state) return;
	const host = findTooltipHost(ev.target as Element | null);
	if (!host || host !== state.target) return;
	// Don't hide if pointer moved into a child of the same host
	const related = ev.relatedTarget as Element | null;
	if (related && host.contains(related)) return;
	clearTimers();
	state.hideTimer = window.setTimeout(hide, HIDE_DELAY_MS);
}

/**
 * Initialise the tooltip system. Idempotent: re-calling is a no-op.
 * Strip any `title` attributes on `[data-tooltip]` elements so the native
 * browser tooltip doesn't double up.
 */
export function initTooltips(): void {
	if (state) return;
	const el = ensureTooltipElement();
	state = { el, target: null, showTimer: null, hideTimer: null };

	// Remove native title= on elements that opted into our custom popup,
	// so browsers don't render both.
	document.querySelectorAll(`[${ATTR}]`).forEach((node) => {
		if (node.hasAttribute("title")) node.removeAttribute("title");
	});

	document.addEventListener("pointerover", onPointerOver, true);
	document.addEventListener("pointermove", onPointerMove, true);
	document.addEventListener("pointerout", onPointerOut, true);
}
