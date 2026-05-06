import { destinations } from "@vietwander/shared";
import { BudgetSimulator } from "@/components/ai/budget-simulator";
import { ItineraryTimeline } from "@/components/itinerary-timeline";
import { PageShell } from "@/components/page-shell";
import { getDestinationCopy } from "@/lib/destination-copy";
import { buildVietnameseDemoItinerary } from "@/lib/vietnamese";

export default async function AiPlannerPage({ searchParams }: { searchParams: Promise<{ destination?: string }> }) {
  const { destination = "da-nang" } = await searchParams;
  const selected = destinations.find((item) => item.slug === destination) ?? destinations[5];
  const plan = buildVietnameseDemoItinerary(selected, 4);
  return (
    <PageShell eyebrow="Lập lịch trình thông minh" title="Tạo kế hoạch chuyến đi theo ngân sách, văn hóa, ẩm thực và nhịp di chuyển">
      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
        <form className="rounded-[16px] border border-[#d9ecfb] bg-white p-5 shadow-[0_18px_54px_rgba(2,68,120,0.08)]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0277d4]">Thông tin chuyến đi</p>
          <h2 className="mt-2 text-3xl font-black text-[#071827]">Bạn muốn đi như thế nào?</h2>
          <p className="mt-2 text-sm leading-6 text-[#584237]">
            Dịch vụ AI ưu tiên chạy local dùng knowledge base mẫu và sẽ nói rõ khi câu hỏi cần dữ liệu chính thức theo thời gian thực.
          </p>
          <div className="mt-5 border-t border-[#eee6da] pt-5">
          <label className="text-sm font-black text-[#071827]" htmlFor="destination">Điểm đến</label>
          <select id="destination" name="destination" defaultValue={selected.slug} className="mt-2 w-full rounded-lg border border-[#d9ecfb] bg-[#f7fbff] px-3 py-3">
            {destinations.map((item) => <option key={item.slug} value={item.slug}>{getDestinationCopy(item).name}</option>)}
          </select>
          </div>
          {["Xuất phát từ", "Ngày đi hoặc số ngày", "Số khách", "Ngân sách", "Sở thích", "Nhịp đi"].map((label) => (
            <label key={label} className="mt-4 block text-sm font-black text-[#071827]">
              {label}
              <input className="mt-2 w-full rounded-lg border border-[#d9ecfb] bg-[#f7fbff] px-3 py-3" placeholder={label} />
            </label>
          ))}
          <button className="mt-5 w-full rounded-lg bg-[#ff6d1a] px-4 py-3 font-black text-white">Tạo lịch trình demo</button>
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
