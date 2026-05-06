"use client";

import { useMemo, useState } from "react";
import { moodSearch } from "@vietwander/shared";
import { DestinationCard } from "@/components/destination-card";
import { budgetLevelLabel, paceLabel, tagLabel } from "@/lib/vietnamese";

const examples = ["biển yên bình, ăn ngon, không quá đông", "chuyến biển cho gia đình, di chuyển dễ", "văn hóa và cà phê với ngân sách tầm trung"];

export function MoodSearchPanel() {
  const [query, setQuery] = useState("biển yên bình, ăn ngon, không quá đông");
  const result = useMemo(() => moodSearch(query), [query]);

  return (
    <section className="rounded-[18px] border border-[#d9ecfb] bg-white p-5 shadow-[0_18px_54px_rgba(2,68,120,0.08)]">
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0277d4]">Tìm theo cảm xúc</p>
          <h2 className="mt-3 text-3xl font-black leading-tight text-[#071827]">Mô tả cảm giác chuyến đi bạn muốn.</h2>
          <label className="mt-5 block text-sm font-bold text-[#071827]">
            Cảm xúc, nhịp đi, món ăn, người đi cùng, ngân sách
            <textarea
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="mt-2 min-h-28 w-full rounded-xl border border-[#d9ecfb] bg-[#f7fbff] px-4 py-3 leading-6 outline-none focus:border-[#0277d4] focus:ring-2 focus:ring-[#0277d4]/15"
            />
          </label>
          <div className="mt-4 flex flex-wrap gap-2">
            {examples.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setQuery(example)}
                className="rounded-full border border-[#d9ecfb] px-3 py-1.5 text-left text-xs font-semibold text-[#40515d] transition hover:border-[#0277d4] hover:text-[#0277d4]"
              >
                {example}
              </button>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {result.inferredFilters.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-[#f5efe4] px-3 py-1 text-sm font-semibold text-[#40515d]">
                {tagLabel(tag)}
              </span>
            ))}
            <span className="rounded-full bg-[#ecf7f4] px-3 py-1 text-sm font-semibold text-[#0f766e]">
              {paceLabel(result.inferredFilters.pace)}
            </span>
            <span className="rounded-full bg-[#ecf7f4] px-3 py-1 text-sm font-semibold text-[#0f766e]">
              {budgetLevelLabel(result.inferredFilters.budget)}
            </span>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {result.destinations.slice(0, 3).map((destination) => (
            <DestinationCard key={destination.slug} destination={destination} />
          ))}
        </div>
      </div>
    </section>
  );
}
