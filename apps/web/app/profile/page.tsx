import Link from "next/link";
import { BadgeCheck, Bell, Globe2, ShieldCheck, Star, UserRound } from "lucide-react";
import { CommerceMetric, CommerceSurface, StatusPill, TrustBanner } from "@/components/commerce-primitives";
import { PageShell } from "@/components/page-shell";

const preferences = ["Ẩm thực địa phương", "Biển yên bình", "Văn hóa", "Nhịp cân bằng", "Gói offline"];
const bookings = [
  ["CT-DA-0826", "Đà Nẵng 4 ngày", "Chờ xác nhận"],
  ["CT-HOI-0901", "Hội An food walk", "Đã xác nhận"],
  ["CT-PQ-0912", "Phú Quốc gia đình", "Giữ chỗ demo"]
];

export default function Page() {
  return (
    <PageShell eyebrow="Hồ sơ du khách" title="Sở thích, đặt chỗ demo và thiết lập an toàn">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="space-y-6">
          <CommerceSurface>
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="grid h-16 w-16 place-items-center rounded-3xl bg-[#eef7ff] text-[#0277d4]">
                  <UserRound size={30} aria-hidden="true" />
                </div>
                <div>
                  <StatusPill tone="teal">Food Hunter · Culture Seeker</StatusPill>
                  <h2 className="mt-2 text-2xl font-black">Minh Chill</h2>
                  <p className="mt-1 text-sm text-[#476273]">minh@chilltravel.local · tài khoản demo</p>
                </div>
              </div>
              <Link href="/personality" className="rounded-2xl bg-[#0277d4] px-4 py-3 text-sm font-black text-white">
                Làm lại quiz
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {preferences.map((item) => (
                <StatusPill key={item}>{item}</StatusPill>
              ))}
            </div>
          </CommerceSurface>

          <div className="grid gap-4 md:grid-cols-3">
            <CommerceMetric label="Đã lưu" value="18" helper="Điểm đến, khách sạn và trải nghiệm." />
            <CommerceMetric label="Đặt chỗ demo" value="3" helper="Không phát sinh giao dịch thật." tone="orange" />
            <CommerceMetric label="Đánh giá" value="4.8" helper="Điểm mẫu từ hồ sơ du khách." tone="teal" />
          </div>

          <CommerceSurface>
            <h2 className="text-2xl font-black">Đặt chỗ gần đây</h2>
            <div className="mt-5 space-y-3">
              {bookings.map(([code, title, status]) => (
                <div key={code} className="grid gap-3 rounded-2xl border border-[#d9ecfb] bg-[#fbfdff] p-4 md:grid-cols-[120px_minmax(0,1fr)_150px] md:items-center">
                  <p className="font-black text-[#0277d4]">{code}</p>
                  <p className="font-black">{title}</p>
                  <StatusPill tone={status === "Đã xác nhận" ? "teal" : "orange"}>{status}</StatusPill>
                </div>
              ))}
            </div>
          </CommerceSurface>
        </section>
        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <TrustBanner compact />
          <CommerceSurface>
            <h2 className="text-xl font-black">Thiết lập</h2>
            <div className="mt-4 space-y-3">
              {[
                [Globe2, "Ngôn ngữ", "Tiếng Việt mặc định, có thể mở rộng tiếng Anh."],
                [Bell, "Thông báo", "Nhắc lịch trình và giữ chỗ demo theo giờ local."],
                [ShieldCheck, "An toàn thanh toán", "Không lưu số thẻ thật hoặc thu tiền thật."],
                [BadgeCheck, "Badge du khách", "Vietnam Explorer, Food Hunter, Beach Seeker."],
                [Star, "Đánh giá", "Bài đánh giá mẫu có kiểm duyệt."]
              ].map(([Icon, title, body]) => (
                <div key={String(title)} className="flex gap-3 rounded-2xl bg-[#f7fbff] p-4">
                  <Icon className="mt-0.5 shrink-0 text-[#0277d4]" size={20} aria-hidden="true" />
                  <div>
                    <p className="font-black">{String(title)}</p>
                    <p className="mt-1 text-sm leading-6 text-[#476273]">{String(body)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CommerceSurface>
        </aside>
      </div>
    </PageShell>
  );
}
