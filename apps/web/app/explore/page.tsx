import Link from "next/link";
import { ArrowRight, MapPinned, Search, SlidersHorizontal, Star, WalletCards } from "lucide-react";
import { destinations, normalizeTravelText } from "@vietwander/shared";
import type { Destination } from "@vietwander/shared";
import { MoodSearchPanel } from "@/components/ai/mood-search-panel";
import { DestinationCard } from "@/components/destination-card";
import { getDestinationCopy } from "@/lib/destination-copy";
import { formatVnd } from "@/lib/utils";

const styleOptions = ["beach", "culture", "food", "family", "mountain", "luxury"];
const seasonOptions = ["February to August", "October to April", "November to April", "May to September"];

export default function ExplorePage({ searchParams }: { searchParams: Promise<{ q?: string; style?: string }> }) {
  return searchParams.then(({ q = "", style = "" }) => {
    const normalizedQuery = normalizeTravelText(`${q} ${style}`.trim());
    const filtered = normalizedQuery
      ? destinations.filter((destination) => {
          const copy = getDestinationCopy(destination);
          const haystack = normalizeTravelText(
            [
              copy.name,
              copy.country,
              copy.city,
              copy.summary,
              destination.slug,
              destination.bestTimeToVisit,
              destination.tags.join(" "),
              destination.travelStyles.join(" "),
              destination.foodHighlights.join(" ")
            ].join(" ")
          );
          return haystack.includes(normalizedQuery) || normalizedQuery.includes(destination.slug);
        })
      : destinations;

    const vietnamPicks = destinations.filter((destination) => destination.tags.includes("Vietnam")).slice(0, 3);
    const worldPicks = destinations.filter((destination) => destination.tags.includes("World")).slice(0, 3);

    return (
      <main className="planning-desk min-h-screen text-[#071827]">
        <section className="editorial-paper border-b border-[#eadfce] px-4 py-12 md:py-16">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_380px] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-[#0f766e]">Explore dossier</p>
              <h1 className="font-editorial mt-4 max-w-4xl text-5xl font-black leading-[0.98] md:text-7xl">
                Find the right trip, not just a place.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#40515d]">
                Search Vietnam and world destinations through season, budget, food, culture, and travel rhythm. The
                interface stays calm; the intelligence works in the background.
              </p>

              <form
                className="mt-8 grid gap-3 rounded-[16px] border border-[#dfd3c1] bg-white p-3 shadow-[0_18px_54px_rgba(7,24,39,0.08)] md:grid-cols-[1fr_190px_140px]"
                action="/explore"
              >
                <label className="flex items-center gap-3 rounded-xl border border-[#eee6da] bg-[#fdf9f0] px-4 py-3">
                  <Search size={20} className="text-[#0f766e]" aria-hidden="true" />
                  <span className="sr-only">Search destination</span>
                  <input
                    name="q"
                    defaultValue={q}
                    placeholder="Da Nang, quiet beach, food, family..."
                    className="w-full bg-transparent text-base outline-none placeholder:text-[#87939a]"
                  />
                </label>
                <select
                  name="style"
                  defaultValue={style}
                  className="rounded-xl border border-[#eee6da] bg-[#fdf9f0] px-4 py-3 font-semibold text-[#071827] outline-none"
                  aria-label="Trip style"
                >
                  <option value="">All styles</option>
                  {styleOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <button className="rounded-xl bg-[#f97316] px-4 py-3 font-black text-white transition hover:bg-[#ea580c] focus:outline-none focus:ring-2 focus:ring-[#071827]">
                  Curate
                </button>
              </form>
            </div>

            <aside className="rounded-[18px] border border-[#dfd3c1] bg-[#071827] p-5 text-white shadow-[0_24px_80px_rgba(7,24,39,0.22)]">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f97316]">Route board</p>
              <h2 className="font-editorial mt-2 text-3xl font-black">Vietnam coastal dossier</h2>
              <div className="mt-5 space-y-4">
                {vietnamPicks.map((destination, index) => {
                  const copy = getDestinationCopy(destination);
                  return (
                    <Link
                      key={destination.slug}
                      href={`/destinations/${destination.slug}`}
                      className="flex items-center justify-between rounded-xl border border-white/12 bg-white/7 px-4 py-3 transition hover:bg-white/12"
                    >
                      <span>
                        <span className="block text-sm font-bold text-white/70">Stop {index + 1}</span>
                        <span className="block text-lg font-black">{copy.name}</span>
                      </span>
                      <ArrowRight size={18} aria-hidden="true" />
                    </Link>
                  );
                })}
              </div>
            </aside>
          </div>
        </section>

        <section className="px-4 py-10">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[290px_1fr]">
            <FilterRail />

            <div>
              <div className="flex flex-col gap-4 border-b border-[#e7ddcf] pb-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0f766e]">Destination library</p>
                  <h2 className="font-editorial mt-2 text-3xl font-black md:text-5xl">{filtered.length} curated places</h2>
                </div>
                <p className="max-w-md text-sm leading-6 text-[#687983]">
                  Local sample data only. Real-time flights, visa rules, and weather should be checked with official
                  sources before travel.
                </p>
              </div>

              {filtered.length ? (
                <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((destination) => (
                    <DestinationCard key={destination.slug} destination={destination} />
                  ))}
                </div>
              ) : (
                <EmptyResults />
              )}
            </div>
          </div>
        </section>

        <section className="border-y border-[#eadfce] bg-white px-4 py-12">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <EditorialStrip title="Vietnam focus" destinations={vietnamPicks} />
            <EditorialStrip title="World short list" destinations={worldPicks} />
          </div>
        </section>

        <section className="bg-[#fdf9f0] px-4 py-12">
          <div className="mx-auto max-w-7xl">
            <MoodSearchPanel />
          </div>
        </section>
      </main>
    );
  });
}

