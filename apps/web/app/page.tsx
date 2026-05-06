import Link from "next/link";
import { Bot, Globe2, MapPinned, Search, ShieldCheck, WalletCards } from "lucide-react";
import { destinations } from "@vietwander/shared";
import { DestinationCard } from "@/components/destination-card";

export default function HomePage() {
  const featuredVietnam = destinations.filter((item) => item.country === "Việt Nam").slice(0, 6);
  const world = destinations.filter((item) => item.country !== "Việt Nam").slice(0, 6);
  return (
    <main>
      <section className="cinematic relative overflow-hidden px-4 py-24 text-white md:py-32">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-mist">Vietnam & World Travel Intelligence</p>
            <h1 className="mt-5 text-5xl font-black leading-tight md:text-7xl">VIETWANDER AI</h1>
            <p className="mt-5 max-w-2xl text-lg text-white/82">A local-first AI travel concierge for Vietnam and the world: itinerary builder, mood search, budget simulator, culture guard, mock booking, and offline-ready mobile app.</p>
            <form className="glass mt-8 flex max-w-3xl flex-col gap-3 rounded-2xl p-3 md:flex-row" action="/explore">
              <label className="sr-only" htmlFor="hero-search">Bạn muốn đi đâu?</label>
              <div className="flex flex-1 items-center gap-3 rounded-xl bg-white px-4 py-3 text-navy">
                <Search size={20} />
                <input id="hero-search" name="q" placeholder="Bạn muốn đi đâu? Đà Nẵng, Paris, Tokyo..." className="w-full bg-transparent outline-none" />
              </div>
              <button className="rounded-xl bg-sunset px-6 py-3 font-bold text-white">Tạo lịch trình bằng AI</button>
            </form>
          </div>
          <div className="glass rounded-2xl p-5 text-navy">
            <div className="grid gap-3">
              {[
                ["Travel Personality Engine", "Food Hunter, Culture Seeker, Beach Lover"],
                ["Smart Budget Simulator", "Hotel, food, transport, activities"],
                ["Local Culture Guard", "Etiquette, safety, offline checklist"]
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl bg-white/70 p-4">
                  <h2 className="font-bold">{title}</h2>
                  <p className="text-sm text-navy/70">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FeatureBand />

      <section className="bg-ivory px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-bold uppercase tracking-[0.18em] text-teal">Top Vietnam</p>
              <h2 className="text-3xl font-black text-navy md:text-5xl">Curated Vietnam routes</h2>
            </div>
            <Link href="/explore" className="font-bold text-sunset">Explore all</Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {featuredVietnam.map((destination) => <DestinationCard key={destination.slug} destination={destination} />)}
          </div>
        </div>
      </section>

      <section className="bg-navy px-4 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="font-bold uppercase tracking-[0.18em] text-sunset">World Bucket List</p>
          <h2 className="mt-3 text-3xl font-black md:text-5xl">From Tokyo neon to Swiss Alps calm</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {world.map((destination) => <DestinationCard key={destination.slug} destination={destination} />)}
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureBand() {
  const features = [
    [Bot, "AI Trip Planner", "Structured day-by-day plans with citations and save actions."],
    [WalletCards, "Mock Booking", "Sandbox-only payment paths with no real transaction."],
    [MapPinned, "Map Discovery", "Clustered markers and route previews with offline fallback."],
    [ShieldCheck, "Culture Guard", "Local etiquette, safety notes, and packing reminders."],
    [Globe2, "Vietnam + World", "A distinctive Vietnamese lens for global travel planning."]
  ];
  return (
    <section className="bg-white px-4 py-14">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-5">
        {features.map(([Icon, title, text]) => (
          <div key={String(title)} className="rounded-2xl border border-navy/10 p-5">
            <Icon className="text-teal" aria-hidden="true" />
            <h2 className="mt-4 font-bold text-navy">{title as string}</h2>
            <p className="mt-2 text-sm text-navy/70">{text as string}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
