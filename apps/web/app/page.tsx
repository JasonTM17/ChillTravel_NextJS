import Link from "next/link";
import { ArrowRight, Globe2, MapPinned, Route, Search, ShieldCheck, WalletCards } from "lucide-react";
import { destinations } from "@vietwander/shared";
import { DestinationCard } from "@/components/destination-card";
import { getDestinationCopy } from "@/lib/destination-copy";

export default function HomePage() {
  const featuredVietnam = destinations.filter((item) => item.tags.includes("Vietnam")).slice(0, 6);
  const world = destinations.filter((item) => item.tags.includes("World")).slice(0, 6);
  const lead = getDestinationCopy(featuredVietnam[5] ?? featuredVietnam[0] ?? destinations[0]);

  return (
    <main>
      <section className="cinematic relative overflow-hidden px-4 py-20 text-white md:py-28">
        <div className="absolute inset-0 bg-gradient-to-t from-[#071827] via-[#071827]/32 to-transparent" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#f7d7b7]">Vietnam and world travel dossiers</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.94] tracking-normal md:text-7xl">
              Plan trips that feel researched, local, and beautifully paced.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/84">
              VietWander blends curated destination data, local culture notes, budget simulation, mock booking, and a
              local-first travel concierge into one portfolio-grade platform.
            </p>
            <form className="mt-8 grid max-w-3xl gap-3 rounded-[16px] border border-white/18 bg-white/12 p-3 backdrop-blur-md md:grid-cols-[1fr_auto]" action="/explore">
              <label className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-[#071827]">
                <Search size={20} className="text-[#0f766e]" aria-hidden="true" />
                <span className="sr-only">Search destination</span>
                <input
                  id="hero-search"
                  name="q"
                  placeholder="Da Nang, Paris, quiet coast, family food trip..."
                  className="w-full bg-transparent outline-none"
                />
              </label>
              <button className="rounded-xl bg-[#f97316] px-6 py-3 font-black text-white transition hover:bg-[#ea580c]">
                Explore routes
              </button>
            </form>
          </div>

          <div className="rounded-[18px] border border-white/16 bg-white/12 p-5 backdrop-blur-md">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f7d7b7]">Featured dossier</p>
            <h2 className="mt-4 text-4xl font-black">{lead.name}</h2>
            <p className="mt-3 leading-7 text-white/82">{lead.summary}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ["Best for", "Food + beach"],
                ["Budget", "Mid range"],
                ["Pace", "Balanced"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-white/14 bg-white/10 p-3">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/58">{label}</p>
                  <p className="mt-2 font-black">{value}</p>
                </div>
              ))}
            </div>
            <Link href="/destinations/da-nang" className="mt-6 inline-flex items-center gap-2 font-black text-[#f7d7b7]">
              Open dossier <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <FeatureBand />

      <section className="bg-[#fdf9f0] px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-black uppercase tracking-[0.18em] text-[#0f766e]">Top Vietnam</p>
              <h2 className="mt-2 text-4xl font-black text-[#071827] md:text-5xl">Routes with a Vietnamese lens</h2>
            </div>
            <Link href="/explore?q=Vietnam" className="inline-flex items-center gap-2 font-black text-[#b45309]">
              Explore all <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredVietnam.map((destination) => (
              <DestinationCard key={destination.slug} destination={destination} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="font-black uppercase tracking-[0.18em] text-[#0f766e]">World bucket list</p>
          <h2 className="mt-3 max-w-3xl text-4xl font-black text-[#071827] md:text-5xl">
            Global trips with the same practical detail.
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {world.map((destination) => (
              <DestinationCard key={destination.slug} destination={destination} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureBand() {
  const features = [
    [Route, "Itinerary builder", "Day-by-day routes with morning, afternoon, evening, cost, and culture notes."],
    [WalletCards, "Budget simulator", "Tune hotel, food, transport, and activities before saving a trip."],
    [MapPinned, "Map discovery", "Destination markers, route previews, and offline-friendly fallback data."],
    [ShieldCheck, "Culture guard", "Etiquette, safety reminders, packing lists, and local sample citations."],
    [Globe2, "Local-first AI", "Runtime chat uses local provider interfaces, RAG, and no OpenAI key dependency."]
  ];
  return (
    <section className="border-y border-[#eadfce] bg-white px-4 py-10">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-5">
        {features.map(([Icon, title, text]) => (
          <div key={String(title)} className="rounded-[14px] border border-[#e6dfd3] bg-[#fdf9f0] p-5">
            <Icon className="text-[#0f766e]" aria-hidden="true" />
            <h2 className="mt-4 font-black text-[#071827]">{title as string}</h2>
            <p className="mt-2 text-sm leading-6 text-[#687983]">{text as string}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
