import Link from "next/link";
import { CalendarCheck2, MapPin, Star, Ticket, Utensils } from "lucide-react";
import type { Destination, HotelProperty, RoomOffer } from "@vietwander/shared";
import { destinations, hotelProperties } from "@vietwander/shared";
import { CommerceSurface, StatusPill, TrustBanner } from "@/components/commerce-primitives";
import { getDestinationCopy } from "@/lib/destination-copy";
import { getDestinationImage } from "@/lib/destination-images";
import { formatVnd } from "@/lib/utils";

export function CatalogListing({ kind }: { kind: "hotel" | "experience" }) {
  const items = destinations.slice(6, 12).slice(0, 6);
  const title = kind === "hotel" ? "Nơi lưu trú nổi bật" : "Trải nghiệm được đặt nhiều";
  const helper = kind === "hotel" ? "Giá phòng là dữ liệu mẫu local, có ghi chú hủy demo." : "Tour, vé và trải nghiệm đều dùng QR và đặt chỗ mô phỏng.";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="space-y-4">
        <CommerceSurface>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[tv-blue]">{title}</p>
              <h2 className="mt-2 text-2xl font-bold">{helper}</h2>
            </div>
            <Link href="/explore" className="inline-flex rounded-tv-sm bg-[tv-blue] px-4 py-3 text-sm font-bold text-white">
              Tìm thêm
            </Link>
          </div>
        </CommerceSurface>
        {kind === "hotel"
          ? hotelProperties.map((hotel) => <HotelCatalogRow key={hotel.slug} hotel={hotel} />)
          : items.map((destination) => <CatalogRow key={destination.slug} destination={destination} kind={kind} />)}
      </section>
      <aside className="h-fit space-y-4 lg:sticky lg:top-24">
        <TrustBanner />
        <CommerceSurface>
          <h2 className="text-xl font-bold">Bộ lọc nhanh</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Hủy demo miễn phí", "Gần trung tâm", "Gia đình", "Ẩm thực", "Gói offline"].map((filter) => (
              <StatusPill key={filter}>{filter}</StatusPill>
            ))}
          </div>
        </CommerceSurface>
      </aside>
    </div>
  );
}

function HotelCatalogRow({ hotel }: { hotel: HotelProperty }) {
  const destination = destinations.find((item) => item.slug === hotel.destinationSlug) ?? destinations[0];
  const copy = getDestinationCopy(destination);
  const lowestRoom = hotel.rooms.reduce<RoomOffer | undefined>((lowest, room) => (!lowest || room.nightlyPrice < lowest.nightlyPrice ? room : lowest), undefined);

  return (
    <article className="grid overflow-hidden rounded-tv border border-[tv-border] bg-white shadow-tv-card md:grid-cols-[210px_minmax(0,1fr)_210px]">
      <Link href={`/hotels/${hotel.slug}`} className="min-h-[190px] bg-cover bg-center" style={{ backgroundImage: `url(${getDestinationImage(hotel.destinationSlug)})` }} aria-label={`Xem chi tiết ${hotel.name}`} />
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill tone="blue">{hotel.district}</StatusPill>
          <span className="inline-flex items-center gap-1 text-sm font-bold text-[#b45309]">
            <Star size={15} fill="currentColor" aria-hidden="true" />
            {hotel.rating.toFixed(1)}
          </span>
        </div>
        <Link href={`/hotels/${hotel.slug}`} className="mt-3 block text-xl font-bold hover:text-[tv-blue]">
          {hotel.name}
        </Link>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[tv-ink-3]">{hotel.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-[tv-ink-3]">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#f3f9ff] px-3 py-1">
            <MapPin size={14} className="text-[tv-blue]" aria-hidden="true" />
            {copy.city}
          </span>
          {hotel.amenities.slice(0, 2).map((amenity) => (
            <span key={amenity} className="inline-flex items-center gap-1 rounded-full bg-[#f3f9ff] px-3 py-1">
              {amenity}
            </span>
          ))}
        </div>
      </div>
      <aside className="flex flex-col justify-between border-t border-[tv-border] bg-[tv-bg] p-5 md:border-l md:border-t-0">
        <div>
          <p className="text-xs font-bold text-[tv-ink-3]">Giá mẫu từ</p>
          <p className="mt-1 text-2xl font-bold text-[tv-orange]">{formatVnd(lowestRoom?.nightlyPrice ?? 0)}</p>
          <p className="mt-1 text-xs font-bold text-[tv-ink-3]">mỗi đêm</p>
        </div>
        <Link href={`/hotels/${hotel.slug}`} className="mt-5 inline-flex items-center justify-center gap-2 rounded-tv-sm bg-[tv-orange] px-4 py-3 text-sm font-bold text-white">
          <CalendarCheck2 size={16} aria-hidden="true" />
          Xem phòng
        </Link>
      </aside>
    </article>
  );
}

function CatalogRow({ destination, kind }: { destination: Destination; kind: "hotel" | "experience" }) {
  const copy = getDestinationCopy(destination);
  const hotel = destination.hotelsMock[0];
  const primaryLabel = kind === "hotel" ? hotel?.name ?? `${copy.name} Comfort Stay` : destination.experiences[0] ?? `${copy.name} food walk`;
  const price = kind === "hotel" ? hotel?.nightlyPrice ?? destination.budgetMin : Math.max(250000, Math.round(destination.budgetMin * 0.45));
  const Icon = kind === "hotel" ? CalendarCheck2 : Ticket;

  return (
    <article className="grid overflow-hidden rounded-tv border border-[tv-border] bg-white shadow-tv-card md:grid-cols-[210px_minmax(0,1fr)_210px]">
      <div className="min-h-[190px] bg-cover bg-center" style={{ backgroundImage: `url(${getDestinationImage(destination.slug)})` }} />
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill tone="blue">{copy.country}</StatusPill>
          <span className="inline-flex items-center gap-1 text-sm font-bold text-[#b45309]">
            <Star size={15} fill="currentColor" aria-hidden="true" />
            {(hotel?.rating ?? destination.ratingAvg).toFixed(1)}
          </span>
        </div>
        <h3 className="mt-3 text-xl font-bold">{primaryLabel}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[tv-ink-3]">{copy.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-[tv-ink-3]">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#f3f9ff] px-3 py-1">
            <MapPin size={14} className="text-[tv-blue]" aria-hidden="true" />
            {copy.city}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#f3f9ff] px-3 py-1">
            <Utensils size={14} className="text-[tv-blue]" aria-hidden="true" />
            {copy.foodHighlights[0]}
          </span>
        </div>
      </div>
      <aside className="flex flex-col justify-between border-t border-[tv-border] bg-[tv-bg] p-5 md:border-l md:border-t-0">
        <div>
          <p className="text-xs font-bold text-[tv-ink-3]">Giá mẫu từ</p>
          <p className="mt-1 text-2xl font-bold text-[tv-orange]">{formatVnd(price)}</p>
          <p className="mt-1 text-xs font-bold text-[tv-ink-3]">{kind === "hotel" ? "mỗi đêm" : "mỗi khách"}</p>
        </div>
        <Link href={`/booking/${destination.slug}`} className="mt-5 inline-flex items-center justify-center gap-2 rounded-tv-sm bg-[tv-orange] px-4 py-3 text-sm font-bold text-white">
          <Icon size={16} aria-hidden="true" />
          Đặt chỗ demo
        </Link>
      </aside>
    </article>
  );
}
