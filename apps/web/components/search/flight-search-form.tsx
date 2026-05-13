'use client';

import { CalendarDays, Users, Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useMemo } from 'react';
import { useLocale } from '@/lib/i18n';
import { Autocomplete, type AutocompleteSuggestion } from './autocomplete';

// ─── Types ───────────────────────────────────────────────────────────────────

type TripType = 'one-way' | 'round-trip';
type CabinClass = 'economy' | 'business' | 'first';

interface FlightSearchFormProps {
  onSearch?: (params: FlightSearchParams) => void;
  fetchLocations?: (query: string) => Promise<AutocompleteSuggestion[]>;
  /** If true, navigates to /flights with URL params on submit (default: true) */
  navigateOnSearch?: boolean;
}

export interface FlightSearchParams {
  origin: string;
  originId: string;
  destination: string;
  destinationId: string;
  departureDate: string;
  returnDate: string | null;
  tripType: TripType;
  passengers: number;
  cabinClass: CabinClass;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const MIN_PASSENGERS = 1;
const MAX_PASSENGERS = 9;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getTodayString(): string {
  return new Date().toISOString().split('T')[0] ?? '';
}

function getDefaultReturnDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().split('T')[0] ?? '';
}

// ─── Default fetch (no-op) ───────────────────────────────────────────────────

const defaultFetchLocations = async (): Promise<AutocompleteSuggestion[]> => [];

// ─── Component ───────────────────────────────────────────────────────────────

