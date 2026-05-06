import Link from "next/link";
import { ArrowRight, CalendarDays, MapPinned, Search, ShieldCheck, SlidersHorizontal, Star, Utensils, WalletCards } from "lucide-react";
import { destinations, normalizeTravelText } from "@vietwander/shared";
import type { Destination } from "@vietwander/shared";
import { MoodSearchPanel } from "@/components/ai/mood-search-panel";
import { DestinationCard } from "@/components/destination-card";
import { getDestinationCopy } from "@/lib/destination-copy";
import { getDestinationImage } from "@/lib/destination-images";
import { formatVnd } from "@/lib/utils";

const styleOptions = ["beach", "culture", "food", "family", "mountain", "luxury"];
const seasonOptions = ["February to August", "October to April", "November to April", "May to September"];

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ q?: string; style?: string }> }) {
  const { q = "", style = "" } = await searchParams;
  const normalizedQuery = normalizeTravelText(`${q} ${style}`.trim());
  const filtered = normalizedQuery
    ? destinations.filter((destination) => matchesQuery(destination, normalizedQuery))
    : destinations;
  const active = filtered[0] ?? destinations.find((destination) => destination.slug === "da-nang") ?? destinations[0];
  const activeCopy = getDestinationCopy(active);

  return (
    <main className="min-h-screen bg-[#fff8ef] text-[#071827]">
      <section className="border-b border-[#e6dfd3] bg-[#f8f3ea] px-4 py-8 md:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#0f766e]">Explore workspace</p>
            <h1 className="font-editorial mt-2 text-4xl font-black leading-tight md:text-6xl">
              Curate destinations while the route stays visible.
            </h1>
          </div>
          <form
            action="/explore"
            className="grid gap-2 rounded-xl border border-[#e6dfd3] bg-[#fff8ef] p-2 md:grid-cols-[1fr_132px]"
          >
            <label className="flex min-w-0 items-center gap-3 rounded-lg border border-[#ded4c6] px-3 py-2">
              <Search size={17} className="shrink-0 text-[#0f766e]" aria-hidden="true" />
              <span className="sr-only">Search destination</span>
              <input
                name="q"
                defaultValue={q}
                placeholder="Da Nang, quiet beach, food..."
                className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-[#8c7164]"
              />
            </label>
            <button className="rounded-lg bg-[#f97316] px-4 py-2 text-sm font-black text-white transition hover:bg-[#d95f09]">
              Curate
            </button>
          </form>
        </div>
      </section>

      <section className="px-4 py-8 md:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-5 lg:grid-cols-[260px_minmax(0,1fr)_330px]">
          <FilterRail selectedStyle={style} />

          <section>
            <div className="mb-5 grid gap-4 rounded-xl border border-[#e6dfd3] bg-[#f8f3ea] p-4 md:grid-cols-[168px_1fr]">
              <div
                className="min-h-[150px] rounded-lg bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(7,24,39,0.02), rgba(7,24,39,0.28)), url(${getDestinationImage(active.slug)})`
                }}
                aria-label={`${activeCopy.name} preview image`}
              />
              <div className="flex min-w-0 flex-col justify-between gap-4">
                <div>
                  <div className="flex flex-wrap gap-2">
                    {active.travelStyles.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full bg-[#0f766e]/10 px-3 py-1 text-xs font-black text-[#0f766e]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="font-editorial mt-3 text-3xl font-black">{filtered.length ? `${filtered.length} matching dossiers` : "No matching dossier"}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#584237]">
                    Active focus: {activeCopy.name}. Sample knowledge only; check official sources for live flight, visa, and weather decisions.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 text-sm font-bold text-[#584237]">
                  <span className="inline-flex items-center gap-2"><Star size={15} className="text-[#b45309]" fill="currentColor" /> {active.ratingAvg.toFixed(1)}</span>
                  <span className="inline-flex items-center gap-2"><WalletCards size={15} className="text-[#0f766e]" /> {formatVnd(active.budgetMin)}+</span>
                  <span className="inline-flex items-center gap-2"><CalendarDays size={15} className="text-[#0f766e]" /> {active.bestTimeToVisit}</span>
                </div>
              </div>
            </div>

            {filtered.length ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((destination) => (
                  <DestinationCard key={destination.slug} destination={destination} />
                ))}
              </div>
            ) : (
              <EmptyResults />
            )}
          </section>

          <RouteDossier destination={active} />
        </div>
      </section>

      <section className="border-t border-[#e6dfd3] bg-[#f8f3ea] px-4 py-10 md:px-8">
        <div className="mx-auto max-w-[1440px]">
          <MoodSearchPanel />
        </div>
      </section>
    </main>
  );
}

