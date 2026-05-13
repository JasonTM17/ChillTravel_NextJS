'use client';

import { Copy, Check } from 'lucide-react';
import { useCallback } from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Coupon {
  id: string;
  /** Max 20 characters */
  code: string;
  /** Max 100 characters */
  description: string;
  startDate: string;
  endDate: string;
  discountPercent: number;
}

interface CouponGridProps {
  coupons: Coupon[];
}

// ─── Gradient presets ────────────────────────────────────────────────────────

const GRADIENTS = [
  'from-booking-blue to-purple-600',
  'from-orange-cta to-red-500',
  'from-teal-trust to-emerald-500',
  'from-deep-blue to-indigo-600',
] as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  // Expect ISO or parseable date, output DD/MM/YYYY
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

// ─── Coupon Card ─────────────────────────────────────────────────────────────

function CouponCard({ coupon, index }: { coupon: Coupon; index: number }) {
  const [copied, setCopied] = useState(false);
  const gradient = GRADIENTS[index % GRADIENTS.length];

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: do nothing
    }
  }, [coupon.code]);

  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-tv-lg border-l-4 border-dashed border-white/50 bg-gradient-to-br text-white shadow-card transition hover:shadow-card-lg',
        gradient,
      )}
    >
      <div className="p-4">
        {/* Discount badge */}
        <div className="mb-2 text-2xl font-bold">-{coupon.discountPercent}%</div>

        {/* Code chip */}
        <div className="mb-3 flex items-center gap-2">
          <code className="rounded bg-white/20 px-2 py-1 font-mono text-sm font-bold tracking-wider backdrop-blur">
            {coupon.code.slice(0, 20)}
          </code>
          <button
            onClick={handleCopy}
            aria-label={`Sao chép mã ${coupon.code}`}
            className="grid h-7 w-7 place-items-center rounded bg-white/20 transition hover:bg-white/30"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>

        {/* Description */}
        <p className="mb-3 line-clamp-2 text-sm leading-5 text-white/90">
          {coupon.description.slice(0, 100)}
        </p>

        {/* Validity */}
        <p className="mb-3 text-xs text-white/70">
          {formatDate(coupon.startDate)} – {formatDate(coupon.endDate)}
        </p>

        {/* CTA */}
        <button className="w-full rounded-tv bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur transition hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/40">
          Dùng ngay
        </button>
      </div>
    </article>
  );
}

// ─── Grid Component ──────────────────────────────────────────────────────────

export function CouponGrid({ coupons }: CouponGridProps) {
  const visibleCoupons = coupons.slice(0, 8);

  if (visibleCoupons.length === 0) return null;

  return (
    <section aria-label="Mã giảm giá">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {visibleCoupons.map((coupon, idx) => (
          <CouponCard key={coupon.id} coupon={coupon} index={idx} />
        ))}
      </div>
    </section>
  );
}
