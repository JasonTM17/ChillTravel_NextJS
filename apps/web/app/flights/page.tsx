'use client';

import { Plane, Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState, useMemo, useCallback } from 'react';
import { FlightCard, type Flight } from '@/components/listing/flight-card';
import { FlightFilterPanel, type FlightFilters } from '@/components/listing/flight-filter-panel';
import { PageShell } from '@/components/page-shell';

/* ─── Mock flight data (API will provide real data later) ──────────────────── */
const MOCK_FLIGHTS: Flight[] = [
  {
    id: 'vn-101',
    flightNumber: 'VN 101',
    airline: 'Vietnam Airlines',
    origin: 'HAN',
    destination: 'DAD',
    departureTime: '2026-08-12T06:30:00',
    arrivalTime: '2026-08-12T07:50:00',
    durationMin: 80,
    stops: 0,
    basePrice: 1_450_000,
    taxAmount: 350_000,
  },
  {
    id: 'vj-202',
    flightNumber: 'VJ 202',
    airline: 'VietJet Air',
    origin: 'HAN',
    destination: 'DAD',
    departureTime: '2026-08-12T09:15:00',
    arrivalTime: '2026-08-12T10:40:00',
    durationMin: 85,
    stops: 0,
    basePrice: 980_000,
    taxAmount: 280_000,
  },
  {
    id: 'qh-303',
    flightNumber: 'QH 303',
    airline: 'Bamboo Airways',
    origin: 'HAN',
    destination: 'DAD',
    departureTime: '2026-08-12T14:00:00',
    arrivalTime: '2026-08-12T15:25:00',
    durationMin: 85,
    stops: 0,
    basePrice: 1_200_000,
    taxAmount: 300_000,
  },
  {
    id: 'vn-405',
    flightNumber: 'VN 405',
    airline: 'Vietnam Airlines',
    origin: 'HAN',
    destination: 'SGN',
    departureTime: '2026-08-12T18:30:00',
    arrivalTime: '2026-08-12T20:40:00',
    durationMin: 130,
    stops: 0,
    basePrice: 2_100_000,
    taxAmount: 450_000,
  },
  {
    id: 'vj-506',
    flightNumber: 'VJ 506',
    airline: 'VietJet Air',
    origin: 'HAN',
    destination: 'SGN',
    departureTime: '2026-08-12T07:00:00',
    arrivalTime: '2026-08-12T10:30:00',
    durationMin: 210,
    stops: 1,
    layoverCity: 'DAD',
    layoverMin: 60,
    basePrice: 850_000,
    taxAmount: 250_000,
  },
  {
    id: 'qh-607',
    flightNumber: 'QH 607',
    airline: 'Bamboo Airways',
    origin: 'SGN',
    destination: 'PQC',
    departureTime: '2026-08-12T11:45:00',
    arrivalTime: '2026-08-12T12:45:00',
    durationMin: 60,
    stops: 0,
    basePrice: 750_000,
    taxAmount: 200_000,
  },
];

/* ─── Filter Logic ─────────────────────────────────────────────────────────── */

function getTimeBlock(isoTime: string): string {
  const hour = new Date(isoTime).getHours();
  if (hour < 6) return '00-06';
  if (hour < 12) return '06-12';
  if (hour < 18) return '12-18';
  return '18-24';
}

function applyFlightFilters(flights: Flight[], filters: FlightFilters): Flight[] {
  return flights.filter((flight) => {
    if (filters.timeBlocks.length > 0) {
      const block = getTimeBlock(flight.departureTime);
      if (!filters.timeBlocks.includes(block)) return false;
    }
    if (filters.stops.length > 0) {
      const stopBucket = Math.min(flight.stops, 2);
      if (!filters.stops.includes(stopBucket)) return false;
    }
    if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) return false;
    const totalPrice = flight.basePrice + flight.taxAmount;
    if (totalPrice < filters.priceRange[0] || totalPrice > filters.priceRange[1]) return false;
    return true;
  });
}

/* ─── Page Component ───────────────────────────────────────────────────────── */

