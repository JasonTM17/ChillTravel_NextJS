"use client";

import { useMemo, useState } from "react";
import { compareDestinations, destinations, type TravelStyle } from "@vietwander/shared";
import { getDestinationCopy } from "@/lib/destination-copy";
import { formatVnd } from "@/lib/utils";
import { comparisonVerdictLabel, travelStyleLabel } from "@/lib/vietnamese";

const styles: TravelStyle[] = ["Culture Seeker", "Food Hunter", "Beach Lover", "Family Planner", "Luxury Escaper", "Budget Backpacker"];
const headings = ["Điểm đến", "Ngân sách", "Mùa đẹp", "Ẩm thực", "Gia đình", "Đêm vui", "An toàn", "Điểm gợi ý", "Kết luận"];

export function CompareConsole() {
  const [selected, setSelected] = useState(["da-nang", "bali", "paris"]);
  const [style, setStyle] = useState<TravelStyle>("Culture Seeker");
  const rows = useMemo(() => compareDestinations(selected, style), [selected, style]);

  function toggle(slug: string) {
    setSelected((current) => {
      if (current.includes(slug)) {
        return current.length > 2 ? current.filter((item) => item !== slug) : current;
      }
      return [...current, slug].slice(-4);
    });
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-[#d9ecfb] bg-white p-5 shadow-[0_18px_48px_rgba(2,68,120,0.08)]">
        <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#0277d4]">So sánh điểm đến</p>
            <h2 className="mt-2 text-3xl font-black text-[#071827]">Chọn 2-4 điểm đến và xem khác biệt khi lên kế hoạch thật</h2>
          </div>
          <label className="block text-sm font-bold text-[#071827]">
            Phong cách du lịch
            <select value={style} onChange={(event) => setStyle(event.target.value as TravelStyle)} className="mt-2 w-full rounded-lg border border-[#d9ecfb] bg-[#f7fbff] px-3 py-3">
              {styles.map((item) => (
                <option key={item} value={item}>
                  {travelStyleLabel(item)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {destinations.slice(0, 18).map((destination) => (
            <button
              key={destination.slug}
              type="button"
              onClick={() => toggle(destination.slug)}
              className={selected.includes(destination.slug) ? "rounded-full bg-[#0277d4] px-3 py-2 text-sm font-semibold text-white" : "rounded-full border border-[#d9ecfb] bg-[#f7fbff] px-3 py-2 text-sm font-semibold text-[#071827]"}
            >
              {getDestinationCopy(destination).name}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#d9ecfb] bg-white shadow-[0_18px_48px_rgba(2,68,120,0.08)]">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-[#0277d4] text-white">
            <tr>
              {headings.map((heading) => (
                <th key={heading} className="px-4 py-3 font-semibold">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.slug} className="border-b border-[#edf4fa]">
                <td className="px-4 py-4 font-bold text-[#071827]">{getDestinationCopy(destinations.find((item) => item.slug === row.slug) ?? destinations[0]).name}</td>
                <td className="px-4 py-4">{formatBudgetRange(row.slug)}</td>
                <td className="px-4 py-4">{getDestinationCopy(destinations.find((item) => item.slug === row.slug) ?? destinations[0]).bestTimeToVisit}</td>
                <td className="px-4 py-4">{row.foodFit}</td>
                <td className="px-4 py-4">{row.familyFit}</td>
                <td className="px-4 py-4">{row.nightlifeFit}</td>
                <td className="px-4 py-4">{row.safetyFit}</td>
                <td className="px-4 py-4 font-black text-[#0f8b7b]">{row.aiScore}</td>
                <td className="px-4 py-4 font-semibold text-[#ff6d1a]">{comparisonVerdictLabel(row.verdict)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function formatBudgetRange(slug: string) {
  const destination = destinations.find((item) => item.slug === slug) ?? destinations[0];
  return `${formatVnd(destination.budgetMin)} - ${formatVnd(destination.budgetMax)} / ngày`;
}
