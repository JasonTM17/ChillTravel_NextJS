import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Coffee,
  MapPinned,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Utensils,
  WalletCards,
  Wifi
} from "lucide-react";
import { destinations, normalizeTravelText } from "@vietwander/shared";
import type { Destination } from "@vietwander/shared";
import { getDestinationCopy } from "@/lib/destination-copy";
import { getDestinationImage } from "@/lib/destination-images";
import { formatVnd } from "@/lib/utils";

const styleOptions = ["Beach", "Culture", "Food", "Family", "Mountain", "Luxury"];
const sortOptions = ["Best match", "Highest rating", "Lowest budget", "Best season"];

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ q?: string; style?: string }> }) {
  const { q = "Da Nang", style = "" } = await searchParams;
  const normalizedQuery = normalizeTravelText(`${q} ${style}`.trim());
  const filtered = normalizedQuery
    ? destinations.filter((destination) => matchesQuery(destination, normalizedQuery))
    : destinations;
  const active = filtered[0] ?? destinations.find((destination) => destination.slug === "da-nang") ?? destinations[0];

  return (
    <main className="min-h-screen bg-[#f6fbff] text-[#071827]">
      <SearchHeader q={q} />

      <section className="px-4 py-6 md:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-5 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
          <FilterRail selectedStyle={style} />

          <section className="min-w-0">
            <ResultsToolbar count={filtered.length} q={q} />
            <div className="mt-4 space-y-4">
              {filtered.length ? (
                filtered.map((destination) => <SearchResultCard key={destination.slug} destination={destination} />)
              ) : (
                <EmptyResults />
              )}
            </div>
          </section>

          <TripSidePanel destination={active} />
        </div>
      </section>
    </main>
  );
}

function SearchHeader({ q }: { q: string }) {
  return (
    <section className="border-b border-[#d9ecfb] bg-white px-4 py-5 md:px-8">
      <div className="mx-auto max-w-[1440px]">
        <form action="/explore" className="booking-card-shadow grid gap-3 rounded-2xl border border-[#d9ecfb] bg-white p-3 lg:grid-cols-[1.3fr_1fr_1fr_1fr_auto]">
          <label className="flex min-w-0 items-center gap-3 rounded-xl border border-[#d9ecfb] bg-[#f7fbff] px-4 py-3">
            <Search size={18} className="shrink-0 text-[#0277d4]" aria-hidden="true" />
            <span className="min-w-0">
              <span className="block text-xs font-bold text-[#6f8594]">City, destination, or hotel</span>
              <input name="q" defaultValue={q} className="mt-1 w-full bg-transparent font-black outline-none" />
            </span>
          </label>
          <CompactField icon={CalendarDays} label="Check-in" value="Aug 12, 2026" />
          <CompactField icon={CalendarDays} label="Check-out" value="Aug 16, 2026" />
          <CompactField icon={WalletCards} label="Budget" value={`${formatVnd(4500000)} avg`} />
          <button className="rounded-xl bg-[#ff6d1a] px-6 py-4 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:bg-[#e95c0a]">
            Search
          </button>
        </form>
      </div>
    </section>
  );
}

