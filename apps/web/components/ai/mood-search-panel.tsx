"use client";

import { useMemo, useState } from "react";
import { moodSearch } from "@vietwander/shared";
import { DestinationCard } from "@/components/destination-card";

export function MoodSearchPanel() {
  const [query, setQuery] = useState("yen binh co bien an ngon khong qua dong");
  const result = useMemo(() => moodSearch(query), [query]);

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal">Mood-based Search</p>
      <label className="mt-4 block text-sm font-bold text-navy">
        Natural-language mood
        <input value={query} onChange={(event) => setQuery(event.target.value)} className="mt-2 w-full rounded-lg border border-navy/15 px-4 py-3" />
      </label>
      <div className="mt-4 flex flex-wrap gap-2">
        {result.inferredFilters.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-mist px-3 py-1 text-sm font-semibold text-navy">
            {tag}
          </span>
        ))}
        <span className="rounded-full bg-ivory px-3 py-1 text-sm font-semibold text-navy">{result.inferredFilters.pace}</span>
        <span className="rounded-full bg-ivory px-3 py-1 text-sm font-semibold text-navy">{result.inferredFilters.budget}</span>
        <span className="rounded-full bg-ivory px-3 py-1 text-sm font-semibold text-navy">{result.inferredFilters.styles[0]}</span>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {result.destinations.slice(0, 4).map((destination) => (
          <DestinationCard key={destination.slug} destination={destination} />
        ))}
      </div>
    </section>
  );
}
