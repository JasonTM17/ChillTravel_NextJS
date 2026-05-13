'use client';

import {
  ArrowRight,
  Bus,
  CalendarDays,
  Car,
  CheckCircle2,
  ChevronRight,
  Facebook,
  Headphones,
  Hotel,
  Instagram,
  MapPin,
  Plane,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  Ticket,
  Train,
  Twitter,
  Users,
  Youtube,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PromoCarousel, CouponGrid, FlashSale, DealRecommendations } from '@/components/promo';
import type { PromoBanner as PromoBannerType } from '@/components/promo';
import type { Coupon } from '@/components/promo';
import type { FlashSaleItem } from '@/components/promo';
import type { Deal } from '@/components/promo';
import { destinationApi, getCountryName } from '@/lib/api/destination.api';
import type { Destination } from '@/lib/api/destination.api';
import { tourApi } from '@/lib/api/tour.api';
import type { Tour } from '@/lib/api/tour.api';
import { getDestinationImage } from '@/lib/destination-images';
import type { TranslationNamespace } from '@/lib/i18n/types';
import { useLocale } from '@/lib/i18n/use-locale';
import { formatVnd } from '@/lib/utils';

/* ─── Service tabs (icon grid) ─────────────────────────────── */
const serviceItems = [
  { key: 'hotels' as const, href: '/hotels', icon: Hotel, color: '#0064D2' },
  { key: 'flights' as const, href: '/flights', icon: Plane, color: '#0064D2' },
  { key: 'tours' as const, href: '/tours', icon: Ticket, color: '#0064D2' },
  { key: 'train' as const, href: '/map', icon: Train, color: '#0064D2' },
  { key: 'shuttle' as const, href: '/map', icon: Bus, color: '#0064D2' },
  { key: 'carRental' as const, href: '/map', icon: Car, color: '#0064D2' },
  { key: 'activities' as const, href: '/experiences', icon: Zap, color: '#0064D2' },
  { key: 'aiPlanner' as const, href: '/ai-planner', icon: Sparkles, color: '#FF6D00' },
] as const;

/* ─── Promo deals ──────────────────────────────────────────────────────────── */
const promos = [
  {
    code: 'WVWELCOME10',
    title: 'Giảm 10% cho lần đầu',
    desc: 'Áp dụng cho tất cả tour và khách sạn',
    badge: 'Mới',
    badgeColor: 'tv-badge-red',
    bg: 'from-blue-500 to-blue-700',
  },
  {
    code: 'WV500K',
    title: 'Giảm 500.000đ',
    desc: 'Đơn hàng từ 5.000.000đ trở lên',
    badge: 'Hot',
    badgeColor: 'tv-badge-red',
    bg: 'from-orange-400 to-orange-600',
  },
  {
    code: 'VWD-DANANG',
    title: 'Đà Nẵng cuối tuần',
    desc: 'Ưu đãi đặc biệt cho tour biển',
    badge: 'Phổ biến',
    badgeColor: 'tv-badge-blue',
    bg: 'from-teal-500 to-teal-700',
  },
  {
    code: 'FAMILY-PQ',
    title: 'Phú Quốc gia đình',
    desc: 'Resort + tour trọn gói',
    badge: 'Gói mẫu',
    badgeColor: 'tv-badge-green',
    bg: 'from-emerald-500 to-emerald-700',
  },
] as const;

/* ─── Mock data for promo components ───────────────────────────────────────── */
const MOCK_PROMO_BANNERS: PromoBannerType[] = [
  {
    id: 'banner-1',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=400&fit=crop',
    title: 'Mùa hè rực rỡ — Giảm đến 40% tour biển',
    ctaText: 'Khám phá ngay',
    ctaUrl: '/tours',
  },
  {
    id: 'banner-2',
    imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&h=400&fit=crop',
    title: 'Đà Nẵng 3N2Đ chỉ từ 2.990.000đ',
    ctaText: 'Đặt tour',
    ctaUrl: '/tours',
  },
  {
    id: 'banner-3',
    imageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&h=400&fit=crop',
    title: 'Phú Quốc — Resort 5 sao giá ưu đãi',
    ctaText: 'Xem ưu đãi',
    ctaUrl: '/hotels',
  },
];

