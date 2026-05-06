"use client";

import { useMemo, useState } from "react";
import { compareDestinations, destinations, type TravelStyle } from "@vietwander/shared";

const styles: TravelStyle[] = ["Culture Seeker", "Food Hunter", "Beach Lover", "Family Planner", "Luxury Escaper", "Budget Backpacker"];

export function CompareConsole() {
  const [selected, setSelected] = useState(["da-nang", "bali", "paris"]);
  const [style, setStyle] = useState<TravelStyle>("Culture Seeker");
  const rows = useMemo(() => compareDestinations(selected, style), [selected, style]);

  function toggle(slug: string) {
    setSelected((current) => {
      if (current.includes(slug)) {
        return current.length > 2 ? current.filter((item) => item !== slug) : current;
      }
      return [...current, slug].slice(-4);
    });
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal">AI Compare</p>
            <h2 className="mt-2 text-3xl font-black text-navy">Compare 2-4 destinations by real planning tradeoffs</h2>
          </div>
          <label className="block text-sm font-bold text-navy">
            Travel style
            <select value={style} onChange={(event) => setStyle(event.target.value as TravelStyle)} className="mt-2 w-full rounded-lg border border-navy/15 px-3 py-3">
              {styles.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {destinations.slice(0, 18).map((destination) => (
            <button
              key={destination.slug}
              type="button"
              onClick={() => toggle(destination.slug)}
              className={selected.includes(destination.slug) ? "rounded-full bg-teal px-3 py-2 text-sm font-semibold text-white" : "rounded-full bg-ivory px-3 py-2 text-sm font-semibold text-navy"}
            >
              {destination.name}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-navy text-white">
            <tr>
              {["Destination", "Budget", "Best season", "Food", "Family", "Nightlife", "Safety", "AI score", "Verdict"].map((heading) => (
                <th key={heading} className="px-4 py-3 font-semibold">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.slug} className="border-b border-navy/10">
                <td className="px-4 py-4 font-bold text-navy">{row.destination}</td>
                <td className="px-4 py-4">{row.budgetRange}</td>
                <td className="px-4 py-4">{row.bestSeason}</td>
                <td className="px-4 py-4">{row.foodFit}</td>
                <td className="px-4 py-4">{row.familyFit}</td>
                <td className="px-4 py-4">{row.nightlifeFit}</td>
                <td className="px-4 py-4">{row.safetyFit}</td>
                <td className="px-4 py-4 font-black text-teal">{row.aiScore}</td>
                <td className="px-4 py-4 font-semibold text-sunset">{row.verdict}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
