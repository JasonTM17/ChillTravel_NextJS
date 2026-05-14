'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  HeroSearch,
  ServiceGrid,
  PromoBannerCarousel,
  FlashSaleSection,
  CouponSection,
  FeaturedTourCard,
  DestinationCard,
  TrustBand,
  SiteFooter,
} from '@/components/home';
import { destinationApi, getCountryName } from '@/lib/api/destination.api';
import type { Destination } from '@/lib/api/destination.api';
import { tourApi } from '@/lib/api/tour.api';
import type { Tour } from '@/lib/api/tour.api';
import { useLocale } from '@/lib/i18n/use-locale';

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
      <div className="h-44 w-full animate-pulse bg-gray-200" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  href,
  viewAllLabel,
}: {
  title: string;
  subtitle?: string;
  href: string;
  viewAllLabel?: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between">
      <div>
        <h2 className="text-xl font-extrabold text-gray-900 md:text-2xl">{title}</h2>
        {subtitle && <p className="mt-1 text-[13px] text-gray-500">{subtitle}</p>}
      </div>
      <Link
        href={href}
        className="flex items-center gap-1 text-sm font-semibold text-[#0064D2] hover:underline whitespace-nowrap"
      >
        {viewAllLabel ?? 'Xem tất cả'} <ArrowRight size={14} />
      </Link>
    </div>
  );
}

export default function HomePage() {
  const { t } = useLocale();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

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
        if (!cancelled) {
          setDestinations([]);
          setTours([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [t]);

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
    <main className="min-h-screen bg-[#F7F8FA]">
      <HeroSearch t={t} />
      <ServiceGrid t={t} />
      <PromoBannerCarousel />
      <FlashSaleSection />
      <CouponSection />

      {/* Main content sections */}
      <div className="mx-auto max-w-[1200px] px-4 py-8 space-y-10">
        {/* Featured tours */}
        {(loading || tours.length > 0) && (
          <section>
            <SectionHeader
              title={t.home.featuredTours}
              subtitle={t.home.featuredToursSubtitle}
              href="/tours"
              viewAllLabel={t.home.viewAll}
            />
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
                : tours.slice(0, 4).map((tour) => <FeaturedTourCard key={tour.slug} tour={tour} />)}
            </div>
          </section>
        )}

        {/* Vietnam destinations */}
        {(loading || vietnam.length > 0) && (
          <section>
            <SectionHeader
              title={t.home.vietnamDestinations}
              subtitle={t.home.vietnamDestinationsSubtitle}
              href="/explore"
              viewAllLabel={t.home.viewAll}
            />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
                : vietnam.map((d) => <DestinationCard key={d.slug} destination={d} compact />)}
            </div>
          </section>
        )}

        {/* World destinations */}
        {(loading || world.length > 0) && (
          <section>
            <SectionHeader
              title={t.home.worldDestinations}
              subtitle={t.home.worldDestinationsSubtitle}
              href="/explore"
              viewAllLabel={t.home.viewAll}
            />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
                : world.map((d) => <DestinationCard key={d.slug} destination={d} compact />)}
            </div>
          </section>
        )}

        {/* More tours */}
        {!loading && tours.length > 4 && (
          <section>
            <SectionHeader
              title={t.home.allTours}
              subtitle={t.home.allToursSubtitle}
              href="/tours"
              viewAllLabel={t.home.viewAll}
            />
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
              {tours.slice(4).map((tour) => (
                <FeaturedTourCard key={tour.slug} tour={tour} />
              ))}
            </div>
          </section>
        )}
      </div>

      <TrustBand t={t} />
      <SiteFooter t={t} />
    </main>
  );
}
