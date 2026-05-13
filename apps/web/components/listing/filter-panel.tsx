'use client';

import { Star, X, SlidersHorizontal, SearchX } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useLocale } from '@/lib/i18n';
import type { AmenityType } from './hotel-card';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface HotelFilterState {
  priceMin: number;
  priceMax: number;
  starRatings: number[];
  amenities: AmenityType[];
  propertyTypes: string[];
  maxDistance: number;
}

export interface FilterPanelProps {
  filters: HotelFilterState;
  onChange: (filters: HotelFilterState) => void;
  type: 'hotel' | 'flight';
  resultCount?: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PRICE_MIN = 0;
const PRICE_MAX = 50_000_000;
const PRICE_STEP = 500_000;

const DISTANCE_MAX = 50;
const DISTANCE_STEP = 1;

const ALL_AMENITIES: AmenityType[] = ['wifi', 'pool', 'parking', 'restaurant', 'gym', 'spa'];

const AMENITY_LABELS: Record<AmenityType, Record<string, string>> = {
  wifi: { vi: 'Wi-Fi', en: 'Wi-Fi', ja: 'Wi-Fi' },
  pool: { vi: 'Hồ bơi', en: 'Pool', ja: 'プール' },
  parking: { vi: 'Bãi đỗ xe', en: 'Parking', ja: '駐車場' },
  restaurant: { vi: 'Nhà hàng', en: 'Restaurant', ja: 'レストラン' },
  gym: { vi: 'Phòng gym', en: 'Gym', ja: 'ジム' },
  spa: { vi: 'Spa', en: 'Spa', ja: 'スパ' },
};

const PROPERTY_TYPES = ['hotel', 'resort', 'villa', 'hostel'] as const;

const PROPERTY_TYPE_LABELS: Record<string, Record<string, string>> = {
  hotel: { vi: 'Khách sạn', en: 'Hotel', ja: 'ホテル' },
  resort: { vi: 'Resort', en: 'Resort', ja: 'リゾート' },
  villa: { vi: 'Biệt thự', en: 'Villa', ja: 'ヴィラ' },
  hostel: { vi: 'Nhà nghỉ', en: 'Hostel', ja: 'ホステル' },
};

// ─── Default Filters ─────────────────────────────────────────────────────────

export const DEFAULT_HOTEL_FILTERS: HotelFilterState = {
  priceMin: PRICE_MIN,
  priceMax: PRICE_MAX,
  starRatings: [],
  amenities: [],
  propertyTypes: [],
  maxDistance: DISTANCE_MAX,
};

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Unified filter panel for hotel listings.
 * Supports price range slider (0 - 50,000,000 VND), star rating checkboxes,
 * amenities multi-select, property type multi-select, and distance slider (max 50km).
 * Displays empty state message when zero results match active filters.
 *
 * Validates: Requirements 8.2, 8.4
 */
export function FilterPanel({ filters, onChange, type, resultCount }: FilterPanelProps) {
  const { locale, t, fmt } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Only render hotel filters for now (type === 'hotel')
  if (type !== 'hotel') return null;

  // ─── Handlers ────────────────────────────────────────────────────────────

  const updateFilter = <K extends keyof HotelFilterState>(key: K, value: HotelFilterState[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleArrayItem = <T,>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter((v) => v !== item) : [...arr, item];

  const handleStarToggle = (star: number) => {
    updateFilter('starRatings', toggleArrayItem(filters.starRatings, star));
  };

  const handleAmenityToggle = (amenity: AmenityType) => {
    updateFilter('amenities', toggleArrayItem(filters.amenities, amenity));
  };

  const handlePropertyTypeToggle = (propertyType: string) => {
    updateFilter('propertyTypes', toggleArrayItem(filters.propertyTypes, propertyType));
  };

  const handleReset = () => {
    onChange(DEFAULT_HOTEL_FILTERS);
  };

  // ─── Empty State ─────────────────────────────────────────────────────────

  const emptyState = resultCount === 0 && (
    <div className="mt-5 rounded-xl border border-border bg-sky-surface p-5 text-center">
      <SearchX size={32} className="mx-auto mb-2 text-booking-blue" aria-hidden="true" />
      <p className="text-sm font-semibold text-ink">{t.hotel.noHotelsFound}</p>
      <p className="mt-1 text-xs text-muted-ink">{t.hotel.adjustFilters}</p>
      <button
        type="button"
        onClick={handleReset}
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-booking-blue px-4 py-2 text-xs font-semibold text-booking-blue transition-colors hover:bg-sky-surface"
      >
        {t.common.resetFilters}
      </button>
    </div>
  );

  // ─── Filter Content ──────────────────────────────────────────────────────

  const filterContent = (
    <div className="space-y-6">
      {/* Price Range Slider */}
      <section>
        <h4 className="mb-3 text-sm font-bold text-ink">{t.hotel.priceRange}</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-ink">
            <span>{fmt.formatCurrency(filters.priceMin)}</span>
            <span>{fmt.formatCurrency(filters.priceMax)}</span>
          </div>
          {/* Min price slider */}
          <label className="block">
            <span className="sr-only">Minimum price</span>
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={PRICE_STEP}
              value={filters.priceMin}
              onChange={(e) =>
                updateFilter(
                  'priceMin',
                  Math.min(Number(e.target.value), filters.priceMax - PRICE_STEP),
                )
              }
              className="w-full accent-booking-blue"
              aria-label="Minimum price"
            />
          </label>
          {/* Max price slider */}
          <label className="block">
            <span className="sr-only">Maximum price</span>
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={PRICE_STEP}
              value={filters.priceMax}
              onChange={(e) =>
                updateFilter(
                  'priceMax',
                  Math.max(Number(e.target.value), filters.priceMin + PRICE_STEP),
                )
              }
              className="w-full accent-booking-blue"
              aria-label="Maximum price"
            />
          </label>
        </div>
      </section>

      {/* Star Rating Checkboxes */}
      <section>
        <h4 className="mb-3 text-sm font-bold text-ink">{t.hotel.starRating}</h4>
        <div className="flex flex-wrap gap-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const isActive = filters.starRatings.includes(star);
            return (
              <button
                key={star}
                type="button"
                onClick={() => handleStarToggle(star)}
                className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-booking-blue bg-sky-surface text-booking-blue'
                    : 'border-border bg-white text-muted-ink hover:border-booking-blue/50'
                }`}
                aria-pressed={isActive}
                aria-label={`${star} star${star > 1 ? 's' : ''}`}
              >
                {star}
                <Star size={13} className="fill-yellow-400 text-yellow-400" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </section>

      {/* Amenities Multi-Select */}
      <section>
        <h4 className="mb-3 text-sm font-bold text-ink">{t.hotel.amenities}</h4>
        <div className="space-y-2">
          {ALL_AMENITIES.map((amenity) => {
            const isChecked = filters.amenities.includes(amenity);
            return (
              <label key={amenity} className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="h-4 w-4 rounded border-border text-booking-blue accent-booking-blue focus:ring-booking-blue/30"
                />
                <span className="text-sm text-ink">
                  {AMENITY_LABELS[amenity][locale] ?? AMENITY_LABELS[amenity].en}
                </span>
              </label>
            );
          })}
        </div>
      </section>

      {/* Property Type Multi-Select */}
      <section>
        <h4 className="mb-3 text-sm font-bold text-ink">{t.hotel.propertyType}</h4>
        <div className="space-y-2">
          {PROPERTY_TYPES.map((propertyType) => {
            const isChecked = filters.propertyTypes.includes(propertyType);
            return (
              <label key={propertyType} className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handlePropertyTypeToggle(propertyType)}
                  className="h-4 w-4 rounded border-border text-booking-blue accent-booking-blue focus:ring-booking-blue/30"
                />
                <span className="text-sm text-ink">
                  {PROPERTY_TYPE_LABELS[propertyType]?.[locale] ??
                    PROPERTY_TYPE_LABELS[propertyType]?.en ??
                    propertyType}
                </span>
              </label>
            );
          })}
        </div>
      </section>

      {/* Distance from Center Slider */}
      <section>
        <h4 className="mb-3 text-sm font-bold text-ink">{t.hotel.distanceFromCenter}</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-ink">
            <span>0 km</span>
            <span>{filters.maxDistance} km</span>
          </div>
          <label className="block">
            <span className="sr-only">{t.hotel.distanceFromCenter}</span>
            <input
              type="range"
              min={0}
              max={DISTANCE_MAX}
              step={DISTANCE_STEP}
              value={filters.maxDistance}
              onChange={(e) => updateFilter('maxDistance', Number(e.target.value))}
              className="w-full accent-booking-blue"
              aria-label="Maximum distance from center"
            />
          </label>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex gap-3 border-t border-border pt-4">
        <button
          type="button"
          onClick={handleReset}
          className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-muted-ink transition-colors hover:bg-gray-50"
        >
          {t.common.resetFilters}
        </button>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="flex-1 rounded-lg bg-orange-cta px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-600 lg:hidden"
        >
          {t.common.confirm}
        </button>
      </div>

      {/* Empty State */}
      {emptyState}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-72 shrink-0 lg:block" aria-label="Hotel filters">
        <div className="sticky top-24 rounded-xl border border-border bg-white p-5 shadow-[0_2px_12px_rgba(2,119,212,0.08)]">
          <h3 className="mb-5 text-base font-bold text-ink">
            <SlidersHorizontal size={16} className="mr-2 inline-block" aria-hidden="true" />
            {t.common.search}
          </h3>
          {filterContent}
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <div className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-booking-blue px-5 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105"
          aria-label="Open filters"
        >
          <SlidersHorizontal size={16} aria-hidden="true" />
          {t.hotel.amenities}
        </button>
      </div>

      {/* Mobile Bottom Sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          {/* Sheet */}
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-5 shadow-lg animate-in slide-in-from-bottom">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-ink">
                <SlidersHorizontal size={16} className="mr-2 inline-block" aria-hidden="true" />
                {t.common.search}
              </h3>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full hover:bg-gray-100"
                aria-label={t.common.close}
              >
                <X size={18} />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}
    </>
  );
}
