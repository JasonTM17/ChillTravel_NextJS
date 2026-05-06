"use client";

import { useMemo, useState } from "react";
import { moodSearch } from "@vietwander/shared";
import { DestinationCard } from "@/components/destination-card";

const examples = ["quiet coast, great food, not crowded", "family beach trip with easy transport", "culture and cafes under a mid budget"];

export function MoodSearchPanel() {
  const [query, setQuery] = useState("quiet coast, great food, not crowded");
  const result = useMemo(() => moodSearch(query), [query]);

  return (
    <section className="rounded-[18px] border border-[#dfd3c1] bg-white p-5 shadow-[0_18px_54px_rgba(7,24,39,0.06)]">
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0f766e]">Trip mood</p>
          <h2 className="mt-3 text-3xl font-black leading-tight text-[#071827]">Describe the feeling of the trip.</h2>
          <label className="mt-5 block text-sm font-bold text-[#071827]">
            Mood, pace, food, people, budget
            <textarea
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="mt-2 min-h-28 w-full rounded-xl border border-[#e5dccf] bg-[#fdf9f0] px-4 py-3 leading-6 outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/15"
            />
          </label>
          <div className="mt-4 flex flex-wrap gap-2">
            {examples.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setQuery(example)}
                className="rounded-full border border-[#ddd1bf] px-3 py-1.5 text-left text-xs font-semibold text-[#40515d] transition hover:border-[#0f766e] hover:text-[#0f766e]"
              >
                {example}
              </button>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {result.inferredFilters.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-[#f5efe4] px-3 py-1 text-sm font-semibold text-[#40515d]">
                {tag}
              </span>
            ))}
            <span className="rounded-full bg-[#ecf7f4] px-3 py-1 text-sm font-semibold text-[#0f766e]">
              {result.inferredFilters.pace}
            </span>
            <span className="rounded-full bg-[#ecf7f4] px-3 py-1 text-sm font-semibold text-[#0f766e]">
              {result.inferredFilters.budget}
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
