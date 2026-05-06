import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { destinations } from "@vietwander/shared";
import { getDestinationCopy } from "./destination-copy";
import { filterDestinations } from "./travel";
import { buildVietnameseDemoItinerary, demoPaymentWarning, formatDateVi } from "./vietnamese";

const root = fileURLToPath(new URL("..", import.meta.url));

describe("Vietnamese travel-commerce UX", () => {
  it("keeps the distinct VietWander logo assets available", () => {
    const markPath = new URL("../public/brand/logo-mark.svg", import.meta.url);
    const lockupPath = new URL("../public/brand/logo-lockup.svg", import.meta.url);

    expect(existsSync(markPath)).toBe(true);
    expect(existsSync(lockupPath)).toBe(true);
    expect(readFileSync(markPath, "utf8")).not.toMatch(/traveloka/i);
  });

  it("formats Vietnamese dates and demo payment warning", () => {
    expect(formatDateVi(new Date("2026-08-12"))).toBe("12/08/2026");
    expect(demoPaymentWarning).toContain("không phát sinh giao dịch thật");
  });

  it("uses Vietnamese destination copy and search", () => {
    const daNang = destinations.find((item) => item.slug === "da-nang");
    expect(daNang).toBeTruthy();
    expect(getDestinationCopy(daNang!).name).toBe("Đà Nẵng");
    expect(filterDestinations("Đà Nẵng").some((item) => item.slug === "da-nang")).toBe(true);
  });

  it("builds a Vietnamese itinerary draft", () => {
    const destination = destinations.find((item) => item.slug === "da-nang")!;
    const plan = buildVietnameseDemoItinerary(destination, 3);

    expect(plan.destination).toBe("Đà Nẵng");
    expect(plan.days[0]?.title).toContain("Đà Nẵng");
    expect(plan.packingList).toContain("Giấy tờ tùy thân");
  });

  it("removes old English template phrases from the public user flow", () => {
    const files = [
      "app/page.tsx",
      "app/explore/page.tsx",
      "app/destinations/[slug]/page.tsx",
      "app/ai-planner/page.tsx",
      "app/chat/page.tsx",
      "app/booking/[id]/page.tsx",
      "components/destination-card.tsx",
      "components/itinerary-timeline.tsx"
    ];
    const source = files.map((file) => readFileSync(`${root}/${file}`, "utf8")).join("\n");

    expect(source).not.toMatch(/Demo payment - no real transaction|Open dossier|Mock booking|Search results|Your trip cart|Build itinerary|Starting from/);
  });
});
