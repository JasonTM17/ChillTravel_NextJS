'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PromoBanner {
  id: string;
  imageUrl: string;
  /** Max 60 characters */
  title: string;
  ctaText: string;
  ctaUrl: string;
}

interface PromoCarouselProps {
  banners: PromoBanner[];
  /** Auto-advance interval in ms (default: 5000) */
  interval?: number;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function PromoCarousel({ banners, interval = 5000 }: PromoCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const validBanners = banners.slice(0, 10);
  const total = validBanners.length;

  // ─── Auto-advance ────────────────────────────────────────────────────────

  const advance = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  useEffect(() => {
    if (isPaused || total <= 1) return;
    timerRef.current = setInterval(advance, interval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, advance, interval, total]);

  // ─── Scroll to active banner ─────────────────────────────────────────────

  useEffect(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const bannerWidth = container.offsetWidth;
    container.scrollTo({ left: bannerWidth * activeIndex, behavior: 'smooth' });
  }, [activeIndex]);

  // ─── Pause handlers ──────────────────────────────────────────────────────

  const handlePause = useCallback(() => setIsPaused(true), []);
  const handleResume = useCallback(() => setIsPaused(false), []);

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
    // Reset timer on manual navigation
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 300);
  }, []);

  if (total < 3) return null;

  return (
    <section
      aria-label="Khuyến mãi nổi bật"
      className="relative w-full overflow-hidden"
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      onTouchStart={handlePause}
      onTouchEnd={handleResume}
    >
      {/* Banner track */}
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory overflow-x-hidden scroll-smooth"
        aria-live="polite"
      >
        {validBanners.map((banner, idx) => (
          <div
            key={banner.id}
            className="w-full flex-shrink-0 snap-center"
            aria-hidden={idx !== activeIndex}
          >
            <div className="relative mx-auto aspect-[21/9] w-full max-w-6xl overflow-hidden rounded-tv-lg sm:aspect-[3/1]">
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1152px"
                priority={idx === 0}
              />
              {/* Overlay content */}
              <div className="absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 sm:p-8">
                <h3 className="max-w-md text-lg font-bold text-white sm:text-2xl">
                  {banner.title.slice(0, 60)}
                </h3>
                <Link
                  href={banner.ctaUrl}
                  className="mt-3 inline-flex items-center rounded-tv bg-orange-cta px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#e55f14] focus:outline-none focus:ring-2 focus:ring-orange-cta/40 focus:ring-offset-2"
                >
                  {banner.ctaText}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      <div className="mt-3 flex items-center justify-center gap-2" role="tablist">
        {validBanners.map((banner, idx) => (
          <button
            key={banner.id}
            role="tab"
            aria-selected={idx === activeIndex}
            aria-label={`Xem banner ${idx + 1}`}
            onClick={() => goTo(idx)}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              idx === activeIndex ? 'w-6 bg-booking-blue' : 'w-2 bg-border hover:bg-muted-ink/40',
            )}
          />
        ))}
      </div>
    </section>
  );
}
