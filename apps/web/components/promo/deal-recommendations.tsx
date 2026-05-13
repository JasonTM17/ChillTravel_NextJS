'use client';

import { Star } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { cn, formatVnd } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Deal {
  id: string;
  imageUrl: string;
  title: string;
  price: number;
  rating: number;
}

interface DealRecommendationsProps {
  /** Fallback deals shown when browsing history is insufficient */
  deals: Deal[];
  /** Maximum number of items to display (default: 4) */
  maxItems?: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const BROWSING_HISTORY_KEY = 'wanderviet-browsing-history';
const MIN_HISTORY_ITEMS = 3;

// ─── Helpers ─────────────────────────────────────────────────────────────────

interface BrowsingHistoryItem {
  id: string;
  title?: string;
  slug?: string;
}

function getBrowsingHistory(): BrowsingHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BROWSING_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Filter deals based on browsing history IDs.
 * If history has fewer than MIN_HISTORY_ITEMS, return fallback deals sorted by rating.
 */
function getRecommendedDeals(
  allDeals: Deal[],
  history: BrowsingHistoryItem[],
  maxItems: number,
): Deal[] {
  if (history.length < MIN_HISTORY_ITEMS) {
    // Fallback: top-rated deals
    return [...allDeals].sort((a, b) => b.rating - a.rating).slice(0, maxItems);
  }

  // Personalized: match deals to browsing history IDs
  const historyIds = new Set(history.map((h) => h.id));
  const matched = allDeals.filter((deal) => historyIds.has(deal.id));

  // If not enough matches, fill with top-rated
  if (matched.length < maxItems) {
    const remaining = allDeals
      .filter((d) => !historyIds.has(d.id))
      .sort((a, b) => b.rating - a.rating);
    return [...matched, ...remaining].slice(0, maxItems);
  }

  return matched.slice(0, maxItems);
}

// ─── Deal Card ───────────────────────────────────────────────────────────────

function DealCard({ deal }: { deal: Deal }) {
  return (
    <article className="w-64 flex-shrink-0 overflow-hidden rounded-tv-lg border border-border bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-lg lg:w-auto">
      {/* Image */}
      <div className="relative aspect-[4/3] w-full bg-sky-surface">
        <Image
          src={deal.imageUrl}
          alt={deal.title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 256px, 280px"
        />
        {/* Rating badge */}
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-xs font-bold text-ink shadow-sm backdrop-blur">
          <Star size={12} fill="#FFB300" className="text-[#FFB300]" />
          {deal.rating.toFixed(1)}
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h4 className="line-clamp-2 text-sm font-semibold text-ink">{deal.title}</h4>
        <p className="mt-2 text-base font-bold text-booking-blue">{formatVnd(deal.price)}</p>
      </div>
    </article>
  );
}

// ─── Deal Recommendations Section ────────────────────────────────────────────

export function DealRecommendations({ deals, maxItems = 4 }: DealRecommendationsProps) {
  const [recommended, setRecommended] = useState<Deal[]>([]);

  useEffect(() => {
    const history = getBrowsingHistory();
    const result = getRecommendedDeals(deals, history, maxItems);
    setRecommended(result);
  }, [deals, maxItems]);

  if (recommended.length === 0) return null;

  return (
    <section aria-label="Ưu đãi dành cho bạn">
      <h2 className="mb-4 text-xl font-bold text-ink sm:text-2xl">Ưu đãi dành cho bạn</h2>

      {/* Mobile: horizontal scroll / Desktop: grid */}
      <div
        className={cn(
          'flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border',
          'lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:pb-0',
        )}
      >
        {recommended.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </section>
  );
}