function FilterRail({ selectedStyle }: { selectedStyle: string }) {
  return (
    <aside className="h-fit rounded-xl border border-[#e6dfd3] bg-[#f8f3ea] p-5 lg:sticky lg:top-24">
      <div className="flex items-center justify-between border-b border-[#ded4c6] pb-4">
        <h2 className="font-editorial text-xl font-black">Refine</h2>
        <SlidersHorizontal className="text-[#0f766e]" size={18} aria-hidden="true" />
      </div>

      <FilterGroup title="Region" values={["Vietnam", "World", "Asia", "Europe"]} />
      <FilterGroup title="Trip style" values={styleOptions} selected={selectedStyle} />
      <FilterGroup title="Season" values={seasonOptions} />

      <div className="mt-6 border-t border-[#ded4c6] pt-5">
        <div className="flex items-center gap-2 text-sm font-black text-[#071827]">
          <WalletCards size={17} className="text-[#0f766e]" aria-hidden="true" />
          Budget range
        </div>
        <div className="mt-4 h-2 rounded-full bg-[#ded4c6]">
          <div className="h-2 w-2/3 rounded-full bg-[#0f766e]" />
        </div>
        <div className="mt-3 flex justify-between text-xs font-bold text-[#584237]">
          <span>{formatVnd(500000)}</span>
          <span>{formatVnd(5000000)}+</span>
        </div>
      </div>
    </aside>
  );
}

function FilterGroup({ title, values, selected = "" }: { title: string; values: string[]; selected?: string }) {
  return (
    <div className="mt-5">
      <h3 className="text-xs font-black uppercase tracking-[0.16em] text-[#584237]">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {values.map((value) => {
          const active = normalizeTravelText(selected) === normalizeTravelText(value);
          return (
            <Link
              key={value}
              href={`/explore?q=${encodeURIComponent(value)}`}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                active ? "border-[#0f766e] bg-[#0f766e]/10 text-[#0f766e]" : "border-[#d9cebf] text-[#584237] hover:border-[#0f766e] hover:text-[#0f766e]"
              }`}
            >
              {value}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function RouteDossier({ destination }: { destination: Destination }) {
  const copy = getDestinationCopy(destination);
  const stops = [copy.name, destination.tags.includes("Vietnam") ? "Local food stop" : "Historic core", "Culture guard"];

  return (
    <aside className="h-fit rounded-xl border border-[#e6dfd3] bg-[#071827] p-5 text-white lg:sticky lg:top-24">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f7d7b7]">Route dossier</p>
      <h2 className="font-editorial mt-2 text-2xl font-black">{copy.name}</h2>
      <div className="mt-5 space-y-4">
        {stops.map((stop, index) => (
          <div key={stop} className="grid grid-cols-[28px_1fr] gap-3">
            <span className="grid h-7 w-7 place-items-center rounded-full border border-white/20 bg-white/10 text-xs font-black">{index + 1}</span>
            <div className="border-b border-white/12 pb-4">
              <p className="font-black">{stop}</p>
              <p className="mt-1 text-sm text-white/62">{index === 0 ? destination.bestTimeToVisit : index === 1 ? destination.foodHighlights.slice(0, 2).join(", ") : destination.cultureNotes[0]}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 text-sm">
        <DossierMetric icon={ShieldCheck} label="Safety" value={`${destination.safetyLevel} confidence`} />
        <DossierMetric icon={WalletCards} label="Daily budget" value={`${formatVnd(destination.budgetMin)}+`} />
        <DossierMetric icon={Utensils} label="Food focus" value={destination.foodHighlights[0] ?? "Local dining"} />
      </div>

      <div className="mt-5 grid gap-2">
        <Link href={`/ai-planner?destination=${destination.slug}`} className="inline-flex items-center justify-between rounded-lg bg-white px-4 py-3 text-sm font-black text-[#071827]">
          Quick itinerary
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link href={`/booking/${destination.slug}`} className="inline-flex items-center justify-between rounded-lg border border-white/16 px-4 py-3 text-sm font-black text-white">
          Mock booking
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}

function DossierMetric({ icon: Icon, label, value }: { icon: typeof ShieldCheck; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-white/12 p-3">
      <Icon size={17} className="mt-0.5 text-[#f97316]" aria-hidden="true" />
      <span>
        <span className="block text-xs font-black uppercase tracking-[0.14em] text-white/48">{label}</span>
        <span className="mt-1 block font-bold text-white/86">{value}</span>
      </span>
    </div>
  );
}

function EmptyResults() {
  return (
    <div className="rounded-xl border border-dashed border-[#cdbfae] bg-[#f8f3ea] p-10 text-center">
      <MapPinned className="mx-auto text-[#0f766e]" size={34} aria-hidden="true" />
      <h2 className="font-editorial mt-4 text-2xl font-black">No destination matched that search.</h2>
      <p className="mt-2 text-[#584237]">Try a place, region, travel style, food, or season.</p>
      <Link href="/explore" className="mt-5 inline-flex rounded-lg bg-[#071827] px-5 py-3 font-bold text-white">
        Reset explore
      </Link>
    </div>
  );
}

function matchesQuery(destination: Destination, normalizedQuery: string) {
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
}
