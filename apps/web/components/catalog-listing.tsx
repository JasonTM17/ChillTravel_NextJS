import Link from "next/link";
import { CalendarCheck2, MapPin, Star, Ticket, Utensils } from "lucide-react";
import type { Destination } from "@vietwander/shared";
import { destinations } from "@vietwander/shared";
import { CommerceSurface, StatusPill, TrustBanner } from "@/components/commerce-primitives";
import { getDestinationCopy } from "@/lib/destination-copy";
import { getDestinationImage } from "@/lib/destination-images";
import { formatVnd } from "@/lib/utils";

export function CatalogListing({ kind }: { kind: "hotel" | "experience" }) {
  const items = (kind === "hotel" ? destinations.slice(12, 18) : destinations.slice(6, 12)).slice(0, 6);
  const title = kind === "hotel" ? "Nơi lưu trú nổi bật" : "Trải nghiệm được đặt nhiều";
  const helper = kind === "hotel" ? "Giá phòng là dữ liệu mẫu local, có ghi chú hủy demo." : "Tour, vé và trải nghiệm đều dùng QR/mock booking.";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="space-y-4">
        <CommerceSurface>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0277d4]">{title}</p>
              <h2 className="mt-2 text-2xl font-black">{helper}</h2>
            </div>
            <Link href="/explore" className="inline-flex rounded-xl bg-[#0277d4] px-4 py-3 text-sm font-black text-white">
              Tìm thêm
            </Link>
          </div>
        </CommerceSurface>
        {items.map((destination) => (
          <CatalogRow key={destination.slug} destination={destination} kind={kind} />
        ))}
      </section>
      <aside className="h-fit space-y-4 lg:sticky lg:top-24">
        <TrustBanner />
        <CommerceSurface>
          <h2 className="text-xl font-black">Bộ lọc nhanh</h2>
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

function CatalogRow({ destination, kind }: { destination: Destination; kind: "hotel" | "experience" }) {
  const copy = getDestinationCopy(destination);
  const hotel = destination.hotelsMock[0];
  const primaryLabel = kind === "hotel" ? hotel?.name ?? `${copy.name} Comfort Stay` : destination.experiences[0] ?? `${copy.name} food walk`;
  const price = kind === "hotel" ? hotel?.nightlyPrice ?? destination.budgetMin : Math.max(250000, Math.round(destination.budgetMin * 0.45));
  const Icon = kind === "hotel" ? CalendarCheck2 : Ticket;

  return (
    <article className="grid overflow-hidden rounded-2xl border border-[#d9ecfb] bg-white shadow-[0_14px_34px_rgba(2,68,120,0.08)] md:grid-cols-[210px_minmax(0,1fr)_210px]">
      <div className="min-h-[190px] bg-cover bg-center" style={{ backgroundImage: `url(${getDestinationImage(destination.slug)})` }} />
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill tone="blue">{copy.country}</StatusPill>
          <span className="inline-flex items-center gap-1 text-sm font-black text-[#b45309]">
            <Star size={15} fill="currentColor" aria-hidden="true" />
            {(hotel?.rating ?? destination.ratingAvg).toFixed(1)}
          </span>
        </div>
        <h3 className="mt-3 text-xl font-black">{primaryLabel}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#476273]">{copy.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-[#476273]">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#f3f9ff] px-3 py-1">
            <MapPin size={14} className="text-[#0277d4]" aria-hidden="true" />
            {copy.city}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#f3f9ff] px-3 py-1">
            <Utensils size={14} className="text-[#0277d4]" aria-hidden="true" />
            {copy.foodHighlights[0]}
          </span>
        </div>
      </div>
      <aside className="flex flex-col justify-between border-t border-[#edf4fa] bg-[#fbfdff] p-5 md:border-l md:border-t-0">
        <div>
          <p className="text-xs font-bold text-[#6f8594]">Giá mẫu từ</p>
          <p className="mt-1 text-2xl font-black text-[#ff5f12]">{formatVnd(price)}</p>
          <p className="mt-1 text-xs font-bold text-[#6f8594]">{kind === "hotel" ? "mỗi đêm" : "mỗi khách"}</p>
        </div>
        <Link href={`/booking/${destination.slug}`} className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff6d1a] px-4 py-3 text-sm font-black text-white">
          <Icon size={16} aria-hidden="true" />
          Đặt chỗ demo
        </Link>
      </aside>
    </article>
  );
}
