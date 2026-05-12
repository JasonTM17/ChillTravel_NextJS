"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bus,
  CalendarDays,
  Car,
  ChevronRight,
  Hotel,
  MapPin,
  Plane,
  Search,
  Sparkles,
  Star,
  Ticket,
  Train,
  Users,
  Zap,
} from "lucide-react";
import { destinationApi } from "@/lib/api/destination.api";
import { tourApi } from "@/lib/api/tour.api";
import type { Destination } from "@/lib/api/destination.api";
import type { Tour } from "@/lib/api/tour.api";
import { getDestinationImage } from "@/lib/destination-images";
import { formatVnd } from "@/lib/utils";

/* ─── Service tabs (Traveloka-style icon grid) ─────────────────────────────── */
const services = [
  { label: "Khách sạn",    href: "/hotels",      icon: Hotel,    color: "#0064D2" },
  { label: "Vé máy bay",   href: "/flights",     icon: Plane,    color: "#0064D2" },
  { label: "Tour du lịch", href: "/tours",       icon: Ticket,   color: "#0064D2" },
  { label: "Tàu hỏa",      href: "/map",         icon: Train,    color: "#0064D2" },
  { label: "Xe đưa đón",   href: "/map",         icon: Bus,      color: "#0064D2" },
  { label: "Thuê xe",      href: "/map",         icon: Car,      color: "#0064D2" },
  { label: "Hoạt động",    href: "/experiences", icon: Zap,      color: "#0064D2" },
  { label: "Lập lịch AI",  href: "/ai-planner",  icon: Sparkles, color: "#FF6D00" },
] as const;

/* ─── Promo deals ──────────────────────────────────────────────────────────── */
const promos = [
  {
    code: "WVWELCOME10",
    title: "Giảm 10% cho lần đầu",
    desc: "Áp dụng cho tất cả tour và khách sạn",
    badge: "Mới",
    badgeColor: "tv-badge-red",
    bg: "from-blue-500 to-blue-700",
  },
  {
    code: "WV500K",
    title: "Giảm 500.000đ",
    desc: "Đơn hàng từ 5.000.000đ trở lên",
    badge: "Hot",
    badgeColor: "tv-badge-red",
    bg: "from-orange-400 to-orange-600",
  },
  {
    code: "VWD-DANANG",
    title: "Đà Nẵng cuối tuần",
    desc: "Ưu đãi đặc biệt cho tour biển",
    badge: "Phổ biến",
    badgeColor: "tv-badge-blue",
    bg: "from-teal-500 to-teal-700",
  },
  {
    code: "FAMILY-PQ",
    title: "Phú Quốc gia đình",
    desc: "Resort + tour trọn gói",
    badge: "Gói mẫu",
    badgeColor: "tv-badge-green",
    bg: "from-emerald-500 to-emerald-700",
  },
] as const;

