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
    <PageShell eyebrow="Planning desk" title="Compose a route dossier with budget, culture, food, and safety context">
      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
        <form className="rounded-[16px] border border-[#dfd3c1] bg-white p-5 shadow-[0_18px_54px_rgba(7,24,39,0.06)]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">Traveler brief</p>
          <h2 className="font-editorial mt-2 text-3xl font-black text-[#071827]">Shape the journey</h2>
          <p className="mt-2 text-sm leading-6 text-[#584237]">
            The local service drafts from sample knowledge and flags anything that would require live official data.
          </p>
          <div className="mt-5 border-t border-[#eee6da] pt-5">
          <label className="text-sm font-black text-[#071827]" htmlFor="destination">Destination</label>
          <select id="destination" name="destination" defaultValue={selected.slug} className="mt-2 w-full rounded-lg border border-[#dfd3c1] bg-[#fdf9f0] px-3 py-3">
            {destinations.map((item) => <option key={item.slug} value={item.slug}>{getDestinationCopy(item).name}</option>)}
          </select>
          </div>
          {["From city", "Dates or duration", "Travelers", "Budget", "Interests", "Pace"].map((label) => (
            <label key={label} className="mt-4 block text-sm font-black text-[#071827]">
              {label}
              <input className="mt-2 w-full rounded-lg border border-[#dfd3c1] bg-[#fdf9f0] px-3 py-3" placeholder={label} />
            </label>
          ))}
          <button className="mt-5 w-full rounded-lg bg-[#f97316] px-4 py-3 font-black text-white">Draft route dossier</button>
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