export function FlightSearchForm({
  onSearch,
  fetchLocations = defaultFetchLocations,
  navigateOnSearch = true,
}: FlightSearchFormProps) {
  const { t } = useLocale();
  const router = useRouter();

  const [tripType, setTripType] = useState<TripType>('round-trip');
  const [origin, setOrigin] = useState('');
  const [originId, setOriginId] = useState('');
  const [destination, setDestination] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [departureDate, setDepartureDate] = useState(getTodayString());
  const [returnDate, setReturnDate] = useState(getDefaultReturnDate());
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState<CabinClass>('economy');
  const [showPassengerPicker, setShowPassengerPicker] = useState(false);

  const minReturnDate = useMemo(() => {
    if (!departureDate) return getTodayString();
    return departureDate;
  }, [departureDate]);

  const handleDepartureDateChange = useCallback(
    (value: string) => {
      setDepartureDate(value);
      if (tripType === 'round-trip' && value > returnDate) {
        setReturnDate(value);
      }
    },
    [tripType, returnDate],
  );

  const handleOriginSelect = useCallback((suggestion: AutocompleteSuggestion) => {
    setOrigin(suggestion.label);
    setOriginId(suggestion.id);
  }, []);

  const handleDestinationSelect = useCallback((suggestion: AutocompleteSuggestion) => {
    setDestination(suggestion.label);
    setDestinationId(suggestion.id);
  }, []);

  const handleSubmit = useCallback(() => {
    const params: FlightSearchParams = {
      origin,
      originId,
      destination,
      destinationId,
      departureDate,
      returnDate: tripType === 'round-trip' ? returnDate : null,
      tripType,
      passengers,
      cabinClass,
    };
    onSearch?.(params);

    if (navigateOnSearch) {
      const searchParams = new URLSearchParams();
      if (origin) searchParams.set('origin', origin);
      if (originId) searchParams.set('originId', originId);
      if (destination) searchParams.set('destination', destination);
      if (destinationId) searchParams.set('destinationId', destinationId);
      if (departureDate) searchParams.set('departureDate', departureDate);
      if (tripType === 'round-trip' && returnDate) searchParams.set('returnDate', returnDate);
      searchParams.set('tripType', tripType);
      searchParams.set('passengers', String(passengers));
      searchParams.set('cabinClass', cabinClass);
      router.push(`/flights?${searchParams.toString()}`);
    }
  }, [
    origin,
    originId,
    destination,
    destinationId,
    departureDate,
    returnDate,
    tripType,
    passengers,
    cabinClass,
    onSearch,
    navigateOnSearch,
    router,
  ]);

  const _cabinClassLabel = (cls: CabinClass): string => {
    switch (cls) {
      case 'economy':
        return t.search.economy;
      case 'business':
        return t.search.business;
      case 'first':
        return t.search.firstClass;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ── Trip Type Toggle ──────────────────────────────────────────── */}
      <div className="flex gap-2" role="radiogroup" aria-label={t.search.oneWay}>
        <button
          type="button"
          role="radio"
          aria-checked={tripType === 'one-way'}
          onClick={() => setTripType('one-way')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            tripType === 'one-way'
              ? 'bg-booking-blue text-white'
              : 'border border-border bg-white text-ink hover:bg-sky-surface'
          }`}
        >
          {t.search.oneWay}
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={tripType === 'round-trip'}
          onClick={() => setTripType('round-trip')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            tripType === 'round-trip'
              ? 'bg-booking-blue text-white'
              : 'border border-border bg-white text-ink hover:bg-sky-surface'
          }`}
        >
          {t.search.roundTrip}
        </button>
      </div>

      {/* ── Form Grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {/* Origin */}
        <Autocomplete
          id="flight-origin"
          value={origin}
          onChange={setOrigin}
          onSelect={handleOriginSelect}
          fetchSuggestions={fetchLocations}
          label={t.search.origin}
          placeholder={t.search.origin}
        />

        {/* Destination */}
        <Autocomplete
          id="flight-destination"
          value={destination}
          onChange={setDestination}
          onSelect={handleDestinationSelect}
          fetchSuggestions={fetchLocations}
          label={t.search.destination}
          placeholder={t.search.destination}
        />

        {/* Departure Date */}
        <div>
          <label
            htmlFor="flight-departure"
            className="mb-1 block text-xs font-medium text-muted-ink"
          >
            {t.search.departureDate}
          </label>
          <div className="relative">
            <CalendarDays
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-ink"
              aria-hidden="true"
            />
            <input
              id="flight-departure"
              type="date"
              value={departureDate}
              min={getTodayString()}
              onChange={(e) => handleDepartureDateChange(e.target.value)}
              className="w-full rounded-lg border border-border bg-white py-2.5 pl-9 pr-3 text-sm text-ink focus:border-booking-blue focus:outline-none focus:ring-2 focus:ring-booking-blue/20"
            />
          </div>
        </div>

        {/* Return Date (only for round-trip) */}
        {tripType === 'round-trip' && (
          <div>
            <label
              htmlFor="flight-return"
              className="mb-1 block text-xs font-medium text-muted-ink"
            >
              {t.search.returnDate}
            </label>
            <div className="relative">
              <CalendarDays
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-ink"
                aria-hidden="true"
              />
              <input
                id="flight-return"
                type="date"
                value={returnDate}
                min={minReturnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full rounded-lg border border-border bg-white py-2.5 pl-9 pr-3 text-sm text-ink focus:border-booking-blue focus:outline-none focus:ring-2 focus:ring-booking-blue/20"
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Passengers & Cabin Class Row ──────────────────────────────── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Passengers */}
        <div className="relative">
          <label
            htmlFor="flight-passengers-btn"
            className="mb-1 block text-xs font-medium text-muted-ink"
          >
            {t.search.passengers}
          </label>
          <button
            id="flight-passengers-btn"
            type="button"
            onClick={() => setShowPassengerPicker((prev) => !prev)}
            className="flex w-full items-center gap-2 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-ink focus:border-booking-blue focus:outline-none focus:ring-2 focus:ring-booking-blue/20"
            aria-expanded={showPassengerPicker}
            aria-haspopup="dialog"
          >
            <Users size={16} className="text-muted-ink" aria-hidden="true" />
            <span>
              {passengers} {t.search.passengers}
            </span>
          </button>

          {showPassengerPicker && (
            <div
              className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-border bg-white p-4 shadow-lg"
              role="dialog"
              aria-label={t.search.passengers}
            >
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-ink">{t.search.passengers}</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPassengers((p) => Math.max(MIN_PASSENGERS, p - 1))}
                    disabled={passengers <= MIN_PASSENGERS}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-ink transition-colors hover:bg-sky-surface disabled:opacity-40"
                    aria-label={`${t.search.passengers} -1`}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold">{passengers}</span>
                  <button
                    type="button"
                    onClick={() => setPassengers((p) => Math.min(MAX_PASSENGERS, p + 1))}
                    disabled={passengers >= MAX_PASSENGERS}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-ink transition-colors hover:bg-sky-surface disabled:opacity-40"
                    aria-label={`${t.search.passengers} +1`}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPassengerPicker(false)}
                className="mt-3 w-full rounded-lg bg-booking-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-deep-blue"
              >
                {t.common.confirm}
              </button>
            </div>
          )}
        </div>

        {/* Cabin Class */}
        <div>
          <label htmlFor="flight-cabin" className="mb-1 block text-xs font-medium text-muted-ink">
            {t.search.cabinClass}
          </label>
          <select
            id="flight-cabin"
            value={cabinClass}
            onChange={(e) => setCabinClass(e.target.value as CabinClass)}
            className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-ink focus:border-booking-blue focus:outline-none focus:ring-2 focus:ring-booking-blue/20"
          >
            <option value="economy">{t.search.economy}</option>
            <option value="business">{t.search.business}</option>
            <option value="first">{t.search.firstClass}</option>
          </select>
        </div>
      </div>

      {/* ── Search Button ─────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={handleSubmit}
        className="w-full rounded-lg bg-orange-cta px-6 py-3 text-sm font-bold text-white transition-colors hover:brightness-110 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-cta focus-visible:ring-offset-2 md:ml-auto md:w-auto md:min-w-[140px] md:self-end"
      >
        {t.search.searchFlights}
      </button>
    </div>
  );
}