const MOCK_COUPONS: Coupon[] = [
  {
    id: 'coupon-1',
    code: 'WVWELCOME10',
    description: 'Giảm 10% cho lần đặt đầu tiên, áp dụng tất cả dịch vụ',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    discountPercent: 10,
  },
  {
    id: 'coupon-2',
    code: 'SUMMER500K',
    description: 'Giảm 500.000đ cho đơn từ 5 triệu, tour biển mùa hè',
    startDate: '2026-06-01',
    endDate: '2026-09-30',
    discountPercent: 15,
  },
  {
    id: 'coupon-3',
    code: 'HOTEL20',
    description: 'Giảm 20% khách sạn 4-5 sao tại Đà Nẵng và Hội An',
    startDate: '2026-07-01',
    endDate: '2026-08-31',
    discountPercent: 20,
  },
  {
    id: 'coupon-4',
    code: 'FAMILY-PQ',
    description: 'Ưu đãi gia đình Phú Quốc — Resort + tour trọn gói',
    startDate: '2026-06-15',
    endDate: '2026-10-15',
    discountPercent: 25,
  },
];

const MOCK_FLASH_SALE_ITEMS: FlashSaleItem[] = [
  {
    id: 'fs-1',
    imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&h=400&fit=crop',
    name: 'Tour Đà Nẵng - Hội An 3N2Đ',
    originalPrice: 4_500_000,
    salePrice: 2_990_000,
  },
  {
    id: 'fs-2',
    imageUrl: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=400&h=400&fit=crop',
    name: 'Sapa trekking 2N1Đ',
    originalPrice: 3_200_000,
    salePrice: 1_990_000,
  },
  {
    id: 'fs-3',
    imageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&h=400&fit=crop',
    name: 'Phú Quốc resort 4N3Đ',
    originalPrice: 8_500_000,
    salePrice: 5_900_000,
  },
  {
    id: 'fs-4',
    imageUrl: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=400&h=400&fit=crop',
    name: 'Du thuyền Hạ Long 2N1Đ',
    originalPrice: 5_000_000,
    salePrice: 3_500_000,
  },
];

const MOCK_DEALS: Deal[] = [
  {
    id: 'deal-1',
    imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=450&fit=crop',
    title: 'Nha Trang Beach Resort 5 sao',
    price: 2_800_000,
    rating: 9.2,
  },
  {
    id: 'deal-2',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=450&fit=crop',
    title: 'Đà Lạt romantic getaway 3N2Đ',
    price: 3_500_000,
    rating: 8.8,
  },
  {
    id: 'deal-3',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=450&fit=crop',
    title: 'Huế cố đô — Tour di sản văn hóa',
    price: 2_200_000,
    rating: 9.0,
  },
  {
    id: 'deal-4',
    imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=450&fit=crop',
    title: 'Bangkok shopping & food tour 4N3Đ',
    price: 6_500_000,
    rating: 8.5,
  },
];

