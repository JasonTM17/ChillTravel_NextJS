import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Coffee,
  MapPinned,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Utensils,
  WalletCards,
  Wifi
} from "lucide-react";
import { destinations, normalizeTravelText } from "@vietwander/shared";
import type { Destination } from "@vietwander/shared";
import { getDestinationCopy } from "@/lib/destination-copy";
import { getDestinationImage } from "@/lib/destination-images";
import { formatVnd } from "@/lib/utils";
import { demoPaymentWarning, formatDateVi, safetyLabel } from "@/lib/vietnamese";

const styleOptions = ["Biển", "Văn hóa", "Ẩm thực", "Gia đình", "Núi", "Nghỉ dưỡng"];
const sortOptions = ["Phù hợp nhất", "Đánh giá cao", "Ngân sách thấp", "Mùa đẹp"];

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ q?: string; style?: string }> }) {
  const { q = "Đà Nẵng", style = "" } = await searchParams;
  const normalizedQuery = normalizeTravelText(`${q} ${style}`.trim());
  const filtered = normalizedQuery
    ? destinations.filter((destination) => matchesQuery(destination, normalizedQuery))
    : destinations;
  const active = filtered[0] ?? destinations.find((destination) => destination.slug === "da-nang") ?? destinations[0];

  return (
    <main className="min-h-screen bg-[#f6fbff] text-[#071827]">
      <SearchHeader q={q} />

      <section className="px-4 py-6 md:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-5 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
          <FilterRail selectedStyle={style} />

          <section className="min-w-0">
            <ResultsToolbar count={filtered.length} q={q} />
            <div className="mt-4 space-y-4">
              {filtered.length ? (
                filtered.map((destination) => <SearchResultCard key={destination.slug} destination={destination} />)
              ) : (
                <EmptyResults />
              )}
            </div>
          </section>

          <TripSidePanel destination={active} />
        </div>
      </section>
    </main>
  );
}

function SearchHeader({ q }: { q: string }) {
  return (
    <section className="border-b border-[#d9ecfb] bg-white px-4 py-5 md:px-8">
      <div className="mx-auto max-w-[1440px]">
        <form action="/explore" className="booking-card-shadow grid gap-3 rounded-2xl border border-[#d9ecfb] bg-white p-3 lg:grid-cols-[1.3fr_1fr_1fr_1fr_auto]">
          <label className="flex min-w-0 items-center gap-3 rounded-xl border border-[#d9ecfb] bg-[#f7fbff] px-4 py-3">
            <Search size={18} className="shrink-0 text-[#0277d4]" aria-hidden="true" />
            <span className="min-w-0">
              <span className="block text-xs font-bold text-[#6f8594]">Bạn muốn đi đâu?</span>
              <input name="q" defaultValue={q} className="mt-1 w-full bg-transparent font-black outline-none" />
            </span>
          </label>
          <CompactField icon={CalendarDays} label="Nhận phòng" value={formatDateVi(new Date("2026-08-12"))} />
          <CompactField icon={CalendarDays} label="Trả phòng" value={formatDateVi(new Date("2026-08-16"))} />
          <CompactField icon={WalletCards} label="Ngân sách" value={`${formatVnd(4500000)} / ngày`} />
          <button className="rounded-xl bg-[#ff6d1a] px-6 py-4 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:bg-[#e95c0a]">
            Tìm kiếm
          </button>
        </form>
      </div>
    </section>
  );
}