/* ─── Skeleton ─────────────────────────────────────────────────────────────── */
function CardSkeleton() {
  return (
    <div className="tv-card overflow-hidden">
      <div className="tv-skeleton h-44 w-full" />
      <div className="p-3 space-y-2">
        <div className="tv-skeleton h-4 w-3/4" />
        <div className="tv-skeleton h-3 w-1/2" />
        <div className="tv-skeleton h-5 w-1/3" />
      </div>
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────────────────────── */
export default function HomePage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [destRes, tourRes] = await Promise.all([
          destinationApi.list({ size: 12, sort: "ratingAvg,desc" }),
          tourApi.getFeatured(),
        ]);
        if (cancelled) return;
        if (destRes.success) setDestinations(destRes.data.items);
        if (tourRes.success) setTours(Array.isArray(tourRes.data) ? tourRes.data.slice(0, 8) : []);
      } catch {
        if (!cancelled) setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, []);

  const vietnam = destinations.filter(d =>
    d.country?.toLowerCase().includes("viet") || d.country?.toLowerCase().includes("việt")
  ).slice(0, 6);
  const world = destinations.filter(d =>
    !d.country?.toLowerCase().includes("viet") && !d.country?.toLowerCase().includes("việt")
  ).slice(0, 6);

  return (
    <main className="min-h-screen bg-tv-bg">
      {/* ── Hero search section ──────────────────────────────────────────── */}
      <HeroSearch />

      {/* ── Service icon grid ────────────────────────────────────────────── */}
      <ServiceGrid />

      {/* ── Promo banner ─────────────────────────────────────────────────── */}
      <PromoBanner />

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1200px] px-4 py-6 space-y-8">

        {/* Demo payment notice */}
        <div className="flex items-center gap-2 rounded-tv bg-amber-50 border border-amber-200 px-4 py-2.5 text-tv-sm text-amber-800">
          <span className="font-bold">⚠️ Thanh toán demo</span>
          <span>— Không phát sinh giao dịch thật. Đây là nền tảng demo portfolio.</span>
        </div>

        {/* Error state */}
        {error && (
          <div className="tv-card p-6 text-center">
            <p className="text-tv-red font-semibold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 tv-btn-primary text-tv-sm"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Featured tours */}
        {(loading || tours.length > 0) && (
          <Section
            title="Tour nổi bật"
            subtitle="Các tour được đặt nhiều nhất"
            href="/tours"
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
                : tours.slice(0, 4).map(tour => <TourCard key={tour.slug} tour={tour} />)
              }
            </div>
          </Section>
        )}

        {/* Vietnam destinations */}
        {(loading || vietnam.length > 0) && (
          <Section
            title="Điểm đến Việt Nam"
            subtitle="Khám phá vẻ đẹp đất nước hình chữ S"
            href="/explore"
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
                : vietnam.map(d => <DestCard key={d.slug} destination={d} compact />)
              }
            </div>
          </Section>
        )}

        {/* World destinations */}
        {(loading || world.length > 0) && (
          <Section
            title="Điểm đến quốc tế"
            subtitle="Khám phá thế giới với WanderViet"
            href="/explore"
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
                : world.map(d => <DestCard key={d.slug} destination={d} compact />)
              }
            </div>
          </Section>
        )}

        {/* All tours grid */}
        {!loading && tours.length > 4 && (
          <Section
            title="Tất cả tour"
            subtitle="Tìm tour phù hợp với bạn"
            href="/tours"
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {tours.slice(4).map(tour => <TourCard key={tour.slug} tour={tour} />)}
            </div>
          </Section>
        )}
      </div>

      {/* ── Trust band ───────────────────────────────────────────────────── */}
      <TrustBand />

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <SiteFooter />
    </main>
  );
}