// Flash sale ends 6 hours from now (for demo)
const FLASH_SALE_END = new Date(Date.now() + 6 * 60 * 60 * 1000);

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
  const { locale, t } = useLocale();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [destRes, tourRes] = await Promise.all([
          destinationApi.list({ size: 12, sort: 'ratingAvg,desc' }),
          tourApi.getFeatured(),
        ]);
        if (cancelled) return;
        if (destRes.success) setDestinations(destRes.data.items);
        if (tourRes.success) setTours(Array.isArray(tourRes.data) ? tourRes.data.slice(0, 8) : []);
      } catch {
        if (!cancelled) setError(t.home.loadError);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [t]);

  // country can be a string OR an object { id, name } depending on API include depth
  const vietnam = destinations
    .filter((d) => {
      const c = getCountryName(d).toLowerCase();
      return c.includes('viet') || c.includes('việt');
    })
    .slice(0, 6);
  const world = destinations
    .filter((d) => {
      const c = getCountryName(d).toLowerCase();
      return !c.includes('viet') && !c.includes('việt');
    })
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-tv-bg">
      {/* ── Hero search section ──────────────────────────────────────────── */}
      <HeroSearch t={t} />

      {/* ── Service icon grid ────────────────────────────────────────────── */}
      <ServiceGrid t={t} />

      {/* ── Promo banner ─────────────────────────────────────────────────── */}
      <PromoBanner t={t} />

      {/* ── Promo carousel (new component) ───────────────────────────────── */}
      <div className="mx-auto max-w-[1200px] px-4 py-5">
        <PromoCarousel banners={MOCK_PROMO_BANNERS} interval={5000} />
      </div>

      {/* ── Flash Sale ───────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1200px] px-4 py-5">
        <FlashSale endTime={FLASH_SALE_END} items={MOCK_FLASH_SALE_ITEMS} />
      </div>

      {/* ── Coupon Grid ──────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1200px] px-4 py-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="tv-section-title">{t.home.coupons}</h2>
        </div>
        <CouponGrid coupons={MOCK_COUPONS} locale={locale} />
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1200px] px-4 py-6 space-y-8">
        {/* Error state */}
        {error && (
          <div className="tv-card p-6 text-center">
            <p className="text-tv-red font-semibold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 tv-btn-primary text-tv-sm"
            >
              {t.home.retry}
            </button>
          </div>
        )}

        {/* Featured tours */}
        {(loading || tours.length > 0) && (
          <Section
            title={t.home.featuredTours}
            subtitle={t.home.featuredToursSubtitle}
            href="/tours"
            viewAllLabel={t.home.viewAll}
          >
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
                : tours.slice(0, 4).map((tour) => <TourCard key={tour.slug} tour={tour} />)}
            </div>
          </Section>
        )}

        {/* Vietnam destinations */}
        {(loading || vietnam.length > 0) && (
          <Section
            title={t.home.vietnamDestinations}
            subtitle={t.home.vietnamDestinationsSubtitle}
            href="/explore"
            viewAllLabel={t.home.viewAll}
          >
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
                : vietnam.map((d) => <DestCard key={d.slug} destination={d} compact />)}
            </div>
          </Section>
        )}

        {/* World destinations */}
        {(loading || world.length > 0) && (
          <Section
            title={t.home.worldDestinations}
            subtitle={t.home.worldDestinationsSubtitle}
            href="/explore"
            viewAllLabel={t.home.viewAll}
          >
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
                : world.map((d) => <DestCard key={d.slug} destination={d} compact />)}
            </div>
          </Section>
        )}

        {/* All tours grid */}
        {!loading && tours.length > 4 && (
          <Section
            title={t.home.allTours}
            subtitle={t.home.allToursSubtitle}
            href="/tours"
            viewAllLabel={t.home.viewAll}
          >
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {tours.slice(4).map((tour) => (
                <TourCard key={tour.slug} tour={tour} />
              ))}
            </div>
          </Section>
        )}
      </div>

      {/* ── Deal Recommendations ─────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1200px] px-4 py-5">
        <DealRecommendations deals={MOCK_DEALS} maxItems={4} />
      </div>

      {/* ── Trust band ───────────────────────────────────────────────────── */}
      <TrustBand t={t} />

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <SiteFooter t={t} />
    </main>
  );
}

