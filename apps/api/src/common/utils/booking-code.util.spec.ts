import { describe, expect, it } from "vitest";
import {
  BOOKING_CODE_REGEX,
  generateBookingCode
} from "./booking-code.util";

describe("generateBookingCode", () => {
  it("produces codes matching the WV-YYYYMMDD-XXXXXX format", () => {
    for (let i = 0; i < 20; i++) {
      expect(generateBookingCode()).toMatch(BOOKING_CODE_REGEX);
    }
  });

  it("embeds the UTC date correctly (May 11 2026)", () => {
    const fixed = new Date(Date.UTC(2026, 4, 11, 9, 0, 0));
    const code = generateBookingCode(fixed);
    expect(code.startsWith("WV-20260511-")).toBe(true);
    expect(code).toMatch(BOOKING_CODE_REGEX);
  });

  it("zero-pads single-digit month and day", () => {
    const feb03 = new Date(Date.UTC(2026, 1, 3, 0, 0, 0));
    const code = generateBookingCode(feb03);
    expect(code.startsWith("WV-20260203-")).toBe(true);
  });

  it("produces different random suffixes for the same date", () => {
    const fixed = new Date(Date.UTC(2026, 4, 11, 0, 0, 0));
    const suffixes = new Set<string>();
    for (let i = 0; i < 50; i++) {
      const code = generateBookingCode(fixed);
      suffixes.add(code.split("-")[2]!);
    }
    // Allow one theoretical collision; with 2^24 space and 50 draws the
    // probability is negligible (<<1e-10), so we simply require "most" unique.
    expect(suffixes.size).toBeGreaterThanOrEqual(48);
  });

  it("handles the last day of the year correctly", () => {
    const dec31 = new Date(Date.UTC(2026, 11, 31, 23, 59, 59));
    const code = generateBookingCode(dec31);
    expect(code.startsWith("WV-20261231-")).toBe(true);
  });
});
