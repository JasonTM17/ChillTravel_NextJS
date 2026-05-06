import { destinations } from "@vietwander/shared";
import { DestinationCard } from "@/components/destination-card";
import { PageShell } from "@/components/page-shell";
import { demoPaymentWarning } from "@/lib/vietnamese";

interface FeatureOverviewProps {
  eyebrow: string;
  title: string;
  summary: string;
  details?: string[];
  destinationOffset?: number;
}

const defaultDetails = [
  "Dữ liệu du lịch mẫu, không thay thế nguồn chính thức",
  demoPaymentWarning,
  "Chatbot dùng RAG local khi chạy, không phụ thuộc OpenAI key",
  "Hiển thị tốt trên desktop/mobile và có trạng thái focus rõ ràng"
];

export function FeatureOverview({ eyebrow, title, summary, details = defaultDetails, destinationOffset = 0 }: FeatureOverviewProps) {
  const cards = destinations.slice(destinationOffset, destinationOffset + 4);

  return (
    <PageShell eyebrow={eyebrow} title={title}>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-[16px] border border-[#d9ecfb] bg-white p-6 shadow-[0_18px_54px_rgba(2,68,120,0.08)]">
          <p className="max-w-3xl text-lg leading-8 text-[#40515d]">{summary}</p>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {cards.map((destination) => (
              <DestinationCard key={destination.slug} destination={destination} />
            ))}
          </div>
        </section>
        <aside className="h-fit rounded-[16px] bg-[#071827] p-6 text-white shadow-[0_18px_54px_rgba(7,24,39,0.14)]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8ed6ff]">Ranh giới demo</p>
          <h2 className="mt-3 text-2xl font-black">Sẵn sàng làm portfolio, an toàn khi chạy local</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-white/76">
            {details.map((detail) => (
              <li key={detail} className="rounded-xl border border-white/12 bg-white/8 px-4 py-3">
                {detail}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </PageShell>
  );
}
