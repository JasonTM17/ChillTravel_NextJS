import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Download,
  Gauge,
  MapPinned,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Utensils,
  WalletCards,
  WifiOff
} from "lucide-react";
import { destinations } from "@vietwander/shared";
import type { Destination } from "@vietwander/shared";
import { DestinationCard } from "@/components/destination-card";
import { getDestinationCopy } from "@/lib/destination-copy";
import { getDestinationImage, getEditorialHeroImage } from "@/lib/destination-images";
import { formatVnd } from "@/lib/utils";

const routeStops = ["Da Nang", "Hoi An", "My Son"] as const;
const styleOptions = ["Adventure", "Luxury", "Culinary", "Cultural"] as const;

export default function HomePage() {
  const daNang = findDestination("da-nang");
  const workspaceDestinations = ["ninh-binh", "sapa", "ha-long", "hoi-an"]
    .map(findDestination)
    .filter((destination): destination is Destination => Boolean(destination));
  const worldShortlist = destinations.filter((item) => item.tags.includes("World")).slice(0, 3);

  return (
    <main className="min-h-screen bg-[#fff8ef] text-[#071827]">
      <HeroCommandCenter destination={daNang} />
      <ExploreWorkspace destinations={workspaceDestinations} />
      <ToolModules />
      <WorldStrip destinations={worldShortlist} />
      <TrustBoundary />
    </main>
  );
}

function HeroCommandCenter({ destination }: { destination: Destination }) {
  const copy = getDestinationCopy(destination);

  return (
    <section className="grid min-h-[calc(100svh-72px)] border-b border-[#e6dfd3] lg:grid-cols-[minmax(0,1.36fr)_minmax(390px,0.64fr)]">
      <div
        className="relative flex min-h-[540px] items-end overflow-hidden bg-[#071827] p-4 text-white md:p-8 lg:min-h-[calc(100svh-72px)]"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(7,24,39,0.08), rgba(7,24,39,0.82)), url(${getEditorialHeroImage()})`,
          backgroundPosition: "center",
          backgroundSize: "cover"
        }}
      >
        <div className="relative z-10 w-full">
          <div className="flex flex-wrap gap-2">
            {["Autumn", "Safety high", "Premium", "Heritage trail"].map((tag) => (
              <span key={tag} className="rounded-full border border-white/24 bg-[#071827]/52 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-white/86">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f7d7b7]">Current route</p>
              <h1 className="font-editorial mt-2 text-5xl font-black leading-[1.02] md:text-7xl">
                {copy.name} - Hoi An
              </h1>
            </div>
            <Link
              href="/explore?q=Da+Nang"
              className="inline-flex items-center gap-2 rounded-lg border border-white/24 bg-white/12 px-4 py-3 text-sm font-black text-white backdrop-blur transition hover:bg-white/20"
            >
              Explore workspace
              <ArrowDown size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      <aside className="flex items-center bg-[#f8f3ea] px-4 py-8 md:px-8">
        <form action="/explore" className="w-full">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#0f766e]">Command center</p>
          <h2 className="font-editorial mt-3 text-4xl font-black leading-tight text-[#071827]">
            Design your optimal itinerary with precision.
          </h2>
          <div className="mt-8 space-y-6">
            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-[#584237]">Destination</span>
              <span className="mt-2 flex items-center gap-3 border-b border-[#cfc4b7] py-3">
                <Search size={17} className="text-[#0f766e]" aria-hidden="true" />
                <input
                  name="q"
                  defaultValue="Da Nang"
                  className="w-full bg-transparent text-sm font-semibold text-[#071827] outline-none"
                  aria-label="Destination"
                />
              </span>
            </label>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#584237]">Travel style</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {styleOptions.map((style) => (
                  <button
                    key={style}
                    type="button"
                    className={`rounded-lg border px-3 py-2 text-xs font-black uppercase tracking-[0.08em] transition ${
                      style === "Luxury"
                        ? "border-[#071827] bg-[#071827] text-white"
                        : "border-[#d9cebf] bg-[#fff8ef] text-[#584237] hover:border-[#0f766e] hover:text-[#0f766e]"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-[#584237]">Duration</span>
                  <span className="font-black">10 days</span>
                </div>
                <div className="mt-3 flex items-center justify-between border-y border-[#d9cebf] py-3">
                  <button type="button" className="grid h-8 w-8 place-items-center rounded-lg border border-[#d9cebf]" aria-label="Shorten trip">
                    <Minus size={15} />
                  </button>
                  <span className="text-sm font-bold text-[#584237]">5-14 days</span>
                  <button type="button" className="grid h-8 w-8 place-items-center rounded-lg border border-[#d9cebf]" aria-label="Extend trip">
                    <Plus size={15} />
                  </button>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-[#584237]">Budget est.</span>
                  <span className="font-black">{formatVnd(4500000)}</span>
                </div>
                <div className="mt-4 h-2 rounded-full bg-[#ded4c6]">
                  <div className="h-2 w-[62%] rounded-full bg-[#0f766e]" />
                </div>
                <div className="mt-2 flex justify-between text-[11px] font-bold text-[#6d6258]">
                  <span>{formatVnd(1000000)}</span>
                  <span>{formatVnd(10000000)}</span>
                </div>
              </div>
            </div>

            <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#f97316] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:bg-[#d95f09]">
              Build route
              <ArrowRight size={17} aria-hidden="true" />
            </button>
            <p className="text-center text-xs font-bold text-[#0f766e]">High-confidence precision from local sample knowledge</p>
          </div>
        </form>
      </aside>
    </section>
  );
}

function ExploreWorkspace({ destinations: items }: { destinations: Destination[] }) {
  return (
    <section className="px-4 py-12 md:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">Explore workspace</p>
            <h2 className="font-editorial mt-2 text-4xl font-black md:text-5xl">Search, compare, and keep the route visible.</h2>
          </div>
          <Link href="/explore?q=Da+Nang" className="inline-flex items-center gap-2 rounded-lg border border-[#d9cebf] bg-[#fff8ef] px-4 py-3 text-sm font-black text-[#071827]">
            Open full explore
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)_320px]">
          <FilterPanel />
          <div className="grid gap-5 md:grid-cols-2">
            {items.map((destination) => (
              <DestinationCard key={destination.slug} destination={destination} />
            ))}
          </div>
          <RouteDossier />
        </div>
      </div>
    </section>
  );
}

