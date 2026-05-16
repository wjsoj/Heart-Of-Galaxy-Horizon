// Ambient type declarations for the legacy globals exposed by
// `core/script/cfg.js`, `core/script/sall.js`, and `zh/core.js`.
//
// These declarations describe SHAPES, not behavior — they exist so that new
// TypeScript code under `src/` can safely interact with the legacy runtime
// without touching it. As we migrate code, types here become the contract.

// ─── Magnitude constants from cfg.js ──────────────────────────────────────
declare const mi: number; // 1e6
declare const bi: number; // 1e9
declare const tri: number; // 1e12
declare const qad: number; // 1e15

// ─── Feature flags / UI constants (subset; extend as needed) ──────────────
declare let MOBILE: boolean;
declare let HORIZONS: boolean;
declare let POPULATION_ENABLED: boolean;
declare let ENERGY_ENABLED: boolean;
declare let NEW_AUTOROUTES: boolean;
declare let SHARED_RESOURCES: boolean;
declare let IDLE_BONUS_ENABLED: boolean;
declare let POPUP_VERTICAL: boolean;
declare let AG_SAVE: boolean;
declare let AG_GAME: boolean;
declare const UI_FOLDER: string;
declare const IMG_FOLDER: string;
declare const SAVESTR_HEAD: string;

// ─── Game data types ──────────────────────────────────────────────────────

export interface Artifact {
	id: string;
	name: string;
	description?: string;
	sticky?: boolean;
	action?: () => void;
	unaction?: () => void;
}

export interface ResourceDefinition {
	name: string;
	type?: "prod";
	value?: number;
	category?: "extraction" | "production" | "military" | string;
	functional?: "construction" | "production" | "refining" | "energy" | "population" | "military" | string;
	req?: Record<string, number>;
	quests?: Record<string, number>;
}

export interface PlanetMoon {
	size: number;
	type: string;
}

export interface PlanetInfo {
	radius?: number;
	temp?: number;
	atmos?: string;
	orbit?: number;
	caesium?: number;
	engine?: number;
}

export interface PlanetDefinition {
	name: string;
	influence: number;
	icon: string;
	type?: string;
	pos?: [number, number];
	baseRes?: Record<string, number>;
	moon?: PlanetMoon;
	info?: PlanetInfo;
	unlock?: string;
}

export interface ShipDefinition {
	name?: string;
	weapon?: "ballistic" | "laser" | "missile" | "torpedo" | string;
	power?: number;
	armor?: number;
	hp?: number;
	shield?: number;
	weight?: number;
	[key: string]: unknown;
}

// ─── Game runtime shape (loose — extend as we lock down each subsystem) ───

export interface GameState {
	ships: ShipDefinition[];
	year?: number;
	day?: number;
	[key: string]: unknown;
}

// ─── i18n dictionary from zh/core.js ──────────────────────────────────────

export interface I18nDictionary {
	_OTHER_: string[];
	[key: string]: string | string[];
}

// ─── Window augmentation (the actual runtime surface) ─────────────────────

declare global {
	interface Window {
		game: GameState;
		cnItems: I18nDictionary;

		artifactsDefinition: Artifact[];
		artifactsName: Record<string, number>;
		resourcesDefinition: ResourceDefinition[];
		planetsDefinition: PlanetDefinition[];
		shipsDefinition?: ShipDefinition[];

		// Magnitude constants reachable via window
		mi: number;
		bi: number;
		tri: number;
		qad: number;
	}

	const game: GameState;
	const cnItems: I18nDictionary;
	const artifactsDefinition: Artifact[];
	const artifactsName: Record<string, number>;
	const resourcesDefinition: ResourceDefinition[];
	const planetsDefinition: PlanetDefinition[];
}

export {};
