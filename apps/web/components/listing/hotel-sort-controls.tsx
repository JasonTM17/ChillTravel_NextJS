'use client';

import { useLocale } from '@/lib/i18n';

// ─── Types ───────────────────────────────────────────────────────────────────

export type SortOption =
  | 'price_asc'
  | 'price_desc'
  | 'rating_desc'
  | 'popularity_desc'
  | 'distance_asc';

interface HotelSortControlsProps {
  activeSort: SortOption;
  onChange: (sort: SortOption) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function HotelSortControls({ activeSort, onChange }: HotelSortControlsProps) {
  const { t } = useLocale();

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'price_asc', label: t.hotel.priceLowHigh },
    { value: 'price_desc', label: t.hotel.priceHighLow },
    { value: 'rating_desc', label: t.hotel.ratingDesc },
    { value: 'popularity_desc', label: t.hotel.popularityDesc },
    { value: 'distance_asc', label: t.hotel.distanceAsc },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {sortOptions.map((option) => {
        const isActive = activeSort === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'border-booking-blue bg-sky-surface text-booking-blue'
                : 'border-border bg-white text-muted-ink hover:border-booking-blue/50 hover:text-ink'
            }`}
            aria-pressed={isActive}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
