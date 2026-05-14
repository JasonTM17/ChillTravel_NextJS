'use client';

import { Plane } from 'lucide-react';
import { useLocale } from '@/lib/i18n';

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
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
      ? 'bg-emerald-50 text-emerald-700'
      : flight.stops === 1
        ? 'bg-amber-50 text-amber-700'
        : 'bg-red-50 text-red-700';

  const totalPrice = flight.basePrice + flight.taxAmount;

  return (
    <article className="overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5">
      {/* Top row: airline + flight number + price */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-[11px] font-bold text-[#0064D2]">
            {flight.airline.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-[13px] font-bold text-gray-800">{flight.airline}</p>
            <p className="text-[11px] text-gray-500">{flight.flightNumber}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[17px] font-extrabold text-[#0064D2]">
            {fmt.formatCurrency(totalPrice)}
          </p>
          <p className="text-[11px] text-gray-400">{t.flight.pricePerPassenger}</p>
        </div>
      </div>

      {/* Flight timeline */}
      <div className="mt-5 flex items-center gap-3">
        {/* Departure */}
        <div className="text-center">
          <p className="text-xl font-extrabold text-gray-900">{formatTime(flight.departureTime)}</p>
          <p className="text-[11px] font-semibold text-gray-500">{flight.origin}</p>
        </div>

        {/* Timeline */}
        <div className="flex flex-1 flex-col items-center gap-1">
          <p className="text-[11px] font-medium text-gray-400">
            {formatDuration(flight.durationMin)}
          </p>
          <div className="relative flex w-full items-center">
            <div className="h-[2px] flex-1 bg-gray-200" />
            {flight.stops > 0 && flight.layoverCity && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="h-2.5 w-2.5 rounded-full border-2 border-[#0064D2] bg-white" />
              </div>
            )}
            <Plane size={14} className="mx-1 text-[#0064D2]" aria-hidden="true" />
            <div className="h-[2px] flex-1 bg-gray-200" />
          </div>
          <div className="flex items-center gap-1">
            <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${stopsBadgeColor}`}>
              {stopsLabel}
            </span>
            {flight.stops > 0 && flight.layoverCity && flight.layoverMin && (
              <span className="text-[10px] text-gray-400">
                {t.flight.layover}: {flight.layoverCity} ({formatDuration(flight.layoverMin)})
              </span>
            )}
          </div>
        </div>

        {/* Arrival */}
        <div className="text-center">
          <p className="text-xl font-extrabold text-gray-900">{formatTime(flight.arrivalTime)}</p>
          <p className="text-[11px] font-semibold text-gray-500">{flight.destination}</p>
        </div>
      </div>

      {/* Select button */}
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={() => onSelect?.(flight)}
          className="rounded-lg bg-[#FF6D00] px-6 py-2.5 text-[13px] font-bold text-white shadow-sm transition-all hover:bg-[#E55A00] hover:shadow-md active:scale-[0.97]"
        >
          {t.flight.selectFlight}
        </button>
      </div>
    </article>
  );
}