/* ─── Hero search ───────────────────────────────────────────────────────────── */
function HeroSearch({ t }: { t: TranslationNamespace }) {
  return (
    <div className="bg-tv-blue">
      <div className="mx-auto max-w-[1200px] px-4 py-8">
        <h1 className="mb-6 text-center text-2xl font-bold text-white md:text-3xl">
          {t.home.heroTitle}
        </h1>

        {/* Search card — interactive Traveloka-style */}
        <div className="rounded-tv-lg bg-white p-4 shadow-tv-modal">
          <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_160px_auto]">
            {/* Destination — editable input */}
            <div className="tv-search-field">
              <label className="text-tv-xs text-tv-ink-3">{t.home.destination}</label>
              <div className="flex items-center gap-2 mt-1">
                <MapPin size={16} className="shrink-0 text-tv-blue" />
                <input
                  defaultValue="Đà Nẵng"
                  placeholder={t.home.searchPlaceholder}
                  className="w-full text-tv-base font-semibold text-tv-ink bg-transparent outline-none placeholder:text-tv-ink-4"
                />
              </div>
            </div>

            {/* Check-in — static display */}
            <div className="tv-search-field">
              <label className="text-tv-xs text-tv-ink-3">{t.home.checkIn}</label>
              <div className="flex items-center gap-2 mt-1">
                <CalendarDays size={16} className="shrink-0 text-tv-blue" />
                <span className="text-tv-base font-semibold">12 thg 8, 2026</span>
              </div>
            </div>

            {/* Check-out — static display */}
            <div className="tv-search-field">
              <label className="text-tv-xs text-tv-ink-3">{t.home.checkOut}</label>
              <div className="flex items-center gap-2 mt-1">
                <CalendarDays size={16} className="shrink-0 text-tv-blue" />
                <span className="text-tv-base font-semibold">16 thg 8, 2026</span>
              </div>
            </div>

            {/* Guests — static display */}
            <div className="tv-search-field">
              <label className="text-tv-xs text-tv-ink-3">{t.booking.guests}</label>
              <div className="flex items-center gap-2 mt-1">
                <Users size={16} className="shrink-0 text-tv-blue" />
                <span className="text-tv-base font-semibold">{t.home.guests}</span>
              </div>
            </div>

            {/* Search button — Link to /hotels */}
            <Link
              href="/hotels?destination=Đà+Nẵng&checkIn=2026-08-12&checkOut=2026-08-16&rooms=1&guests=2"
              className="flex items-center justify-center gap-2 rounded-tv bg-tv-orange px-6 py-3 text-tv-base font-bold text-white hover:bg-tv-orange-dark transition-colors"
            >
              <Search size={18} />
              <span className="hidden md:inline">{t.home.search}</span>
            </Link>
          </div>

          {/* Quick search tags — Links */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-tv-xs text-tv-ink-3 self-center">{t.home.quickSearch}</span>
            {['Đà Nẵng', 'Phú Quốc', 'Hội An', 'Sapa', 'Hà Nội', 'Tokyo', 'Bangkok'].map((city) => (
              <Link
                key={city}
                href={`/explore?keyword=${city}`}
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
function ServiceGrid({ t }: { t: TranslationNamespace }) {
  return (
    <div className="bg-white border-b border-tv-border shadow-tv-card">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="flex overflow-x-auto">
          {serviceItems.map(({ key, href, icon: Icon, color }) => (
            <Link
              key={key}
              href={href}
              className="tv-service-tab flex-shrink-0"
              style={{ color: undefined }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: color + '18' }}
              >
                <Icon size={24} style={{ color }} />
              </div>
              <span className="text-tv-xs font-semibold text-tv-ink-2">{t.home[key]}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Promo banner ──────────────────────────────────────────────────────────── */
function PromoBanner({ t }: { t: TranslationNamespace }) {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="tv-section-title">{t.home.todayDeals}</h2>
        <Link
          href="/tours"
          className="flex items-center gap-1 text-tv-sm font-semibold text-tv-blue hover:underline"
        >
          {t.home.viewAll} <ChevronRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {promos.map((promo) => (
          <Link key={promo.code} href="/tours" className="tv-card overflow-hidden group">
            <div className={`bg-gradient-to-br ${promo.bg} p-4 text-white`}>
              <span className={`tv-badge bg-white/20 text-white text-tv-xs`}>{promo.badge}</span>
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
  viewAllLabel,
  children,
}: {
  title: string;
  subtitle: string;
  href: string;
  viewAllLabel?: string;
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
          {viewAllLabel ?? 'Xem tất cả'} <ArrowRight size={14} />
        </Link>
      </div>
      {children}
    </section>
  );
}

/* ─── Destination card ──────────────────────────────────────────────────────── */
function DestCard({
  destination,
  compact = false,
}: {
  destination: Destination;
  compact?: boolean;
}) {
  const img = destination.imageUrl ?? getDestinationImage(destination.slug);
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="tv-card overflow-hidden group block"
    >
      <div
        className={`${compact ? 'h-28' : 'h-40'} bg-cover bg-center`}
        style={{ backgroundImage: `url(${img})` }}
      />
      <div className="p-2.5">
        <p className="font-bold text-tv-base text-tv-ink truncate group-hover:text-tv-blue transition-colors">
          {destination.name}
        </p>
        <p className="text-tv-xs text-tv-ink-3 truncate">{getCountryName(destination)}</p>
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
        {hasSale && <span className="absolute right-2 top-2 tv-badge tv-badge-red">Ưu đãi</span>}
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
            <p className="tv-price-small">
              {formatVnd(price)}
              <span className="text-tv-ink-3 font-normal">/người</span>
            </p>
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
function TrustBand({ t }: { t: TranslationNamespace }) {
  return (
    <div className="bg-white border-t border-tv-border">
      <div className="mx-auto max-w-[1200px] px-4 py-5">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4">
          {/* 1 */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tv-blue-light">
              <ShieldCheck size={20} className="text-tv-blue" />
            </div>
            <div>
              <p className="text-tv-sm font-bold text-tv-ink">{t.home.safePayment}</p>
              <p className="text-tv-xs text-tv-ink-3">{t.home.safePaymentDesc}</p>
            </div>
          </div>
          {/* 2 */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-tv-sm font-bold text-tv-ink">{t.home.realData}</p>
              <p className="text-tv-xs text-tv-ink-3">{t.home.realDataDesc}</p>
            </div>
          </div>
          {/* 3 */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tv-orange-light">
              <Headphones size={20} className="text-tv-orange-dark" />
            </div>
            <div>
              <p className="text-tv-sm font-bold text-tv-ink">{t.home.support247}</p>
              <p className="text-tv-xs text-tv-ink-3">{t.home.support247Desc}</p>
            </div>
          </div>
          {/* 4 */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50">
              <Tag size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-tv-sm font-bold text-tv-ink">{t.home.bestPrice}</p>
              <p className="text-tv-xs text-tv-ink-3">{t.home.bestPriceDesc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Footer ────────────────────────────────────────────────────────────────── */
function SiteFooter({ t }: { t: TranslationNamespace }) {
  return (
    <footer className="bg-tv-ink text-white">
      <div className="mx-auto max-w-[1200px] px-4 py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-tv-lg font-bold text-white">WanderViet</p>
            <p className="mt-1 text-tv-xs text-white/60">
              Nền tảng đặt tour du lịch Việt Nam &amp; quốc tế
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-tv-sm bg-white/10 px-2.5 py-1 text-tv-xs text-white/50">
              <ShieldCheck size={12} />
              {t.home.safePaymentDesc}
            </p>
            {/* Social media links */}
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors"
                aria-label="Twitter/X"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: t.home.services,
              links: [
                { label: t.home.tours, href: '/tours' },
                { label: t.home.hotels, href: '/hotels' },
                { label: t.home.flights, href: '/flights' },
                { label: t.home.activities, href: '/experiences' },
              ],
            },
            {
              title: t.home.support,
              links: [
                { label: t.home.support, href: '/support' },
                { label: t.home.support, href: '/support' },
                { label: 'Blog', href: '/blog' },
                { label: t.home.support, href: '/support' },
              ],
            },
            {
              title: t.home.account,
              links: [
                { label: t.nav.login, href: '/login' },
                { label: t.nav.register, href: '/register' },
                { label: t.nav.myBookings, href: '/my-bookings' },
                { label: t.nav.wishlist, href: '/wishlist' },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <p className="mb-3 text-tv-sm font-bold text-white/80 uppercase tracking-wider">
                {col.title}
              </p>
              <ul className="space-y-2">
                {col.links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="text-tv-xs text-white/50 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Tải ứng dụng */}
        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="mb-3 text-tv-sm font-bold text-white/80 uppercase tracking-wider">
            {t.home.downloadApp}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-tv-sm border border-white/20 bg-white/5 px-4 py-2 text-tv-xs text-white/70 hover:bg-white/10 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              App Store
            </a>
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-tv-sm border border-white/20 bg-white/5 px-4 py-2 text-tv-xs text-white/70 hover:bg-white/10 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.3 2.3-8.636-8.632z" />
              </svg>
              Google Play
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 flex flex-col items-center gap-2 md:flex-row md:justify-between">
          <p className="text-tv-xs text-white/40">© 2026 WanderViet. All rights reserved.</p>
          <p className="text-tv-xs text-white/40">
            Built with Next.js 16 · NestJS 11 · Prisma 7 · PostgreSQL
          </p>
        </div>
      </div>
    </footer>
  );
}
