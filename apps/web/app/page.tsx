import Link from "next/link";
import { ArrowRight, BookOpenText, CircleDollarSign, Compass, MapPinned, Search, ShieldCheck, Smartphone, Sparkles } from "lucide-react";
import { destinations } from "@vietwander/shared";
import { DestinationCard } from "@/components/destination-card";
import { getDestinationCopy } from "@/lib/destination-copy";

const dossierRows = [
  ["Route", "Da Nang -> Hoi An", "balanced coastal culture"],
  ["Window", "February to August", "best light and beach days"],
  ["Guard", "Temple etiquette", "dress notes saved"],
  ["Budget", "Mid-range", "food-heavy itinerary"]
] as const;

export default function HomePage() {
  const featuredVietnam = destinations.filter((item) => item.tags.includes("Vietnam")).slice(0, 6);
  const world = destinations.filter((item) => item.tags.includes("World")).slice(0, 6);
  const lead = getDestinationCopy(featuredVietnam[5] ?? featuredVietnam[0] ?? destinations[0]);

  return (
    <main className="planning-desk text-[#071827]">
      <section className="hero-image-generated relative min-h-[calc(100svh-72px)] overflow-hidden px-4 py-20 text-white md:px-8">
        <div className="relative mx-auto flex min-h-[calc(100svh-240px)] max-w-[1440px] flex-col justify-end">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-[#f7d7b7]">Vietnam-first travel intelligence</p>
              <h1 className="font-editorial mt-5 max-w-5xl text-6xl font-black leading-[0.96] md:text-8xl">
                Unveil the hidden rhythm of every journey.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82">
                A cinematic planning desk for Vietnam and the world: local dossiers, route timing, culture guardrails,
                budget tradeoffs, and mock-safe bookings in one polished product.
              </p>

              <form className="mt-8 grid max-w-3xl gap-3 rounded-2xl border border-white/18 bg-[#071827]/42 p-3 backdrop-blur-md md:grid-cols-[1fr_auto]" action="/explore">
                <label className="flex min-w-0 items-center gap-3 rounded-xl bg-[#fdf9f0] px-4 py-3 text-[#071827]">
                  <Search size={20} className="shrink-0 text-[#0f766e]" aria-hidden="true" />
                  <span className="sr-only">Search destination</span>
                  <input
                    id="hero-search"
                    name="q"
                    placeholder="Da Nang, Hoi An, quiet coast, food trip..."
                    className="w-full bg-transparent outline-none placeholder:text-[#8c7164]"
                  />
                </label>
                <button className="rounded-xl bg-[#f97316] px-6 py-3 font-black text-white transition hover:bg-[#d95f09]">
                  Build route
                </button>
              </form>
            </div>

            <aside className="editorial-shadow rounded-3xl border border-white/14 bg-[#071827]/78 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f7d7b7]">Live route dossier</p>
                  <h2 className="font-editorial mt-2 text-3xl font-black">{lead.name}</h2>
                </div>
                <Sparkles className="text-[#f97316]" aria-hidden="true" />
              </div>
              <div className="mt-5 divide-y divide-white/12 rounded-2xl border border-white/12 bg-white/8">
                {dossierRows.map(([label, value, note]) => (
                  <div key={label} className="grid gap-2 p-4 sm:grid-cols-[92px_1fr]">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-white/48">{label}</p>
                    <div>
                      <p className="font-black">{value}</p>
                      <p className="mt-1 text-sm text-white/58">{note}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/ai-planner?destination=da-nang" className="mt-5 inline-flex w-full items-center justify-between rounded-xl bg-white px-4 py-3 font-black text-[#071827]">
                Open planning desk
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <IntelligenceStrip />

      <section className="px-4 py-20 md:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0f766e]">Featured intelligence</p>
              <h2 className="font-editorial mt-3 text-5xl font-black leading-[1.05] md:text-6xl">
                Vietnam routes with a human pace.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-[#584237]">
              Each destination card is a dossier: season, cost, local food, safety signal, and a practical next action.
              The intelligence is useful, but the experience should feel like opening a beautiful travel journal.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredVietnam.map((destination) => (
              <DestinationCard key={destination.slug} destination={destination} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#e0c0b1]/70 bg-[#071827] px-4 py-20 text-white md:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#f7d7b7]">Planning desk</p>
            <h2 className="font-editorial mt-3 text-5xl font-black leading-[1.05]">Tools that feel like field notes, not dashboards.</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/70">
              Budget, culture, safety, and route timing live together so a traveler can adjust a trip without losing the story.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              [BookOpenText, "Route timeline", "Morning, afternoon, evening cards with estimated cost."],
              [CircleDollarSign, "Budget dial", "Hotel, food, transport, and activity tradeoffs."],
              [ShieldCheck, "Culture guard", "Etiquette and safety reminders saved with the plan."],
              [Smartphone, "Offline pack", "Mobile-ready itinerary, wishlist, booking, and checklist cache."]
            ].map(([Icon, title, text]) => (
              <div key={String(title)} className="rounded-2xl border border-white/12 bg-white/8 p-5">
                <Icon className="text-[#f97316]" aria-hidden="true" />
                <h3 className="mt-4 font-editorial text-2xl font-black">{title as string}</h3>
                <p className="mt-2 text-sm leading-6 text-white/66">{text as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 md:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0f766e]">World short list</p>
              <h2 className="font-editorial mt-3 text-5xl font-black leading-[1.05]">Global places, same grounded logic.</h2>
            </div>
            <Link href="/explore?q=World" className="inline-flex items-center gap-2 rounded-xl border border-[#e0c0b1] px-4 py-3 font-black text-[#071827]">
              Browse all dossiers <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {world.map((destination) => (
              <DestinationCard key={destination.slug} destination={destination} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function IntelligenceStrip() {
  const items = [
    [Compass, "26", "sample destinations"],
    [MapPinned, "4", "route modes"],
    [ShieldCheck, "0", "real charges"],
    [BookOpenText, "local", "RAG runtime"]
  ];

  return (
    <section className="border-b border-[#e0c0b1]/70 bg-[#fdf9f0]/96 px-4 py-6 md:px-8">
      <div className="mx-auto grid max-w-[1440px] gap-3 md:grid-cols-4">
        {items.map(([Icon, value, label]) => (
          <div key={String(label)} className="rounded-2xl border border-[#e0c0b1]/70 bg-white/66 p-4">
            <Icon className="text-[#0f766e]" size={20} aria-hidden="true" />
            <p className="font-editorial mt-3 text-3xl font-black text-[#071827]">{value as string}</p>
            <p className="text-sm font-bold text-[#584237]">{label as string}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
