import { CalendarCheck2, DatabaseZap, Map, ShieldCheck, Ticket, WalletCards } from "lucide-react";
import { CommerceMetric, CommerceSurface, BoundaryList, ServiceActionCard, TrustBanner } from "@/components/commerce-primitives";
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
  "Trợ lý dùng RAG local khi chạy, không phụ thuộc khóa cloud",
  "Hiển thị tốt trên desktop/mobile và có trạng thái focus rõ ràng"
];

const actions = [
  {
    icon: CalendarCheck2,
    title: "Tạo kế hoạch",
    description: "Chọn điểm đến, ngày đi, ngân sách và nhịp chuyến để tạo lịch trình mẫu có thể chỉnh sửa.",
    href: "/ai-planner",
    tone: "blue" as const
  },
  {
    icon: WalletCards,
    title: "Mô phỏng chi phí",
    description: "Điều chỉnh lưu trú, ăn uống, di chuyển và hoạt động trước khi đặt chỗ demo.",
    href: "/budget",
    tone: "orange" as const
  },
  {
    icon: Ticket,
    title: "Đặt chỗ demo",
    description: "Giữ chỗ mẫu, chọn phương thức thanh toán local/mock và nhận vé QR mô phỏng.",
    href: "/booking/demo",
    tone: "teal" as const
  },
  {
    icon: Map,
    title: "Khám phá bản đồ",
    description: "Xem marker điểm đến, route preview và fallback đẹp khi chưa có map provider thật.",
    href: "/map",
    tone: "blue" as const
  }
];

export function FeatureOverview({ eyebrow, title, summary, details = defaultDetails }: FeatureOverviewProps) {
  return (
    <PageShell eyebrow={eyebrow} title={title}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <CommerceSurface>
            <p className="max-w-3xl text-lg leading-8 text-[#40515d]">{summary}</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <CommerceMetric label="Tốc độ quyết định" value="3 bước" helper="Tìm kiếm, so sánh, lưu hoặc đặt chỗ demo." />
              <CommerceMetric label="Dữ liệu" value="Local" helper="Seed sample và knowledge base nội bộ." tone="teal" />
              <CommerceMetric label="Thanh toán" value="Mock" helper="Không phát sinh giao dịch thật." tone="orange" />
            </div>
          </CommerceSurface>
          <div className="grid gap-4 md:grid-cols-2">
            {actions.map((action) => (
              <ServiceActionCard key={action.title} {...action} />
            ))}
          </div>
        </div>
        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <TrustBanner />
          <CommerceSurface>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#e8fbf6] p-3 text-[#0f766e]">
                <ShieldCheck size={22} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6f8594]">Ranh giới demo</p>
                <h2 className="text-xl font-black">Rõ ràng trước khi bấm</h2>
              </div>
            </div>
            <div className="mt-5">
              <BoundaryList items={details} />
            </div>
          </CommerceSurface>
          <CommerceSurface>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#eef7ff] p-3 text-[#0277d4]">
                <DatabaseZap size={22} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6f8594]">Nguồn local</p>
                <p className="font-black">RAG, seed data, mock provider</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#476273]">
              Khi câu hỏi cần dữ liệu thời gian thực như vé bay, visa hoặc thời tiết, giao diện phải nhắc người dùng kiểm tra nguồn chính thức.
            </p>
          </CommerceSurface>
        </aside>
      </div>
    </PageShell>
  );
}
