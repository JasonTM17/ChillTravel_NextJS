import { PageShell } from "@/components/page-shell";
import { destinations } from "@vietwander/shared";
import { DestinationCard } from "@/components/destination-card";
import { demoPaymentWarning } from "@/lib/vietnamese";

export default function Page() {
  return (
    <PageShell eyebrow="Vận hành hệ thống" title="Bảng quản trị VietWander">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-[16px] border border-[#d9ecfb] bg-white p-6 shadow-[0_18px_54px_rgba(2,68,120,0.08)]">
          <p className="text-lg leading-8 text-[#40515d]">
            Quản lý analytics, đặt chỗ demo, điểm đến, nhật ký chatbot, moderation và Knowledge Studio trong một bề mặt vận hành nhất quán.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {destinations.slice(0, 4).map((destination) => (
              <DestinationCard key={destination.slug} destination={destination} />
            ))}
          </div>
        </section>
        <aside className="rounded-[16px] bg-[#071827] p-6 text-white">
          <h2 className="text-xl font-black">Ranh giới production-safe</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-white/75">
            <li>Dữ liệu du lịch mẫu local, không thay thế nguồn chính thức</li>
            <li>{demoPaymentWarning}</li>
            <li>AI RAG chạy local, không yêu cầu OpenAI key khi dùng chatbot runtime</li>
            <li>UI responsive, có trạng thái focus và đồng bộ với web/mobile flow</li>
          </ul>
        </aside>
      </div>
    </PageShell>
  );
}
