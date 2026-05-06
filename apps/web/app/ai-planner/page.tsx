import { buildDemoItinerary, destinations } from "@vietwander/shared";
import { BudgetSimulator } from "@/components/ai/budget-simulator";
import { ItineraryTimeline } from "@/components/itinerary-timeline";
import { PageShell } from "@/components/page-shell";
import { getDestinationCopy } from "@/lib/destination-copy";

export default async function AiPlannerPage({ searchParams }: { searchParams: Promise<{ destination?: string }> }) {
  const { destination = "da-nang" } = await searchParams;
  const selected = destinations.find((item) => item.slug === destination) ?? destinations[5];
  const plan = buildDemoItinerary(selected, 4);
  return (
    <PageShell eyebrow="Trip planner" title="Build a grounded itinerary with budget, culture, food, and safety context">
      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
        <form className="rounded-[16px] border border-[#dfd3c1] bg-white p-5 shadow-[0_18px_54px_rgba(7,24,39,0.06)]">
          <label className="text-sm font-black text-[#071827]" htmlFor="destination">Destination</label>
          <select id="destination" name="destination" defaultValue={selected.slug} className="mt-2 w-full rounded-lg border border-[#dfd3c1] bg-[#fdf9f0] px-3 py-3">
            {destinations.map((item) => <option key={item.slug} value={item.slug}>{getDestinationCopy(item).name}</option>)}
          </select>
          {["From city", "Dates or duration", "Travelers", "Budget", "Interests", "Pace"].map((label) => (
            <label key={label} className="mt-4 block text-sm font-black text-[#071827]">
              {label}
              <input className="mt-2 w-full rounded-lg border border-[#dfd3c1] bg-[#fdf9f0] px-3 py-3" placeholder={label} />
            </label>
          ))}
          <button className="mt-5 w-full rounded-lg bg-[#f97316] px-4 py-3 font-black text-white">Generate local plan</button>
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
