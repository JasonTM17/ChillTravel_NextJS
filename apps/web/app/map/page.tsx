import Link from "next/link";
import { Filter, MapPin, Navigation, Route, ShieldCheck } from "lucide-react";
import { destinations } from "@vietwander/shared";
import { CommerceSurface, StatusPill, TrustBanner } from "@/components/commerce-primitives";
import { PageShell } from "@/components/page-shell";
import { getDestinationCopy } from "@/lib/destination-copy";
import { formatVnd } from "@/lib/utils";

const routeStops = ["da-nang", "hoi-an", "hue", "ninh-binh"];
const markerPositions = [
  ["ha-long", "68%", "20%"],
  ["ha-noi", "58%", "24%"],
  ["da-nang", "55%", "48%"],
  ["hoi-an", "58%", "54%"],
  ["phu-quoc", "42%", "82%"],
  ["sapa", "45%", "15%"]
] as const;

export default function Page() {
  const stops = routeStops.map((slug) => destinations.find((item) => item.slug === slug) ?? destinations[0]);

  return (
    <PageShell eyebrow="Bản đồ khám phá" title="Duyệt điểm đến theo marker, tuyến đường và phong cách chuyến đi">
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)_330px]">
        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <CommerceSurface>
            <div className="flex items-center gap-3">
              <div className="rounded-tv bg-tv-blue-light p-3 text-tv-blue">
                <Filter size={20} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-tv-ink-3">Bộ lọc</p>
                <h2 className="font-bold">Phong cách chuyến đi</h2>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Biển", "Ẩm thực", "Gia đình", "Văn hóa", "Núi", "Tiết kiệm"].map((item) => (
                <StatusPill key={item}>{item}</StatusPill>
              ))}
            </div>
          </CommerceSurface>
          <TrustBanner compact />
        </aside>

        <section className="overflow-hidden rounded-tv-lg border border-tv-border bg-white shadow-[0_18px_54px_rgba(2,68,120,0.1)]">
          <div className="flex flex-col gap-3 border-b border-tv-border p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-tv-blue">Bản đồ mô phỏng</p>
              <h2 className="mt-1 text-2xl font-bold">Việt Nam route preview</h2>
            </div>
            <div className="flex gap-2">
              <StatusPill tone="teal">Dự phòng offline</StatusPill>
              <StatusPill tone="orange">Dữ liệu mẫu</StatusPill>
            </div>
          </div>
          <div className="relative min-h-[560px] bg-[radial-gradient(circle_at_35%_20%,#d7f0ff,transparent_30%),linear-gradient(160deg,#f7fbff,#eaf7ff_48%,#fff7ed)]">
            <div className="absolute inset-8 rounded-[32px] border border-dashed border-[#9ccdec]" />
            <div className="absolute left-[45%] top-[9%] h-[78%] w-24 rounded-[55%] border-l-[18px] border-[#9bd3b8] opacity-50" />
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Tuyến demo Đà Nẵng Hội An Huế Ninh Bình">
              <path d="M 55 48 C 68 44, 65 35, 62 27 C 58 58, 60 66, 49 73" fill="none" stroke="#ff6d1a" strokeWidth="4" strokeLinecap="round" strokeDasharray="10 10" />
            </svg>
            {markerPositions.map(([slug, left, top]) => {
              const destination = destinations.find((item) => item.slug === slug) ?? destinations[0];
              const copy = getDestinationCopy(destination);
              return (
                <Link
                  key={slug}
                  href={`/destinations/${slug}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-2 text-tv-blue shadow-[0_12px_28px_rgba(2,68,120,0.22)] ring-4 ring-white/70 transition hover:scale-110"
                  style={{ left, top }}
                  aria-label={`Mở ${copy.name}`}
                >
                  <MapPin size={24} fill="#0277d4" aria-hidden="true" />
                </Link>
              );
            })}
            <div className="absolute bottom-5 left-5 right-5 rounded-tv-lg border border-tv-border bg-white/92 p-4 shadow-[0_16px_36px_rgba(2,68,120,0.1)] backdrop-blur">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-tv-blue">Dự phòng khi chưa có bản đồ thật</p>
                  <h3 className="text-xl font-bold">Vẫn xem được marker, route preview và CTA đặt chỗ demo.</h3>
                </div>
                <Link href="/booking/da-nang" className="rounded-tv bg-tv-orange px-4 py-3 text-sm font-bold text-white">
                  Đặt chỗ demo
                </Link>
              </div>
            </div>
          </div>
        </section>

        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <CommerceSurface>
            <div className="flex items-center gap-3">
              <div className="rounded-tv bg-[#e8fbf6] p-3 text-[#0f766e]">
                <Route size={20} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-tv-ink-3">Tuyến đề xuất</p>
                <h2 className="font-bold">Miền Trung 4 điểm</h2>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {stops.map((destination, index) => {
                const copy = getDestinationCopy(destination);
                return (
                  <Link key={destination.slug} href={`/destinations/${destination.slug}`} className="flex gap-3 rounded-tv bg-tv-bg p-4 transition hover:bg-tv-blue-light">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-tv-blue text-sm font-bold text-white">{index + 1}</span>
                    <span className="min-w-0">
                      <span className="block font-bold">{copy.name}</span>
                      <span className="mt-1 block text-sm text-tv-ink-3">{formatVnd(destination.budgetMin)} / ngày</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </CommerceSurface>
          <CommerceSurface>
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 shrink-0 text-[#0f8b7b]" size={22} aria-hidden="true" />
              <div>
                <h2 className="font-bold">Ranh giới dữ liệu</h2>
                <p className="mt-2 text-sm leading-6 text-tv-ink-3">Bản đồ này là mô phỏng local. Không khẳng định đường bay, thời tiết hoặc giá theo thời gian thực.</p>
              </div>
            </div>
          </CommerceSurface>
          <Link href="/explore?q=Da+Nang" className="inline-flex w-full items-center justify-center gap-2 rounded-tv bg-tv-blue px-4 py-3 font-bold text-white">
            <Navigation size={18} aria-hidden="true" />
            Tìm điểm đến khác
          </Link>
        </aside>
      </div>
    </PageShell>
  );
}
