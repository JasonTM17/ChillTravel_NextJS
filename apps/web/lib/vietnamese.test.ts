import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { destinations } from "@vietwander/shared";
import { getDestinationCopy } from "./destination-copy";
import { filterDestinations } from "./travel";
import { buildVietnameseDemoItinerary, demoPaymentWarning, formatDateVi } from "./vietnamese";

const root = fileURLToPath(new URL("..", import.meta.url));

describe("Vietnamese travel-commerce UX", () => {
  it("keeps the distinct ChillTravel logo assets available", () => {
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
      "app/budget/page.tsx",
      "app/compare/page.tsx",
      "app/experiences/page.tsx",
      "app/hotels/page.tsx",
      "app/login/page.tsx",
      "app/register/page.tsx",
      "app/map/page.tsx",
      "app/personality/page.tsx",
      "app/profile/page.tsx",
      "app/trips/page.tsx",
      "app/wishlist/page.tsx",
      "app/admin/page.tsx",
      "app/admin/destinations/page.tsx",
      "app/admin/bookings/page.tsx",
      "app/admin/analytics/page.tsx",
      "app/admin/ai-knowledge/page.tsx",
      "components/destination-card.tsx",
      "components/itinerary-timeline.tsx",
      "components/feature-overview.tsx",
      "components/ai/compare-console.tsx",
      "components/ai/mood-search-panel.tsx",
      "components/ai/personality-quiz.tsx"
    ];
    const source = files.map((file) => readFileSync(`${root}/${file}`, "utf8")).join("\n");

    expect(source).not.toMatch(
      /Demo payment - no real transaction|Open dossier|Mock booking|Search results|Your trip cart|Build itinerary|Starting from|Admin dashboard|Traveler profile|Wishlist|Login|Register|Bo nhan dien phong cach du lich|Map discovery|Hotels mock|So sanh thong minh/
    );
  });

  it("keeps Vietnamese route labels for the expanded web surface", () => {
    const checks = [
      ["app/budget/page.tsx", "Ngân sách thông minh"],
      ["app/compare/page.tsx", "So sánh thông minh"],
      ["app/personality/page.tsx", "Phong cách du lịch"],
      ["app/wishlist/page.tsx", "Yêu thích"],
      ["app/trips/page.tsx", "Chuyến đi"],
      ["app/admin/page.tsx", "Bảng vận hành ChillTravel"],
      ["app/admin/ai-knowledge/page.tsx", "Knowledge Studio"]
    ] as const;

    for (const [file, phrase] of checks) {
      expect(readFileSync(`${root}/${file}`, "utf8")).toContain(phrase);
    }
  });
});
