import { buildDemoItinerary, destinations } from "@vietwander/shared";
import { BudgetSimulator } from "@/components/ai/budget-simulator";
import { ItineraryTimeline } from "@/components/itinerary-timeline";
import { PageShell } from "@/components/page-shell";

export default async function AiPlannerPage({ searchParams }: { searchParams: Promise<{ destination?: string }> }) {
  const { destination = "da-nang" } = await searchParams;
  const selected = destinations.find((item) => item.slug === destination) ?? destinations[5];
  const plan = buildDemoItinerary(selected, 4);
  return (
    <PageShell eyebrow="AI Trip Planner" title="Build a grounded itinerary with budget, culture, food, and safety context">
      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
        <form className="rounded-2xl bg-white p-5 shadow-sm">
          <label className="text-sm font-bold text-navy" htmlFor="destination">Destination</label>
          <select id="destination" name="destination" defaultValue={selected.slug} className="mt-2 w-full rounded-lg border border-navy/15 px-3 py-3">
            {destinations.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
          </select>
          {["From city", "Dates or duration", "Travelers", "Budget", "Interests", "Pace"].map((label) => (
            <label key={label} className="mt-4 block text-sm font-bold text-navy">
              {label}
              <input className="mt-2 w-full rounded-lg border border-navy/15 px-3 py-3" placeholder={label} />
            </label>
          ))}
          <button className="mt-5 w-full rounded-lg bg-sunset px-4 py-3 font-bold text-white">Generate local AI plan</button>
        </form>
        <div>
          <ItineraryTimeline plan={plan} />
        </div>
      </div>
      <div className="mt-8">
        <BudgetSimulator initialDestinationSlug={selected.slug} />
      </div>
    </PageShell>
  );
}