function CompactField({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-[#d9ecfb] bg-[#f7fbff] px-4 py-3">
      <Icon size={18} className="shrink-0 text-[#0277d4]" aria-hidden="true" />
      <span className="min-w-0">
        <span className="block text-xs font-bold text-[#6f8594]">{label}</span>
        <span className="mt-1 block truncate font-black">{value}</span>
      </span>
    </div>
  );
}

function ResultsToolbar({ count, q }: { count: number; q: string }) {
  return (
    <div className="rounded-2xl border border-[#d9ecfb] bg-white p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0277d4]">Kết quả tìm kiếm</p>
          <h1 className="mt-1 text-2xl font-black md:text-3xl">{count} điểm đến cho {q || "chuyến đi của bạn"}</h1>
          <p className="mt-1 text-sm text-[#476273]">Dữ liệu mẫu local. Không khẳng định giá live, chuyến bay, thời tiết hoặc visa thời gian thực.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option, index) => (
            <button
              key={option}
              className={`rounded-full border px-3 py-2 text-xs font-black ${
                index === 0 ? "border-[#0277d4] bg-[#eef7ff] text-[#0277d4]" : "border-[#d9ecfb] bg-white text-[#476273]"
              }`}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterRail({ selectedStyle }: { selectedStyle: string }) {
  return (
    <aside className="h-fit rounded-2xl border border-[#d9ecfb] bg-white p-5 lg:sticky lg:top-28">
      <div className="flex items-center justify-between border-b border-[#edf4fa] pb-4">
        <h2 className="text-xl font-black">Lọc kết quả</h2>
        <SlidersHorizontal className="text-[#0277d4]" size={18} aria-hidden="true" />
      </div>

      <FilterGroup title="Bộ lọc phổ biến" values={["Bao gồm bữa sáng", "Thanh toán tại nơi ở", "Hủy miễn phí", "Phù hợp gia đình"]} />
      <FilterGroup title="Phong cách chuyến đi" values={styleOptions} selected={selectedStyle} />
      <FilterGroup title="Khu vực" values={["Sát biển", "Phố cổ", "Trung tâm", "View núi"]} />

      <div className="mt-6 rounded-2xl bg-[#f7fbff] p-4">
        <div className="flex items-center gap-2 text-sm font-black">
          <WalletCards size={17} className="text-[#0277d4]" aria-hidden="true" />
          Giá mỗi ngày
        </div>
        <div className="mt-4 h-2 rounded-full bg-[#d8ecfb]">
          <div className="h-2 w-2/3 rounded-full bg-[#0277d4]" />
        </div>
        <div className="mt-3 flex justify-between text-xs font-bold text-[#476273]">
          <span>{formatVnd(500000)}</span>
          <span>{formatVnd(5000000)}+</span>
        </div>
      </div>
    </aside>
  );
}

function FilterGroup({ title, values, selected = "" }: { title: string; values: string[]; selected?: string }) {
  return (
    <div className="mt-5">
      <h3 className="text-xs font-black uppercase tracking-[0.16em] text-[#6f8594]">{title}</h3>
      <div className="mt-3 grid gap-2">
        {values.map((value) => {
          const active = normalizeTravelText(selected) === normalizeTravelText(value);
          return (
            <Link
              key={value}
              href={`/explore?q=${encodeURIComponent(value)}`}
              className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm font-bold transition ${
                active ? "border-[#0277d4] bg-[#eef7ff] text-[#0277d4]" : "border-[#edf4fa] bg-white text-[#476273] hover:border-[#0277d4] hover:text-[#0277d4]"
              }`}
            >
              <span>{value}</span>
              {active ? <CheckCircle2 size={16} aria-hidden="true" /> : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultCard({ destination }: { destination: Destination }) {
  const copy = getDestinationCopy(destination);

  return (
    <article className="grid overflow-hidden rounded-2xl border border-[#d9ecfb] bg-white shadow-[0_14px_36px_rgba(2,68,120,0.08)] md:grid-cols-[250px_minmax(0,1fr)_220px]">
      <Link
        href={`/destinations/${destination.slug}`}
        className="min-h-[220px] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(7,24,39,0.02), rgba(7,24,39,0.28)), url(${getDestinationImage(destination.slug)})`
        }}
          aria-label={`Xem chi tiết ${copy.name}`}
      />

      <div className="min-w-0 p-5">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full bg-[#eef7ff] px-3 py-1 font-black text-[#0277d4]">{copy.country}</span>
          <span className="inline-flex items-center gap-1 font-black text-[#b45309]">
            <Star size={15} fill="currentColor" aria-hidden="true" />
            {destination.ratingAvg.toFixed(1)}
          </span>
          <span className="text-[#6f8594]">({destination.reviewCount} đánh giá)</span>
        </div>
        <Link href={`/destinations/${destination.slug}`} className="mt-3 block text-2xl font-black hover:text-[#0277d4]">
          {copy.name}
        </Link>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#476273]">{copy.summary}</p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-[#476273]">
          <Amenity icon={Wifi} label="Gói offline" />
          <Amenity icon={Coffee} label={copy.foodHighlights[0] ?? "Ẩm thực địa phương"} />
          <Amenity icon={ShieldCheck} label={safetyLabel(destination.safetyLevel)} />
          <Amenity icon={MapPinned} label={copy.city} />
        </div>
      </div>

      <aside className="flex flex-col justify-between border-t border-[#edf4fa] bg-[#fbfdff] p-5 md:border-l md:border-t-0">
        <div>
          <p className="text-xs font-bold text-[#6f8594]">Giá từ</p>
          <p className="mt-1 text-2xl font-black text-[#ff5f12]">{formatVnd(destination.budgetMin)}</p>
          <p className="mt-1 text-xs font-bold text-[#6f8594]">mỗi ngày, giá mẫu</p>
          <p className="mt-4 inline-flex rounded-full bg-[#fff3e8] px-3 py-1 text-xs font-black text-[#b45309]">Chỉ thanh toán demo</p>
        </div>
        <div className="mt-5 grid gap-2">
          <Link href={`/booking/${destination.slug}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff6d1a] px-4 py-3 text-sm font-black text-white hover:bg-[#e95c0a]">
            Xem ưu đãi
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link href={`/ai-planner?destination=${destination.slug}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d9ecfb] bg-white px-4 py-3 text-sm font-black text-[#0277d4] hover:bg-[#eef7ff]">
            Lập lịch trình AI
            <Sparkles size={16} aria-hidden="true" />
          </Link>
        </div>
      </aside>
    </article>
  );
}

function Amenity({ icon: Icon, label }: { icon: typeof Wifi; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#f3f9ff] px-3 py-1">
      <Icon size={14} className="text-[#0277d4]" aria-hidden="true" />
      {label}
    </span>
  );
}

function TripSidePanel({ destination }: { destination: Destination }) {
  const copy = getDestinationCopy(destination);

  return (
    <aside className="h-fit rounded-2xl border border-[#d9ecfb] bg-white p-5 lg:sticky lg:top-28">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0277d4]">Giỏ chuyến đi</p>
      <h2 className="mt-2 text-2xl font-black">{copy.name}</h2>
      <div className="mt-5 space-y-3 text-sm">
        <CartRow label="Lưu trú" value={`${formatVnd(destination.budgetMin)}+`} />
        <CartRow label="Trải nghiệm" value={copy.foodHighlights[0] ?? "Ẩm thực địa phương"} />
        <CartRow label="Lịch trình AI" value="4 ngày cân bằng" />
      </div>
      <div className="mt-5 rounded-2xl bg-[#f7fbff] p-4">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6f8594]">Lưu ý văn hóa</p>
        <p className="mt-2 text-sm leading-6 text-[#34566f]">{copy.cultureNotes[0]}</p>
      </div>
      <Link href={`/booking/${destination.slug}`} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0277d4] px-4 py-3 text-sm font-black text-white hover:bg-[#005ea8]">
        Tiếp tục đặt chỗ demo
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
      <p className="mt-3 text-center text-xs font-bold text-[#b45309]">{demoPaymentWarning}</p>
    </aside>
  );
}

function CartRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#edf4fa] pb-3">
      <span className="font-bold text-[#476273]">{label}</span>
      <span className="text-right font-black">{value}</span>
    </div>
  );
}

function EmptyResults() {
  return (
    <div className="rounded-2xl border border-dashed border-[#b8d8f0] bg-white p-10 text-center">
      <MapPinned className="mx-auto text-[#0277d4]" size={34} aria-hidden="true" />
      <h2 className="mt-4 text-2xl font-black">Chưa có điểm đến phù hợp.</h2>
      <p className="mt-2 text-[#476273]">Thử nhập thành phố, điểm đến, món ăn, phong cách du lịch hoặc mùa đi.</p>
      <Link href="/explore" className="mt-5 inline-flex rounded-xl bg-[#0277d4] px-5 py-3 font-bold text-white">
        Xóa bộ lọc
      </Link>
    </div>
  );
}

function matchesQuery(destination: Destination, normalizedQuery: string) {
  const copy = getDestinationCopy(destination);
  const haystack = normalizeTravelText(
    [
      copy.name,
      copy.country,
      copy.city,
      copy.summary,
      destination.slug,
      destination.bestTimeToVisit,
      destination.tags.join(" "),
      destination.travelStyles.join(" "),
      destination.foodHighlights.join(" ")
    ].join(" ")
  );

  return haystack.includes(normalizedQuery) || normalizedQuery.includes(destination.slug);
}
