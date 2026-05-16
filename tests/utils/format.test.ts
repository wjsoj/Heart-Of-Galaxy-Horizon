import { describe, it, expect } from "vitest";
import { clamp, formatShort } from "../../src/utils/format";

describe("formatShort", () => {
	it("returns plain integers below 1000", () => {
		expect(formatShort(0)).toBe("0");
		expect(formatShort(999)).toBe("999");
		expect(formatShort(-42)).toBe("-42");
	});

	it("formats thousands with k", () => {
		expect(formatShort(1_500)).toBe("1.50k");
		expect(formatShort(1_500, 0)).toBe("2k");
	});

	it("formats millions / billions / trillions / quadrillions", () => {
		expect(formatShort(2_500_000)).toBe("2.50M");
		expect(formatShort(3_750_000_000)).toBe("3.75B");
		expect(formatShort(1_000_000_000_000)).toBe("1.00T");
		expect(formatShort(2_000_000_000_000_000)).toBe("2.00Q");
	});

	it("handles negatives in large ranges", () => {
		expect(formatShort(-5_000_000)).toBe("-5.00M");
	});
});

describe("clamp", () => {
	it("returns value when inside the range", () => {
		expect(clamp(5, 0, 10)).toBe(5);
	});
	it("clamps below min and above max", () => {
		expect(clamp(-1, 0, 10)).toBe(0);
		expect(clamp(11, 0, 10)).toBe(10);
	});
});
