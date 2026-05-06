import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPinned, ShieldCheck, Star, WalletCards } from "lucide-react";
import { destinations } from "@vietwander/shared";
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

  return (
    <main className="travel-commerce-surface text-[#071827]">
      <section className="grid min-h-[620px] border-b border-[#d9ecfb] lg:grid-cols-[1.08fr_0.92fr]">
        <div className="flex items-end bg-[#071827] px-4 py-16 text-white md:py-20">
          <div className="mx-auto w-full max-w-3xl lg:mr-0">
            <p className="font-black uppercase tracking-[0.22em] text-[#f7d7b7]">
              {copy.country} / {copy.city}
            </p>
            <h1 className="mt-4 text-6xl font-black leading-[0.98] md:text-8xl">{copy.name}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78">{copy.summary}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/ai-planner?destination=${destination.slug}`} className="rounded-lg bg-[#f97316] px-5 py-3 font-black text-white">
                Tạo lịch trình
              </Link>
              <Link href="/compare" className="rounded-lg border border-white/18 bg-white/10 px-5 py-3 font-black">
                So sánh điểm đến
              </Link>
            </div>
          </div>
        </div>
        <div
          className="min-h-[360px] bg-cover bg-center lg:min-h-full"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(7,24,39,0.02), rgba(7,24,39,0.22)), url(${getDestinationImage(destination.slug)})`
          }}
          aria-label={`Ảnh du lịch ${copy.name}`}
        />
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <Panel title="Vì sao nên đi">{copy.summary}</Panel>
          <div className="grid gap-4 md:grid-cols-2">
            <InfoCard icon={CalendarDays} title="Mùa đẹp" value={copy.bestTimeToVisit} />
            <InfoCard icon={ShieldCheck} title="Mức an toàn" value={safetyLabel(destination.safetyLevel)} />
          </div>
          <Panel title="Ăn gì ở đây">
            <span className="flex flex-wrap gap-2">
              {copy.foodHighlights.map((food) => (
                <span key={food} className="rounded-full bg-[#f5efe4] px-3 py-1 text-sm font-bold text-[#40515d]">
                  {food}
                </span>
              ))}
            </span>
          </Panel>
          <Panel title="Lưu ý văn hóa và an toàn">
            <ul className="space-y-2">
              {copy.cultureNotes.map((note) => (
                <li key={note} className="leading-7 text-[#40515d]">
                  {note}
                </li>
              ))}
            </ul>
          </Panel>
          <ItineraryTimeline plan={plan} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-[16px] border border-[#d9ecfb] bg-white p-5 shadow-[0_18px_54px_rgba(2,68,120,0.08)]">
            <h2 className="text-xl font-black">Thông tin nhanh</h2>
            <div className="mt-5 space-y-4">
              <Metric icon={Star} label="Đánh giá" value={`${destination.ratingAvg.toFixed(1)} / 5`} />
              <Metric icon={WalletCards} label="Ngân sách/ngày" value={`${formatVnd(destination.budgetMin)}+`} />
              <Metric icon={MapPinned} label="Tọa độ" value={`${destination.latitude.toFixed(1)}, ${destination.longitude.toFixed(1)}`} />
            </div>
          </div>

          <div className="rounded-[16px] border border-[#dfd3c1] bg-[#071827] p-5 text-white shadow-[0_18px_54px_rgba(7,24,39,0.14)]">
            <h2 className="text-xl font-black">Nơi lưu trú gợi ý</h2>
            <ul className="mt-4 space-y-3">
              {destination.hotelsMock.map((hotel, index) => (
                <li key={hotel.name} className="rounded-xl border border-white/12 bg-white/8 p-3">
                  <p className="font-bold">{index === 0 ? `${copy.name} Boutique Stay` : `${copy.name} Smart Comfort Hotel`}</p>
                  <p className="mt-1 text-sm text-white/70">{formatVnd(hotel.nightlyPrice)} / đêm</p>
                </li>
              ))}
            </ul>
            <Link
              href={`/booking/${destination.slug}`}
              className="mt-5 inline-flex w-full items-center justify-between rounded-lg bg-white px-4 py-3 font-black text-[#071827]"
            >
              Bắt đầu đặt chỗ demo
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <p className="mt-3 text-xs font-bold text-white/62">{demoPaymentWarning}</p>
          </div>
        </aside>
      </section>
    </main>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[16px] border border-[#d9ecfb] bg-white p-6 shadow-[0_18px_54px_rgba(2,68,120,0.08)]">
      <h2 className="text-2xl font-black">{title}</h2>
      <div className="mt-3 text-[#40515d]">{children}</div>
    </section>
  );
}

function InfoCard({ icon: Icon, title, value }: { icon: typeof CalendarDays; title: string; value: string }) {
  return (
    <div className="rounded-[16px] border border-[#d9ecfb] bg-white p-5">
      <Icon className="text-[#0277d4]" aria-hidden="true" />
      <h2 className="mt-4 text-sm font-black uppercase tracking-[0.18em] text-[#687983]">{title}</h2>
      <p className="mt-2 text-xl font-black">{value}</p>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Star; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-[#ecf7f4] text-[#0f766e]">
        <Icon size={18} aria-hidden="true" />
      </span>
      <span>
        <span className="block text-xs font-black uppercase tracking-[0.16em] text-[#687983]">{label}</span>
        <span className="block font-black">{value}</span>
      </span>
    </div>
  );
}