function FilterPanel() {
  return (
    <aside className="h-fit rounded-xl border border-[#e6dfd3] bg-[#f8f3ea] p-5 lg:sticky lg:top-24">
      <div className="flex items-center justify-between border-b border-[#ded4c6] pb-4">
        <h3 className="font-editorial text-xl font-black">Filters</h3>
        <SlidersHorizontal size={18} className="text-[#0f766e]" aria-hidden="true" />
      </div>
      {[
        ["Category", ["Coast", "Food", "Heritage", "Nature"]],
        ["Rating", ["4.7+", "4.8+", "4.9+"]],
        ["Pace", ["Chill", "Balanced", "Packed"]]
      ].map(([label, values]) => (
        <div key={label as string} className="mt-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#584237]">{label as string}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(values as string[]).map((value, index) => (
              <Link
                key={value}
                href={`/explore?q=${encodeURIComponent(value)}`}
                className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
                  index === 0 ? "border-[#0f766e] bg-[#0f766e]/10 text-[#0f766e]" : "border-[#d9cebf] text-[#584237]"
                }`}
              >
                {value}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}

function RouteDossier() {
  return (
    <aside className="h-fit rounded-xl border border-[#e6dfd3] bg-[#071827] p-5 text-white lg:sticky lg:top-24">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f7d7b7]">Route dossier</p>
      <h3 className="font-editorial mt-2 text-2xl font-black">Da Nang heritage loop</h3>
      <div className="mt-5 space-y-4">
        {routeStops.map((stop, index) => (
          <div key={stop} className="grid grid-cols-[28px_1fr] gap-3">
            <span className="grid h-7 w-7 place-items-center rounded-full border border-white/20 bg-white/10 text-xs font-black">{index + 1}</span>
            <div className="border-b border-white/12 pb-4">
              <p className="font-black">{stop}</p>
              <p className="mt-1 text-sm text-white/62">{index === 0 ? "Beach arrival and seafood" : index === 1 ? "Lantern evening and old town walk" : "Temple etiquette and heritage stop"}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-3 text-sm">
        <DossierMetric icon={ShieldCheck} label="Culture guard" value="Dress modestly for temple visits" />
        <DossierMetric icon={WalletCards} label="Cost estimate" value={formatVnd(4500000)} />
        <DossierMetric icon={CalendarDays} label="Best window" value="Feb-Aug" />
      </div>
      <Link href="/ai-planner?destination=da-nang" className="mt-5 inline-flex w-full items-center justify-between rounded-lg bg-white px-4 py-3 text-sm font-black text-[#071827]">
        Quick itinerary
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
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

function ToolModules() {
  const modules = [
    { icon: Gauge, title: "Smart Budget Simulator", text: "Daily spend curve across hotel, food, transport, and activities.", detail: "62% mid-range" },
    { icon: Search, title: "Mood Search", text: "Translate serene, vibrant, historic, or food-heavy moods into filters.", detail: "Serene + Food" },
    { icon: ShieldCheck, title: "Local Culture Guard", text: "Etiquette, safety, tipping, dress-code, and timing notes.", detail: "3 active notes" },
    { icon: Download, title: "Offline Travel Pack", text: "Save itinerary, checklist, emergency notes, and map fallback.", detail: "Ready for mobile" }
  ] as const;

  return (
    <section className="border-y border-[#e6dfd3] bg-[#f8f3ea] px-4 py-12 md:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {modules.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-xl border border-[#e6dfd3] bg-[#fff8ef] p-5">
                <div className="flex items-center justify-between">
                  <Icon size={20} className="text-[#0f766e]" aria-hidden="true" />
                  <span className="rounded-full bg-[#0f766e]/10 px-3 py-1 text-xs font-black text-[#0f766e]">{item.detail}</span>
                </div>
                <h3 className="font-editorial mt-5 text-2xl font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#584237]">{item.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WorldStrip({ destinations: items }: { destinations: Destination[] }) {
  return (
    <section className="px-4 py-12 md:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">World shortlist</p>
            <h2 className="font-editorial mt-2 text-4xl font-black">Global places, same operating system.</h2>
          </div>
          <Link href="/explore?q=World" className="hidden items-center gap-2 text-sm font-black text-[#071827] md:inline-flex">
            Browse all
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((destination) => {
            const copy = getDestinationCopy(destination);
            return (
              <Link
                key={destination.slug}
                href={`/destinations/${destination.slug}`}
                className="group grid min-h-[260px] overflow-hidden rounded-xl border border-[#e6dfd3] bg-cover bg-center p-4 text-white"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(7,24,39,0.08), rgba(7,24,39,0.78)), url(${getDestinationImage(destination.slug)})`
                }}
              >
                <div className="mt-auto">
                  <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white/84">
                    <Star size={15} fill="currentColor" />
                    {destination.ratingAvg.toFixed(1)}
                    <span>•</span>
                    <Utensils size={15} />
                    {destination.foodHighlights[0]}
                  </div>
                  <h3 className="font-editorial text-3xl font-black">{copy.name}</h3>
                  <p className="mt-2 text-sm text-white/72">{destination.bestTimeToVisit}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TrustBoundary() {
  return (
    <section className="border-t border-[#e6dfd3] bg-[#071827] px-4 py-4 text-white md:px-8">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 text-xs font-bold text-white/68">
        <span className="inline-flex items-center gap-2"><CheckCircle2 size={15} className="text-[#0f766e]" /> Local sample knowledge</span>
        <span className="inline-flex items-center gap-2"><MapPinned size={15} className="text-[#0f766e]" /> RAG runtime active</span>
        <span className="inline-flex items-center gap-2"><WalletCards size={15} className="text-[#f97316]" /> Mock payments only</span>
        <span className="inline-flex items-center gap-2"><WifiOff size={15} className="text-[#f97316]" /> No live flight, visa, or weather claims</span>
      </div>
    </section>
  );
}

function findDestination(slug: string) {
  return destinations.find((destination) => destination.slug === slug) ?? destinations[0];
}