export default function FlightsPage() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FlightFilters>({
    timeBlocks: [],
    stops: [],
    airlines: [],
    priceRange: [0, 10_000_000],
  });

  // Read search params from URL (passed from search panel)
  const origin = searchParams.get('origin') ?? '';
  const destination = searchParams.get('destination') ?? '';
  const departureDate = searchParams.get('departureDate') ?? '';
  const passengers = searchParams.get('passengers') ?? '1';
  const tripType = searchParams.get('tripType') ?? 'round-trip';
  const cabinClass = searchParams.get('cabinClass') ?? 'economy';

  const filteredFlights = useMemo(() => {
    let flights = MOCK_FLIGHTS;

    // Filter by origin/destination from URL params if provided
    if (origin) {
      const originUpper = origin.toUpperCase();
      flights = flights.filter(
        (f) => f.origin.toUpperCase().includes(originUpper) || f.airline.toLowerCase().includes(origin.toLowerCase()),
      );
    }
    if (destination) {
      const destUpper = destination.toUpperCase();
      const filtered = flights.filter((f) => f.destination.toUpperCase().includes(destUpper));
      if (filtered.length > 0) flights = filtered;
    }

    return applyFlightFilters(flights, filters);
  }, [filters, origin, destination]);

  const handleSelectFlight = useCallback((flight: Flight) => {
    // Navigate to booking flow with flight data and search params
    const bookingParams = new URLSearchParams();
    bookingParams.set('type', 'flight');
    bookingParams.set('id', flight.id);
    if (passengers) bookingParams.set('passengers', passengers);
    window.location.href = `/booking/new?${bookingParams.toString()}`;
  }, [passengers]);

  const searchSummary = origin || destination
    ? `${origin || '?'} → ${destination || '?'}${departureDate ? ` · ${departureDate}` : ''} · ${tripType === 'round-trip' ? 'Khứ hồi' : 'Một chiều'} · ${passengers} hành khách · ${cabinClass}`
    : '';

  return (
    <PageShell
      eyebrow="Vé máy bay mẫu"
      title="Tìm chuyến bay demo rõ giá, dễ so sánh và không dùng dữ liệu real-time"
    >
      {/* Search bar */}
      <div className="mb-6 rounded-tv border border-tv-border bg-white p-4 shadow-tv-card">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_1fr_auto]">
          <FlightField label="Từ" value="Hà Nội (HAN)" />
          <FlightField label="Đến" value="Đà Nẵng (DAD)" />
          <FlightField label="Ngày đi" value="12/08/2026" />
          <FlightField label="Hành khách" value="2 người lớn" />
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-tv bg-tv-orange px-5 py-3 text-sm font-bold text-white hover:bg-tv-orange-dark transition-colors"
          >
            <Search size={18} aria-hidden="true" />
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Demo notice */}
      {searchSummary && (
        <div className="mb-4 rounded-tv border border-tv-border bg-sky-surface/50 px-4 py-3 text-sm text-muted-ink">
          <span className="font-semibold text-ink">Tìm kiếm:</span> {searchSummary}
        </div>
      )}
      <div className="mb-6 flex items-center gap-2 rounded-tv bg-amber-50 border border-amber-200 px-4 py-2.5 text-tv-sm text-amber-800">
        <span className="font-bold">⚠️ Dữ liệu mẫu</span>
        <span>— Giá vé và lịch bay là mock data. Kiểm tra hãng bay cho dữ liệu thật.</span>
      </div>

      {/* Main layout: filter sidebar + flight cards */}
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Filter panel */}
        <FlightFilterPanel
          flights={MOCK_FLIGHTS}
          filters={filters}
          onFiltersChange={setFilters}
          filteredCount={filteredFlights.length}
        />

        {/* Flight results */}
        <div className="space-y-4">
          <p className="text-sm text-tv-ink-3">{filteredFlights.length} chuyến bay</p>

          {filteredFlights.length === 0 ? (
            <div className="rounded-tv border border-tv-border bg-white p-8 text-center">
              <p className="text-tv-ink-3">Không tìm thấy chuyến bay phù hợp.</p>
              <button
                onClick={() =>
                  setFilters({
                    timeBlocks: [],
                    stops: [],
                    airlines: [],
                    priceRange: [0, 10_000_000],
                  })
                }
                className="mt-3 text-sm font-semibold text-tv-blue hover:underline"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            filteredFlights.map((flight) => (
              <FlightCard key={flight.id} flight={flight} onSelect={handleSelectFlight} />
            ))
          )}
        </div>
      </div>
    </PageShell>
  );
}

/* ─── Flight Search Field ──────────────────────────────────────────────────── */

function FlightField({ label, value }: { label: string; value: string }) {
  return (
    <label className="flex min-w-0 items-center gap-3 rounded-tv border border-tv-border bg-tv-bg px-4 py-3">
      <Plane size={18} className="shrink-0 text-tv-blue" aria-hidden="true" />
      <span className="min-w-0">
        <span className="block text-xs font-bold text-tv-ink-3">{label}</span>
        <input
          defaultValue={value}
          className="mt-1 w-full bg-transparent font-bold outline-none text-sm"
        />
      </span>
    </label>
  );
}
