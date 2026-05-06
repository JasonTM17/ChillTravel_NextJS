import type { TripPlan } from "@vietwander/shared";
import { formatVnd } from "@/lib/utils";

export function ItineraryTimeline({ plan }: { plan: TripPlan }) {
  return (
    <div className="space-y-4">
      {plan.days.map((day) => (
        <section key={day.day} className="rounded-2xl border border-navy/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-navy">Day {day.day}: {day.title}</h3>
            <span className="rounded-full bg-ivory px-3 py-1 text-sm font-semibold text-teal">{formatVnd(day.estimatedCost)}</span>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <PlanBlock title="Morning" items={day.morning} />
            <PlanBlock title="Afternoon" items={day.afternoon} />
            <PlanBlock title="Evening" items={day.evening} />
          </div>
        </section>
      ))}
    </div>
  );
}

function PlanBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl bg-ivory p-4">
      <h4 className="font-semibold text-navy">{title}</h4>
      <ul className="mt-2 space-y-1 text-sm text-navy/70">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}
