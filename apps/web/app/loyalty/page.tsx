import Link from "next/link";
import { Award, BadgePercent, ChevronRight, Gift, ShieldCheck, Sparkles, Ticket } from "lucide-react";
import { demoPaymentWarning, loyaltyTiers, userBookingSummaries } from "@vietwander/shared";
import { BoundaryList, CommerceMetric, CommerceSurface, StatusPill, TrustBanner } from "@/components/commerce-primitives";
import { PageShell } from "@/components/page-shell";
import { formatVnd } from "@/lib/utils";

export default function LoyaltyPage() {
  const currentTier = loyaltyTiers[0];
  const progress = Math.min(100, Math.round((currentTier.points / currentTier.nextTierPoints) * 100));

  return (
    <PageShell eyebrow="Chill Rewards" title="Loyalty dashboard demo cho ưu đãi, QR và gói offline">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
        <section className="space-y-5">
          <CommerceSurface className="bg-tv-blue text-white">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-white/14 px-3 py-1 text-xs font-bold">
                  <Award size={15} aria-hidden="true" />
                  {currentTier.name}
                </p>
                <h2 className="mt-4 text-3xl font-bold">{currentTier.points.toLocaleString("vi-VN")} điểm demo</h2>
                <p className="mt-2 text-sm font-bold text-white/82">Cần thêm {currentTier.nextTierPoints - currentTier.points} điểm mẫu để lên hạng tiếp theo.</p>
              </div>
              <Link href="/booking/demo" className="inline-flex items-center justify-center gap-2 rounded-tv bg-tv-orange px-5 py-3 font-bold text-white">
                Dùng ưu đãi demo
                <ChevronRight size={18} aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-6 h-3 rounded-full bg-white/20">
              <div className="h-3 rounded-full bg-[#ffcf88]" style={{ width: `${progress}%` }} />
            </div>
          </CommerceSurface>

          <div className="grid gap-4 md:grid-cols-3">
            <CommerceMetric label="Voucher mẫu" value="3" helper="Không có giá trị thanh toán thật." tone="orange" />
            <CommerceMetric label="Gói offline" value="5" helper="Lưu itinerary, checklist và QR demo." tone="teal" />
            <CommerceMetric label="Đặt chỗ demo" value={String(userBookingSummaries.length)} helper="Dùng cho dashboard tài khoản." />
          </div>

          <CommerceSurface>
            <h2 className="text-2xl font-bold">Hạng thành viên</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {loyaltyTiers.map((tier) => (
                <article key={tier.id} className="rounded-tv border border-tv-border bg-tv-bg p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-bold">{tier.name}</h3>
                    <StatusPill tone={tier.id === currentTier.id ? "teal" : "blue"}>{tier.points.toLocaleString("vi-VN")} điểm</StatusPill>
                  </div>
                  <BoundaryList items={tier.benefits} />
                  <div className="mt-4 rounded-tv bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-tv-ink-3">Quà demo</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tier.demoRewards.map((reward) => (
                        <StatusPill key={reward} tone="orange">{reward}</StatusPill>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </CommerceSurface>

          <CommerceSurface>
            <h2 className="text-2xl font-bold">Booking hub</h2>
            <div className="mt-5 space-y-3">
              {userBookingSummaries.map((booking) => (
                <div key={booking.id} className="grid gap-3 rounded-tv border border-tv-border bg-tv-bg p-4 md:grid-cols-[150px_minmax(0,1fr)_160px] md:items-center">
                  <p className="font-bold text-tv-blue">{booking.code}</p>
                  <div>
                    <p className="font-bold">{booking.title}</p>
                    <p className="mt-1 text-sm font-bold text-tv-ink-3">{booking.dateRange}</p>
                  </div>
                  <p className="text-right font-bold text-tv-orange">{formatVnd(booking.totalAmount)}</p>
                </div>
              ))}
            </div>
          </CommerceSurface>
        </section>

        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <TrustBanner compact />
          <CommerceSurface>
            <h2 className="text-xl font-bold">Quy tắc demo</h2>
            <BoundaryList items={[demoPaymentWarning, "Điểm, voucher và nâng hạng chỉ là dữ liệu mẫu.", "Không có hoàn tiền, thu phí hoặc billing thật."]} />
          </CommerceSurface>
          <CommerceSurface>
            <h2 className="text-xl font-bold">Lối tắt</h2>
            <div className="mt-4 grid gap-3">
              {[
                [BadgePercent, "Ưu đãi", "/"],
                [Ticket, "Đặt chỗ", "/booking/demo"],
                [Gift, "Yêu thích", "/wishlist"],
                [Sparkles, "Lập lịch trình", "/ai-planner"]
              ].map(([Icon, label, href]) => (
                <Link key={String(label)} href={String(href)} className="flex items-center gap-3 rounded-tv bg-tv-bg p-4 font-bold text-tv-ink hover:text-tv-blue">
                  <Icon size={20} className="text-tv-blue" aria-hidden="true" />
                  {String(label)}
                </Link>
              ))}
            </div>
          </CommerceSurface>
          <CommerceSurface>
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 shrink-0 text-[#0f8b7b]" size={20} aria-hidden="true" />
              <p className="text-sm font-bold leading-6 text-tv-ink-3">Dashboard này dùng để thể hiện logic sản phẩm, không đại diện cho chương trình khách hàng thật.</p>
            </div>
          </CommerceSurface>
        </aside>
      </div>
    </PageShell>
  );
}
