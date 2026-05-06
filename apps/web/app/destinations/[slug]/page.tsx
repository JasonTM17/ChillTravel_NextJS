import { notFound } from "next/navigation";
import Link from "next/link";
import { destinations } from "@vietwander/shared";
import { ItineraryTimeline } from "@/components/itinerary-timeline";
import { getDestinationBySlug } from "@/lib/travel";
import { formatVnd } from "@/lib/utils";
import { buildDemoItinerary } from "@vietwander/shared";

export function generateStaticParams() {
  return destinations.map((destination) => ({ slug: destination.slug }));
}

export default async function DestinationDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);
  if (!destination) notFound();
  const plan = buildDemoItinerary(destination, 3);
  return (
    <main className="bg-ivory">
      <section className="cinematic px-4 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="font-bold uppercase tracking-[0.18em] text-mist">{destination.country} / {destination.city}</p>
          <h1 className="mt-4 text-5xl font-black md:text-7xl">{destination.name}</h1>
          <p className="mt-5 max-w-3xl text-lg text-white/82">{destination.longDescription}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={"/ai-planner?destination=" + destination.slug} className="rounded-lg bg-sunset px-5 py-3 font-bold">Generate trip plan</Link>
            <Link href="/compare" className="rounded-lg bg-white/15 px-5 py-3 font-bold">Compare</Link>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <Panel title="Why visit">{destination.summary}</Panel>
          <Panel title="Best time to go">{destination.bestTimeToVisit}</Panel>
          <Panel title="Local food">{destination.foodHighlights.join(", ")}</Panel>
          <Panel title="Culture and safety">{destination.cultureNotes.join(" ")}</Panel>
          <ItineraryTimeline plan={plan} />
        </div>
        <aside className="space-y-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-navy">Budget range</h2>
            <p className="mt-2 text-2xl font-black text-teal">{formatVnd(destination.budgetMin)} - {formatVnd(destination.budgetMax)}</p>
            <p className="mt-2 text-sm text-navy/60">Sample/local estimate only.</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-navy">Suggested hotels mock</h2>
            <ul className="mt-3 space-y-3 text-sm">
              {destination.hotelsMock.map((hotel) => <li key={hotel.name}>{hotel.name} — {formatVnd(hotel.nightlyPrice)}</li>)}
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black text-navy">{title}</h2>
      <p className="mt-3 text-navy/72">{children}</p>
    </section>
  );
}
