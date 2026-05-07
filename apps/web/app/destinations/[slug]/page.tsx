import { notFound } from "next/navigation";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, CalendarDays, MapPinned, MessageCircle, ShieldCheck, Star, Utensils, WalletCards } from "lucide-react";
import { destinations } from "@vietwander/shared";
import { BoundaryList, CommerceSurface, StatusPill, TrustBanner } from "@/components/commerce-primitives";
import { ItineraryTimeline } from "@/components/itinerary-timeline";
import { getDestinationCopy } from "@/lib/destination-copy";
import { getDestinationImage } from "@/lib/destination-images";
import { getDestinationBySlug } from "@/lib/travel";
import { formatVnd } from "@/lib/utils";
import { buildVietnameseDemoItinerary, demoPaymentWarning, safetyLabel } from "@/lib/vietnamese";

export function generateStaticParams() {
  return destinations.map((destination) => ({ slug: destination.slug }));
}

export default async function DestinationDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);
  if (!destination) notFound();

  const copy = getDestinationCopy(destination);
  const plan = buildVietnameseDemoItinerary(destination, 3);
  const heroImage = getDestinationImage(destination.slug);

  return (
    <main className="min-h-screen bg-[#f6fbff] text-[#071827]">
      <section className="border-b border-[#d9ecfb] bg-white">
        <div className="mx-auto max-w-[1180px] px-4 py-6 md:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap gap-2">
                <StatusPill>{copy.country}</StatusPill>
                <StatusPill tone="teal">{copy.city}</StatusPill>
                <StatusPill tone="orange">Dữ liệu mẫu local</StatusPill>
              </div>
              <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">{copy.name}</h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[#476273]">{copy.summary}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={`/ai-planner?destination=${destination.slug}`} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#d9ecfb] bg-white px-4 py-3 text-sm font-black text-[#0277d4] transition hover:bg-[#eef7ff]">
                <MessageCircle size={18} aria-hidden="true" />
                Hỏi trợ lý chuyến đi
              </Link>
              <Link href={`/booking/${destination.slug}`} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff6d1a] px-5 py-3 text-sm font-black text-white shadow-[0_12px_26px_rgba(255,109,26,0.2)] transition hover:bg-[#e95c0a]">
                Đặt chỗ demo
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-[1.45fr_0.75fr]">
            <div className="min-h-[320px] rounded-[28px] bg-cover bg-center shadow-[0_18px_48px_rgba(2,68,120,0.14)]" style={{ backgroundImage: `linear-gradient(180deg, rgba(7,24,39,0.02), rgba(7,24,39,0.18)), url(${heroImage})` }} aria-label={`Ảnh du lịch ${copy.name}`} />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {[0, 1].map((index) => (
                <div key={index} className="min-h-[154px] rounded-[24px] bg-cover bg-center shadow-[0_12px_30px_rgba(2,68,120,0.1)]" style={{ backgroundImage: `url(${heroImage})` }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1180px] gap-6 px-4 py-8 md:px-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <InfoCard icon={CalendarDays} title="Mùa đẹp" value={copy.bestTimeToVisit} />
            <InfoCard icon={ShieldCheck} title="An toàn" value={safetyLabel(destination.safetyLevel)} />
            <InfoCard icon={WalletCards} title="Ngân sách/ngày" value={`${formatVnd(destination.budgetMin)}+`} />
          </div>

          <CommerceSurface>
            <h2 className="text-2xl font-black">Vì sao nên đi</h2>
            <p className="mt-3 leading-7 text-[#476273]">{copy.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {destination.travelStyles.slice(0, 6).map((style) => (
                <StatusPill key={style} tone="gray">
                  {style}
                </StatusPill>
              ))}
            </div>
          </CommerceSurface>

          <CommerceSurface>
            <h2 className="text-2xl font-black">Ăn gì và chơi gì</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <FeatureList title="Món nên thử" items={copy.foodHighlights} icon={Utensils} />
              <FeatureList title="Hoạt động nổi bật" items={destination.experiences.slice(0, 5)} icon={MapPinned} />
            </div>
          </CommerceSurface>

          <CommerceSurface>
            <h2 className="text-2xl font-black">Lưu ý văn hóa và an toàn</h2>
            <div className="mt-4">
              <BoundaryList items={copy.cultureNotes} />
            </div>
          </CommerceSurface>

          <ItineraryTimeline plan={plan} />
        </div>

        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <TrustBanner />
          <CommerceSurface>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0277d4]">Tóm tắt đặt chỗ</p>
            <h2 className="mt-2 text-2xl font-black">{copy.name}</h2>
            <div className="mt-5 space-y-3 text-sm">
              <SideRow label="Lưu trú mẫu" value={`${formatVnd(destination.hotelsMock[0]?.nightlyPrice ?? destination.budgetMin)} / đêm`} />
              <SideRow label="Gợi ý lịch trình" value="3 ngày cân bằng" />
              <SideRow label="Đánh giá" value={`${destination.ratingAvg.toFixed(1)} / 5`} />
            </div>
            <Link href={`/booking/${destination.slug}`} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ff6d1a] px-4 py-4 font-black text-white">
              Xem ưu đãi demo
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <p className="mt-3 text-center text-xs font-bold text-[#b45309]">{demoPaymentWarning}</p>
          </CommerceSurface>

          <CommerceSurface>
            <h2 className="text-xl font-black">Nơi lưu trú gợi ý</h2>
            <div className="mt-4 space-y-3">
              {destination.hotelsMock.slice(0, 3).map((hotel, index) => (
                <div key={hotel.name} className="rounded-2xl bg-[#f7fbff] p-4">
                  <p className="font-black">{index === 0 ? `${copy.name} Boutique Stay` : `${copy.name} Smart Comfort Hotel`}</p>
                  <p className="mt-1 text-sm font-bold text-[#476273]">{formatVnd(hotel.nightlyPrice)} / đêm</p>
                </div>
              ))}
            </div>
          </CommerceSurface>
        </aside>
      </section>
    </main>
  );
}

function InfoCard({ icon: Icon, title, value }: { icon: LucideIcon; title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#d9ecfb] bg-white p-5 shadow-[0_12px_30px_rgba(2,68,120,0.06)]">
      <Icon className="text-[#0277d4]" aria-hidden="true" />
      <h2 className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-[#6f8594]">{title}</h2>
      <p className="mt-2 text-lg font-black">{value}</p>
    </div>
  );
}

function FeatureList({ title, items, icon: Icon }: { title: string; items: string[]; icon: LucideIcon }) {
  return (
    <div className="rounded-2xl bg-[#f7fbff] p-4">
      <h3 className="flex items-center gap-2 font-black">
        <Icon size={18} className="text-[#0277d4]" aria-hidden="true" />
        {title}
      </h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <StatusPill key={item}>{item}</StatusPill>
        ))}
      </div>
    </div>
  );
}

function SideRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#edf4fa] pb-3">
      <span className="font-bold text-[#476273]">{label}</span>
      <span className="text-right font-black">{value}</span>
    </div>
  );
}