/* ─── Hero search ───────────────────────────────────────────────────────────── */
function HeroSearch() {
  return (
    <div className="bg-tv-blue">
      <div className="mx-auto max-w-[1200px] px-4 py-8">
        <h1 className="mb-6 text-center text-2xl font-bold text-white md:text-3xl">
          Đặt tour, khách sạn và vé máy bay dễ dàng
        </h1>

        {/* Search card */}
        <div className="rounded-tv-lg bg-white p-4 shadow-tv-modal">
          <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_160px_auto]">
            {/* Destination */}
            <div className="tv-search-field">
              <label htmlFor="dest">Điểm đến</label>
              <div className="flex items-center gap-2 mt-1">
                <MapPin size={16} className="shrink-0 text-tv-blue" />
                <input
                  id="dest"
                  name="keyword"
                  defaultValue="Đà Nẵng"
                  placeholder="Nhập điểm đến..."
                  className="w-full text-tv-base font-semibold text-tv-ink outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Check-in */}
            <div className="tv-search-field">
              <label>Nhận phòng</label>
              <div className="flex items-center gap-2 mt-1">
                <CalendarDays size={16} className="shrink-0 text-tv-blue" />
                <span className="value text-tv-base font-semibold">12 thg 8, 2026</span>
              </div>
            </div>

            {/* Check-out */}
            <div className="tv-search-field">
              <label>Trả phòng</label>
              <div className="flex items-center gap-2 mt-1">
                <CalendarDays size={16} className="shrink-0 text-tv-blue" />
                <span className="value text-tv-base font-semibold">16 thg 8, 2026</span>
              </div>
            </div>

            {/* Guests */}
            <div className="tv-search-field">
              <label>Khách</label>
              <div className="flex items-center gap-2 mt-1">
                <Users size={16} className="shrink-0 text-tv-blue" />
                <span className="value text-tv-base font-semibold">2 khách, 1 phòng</span>
              </div>
            </div>

            {/* Search button */}
            <Link
              href="/explore"
              className="flex items-center justify-center gap-2 rounded-tv bg-tv-orange px-6 py-3 text-tv-base font-bold text-white hover:bg-tv-orange-dark transition-colors"
            >
              <Search size={18} />
              <span className="hidden md:inline">Tìm kiếm</span>
            </Link>
          </div>

          {/* Quick search tags */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-tv-xs text-tv-ink-3 self-center">Tìm nhanh:</span>
            {["Đà Nẵng", "Phú Quốc", "Hội An", "Sapa", "Hà Nội", "Tokyo", "Bangkok"].map(city => (
              <Link
                key={city}
                href={`/explore?keyword=${encodeURIComponent(city)}`}
                className="rounded-full border border-tv-border bg-tv-bg px-3 py-1 text-tv-xs font-semibold text-tv-ink-2 hover:border-tv-blue hover:text-tv-blue transition-colors"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Service icon grid ─────────────────────────────────────────────────────── */
function ServiceGrid() {
  return (
    <div className="bg-white border-b border-tv-border shadow-tv-card">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="flex overflow-x-auto">
          {services.map(({ label, href, icon: Icon, color }) => (
            <Link
              key={label}
              href={href}
              className="tv-service-tab flex-shrink-0"
              style={{ color: undefined }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: color + "18" }}
              >
                <Icon size={24} style={{ color }} />
              </div>
              <span className="text-tv-xs font-semibold text-tv-ink-2">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Promo banner ──────────────────────────────────────────────────────────── */
function PromoBanner() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="tv-section-title">Ưu đãi hôm nay</h2>
        <Link href="/" className="flex items-center gap-1 text-tv-sm font-semibold text-tv-blue hover:underline">
          Xem tất cả <ChevronRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {promos.map(promo => (
          <Link
            key={promo.code}
            href="/"
            className="tv-card overflow-hidden group"
          >
            <div className={`bg-gradient-to-br ${promo.bg} p-4 text-white`}>
              <span className={`tv-badge bg-white/20 text-white text-tv-xs`}>
                {promo.badge}
              </span>
              <p className="mt-2 font-bold text-tv-base leading-tight">{promo.title}</p>
              <p className="mt-1 text-tv-xs text-white/80">{promo.desc}</p>
            </div>
            <div className="flex items-center justify-between px-3 py-2 bg-tv-bg">
              <code className="text-tv-xs font-bold text-tv-blue">{promo.code}</code>
              <span className="text-tv-xs text-tv-ink-3 group-hover:text-tv-blue transition-colors">
                Dùng ngay →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ─── Section wrapper ───────────────────────────────────────────────────────── */
function Section({
  title,
  subtitle,
  href,
  children,
}: {
  title: string;
  subtitle: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="tv-section-title">{title}</h2>
          <p className="mt-0.5 text-tv-sm text-tv-ink-3">{subtitle}</p>
        </div>
        <Link
          href={href}
          className="flex items-center gap-1 text-tv-sm font-semibold text-tv-blue hover:underline whitespace-nowrap"
        >
          Xem tất cả <ArrowRight size={14} />
        </Link>
      </div>
      {children}
    </section>
  );
}

/* ─── Destination card ──────────────────────────────────────────────────────── */
function DestCard({ destination, compact = false }: { destination: Destination; compact?: boolean }) {
  const img = destination.imageUrl ?? getDestinationImage(destination.slug);
  return (
    <Link href={`/destinations/${destination.slug}`} className="tv-card overflow-hidden group block">
      <div
        className={`${compact ? "h-28" : "h-40"} bg-cover bg-center`}
        style={{ backgroundImage: `url(${img})` }}
      />
      <div className="p-2.5">
        <p className="font-bold text-tv-base text-tv-ink truncate group-hover:text-tv-blue transition-colors">
          {destination.name}
        </p>
        <p className="text-tv-xs text-tv-ink-3 truncate">{destination.country}</p>
        {destination.ratingAvg != null && (
          <div className="mt-1 tv-rating">
            <Star size={10} fill="currentColor" />
            {destination.ratingAvg.toFixed(1)}
          </div>
        )}
      </div>
    </Link>
  );
}

/* ─── Tour card ─────────────────────────────────────────────────────────────── */
function TourCard({ tour }: { tour: Tour }) {
  const img =
    tour.imageUrl ??
    tour.images?.[0]?.imageUrl ??
    getDestinationImage(tour.destination?.slug ?? tour.slug);
  const price = tour.salePrice ?? tour.basePrice;
  const hasSale = tour.salePrice != null && tour.salePrice < tour.basePrice;

  return (
    <Link href={`/tours/${tour.slug}`} className="tv-card overflow-hidden group block">
      {/* Image */}
      <div className="relative h-40 bg-cover bg-center" style={{ backgroundImage: `url(${img})` }}>
        {tour.featured && (
          <span className="absolute left-2 top-2 tv-badge tv-badge-orange">Nổi bật</span>
        )}
        {hasSale && (
          <span className="absolute right-2 top-2 tv-badge tv-badge-red">Ưu đãi</span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        {tour.destination && (
          <div className="flex items-center gap-1 text-tv-xs text-tv-ink-3 mb-1">
            <MapPin size={11} />
            {tour.destination.city ?? tour.destination.name}
          </div>
        )}
        <p className="font-bold text-tv-base text-tv-ink line-clamp-2 group-hover:text-tv-blue transition-colors leading-snug">
          {tour.title}
        </p>
        <p className="mt-1 text-tv-xs text-tv-ink-3">
          {tour.durationDays} ngày {tour.durationNights} đêm
        </p>

        <div className="mt-2 flex items-end justify-between">
          <div>
            {hasSale && (
              <p className="text-tv-xs text-tv-ink-4 line-through">{formatVnd(tour.basePrice)}</p>
            )}
            <p className="tv-price-small">{formatVnd(price)}<span className="text-tv-ink-3 font-normal">/người</span></p>
          </div>
          {tour.ratingAvg != null && (
            <div className="tv-rating">
              <Star size={10} fill="currentColor" />
              {tour.ratingAvg.toFixed(1)}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

/* ─── Trust band ────────────────────────────────────────────────────────────── */
function TrustBand() {
  const items = [
    { icon: "🔒", title: "Thanh toán an toàn", desc: "Mã hóa SSL 256-bit, không lưu thẻ thật" },
    { icon: "🤖", title: "AI Local-first", desc: "Chatbot chạy local, không cần OpenAI key" },
    { icon: "📊", title: "Dữ liệu thật", desc: "Điểm đến và tour từ hệ thống backend thật" },
    { icon: "🎯", title: "Demo an toàn", desc: "Thanh toán demo — không phát sinh giao dịch thật" },
  ] as const;

  return (
    <div className="bg-white border-t border-tv-border mt-8">
      <div className="mx-auto max-w-[1200px] px-4 py-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map(item => (
            <div key={item.title} className="flex items-start gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="font-bold text-tv-base text-tv-ink">{item.title}</p>
                <p className="text-tv-xs text-tv-ink-3 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Footer ────────────────────────────────────────────────────────────────── */
function SiteFooter() {
  return (
    <footer className="bg-tv-ink text-white">
      <div className="mx-auto max-w-[1200px] px-4 py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-tv-lg font-bold text-white">WanderViet</p>
            <p className="mt-1 text-tv-xs text-white/60">Nền tảng đặt tour du lịch Việt Nam &amp; quốc tế</p>
            <p className="mt-3 text-tv-xs text-white/40">
              ⚠️ Thanh toán demo — không phát sinh giao dịch thật
            </p>
          </div>

          {/* Links */}
          {[
            {
              title: "Dịch vụ",
              links: [
                { label: "Tour du lịch", href: "/tours" },
                { label: "Khách sạn", href: "/hotels" },
                { label: "Vé máy bay", href: "/flights" },
                { label: "Hoạt động", href: "/experiences" },
              ],
            },
            {
              title: "Hỗ trợ",
              links: [
                { label: "Trung tâm hỗ trợ", href: "/support" },
                { label: "Liên hệ", href: "/support" },
                { label: "Blog du lịch", href: "/blog" },
                { label: "Điều khoản", href: "/support" },
              ],
            },
            {
              title: "Tài khoản",
              links: [
                { label: "Đăng nhập", href: "/login" },
                { label: "Đăng ký", href: "/register" },
                { label: "Đặt chỗ của tôi", href: "/my-bookings" },
                { label: "Yêu thích", href: "/wishlist" },
              ],
            },
          ].map(col => (
            <div key={col.title}>
              <p className="mb-3 text-tv-sm font-bold text-white/80 uppercase tracking-wider">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-tv-xs text-white/50 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 flex flex-col items-center gap-2 md:flex-row md:justify-between">
          <p className="text-tv-xs text-white/40">© 2026 WanderViet. Portfolio demo project.</p>
          <p className="text-tv-xs text-white/40">
            Built with Next.js 16 · NestJS 11 · Prisma 7 · PostgreSQL
          </p>
        </div>
      </div>
    </footer>
  );
}