function FilterRail() {
  return (
    <aside className="h-fit rounded-[16px] border border-[#dfd3c1] bg-white p-5 shadow-[0_18px_54px_rgba(7,24,39,0.06)] lg:sticky lg:top-24">
      <div className="flex items-center justify-between border-b border-[#eee6da] pb-4">
        <h2 className="text-lg font-black">Refine</h2>
        <SlidersHorizontal className="text-[#0f766e]" size={20} aria-hidden="true" />
      </div>

      <FilterGroup title="Region" values={["Vietnam", "World", "Asia", "Europe"]} />
      <FilterGroup title="Trip style" values={styleOptions} />
      <FilterGroup title="Season" values={seasonOptions} />

      <div className="mt-6 rounded-xl bg-[#f8f1e6] p-4">
        <div className="flex items-center gap-2 text-sm font-black text-[#071827]">
          <WalletCards size={17} className="text-[#0f766e]" aria-hidden="true" />
          Budget range
        </div>
        <div className="mt-4 h-2 rounded-full bg-[#e4d7c5]">
          <div className="h-2 w-2/3 rounded-full bg-[#0f766e]" />
        </div>
        <div className="mt-3 flex justify-between text-xs font-bold text-[#687983]">
          <span>{formatVnd(500000)}</span>
          <span>{formatVnd(5000000)}+</span>
        </div>
      </div>
    </aside>
  );
}

function FilterGroup({ title, values }: { title: string; values: string[] }) {
  return (
    <div className="mt-6">
      <h3 className="text-xs font-black uppercase tracking-[0.18em] text-[#687983]">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {values.map((value) => (
          <Link
            key={value}
            href={`/explore?q=${encodeURIComponent(value)}`}
            className="rounded-full border border-[#ddd1bf] px-3 py-1.5 text-sm font-semibold text-[#40515d] transition hover:border-[#0f766e] hover:text-[#0f766e]"
          >
            {value}
          </Link>
        ))}
      </div>
    </div>
  );
}

function EditorialStrip({ title, destinations: items }: { title: string; destinations: Destination[] }) {
  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0f766e]">{title}</p>
      <div className="mt-5 divide-y divide-[#eee6da] rounded-[16px] border border-[#dfd3c1] bg-[#fdf9f0]">
        {items.map((destination) => {
          const copy = getDestinationCopy(destination);
          return (
            <Link
              key={destination.slug}
              href={`/destinations/${destination.slug}`}
              className="grid gap-3 p-4 transition hover:bg-white md:grid-cols-[1fr_auto] md:items-center"
            >
              <span>
                <span className="block text-xl font-black">{copy.name}</span>
                <span className="mt-1 block text-sm leading-6 text-[#687983]">{copy.summary}</span>
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-bold text-[#b45309]">
                <Star size={16} fill="currentColor" aria-hidden="true" />
                {destination.ratingAvg.toFixed(1)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function EmptyResults() {
  return (
    <div className="mt-8 rounded-[16px] border border-dashed border-[#cdbfae] bg-white p-10 text-center">
      <MapPinned className="mx-auto text-[#0f766e]" size={34} aria-hidden="true" />
      <h2 className="mt-4 text-2xl font-black">No destination matched that search.</h2>
      <p className="mt-2 text-[#687983]">Try a place, region, travel style, food, or season.</p>
      <Link href="/explore" className="mt-5 inline-flex rounded-lg bg-[#071827] px-5 py-3 font-bold text-white">
        Reset explore
      </Link>
    </div>
  );
}
