import Link from "next/link";
import { notFound } from "next/navigation";
import { Bath, BedDouble, ChevronRight, Coffee, MapPin, ShieldCheck, Sparkles, Star, Users, Waves } from "lucide-react";
import { destinations, getHotelPropertyBySlug } from "@vietwander/shared";
import { BoundaryList, CommerceSurface, StatusPill, TrustBanner } from "@/components/commerce-primitives";
import { getDestinationCopy } from "@/lib/destination-copy";
import { getDestinationImage } from "@/lib/destination-images";
import { formatVnd } from "@/lib/utils";
import { demoPaymentWarning } from "@/lib/vietnamese";

export default async function HotelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const hotel = getHotelPropertyBySlug(id);

  if (!hotel) {
    notFound();
  }

  const destination = destinations.find((item) => item.slug === hotel.destinationSlug) ?? destinations[0];
  const copy = getDestinationCopy(destination);

  return (
    <main className="min-h-screen bg-[#f6fbff] text-[#071827]">
      <section className="border-b border-[#d9ecfb] bg-white">
        <div className="mx-auto max-w-[1180px] px-4 py-6">
          <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-[#476273]">
            <Link href="/hotels" className="text-[#0277d4]">Khách sạn</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span>{hotel.city}</span>
          </div>
          <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_310px] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill tone="blue">{hotel.district}</StatusPill>
                <span className="inline-flex items-center gap-1 text-sm font-black text-[#b45309]">
                  <Star size={16} fill="currentColor" aria-hidden="true" />
                  {hotel.rating.toFixed(1)} ({hotel.reviewCount} đánh giá mẫu)
                </span>
              </div>
              <h1 className="mt-3 text-3xl font-black leading-tight md:text-5xl">{hotel.name}</h1>
              <p className="mt-3 flex items-center gap-2 text-sm font-bold text-[#476273]">
                <MapPin size={17} className="text-[#0277d4]" aria-hidden="true" />
                {hotel.address}
              </p>
            </div>
            <Link href="#rooms" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff6d1a] px-5 py-4 font-black text-white">
              Chọn phòng demo
              <ChevronRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 py-6">
        <div className="grid gap-3 md:grid-cols-[1.45fr_0.75fr]">
          <div className="min-h-[360px] rounded-3xl bg-cover bg-center shadow-[0_18px_48px_rgba(2,68,120,0.16)]" style={{ backgroundImage: `url(${getDestinationImage(hotel.destinationSlug)})` }} />
          <div className="grid gap-3">
            {[copy.foodHighlights[0], destination.experiences[0], hotel.amenities[0]].map((label, index) => (
              <div key={label} className="min-h-[112px] rounded-3xl bg-cover bg-center p-4 text-white shadow-[0_12px_30px_rgba(2,68,120,0.1)]" style={{ backgroundImage: `linear-gradient(120deg, rgba(7,24,39,0.72), rgba(7,24,39,0.1)), url(${getDestinationImage(index === 1 ? "hoi-an" : hotel.destinationSlug)})` }}>
                <p className="text-sm font-black">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
          <section className="space-y-5">
            <CommerceSurface>
              <h2 className="text-2xl font-black">Vì sao nên ở đây?</h2>
              <p className="mt-3 leading-7 text-[#476273]">{hotel.summary}</p>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {[
                  [Waves, hotel.amenities[0]],
                  [Coffee, hotel.amenities[1]],
                  [Sparkles, "Gợi ý lịch trình local"]
                ].map(([Icon, label]) => (
                  <div key={String(label)} className="flex gap-3 rounded-2xl bg-[#f7fbff] p-4 text-sm font-bold text-[#34566f]">
                    <Icon className="mt-0.5 shrink-0 text-[#0277d4]" size={20} aria-hidden="true" />
                    {String(label)}
                  </div>
                ))}
              </div>
            </CommerceSurface>

            <CommerceSurface id="rooms">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0277d4]">Phòng còn trống mẫu</p>
                  <h2 className="mt-2 text-2xl font-black">Chọn phòng theo nhu cầu</h2>
                </div>
                <StatusPill tone="orange">Dữ liệu demo/local</StatusPill>
              </div>
              <div className="mt-5 space-y-4">
                {hotel.rooms.map((room) => (
                  <article key={room.id} className="grid gap-4 rounded-2xl border border-[#d9ecfb] bg-[#fbfdff] p-4 md:grid-cols-[minmax(0,1fr)_210px]">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        {room.badges.map((badge) => (
                          <StatusPill key={badge} tone="teal">{badge}</StatusPill>
                        ))}
                      </div>
                      <h3 className="mt-3 text-xl font-black">{room.name}</h3>
                      <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold text-[#476273]">
                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5">
                          <BedDouble size={15} className="text-[#0277d4]" aria-hidden="true" />
                          {room.bedType}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5">
                          <Users size={15} className="text-[#0277d4]" aria-hidden="true" />
                          {room.guests} khách
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5">
                          <Bath size={15} className="text-[#0277d4]" aria-hidden="true" />
                          {room.breakfastIncluded ? "Có ăn sáng" : "Không ăn sáng"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between rounded-2xl bg-white p-4">
                      <div>
                        <p className="text-xs font-bold text-[#6f8594]">Giá mẫu mỗi đêm</p>
                        <p className="mt-1 text-2xl font-black text-[#ff5f12]">{formatVnd(room.nightlyPrice)}</p>
                      </div>
                      <Link href={`/booking/${hotel.destinationSlug}?hotel=${hotel.slug}&room=${room.id}`} className="mt-4 inline-flex justify-center rounded-xl bg-[#ff6d1a] px-4 py-3 text-sm font-black text-white">
                        Đặt chỗ demo
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </CommerceSurface>
          </section>

          <aside className="h-fit space-y-4 lg:sticky lg:top-24">
            <TrustBanner compact />
            <CommerceSurface>
              <h2 className="text-xl font-black">Chính sách demo</h2>
              <BoundaryList items={[...hotel.policies, demoPaymentWarning, "Không lưu số thẻ thật hoặc tạo giao dịch thật."]} />
            </CommerceSurface>
            <CommerceSurface>
              <h2 className="text-xl font-black">Gợi ý khu vực</h2>
              <p className="mt-2 text-sm leading-6 text-[#476273]">{copy.summary}</p>
              <Link href={`/destinations/${hotel.destinationSlug}`} className="mt-4 inline-flex w-full justify-center rounded-xl border border-[#d9ecfb] px-4 py-3 text-sm font-black text-[#0277d4]">
                Xem điểm đến
              </Link>
            </CommerceSurface>
          </aside>
        </div>
      </section>
    </main>
  );
}
