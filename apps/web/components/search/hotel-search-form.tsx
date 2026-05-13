'use client';

import { CalendarDays, Users, Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useMemo } from 'react';
import { useLocale } from '@/lib/i18n';
import { Autocomplete, type AutocompleteSuggestion } from './autocomplete';

// ─── Types ───────────────────────────────────────────────────────────────────

interface HotelSearchFormProps {
  onSearch?: (params: HotelSearchParams) => void;
  fetchDestinations?: (query: string) => Promise<AutocompleteSuggestion[]>;
  /** If true, navigates to /hotels with URL params on submit (default: true) */
  navigateOnSearch?: boolean;
}

export interface HotelSearchParams {
  destination: string;
  destinationId: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  guests: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const MIN_ROOMS = 1;
const MAX_ROOMS = 8;
const MIN_GUESTS = 1;
const MAX_GUESTS = 16;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getTodayString(): string {
  return new Date().toISOString().split('T')[0] ?? '';
}

function getTomorrowString(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0] ?? '';
}

function getMinCheckOut(checkIn: string): string {
  if (!checkIn) return getTomorrowString();
  const d = new Date(checkIn);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0] ?? '';
}

// ─── Default fetch (no-op) ───────────────────────────────────────────────────

const defaultFetchDestinations = async (): Promise<AutocompleteSuggestion[]> => [];

// ─── Component ───────────────────────────────────────────────────────────────

