import type { TripPlan } from "@vietwander/shared";
import { formatVnd } from "@/lib/utils";

export function ItineraryTimeline({ plan }: { plan: TripPlan }) {
  return (
    <div className="space-y-5">
      {plan.days.map((day) => (
        <section key={day.day} className="rounded-[16px] border border-[#dfd3c1] bg-white p-5 shadow-[0_18px_54px_rgba(7,24,39,0.06)]">
          <div className="flex flex-col gap-3 border-b border-[#eee6da] pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0277d4]">Ngày {day.day}</p>
              <h3 className="mt-1 text-xl font-black text-[#071827]">{day.title}</h3>
            </div>
            <span className="w-fit rounded-full bg-[#eef7ff] px-3 py-1 text-sm font-black text-[#0277d4]">
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
    <div className="rounded-xl bg-[#f8f1e6] p-4">
      <h4 className="font-black text-[#071827]">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-[#40515d]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