function CompactField({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-[#d9ecfb] bg-[#f7fbff] px-4 py-3">
      <Icon size={18} className="shrink-0 text-[#0277d4]" aria-hidden="true" />
      <span className="min-w-0">
        <span className="block text-xs font-bold text-[#6f8594]">{label}</span>
        <span className="mt-1 block truncate font-black">{value}</span>
      </span>
    </div>
  );
}

function ResultsToolbar({ count, q }: { count: number; q: string }) {
  return (
    <div className="rounded-2xl border border-[#d9ecfb] bg-white p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0277d4]">Search results</p>
          <h1 className="mt-1 text-2xl font-black md:text-3xl">{count} places for {q || "your trip"}</h1>
          <p className="mt-1 text-sm text-[#476273]">Sample local inventory. Live rates, flights, weather, and visa data are not claimed.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option, index) => (
            <button
              key={option}
              className={`rounded-full border px-3 py-2 text-xs font-black ${
                index === 0 ? "border-[#0277d4] bg-[#eef7ff] text-[#0277d4]" : "border-[#d9ecfb] bg-white text-[#476273]"
              }`}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterRail({ selectedStyle }: { selectedStyle: string }) {
  return (
    <aside className="h-fit rounded-2xl border border-[#d9ecfb] bg-white p-5 lg:sticky lg:top-28">
      <div className="flex items-center justify-between border-b border-[#edf4fa] pb-4">
        <h2 className="text-xl font-black">Filter your search</h2>
        <SlidersHorizontal className="text-[#0277d4]" size={18} aria-hidden="true" />
      </div>

      <FilterGroup title="Popular filters" values={["Breakfast included", "Pay at property", "Free cancellation", "Family friendly"]} />
      <FilterGroup title="Trip style" values={styleOptions} selected={selectedStyle} />
      <FilterGroup title="Area" values={["Beachfront", "Old town", "City center", "Mountain view"]} />

      <div className="mt-6 rounded-2xl bg-[#f7fbff] p-4">
        <div className="flex items-center gap-2 text-sm font-black">
          <WalletCards size={17} className="text-[#0277d4]" aria-hidden="true" />
          Price per day
        </div>
        <div className="mt-4 h-2 rounded-full bg-[#d8ecfb]">
          <div className="h-2 w-2/3 rounded-full bg-[#0277d4]" />
        </div>
        <div className="mt-3 flex justify-between text-xs font-bold text-[#476273]">
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
      <h3 className="text-xs font-black uppercase tracking-[0.16em] text-[#6f8594]">{title}</h3>
      <div className="mt-3 grid gap-2">
        {values.map((value) => {
          const active = normalizeTravelText(selected) === normalizeTravelText(value);
          return (
            <Link
              key={value}
              href={`/explore?q=${encodeURIComponent(value)}`}
              className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm font-bold transition ${
                active ? "border-[#0277d4] bg-[#eef7ff] text-[#0277d4]" : "border-[#edf4fa] bg-white text-[#476273] hover:border-[#0277d4] hover:text-[#0277d4]"
              }`}
            >
              <span>{value}</span>
              {active ? <CheckCircle2 size={16} aria-hidden="true" /> : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultCard({ destination }: { destination: Destination }) {
  const copy = getDestinationCopy(destination);

  return (
    <article className="grid overflow-hidden rounded-2xl border border-[#d9ecfb] bg-white shadow-[0_14px_36px_rgba(2,68,120,0.08)] md:grid-cols-[250px_minmax(0,1fr)_220px]">
      <Link
        href={`/destinations/${destination.slug}`}
        className="min-h-[220px] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(7,24,39,0.02), rgba(7,24,39,0.28)), url(${getDestinationImage(destination.slug)})`
        }}
        aria-label={`${copy.name} detail`}
      />

      <div className="min-w-0 p-5">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full bg-[#eef7ff] px-3 py-1 font-black text-[#0277d4]">{copy.country}</span>
          <span className="inline-flex items-center gap-1 font-black text-[#b45309]">
            <Star size={15} fill="currentColor" aria-hidden="true" />
            {destination.ratingAvg.toFixed(1)}
          </span>
          <span className="text-[#6f8594]">({destination.reviewCount} reviews)</span>
        </div>
        <Link href={`/destinations/${destination.slug}`} className="mt-3 block text-2xl font-black hover:text-[#0277d4]">
          {copy.name}
        </Link>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#476273]">{copy.summary}</p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-[#476273]">
          <Amenity icon={Wifi} label="Offline pack" />
          <Amenity icon={Coffee} label={destination.foodHighlights[0] ?? "Local food"} />
          <Amenity icon={ShieldCheck} label={`${destination.safetyLevel} safety`} />
          <Amenity icon={MapPinned} label={copy.city} />
        </div>
      </div>

      <aside className="flex flex-col justify-between border-t border-[#edf4fa] bg-[#fbfdff] p-5 md:border-l md:border-t-0">
        <div>
          <p className="text-xs font-bold text-[#6f8594]">Starting from</p>
          <p className="mt-1 text-2xl font-black text-[#ff5f12]">{formatVnd(destination.budgetMin)}</p>
          <p className="mt-1 text-xs font-bold text-[#6f8594]">per day, sample price</p>
          <p className="mt-4 inline-flex rounded-full bg-[#fff3e8] px-3 py-1 text-xs font-black text-[#b45309]">Demo payment only</p>
        </div>
        <div className="mt-5 grid gap-2">
          <Link href={`/booking/${destination.slug}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff6d1a] px-4 py-3 text-sm font-black text-white hover:bg-[#e95c0a]">
            View deal
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link href={`/ai-planner?destination=${destination.slug}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d9ecfb] bg-white px-4 py-3 text-sm font-black text-[#0277d4] hover:bg-[#eef7ff]">
            AI plan
            <Sparkles size={16} aria-hidden="true" />
          </Link>
        </div>
      </aside>
    </article>
  );
}

function Amenity({ icon: Icon, label }: { icon: typeof Wifi; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#f3f9ff] px-3 py-1">
      <Icon size={14} className="text-[#0277d4]" aria-hidden="true" />
      {label}
    </span>
  );
}

function TripSidePanel({ destination }: { destination: Destination }) {
  const copy = getDestinationCopy(destination);

  return (
    <aside className="h-fit rounded-2xl border border-[#d9ecfb] bg-white p-5 lg:sticky lg:top-28">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0277d4]">Your trip cart</p>
      <h2 className="mt-2 text-2xl font-black">{copy.name}</h2>
      <div className="mt-5 space-y-3 text-sm">
        <CartRow label="Stay" value={`${formatVnd(destination.budgetMin)}+`} />
        <CartRow label="Experience" value={destination.foodHighlights[0] ?? "Local food"} />
        <CartRow label="AI route" value="4-day balanced plan" />
      </div>
      <div className="mt-5 rounded-2xl bg-[#f7fbff] p-4">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6f8594]">Culture guard</p>
        <p className="mt-2 text-sm leading-6 text-[#34566f]">{destination.cultureNotes[0]}</p>
      </div>
      <Link href={`/booking/${destination.slug}`} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0277d4] px-4 py-3 text-sm font-black text-white hover:bg-[#005ea8]">
        Continue mock booking
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </aside>
  );
}

function CartRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#edf4fa] pb-3">
      <span className="font-bold text-[#476273]">{label}</span>
      <span className="text-right font-black">{value}</span>
    </div>
  );
}

function EmptyResults() {
  return (
    <div className="rounded-2xl border border-dashed border-[#b8d8f0] bg-white p-10 text-center">
      <MapPinned className="mx-auto text-[#0277d4]" size={34} aria-hidden="true" />
      <h2 className="mt-4 text-2xl font-black">No place matched that search.</h2>
      <p className="mt-2 text-[#476273]">Try a city, destination, food, travel style, or season.</p>
      <Link href="/explore" className="mt-5 inline-flex rounded-xl bg-[#0277d4] px-5 py-3 font-bold text-white">
        Reset search
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
