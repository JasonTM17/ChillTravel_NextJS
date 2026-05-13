'use client';

import { Plane } from 'lucide-react';
import { useLocale } from '@/lib/i18n';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string; // ISO datetime
  arrivalTime: string; // ISO datetime
  durationMin: number;
  stops: number;
  layoverCity?: string;
  layoverMin?: number;
  basePrice: number;
  taxAmount: number;
}

interface FlightCardProps {
  flight: Flight;
  onSelect?: (flight: Flight) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function FlightCard({ flight, onSelect }: FlightCardProps) {
  const { t, fmt } = useLocale();

  const stopsLabel =
    flight.stops === 0
      ? t.flight.direct
      : flight.stops === 1
        ? t.flight.oneStop
        : t.flight.twoOrMoreStops;

  const stopsBadgeColor =
    flight.stops === 0
      ? 'bg-emerald-100 text-emerald-700'
      : flight.stops === 1
        ? 'bg-amber-100 text-amber-700'
        : 'bg-red-100 text-red-700';

  const totalPrice = flight.basePrice + flight.taxAmount;

  return (
    <article className="rounded-2xl border border-[#D9ECFB] bg-white p-5 shadow-[0_2px_12px_rgba(2,119,212,0.08)] transition hover:shadow-[0_4px_20px_rgba(2,119,212,0.14)]">
      {/* Top row: airline + flight number + price */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Airline logo placeholder */}
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#EAF7FF] text-xs font-bold text-[#0277D4]">
            {flight.airline.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#071827]">{flight.airline}</p>
            <p className="text-xs text-[#476273]">{flight.flightNumber}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold text-[#0277D4]">{fmt.formatCurrency(totalPrice)}</p>
          <p className="text-xs text-[#476273]">{t.flight.pricePerPassenger}</p>
        </div>
      </div>

      {/* Flight timeline */}
      <div className="mt-5 flex items-center gap-3">
        {/* Departure */}
        <div className="text-center">
          <p className="text-xl font-bold text-[#071827]">{formatTime(flight.departureTime)}</p>
          <p className="text-xs font-medium text-[#476273]">{flight.origin}</p>
        </div>

        {/* Timeline visualization */}
        <div className="flex flex-1 flex-col items-center gap-1">
          <p className="text-xs font-medium text-[#476273]">{formatDuration(flight.durationMin)}</p>
          <div className="relative flex w-full items-center">
            <div className="h-[2px] flex-1 bg-[#D9ECFB]" />
            {flight.stops > 0 && flight.layoverCity && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="h-2.5 w-2.5 rounded-full border-2 border-[#0277D4] bg-white" />
              </div>
            )}
            <Plane size={14} className="mx-1 text-[#0277D4]" aria-hidden="true" />
            <div className="h-[2px] flex-1 bg-[#D9ECFB]" />
          </div>
          <div className="flex items-center gap-1">
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${stopsBadgeColor}`}
            >
              {stopsLabel}
            </span>
            {flight.stops > 0 && flight.layoverCity && flight.layoverMin && (
              <span className="text-[10px] text-[#476273]">
                {t.flight.layover}: {flight.layoverCity} ({formatDuration(flight.layoverMin)})
              </span>
            )}
          </div>
        </div>

        {/* Arrival */}
        <div className="text-center">
          <p className="text-xl font-bold text-[#071827]">{formatTime(flight.arrivalTime)}</p>
          <p className="text-xs font-medium text-[#476273]">{flight.destination}</p>
        </div>
      </div>

      {/* Select button */}
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={() => onSelect?.(flight)}
          className="rounded-lg bg-[#FF6D1A] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#e55e12] focus:outline-none focus:ring-2 focus:ring-[#FF6D1A]/30 focus:ring-offset-2"
        >
          {t.flight.selectFlight}
        </button>
      </div>
    </article>
  );
}
