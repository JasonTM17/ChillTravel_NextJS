'use client';

// ─── Types ───────────────────────────────────────────────────────────────────

export type SortOption =
  | 'price_asc'
  | 'price_desc'
  | 'rating_desc'
  | 'popularity_desc'
  | 'distance_asc';

export interface SortOptionConfig {
  value: SortOption;
  label: string;
}

interface SortControlsProps {
  sortBy: SortOption;
  onChange: (sort: SortOption) => void;
  options: SortOptionConfig[];
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Generic sort controls component for listing pages.
 * Renders a row of toggle buttons for sort options.
 *
 * Sort options supported:
 * - price_asc: Price low to high
 * - price_desc: Price high to low
 * - rating_desc: Rating descending (by review score)
 * - popularity_desc: Popularity descending (by review count)
 * - distance_asc: Distance ascending (nearest first)
 */
export function SortControls({ sortBy, onChange, options }: SortControlsProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="group"
      aria-label="Sort options"
    >
      {options.map((option) => {
        const isActive = sortBy === option.value;
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
