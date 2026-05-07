import Link from "next/link";
import { BarChart3, BookOpenCheck, CalendarCheck2, DatabaseZap, MessageSquareWarning, ShieldCheck } from "lucide-react";
import { BoundaryList, CommerceMetric, CommerceSurface, OpsTable, ServiceActionCard, TrustBanner } from "@/components/commerce-primitives";
import { PageShell } from "@/components/page-shell";
import { demoPaymentWarning } from "@/lib/vietnamese";

const opsRows = [
  { name: "Đặt chỗ Đà Nẵng cuối tuần", detail: "2 khách, 1 phòng, thanh toán thẻ mô phỏng", status: "Chờ xác nhận", owner: "Vận hành", tone: "orange" as const },
  { name: "Nhập nguồn Hội An", detail: "Markdown local, 18 chunk, cần reindex", status: "Cần rà soát", owner: "Knowledge", tone: "blue" as const },
  { name: "Rà soát tour ẩm thực Huế", detail: "Báo cáo nội dung nhạy cảm từ cộng đồng demo", status: "Kiểm duyệt", owner: "Admin", tone: "gray" as const },
  { name: "Cảnh báo vé bay theo thời gian thực", detail: "Trợ lý đã trả lời đúng giới hạn dữ liệu mẫu", status: "An toàn", owner: "RAG", tone: "teal" as const }
];

export default function Page() {
  return (
    <PageShell eyebrow="Vận hành hệ thống" title="Bảng vận hành ChillTravel">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <CommerceMetric label="Đặt chỗ demo" value="128" helper="Tăng 18% trong dữ liệu mẫu tuần này." />
          <CommerceMetric label="Doanh thu mẫu" value="342tr" helper="Chỉ là mô phỏng, không phát sinh tiền thật." tone="orange" />
          <CommerceMetric label="Truy vấn trợ lý" value="1.9k" helper="Nhóm câu hỏi: ẩm thực, ngân sách, lịch trình." tone="teal" />
          <CommerceMetric label="Tài liệu RAG" value="86" helper="Markdown/JSON local đã sẵn sàng reindex." />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <CommerceSurface>
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0277d4]">Hàng đợi vận hành</p>
                  <h2 className="mt-2 text-2xl font-black">Việc cần xử lý hôm nay</h2>
                </div>
                <Link href="/admin/bookings" className="inline-flex items-center justify-center rounded-xl bg-[#0277d4] px-4 py-3 text-sm font-black text-white">
                  Xem đặt chỗ
                </Link>
              </div>
              <div className="mt-5">
                <OpsTable rows={opsRows} />
              </div>
            </CommerceSurface>

            <div className="grid gap-4 md:grid-cols-2">
              <ServiceActionCard icon={CalendarCheck2} title="Quản lý đặt chỗ" description="Theo dõi trạng thái chờ xử lý, đã xác nhận, đã hủy và hoàn tiền demo." href="/admin/bookings" tone="orange" />
              <ServiceActionCard icon={BookOpenCheck} title="Điểm đến & trải nghiệm" description="Rà soát điểm đến, khách sạn mô phỏng, tour, đánh giá và tag hiển thị." href="/admin/destinations" />
              <ServiceActionCard icon={DatabaseZap} title="Knowledge Studio" description="Nhập markdown/JSON local, rebuild index và xem nhật ký truy xuất." href="/admin/ai-knowledge" tone="teal" />
              <ServiceActionCard icon={BarChart3} title="Thống kê mẫu" description="Top tìm kiếm, phễu đặt chỗ, xu hướng chuyến đi và nhóm câu hỏi." href="/admin/analytics" />
            </div>
          </div>

          <aside className="h-fit space-y-4 lg:sticky lg:top-24">
            <TrustBanner />
            <CommerceSurface className="bg-[#071827] text-white">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/10 p-3 text-[#8ed6ff]">
                  <ShieldCheck size={22} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#8ed6ff]">An toàn demo</p>
                  <h2 className="text-xl font-black">Không vận hành tiền thật</h2>
                </div>
              </div>
              <div className="mt-5">
                <BoundaryList
                  items={[
                    demoPaymentWarning,
                    "Dữ liệu du lịch mẫu local, không thay thế nguồn chính thức.",
                    "RAG chạy local, không yêu cầu khóa cloud cho chatbot runtime.",
                    "Không bịa vé bay, visa hoặc thời tiết theo thời gian thực."
                  ]}
                />
              </div>
            </CommerceSurface>
            <CommerceSurface>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#fff3e8] p-3 text-[#b45309]">
                  <MessageSquareWarning size={22} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6f8594]">Cảnh báo</p>
                  <h2 className="font-black">3 cảnh báo đã xử lý</h2>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#476273]">Các câu hỏi giá vé bay, visa và thời tiết được đánh dấu cần nguồn chính thức.</p>
            </CommerceSurface>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}
