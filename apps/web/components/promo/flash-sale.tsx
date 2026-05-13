'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback, useRef } from 'react';
import { cn, formatVnd } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FlashSaleItem {
  id: string;
  imageUrl: string;
  name: string;
  originalPrice: number;
  salePrice: number;
}

interface FlashSaleProps {
  endTime: Date;
  items: FlashSaleItem[];
}

// ─── Countdown Hook ──────────────────────────────────────────────────────────

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function useCountdown(endTime: Date): TimeLeft {
  const calcTimeLeft = useCallback((): TimeLeft => {
    const diff = endTime.getTime() - Date.now();
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true };
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      expired: false,
    };
  }, [endTime]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft);

  useEffect(() => {
    const tick = () => setTimeLeft(calcTimeLeft());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [calcTimeLeft]);

  return timeLeft;
}

// ─── Countdown Digit ─────────────────────────────────────────────────────────

function CountdownDigit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0');
  const prevRef = useRef(display);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (prevRef.current !== display) {
      setAnimate(true);
      prevRef.current = display;
      const timeout = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [display]);

  return (
    <div className="flex flex-col items-center">
      <span
        className={cn(
          'grid h-10 w-10 place-items-center rounded-tv bg-ink text-lg font-bold tabular-nums text-white transition-transform duration-300 sm:h-12 sm:w-12 sm:text-xl',
          animate && 'scale-110',
        )}
        aria-label={`${value} ${label}`}
      >
        {display}
      </span>
      <span className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-ink">
        {label}
      </span>
    </div>
  );
}

// ─── Flash Sale Item Card ────────────────────────────────────────────────────

function FlashSaleCard({ item, expired }: { item: FlashSaleItem; expired: boolean }) {
  const savings = Math.round(((item.originalPrice - item.salePrice) / item.originalPrice) * 100);

  return (
    <article className="relative w-44 flex-shrink-0 overflow-hidden rounded-tv-lg border border-border bg-white shadow-card transition hover:shadow-card-lg sm:w-52">
      {/* Savings badge */}
      <div className="absolute right-2 top-2 z-10 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
        -{savings}%
      </div>

      {/* Image */}
      <div className="relative aspect-square w-full bg-sky-surface">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className={cn('object-cover', expired && 'grayscale')}
          sizes="(max-width: 640px) 176px, 208px"
        />
      </div>

      {/* Content */}
      <div className="p-3">
        <h4 className="line-clamp-2 text-sm font-semibold text-ink">{item.name}</h4>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-sm text-muted-ink line-through">
            {formatVnd(item.originalPrice)}
          </span>
        </div>
        <span className="text-base font-bold text-red-600">{formatVnd(item.salePrice)}</span>

        {/* Action */}
        <button
          disabled={expired}
          className={cn(
            'mt-3 w-full rounded-tv px-3 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-offset-1',
            expired
              ? 'cursor-not-allowed bg-gray-200 text-muted-ink'
              : 'bg-orange-cta text-white hover:bg-[#e55f14] focus:ring-orange-cta/40',
          )}
        >
          {expired ? 'Đã kết thúc' : 'Mua ngay'}
        </button>
      </div>
    </article>
  );
}

// ─── Flash Sale Section ──────────────────────────────────────────────────────

export function FlashSale({ endTime, items }: FlashSaleProps) {
  const timeLeft = useCountdown(endTime);
  const visibleItems = items.slice(0, 6);

  if (visibleItems.length === 0) return null;

  return (
    <section aria-label="Flash Sale">
      {/* Header with countdown */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <h2 className="text-xl font-bold text-ink sm:text-2xl">⚡ Flash Sale</h2>

        {timeLeft.expired ? (
          <span className="rounded-full bg-gray-200 px-4 py-1.5 text-sm font-bold text-muted-ink">
            Đã kết thúc
          </span>
        ) : (
          <div className="flex items-center gap-1.5">
            <CountdownDigit value={timeLeft.hours} label="giờ" />
            <span className="text-lg font-bold text-ink">:</span>
            <CountdownDigit value={timeLeft.minutes} label="phút" />
            <span className="text-lg font-bold text-ink">:</span>
            <CountdownDigit value={timeLeft.seconds} label="giây" />
          </div>
        )}
      </div>

      {/* Horizontal scroll items */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border sm:gap-4">
        {visibleItems.map((item) => (
          <FlashSaleCard key={item.id} item={item} expired={timeLeft.expired} />
        ))}
      </div>
    </section>
  );
}
