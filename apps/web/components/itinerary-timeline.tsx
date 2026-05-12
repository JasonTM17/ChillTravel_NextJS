import type { TripPlan } from "@vietwander/shared";
import { formatVnd } from "@/lib/utils";

export function ItineraryTimeline({ plan }: { plan: TripPlan }) {
  return (
    <div className="space-y-5">
      {plan.days.map((day) => (
        <section key={day.day} className="rounded-[16px] border border-[#dfd3c1] bg-white p-5 shadow-tv-card">
          <div className="flex flex-col gap-3 border-b border-[#eee6da] pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[tv-blue]">Ngày {day.day}</p>
              <h3 className="mt-1 text-xl font-bold text-[tv-ink]">{day.title}</h3>
            </div>
            <span className="w-fit rounded-full bg-[tv-blue-light] px-3 py-1 text-sm font-bold text-[tv-blue]">
              {formatVnd(day.estimatedCost)}
            </span>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <PlanBlock title="Buổi sáng" items={day.morning} />
            <PlanBlock title="Buổi chiều" items={day.afternoon} />
            <PlanBlock title="Buổi tối" items={day.evening} />
          </div>
        </section>
      ))}
    </div>
  );
}

function PlanBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-tv-sm bg-[#f8f1e6] p-4">
      <h4 className="font-bold text-[tv-ink]">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-[tv-ink-3]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