export function HotelSearchForm({
  onSearch,
  fetchDestinations = defaultFetchDestinations,
  navigateOnSearch = true,
}: HotelSearchFormProps) {
  const { t } = useLocale();
  const router = useRouter();

  const [destination, setDestination] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [checkIn, setCheckIn] = useState(getTodayString());
  const [checkOut, setCheckOut] = useState(getTomorrowString());
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  // Enforce minimum 1-night stay
  const minCheckOut = useMemo(() => getMinCheckOut(checkIn), [checkIn]);

  const handleCheckInChange = useCallback(
    (value: string) => {
      setCheckIn(value);
      // If check-out is before or same as new check-in, auto-adjust
      if (value >= checkOut) {
        const nextDay = new Date(value);
        nextDay.setDate(nextDay.getDate() + 1);
        setCheckOut(nextDay.toISOString().split('T')[0] ?? '');
      }
    },
    [checkOut],
  );

  const handleDestinationSelect = useCallback((suggestion: AutocompleteSuggestion) => {
    setDestination(suggestion.label);
    setDestinationId(suggestion.id);
  }, []);

  const handleSubmit = useCallback(() => {
    const params: HotelSearchParams = {
      destination,
      destinationId,
      checkIn,
      checkOut,
      rooms,
      guests,
    };
    onSearch?.(params);

    if (navigateOnSearch) {
      const searchParams = new URLSearchParams();
      if (destination) searchParams.set('destination', destination);
      if (destinationId) searchParams.set('destinationId', destinationId);
      if (checkIn) searchParams.set('checkIn', checkIn);
      if (checkOut) searchParams.set('checkOut', checkOut);
      searchParams.set('rooms', String(rooms));
      searchParams.set('guests', String(guests));
      router.push(`/hotels?${searchParams.toString()}`);
    }
  }, [destination, destinationId, checkIn, checkOut, rooms, guests, onSearch, navigateOnSearch, router]);

  const maxGuests = MAX_GUESTS;

  return (
    <div className="flex flex-col gap-4">
      {/* Responsive grid: 1 col mobile, 4 col desktop */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {/* ── Destination ──────────────────────────────────────────────── */}
        <Autocomplete
          id="hotel-destination"
          value={destination}
          onChange={setDestination}
          onSelect={handleDestinationSelect}
          fetchSuggestions={fetchDestinations}
          label={t.search.destination}
          placeholder={t.search.destination}
        />

        {/* ── Check-in Date ────────────────────────────────────────────── */}
        <div>
          <label htmlFor="hotel-checkin" className="mb-1 block text-xs font-medium text-muted-ink">
            {t.search.checkIn}
          </label>
          <div className="relative">
            <CalendarDays
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-ink"
              aria-hidden="true"
            />
            <input
              id="hotel-checkin"
              type="date"
              value={checkIn}
              min={getTodayString()}
              onChange={(e) => handleCheckInChange(e.target.value)}
              className="w-full rounded-lg border border-border bg-white py-2.5 pl-9 pr-3 text-sm text-ink focus:border-booking-blue focus:outline-none focus:ring-2 focus:ring-booking-blue/20"
            />
          </div>
        </div>

        {/* ── Check-out Date ───────────────────────────────────────────── */}
        <div>
          <label htmlFor="hotel-checkout" className="mb-1 block text-xs font-medium text-muted-ink">
            {t.search.checkOut}
          </label>
          <div className="relative">
            <CalendarDays
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-ink"
              aria-hidden="true"
            />
            <input
              id="hotel-checkout"
              type="date"
              value={checkOut}
              min={minCheckOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full rounded-lg border border-border bg-white py-2.5 pl-9 pr-3 text-sm text-ink focus:border-booking-blue focus:outline-none focus:ring-2 focus:ring-booking-blue/20"
            />
          </div>
        </div>

        {/* ── Rooms & Guests ───────────────────────────────────────────── */}
        <div className="relative">
          <label
            htmlFor="hotel-guests-btn"
            className="mb-1 block text-xs font-medium text-muted-ink"
          >
            {t.search.guestsCount}
          </label>
          <button
            id="hotel-guests-btn"
            type="button"
            onClick={() => setShowGuestPicker((prev) => !prev)}
            className="flex w-full items-center gap-2 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-ink focus:border-booking-blue focus:outline-none focus:ring-2 focus:ring-booking-blue/20"
            aria-expanded={showGuestPicker}
            aria-haspopup="dialog"
          >
            <Users size={16} className="text-muted-ink" aria-hidden="true" />
            <span>
              {rooms} {t.search.rooms} · {guests} {t.booking.guests}
            </span>
          </button>

          {/* Guest Picker Dropdown */}
          {showGuestPicker && (
            <div
              className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-border bg-white p-4 shadow-lg"
              role="dialog"
              aria-label={t.search.guestsCount}
            >
              {/* Rooms */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-ink">{t.search.rooms}</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setRooms((r) => Math.max(MIN_ROOMS, r - 1))}
                    disabled={rooms <= MIN_ROOMS}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-ink transition-colors hover:bg-sky-surface disabled:opacity-40"
                    aria-label={`${t.search.rooms} -1`}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold">{rooms}</span>
                  <button
                    type="button"
                    onClick={() => setRooms((r) => Math.min(MAX_ROOMS, r + 1))}
                    disabled={rooms >= MAX_ROOMS}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-ink transition-colors hover:bg-sky-surface disabled:opacity-40"
                    aria-label={`${t.search.rooms} +1`}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Guests */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-ink">{t.booking.guests}</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setGuests((g) => Math.max(MIN_GUESTS, g - 1))}
                    disabled={guests <= MIN_GUESTS}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-ink transition-colors hover:bg-sky-surface disabled:opacity-40"
                    aria-label={`${t.booking.guests} -1`}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold">{guests}</span>
                  <button
                    type="button"
                    onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))}
                    disabled={guests >= maxGuests}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-ink transition-colors hover:bg-sky-surface disabled:opacity-40"
                    aria-label={`${t.booking.guests} +1`}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowGuestPicker(false)}
                className="mt-3 w-full rounded-lg bg-booking-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-deep-blue"
              >
                {t.common.confirm}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Search Button ─────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={handleSubmit}
        className="w-full rounded-lg bg-orange-cta px-6 py-3 text-sm font-bold text-white transition-colors hover:brightness-110 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-cta focus-visible:ring-offset-2 md:ml-auto md:w-auto md:min-w-[140px] md:self-end"
      >
        {t.search.searchHotels}
      </button>
    </div>
  );
}
