'use client';

import { RotateCcw } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { useLocale } from '@/lib/i18n';
import type { Flight } from './flight-card';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FlightFilters {
  timeBlocks: string[];
  stops: number[];
  airlines: string[];
  priceRange: [number, number];
}

interface FlightFilterPanelProps {
  flights: Flight[];
  filters: FlightFilters;
  onFiltersChange: (filters: FlightFilters) => void;
  filteredCount: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TIME_BLOCKS = [
  { id: '00-06', label: '00:00 – 06:00' },
  { id: '06-12', label: '06:00 – 12:00' },
  { id: '12-18', label: '12:00 – 18:00' },
  { id: '18-24', label: '18:00 – 24:00' },
] as const;

// ─── Component ───────────────────────────────────────────────────────────────

export function FlightFilterPanel({
  flights,
  filters,
  onFiltersChange,
  filteredCount,
}: FlightFilterPanelProps) {
  const { t, fmt } = useLocale();

  // Derive available airlines from results
  const availableAirlines = useMemo(() => {
    const airlines = new Set(flights.map((f) => f.airline));
    return Array.from(airlines).sort();
  }, [flights]);

  // Derive price bounds from results
  const priceBounds = useMemo<[number, number]>(() => {
    if (flights.length === 0) return [0, 10000000];
    const prices = flights.map((f) => f.basePrice + f.taxAmount);
    return [Math.min(...prices), Math.max(...prices)];
  }, [flights]);

  // ─── Handlers ────────────────────────────────────────────────────────────

  const toggleTimeBlock = useCallback(
    (blockId: string) => {
      const next = filters.timeBlocks.includes(blockId)
        ? filters.timeBlocks.filter((b) => b !== blockId)
        : [...filters.timeBlocks, blockId];
      onFiltersChange({ ...filters, timeBlocks: next });
    },
    [filters, onFiltersChange],
  );

  const toggleStops = useCallback(
    (stopCount: number) => {
      const next = filters.stops.includes(stopCount)
        ? filters.stops.filter((s) => s !== stopCount)
        : [...filters.stops, stopCount];
      onFiltersChange({ ...filters, stops: next });
    },
    [filters, onFiltersChange],
  );

  const toggleAirline = useCallback(
    (airline: string) => {
      const next = filters.airlines.includes(airline)
        ? filters.airlines.filter((a) => a !== airline)
        : [...filters.airlines, airline];
      onFiltersChange({ ...filters, airlines: next });
    },
    [filters, onFiltersChange],
  );

  const handlePriceChange = useCallback(
    (value: number) => {
      onFiltersChange({ ...filters, priceRange: [priceBounds[0], value] });
    },
    [filters, onFiltersChange, priceBounds],
  );

  const resetAll = useCallback(() => {
    onFiltersChange({
      timeBlocks: [],
      stops: [],
      airlines: [],
      priceRange: priceBounds,
    });
  }, [onFiltersChange, priceBounds]);

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <aside className="rounded-2xl border border-[#D9ECFB] bg-white p-5 shadow-[0_2px_12px_rgba(2,119,212,0.08)]">
      {/* Departure time blocks */}
      <section>
        <h3 className="text-sm font-bold text-[#071827]">{t.flight.departureTime}</h3>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {TIME_BLOCKS.map((block) => {
            const isActive = filters.timeBlocks.includes(block.id);
            return (
              <button
                key={block.id}
                type="button"
                onClick={() => toggleTimeBlock(block.id)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                  isActive
                    ? 'border-[#0277D4] bg-[#EAF7FF] text-[#0277D4]'
                    : 'border-[#D9ECFB] bg-white text-[#476273] hover:border-[#0277D4]/40'
                }`}
              >
                {block.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Number of stops */}
      <section className="mt-6">
        <h3 className="text-sm font-bold text-[#071827]">{t.flight.stops}</h3>
        <div className="mt-3 space-y-2">
          {[
            { value: 0, label: t.flight.direct },
            { value: 1, label: t.flight.oneStop },
            { value: 2, label: t.flight.twoOrMoreStops },
          ].map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2 text-sm text-[#071827]"
            >
              <input
                type="checkbox"
                checked={filters.stops.includes(option.value)}
                onChange={() => toggleStops(option.value)}
                className="h-4 w-4 rounded border-[#D9ECFB] text-[#0277D4] focus:ring-[#0277D4]/30"
              />
              {option.label}
            </label>
          ))}
        </div>
      </section>

      {/* Airlines */}
      <section className="mt-6">
        <h3 className="text-sm font-bold text-[#071827]">{t.flight.airline}</h3>
        <div className="mt-3 max-h-40 space-y-2 overflow-y-auto">
          {availableAirlines.map((airline) => (
            <label
              key={airline}
              className="flex cursor-pointer items-center gap-2 text-sm text-[#071827]"
            >
              <input
                type="checkbox"
                checked={filters.airlines.includes(airline)}
                onChange={() => toggleAirline(airline)}
                className="h-4 w-4 rounded border-[#D9ECFB] text-[#0277D4] focus:ring-[#0277D4]/30"
              />
              {airline}
            </label>
          ))}
        </div>
      </section>

      {/* Price range slider */}
      <section className="mt-6">
        <h3 className="text-sm font-bold text-[#071827]">{t.flight.pricePerPassenger}</h3>
        <div className="mt-3">
          <input
            type="range"
            min={priceBounds[0]}
            max={priceBounds[1]}
            value={filters.priceRange[1]}
            onChange={(e) => handlePriceChange(Number(e.target.value))}
            className="w-full accent-[#0277D4]"
            aria-label={t.flight.pricePerPassenger}
          />
          <div className="mt-1 flex justify-between text-xs text-[#476273]">
            <span>{fmt.formatCurrency(priceBounds[0])}</span>
            <span>{fmt.formatCurrency(filters.priceRange[1])}</span>
          </div>
        </div>
      </section>

      {/* Reset all */}
      <button
        type="button"
        onClick={resetAll}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-[#D9ECFB] px-4 py-2.5 text-sm font-medium text-[#476273] transition hover:border-[#0277D4]/40 hover:text-[#0277D4]"
      >
        <RotateCcw size={14} aria-hidden="true" />
        {t.flight.resetAllFilters}
      </button>

      {/* Empty state */}
      {filteredCount === 0 && (
        <div className="mt-5 rounded-lg bg-[#EAF7FF] p-4 text-center">
          <p className="text-sm font-medium text-[#0277D4]">{t.flight.noFlightsFound}</p>
          <p className="mt-1 text-xs text-[#476273]">{t.common.resetFilters}</p>
        </div>
      )}
    </aside>
  );
}
