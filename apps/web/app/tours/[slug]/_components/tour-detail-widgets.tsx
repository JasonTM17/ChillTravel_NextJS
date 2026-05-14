import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Clock,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { CommerceSurface } from '@/components/commerce-primitives';
import type { Review } from '@/lib/api/review.api';
import type { Tour, TourItinerary, TourDeparture } from '@/lib/api/tour.api';
import { formatVnd } from '@/lib/utils';
import { formatDateVi } from '@/lib/vietnamese';

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

export function TourDetailSkeleton() {
  return (
    <main className="min-h-screen bg-tv-bg text-tv-ink animate-pulse">
      <section className="border-b border-tv-border bg-white">
        <div className="mx-auto max-w-[1180px] px-4 py-6 md:px-6">
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-20 rounded-full bg-tv-border" />
            ))}
          </div>
          <div className="h-12 w-3/4 rounded bg-tv-border mb-4" />
          <div className="grid gap-3 lg:grid-cols-[1.45fr_0.75fr]">
            <div className="min-h-[320px] rounded-[28px] bg-tv-border" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="min-h-[154px] rounded-[24px] bg-tv-border" />
              <div className="min-h-[154px] rounded-[24px] bg-tv-border" />
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-[1180px] gap-6 px-4 py-8 md:px-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-tv border border-tv-border bg-white p-6 space-y-3">
              <div className="h-6 w-40 rounded bg-tv-border" />
              <div className="h-4 w-full rounded bg-tv-border" />
              <div className="h-4 w-3/4 rounded bg-tv-border" />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="rounded-tv border border-tv-border bg-white p-5 space-y-3">
            <div className="h-4 w-24 rounded bg-tv-border" />
            <div className="h-6 w-40 rounded bg-tv-border" />
            <div className="h-10 rounded-tv bg-tv-border" />
            <div className="h-10 rounded-tv bg-tv-border" />
          </div>
        </div>
      </section>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Info card
// ---------------------------------------------------------------------------

export function InfoCard({
  icon: Icon,
  title,
  value,
  valueClass = '',
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-tv border border-tv-border bg-white p-5 shadow-tv-card">
      <Icon className="text-tv-blue" size={20} aria-hidden="true" />
      <h2 className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-tv-ink-3">{title}</h2>
      <p className={`mt-2 text-lg font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Itinerary accordion
// ---------------------------------------------------------------------------

export function ItineraryAccordion({ item }: { item: TourItinerary }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-tv border border-tv-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between bg-tv-bg px-5 py-4 text-left transition hover:bg-tv-blue-light"
        type="button"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-tv-blue text-xs font-bold text-white">
            {item.dayNumber}
          </span>
          <span className="font-bold text-tv-ink">{item.title}</span>
        </div>
        {open ? (
          <ChevronUp size={18} className="shrink-0 text-tv-blue" aria-hidden="true" />
        ) : (
          <ChevronDown size={18} className="shrink-0 text-tv-ink-3" aria-hidden="true" />
        )}
      </button>

      {open && (
        <div className="border-t border-tv-border bg-white px-5 py-4 space-y-3 text-sm">
          {item.description && <p className="leading-6 text-tv-ink-3">{item.description}</p>}
          <div className="grid gap-2 sm:grid-cols-3">
            {item.meals && <DetailChip label="Bua an" value={item.meals} />}
            {item.accommodation && <DetailChip label="Luu tru" value={item.accommodation} />}
            {item.activities && <DetailChip label="Hoat dong" value={item.activities} />}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-tv-sm bg-[#f3f9ff] px-3 py-2">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-tv-ink-3">{label}</p>
      <p className="mt-1 font-bold text-tv-ink">{value}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Departure row
// ---------------------------------------------------------------------------

export function DepartureRow({
  departure,
  basePrice,
  selected,
  onSelect,
}: {
  departure: TourDeparture;
  basePrice: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const price = departure.priceOverride ?? basePrice;
  const date = new Date(departure.departureDate);

  return (
    <button
      onClick={onSelect}
      className={`flex w-full items-center justify-between rounded-tv border px-4 py-3 text-left transition ${
        selected
          ? 'border-tv-blue bg-tv-blue-light'
          : 'border-tv-border bg-white hover:border-tv-blue hover:bg-tv-bg'
      }`}
      type="button"
      aria-pressed={selected}
    >
      <div className="flex items-center gap-3">
        <CalendarDays
          size={18}
          className={selected ? 'text-tv-blue' : 'text-tv-ink-3'}
          aria-hidden="true"
        />
        <div>
          <p className="font-bold text-tv-ink">{formatDateVi(date)}</p>
          <p className="text-xs font-bold text-tv-ink-3">Con {departure.availableSlots} cho</p>
        </div>
      </div>
      <div className="text-right">
        {departure.priceOverride != null && departure.priceOverride !== basePrice && (
          <p className="text-xs font-bold text-tv-ink-3 line-through">{formatVnd(basePrice)}</p>
        )}
        <p className="font-bold text-tv-orange">{formatVnd(price)}</p>
        <p className="text-xs font-bold text-tv-ink-3">/ nguoi</p>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Review card
// ---------------------------------------------------------------------------

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="rounded-tv border border-tv-border bg-tv-bg p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-tv-blue text-sm font-bold text-white">
            {(review.author?.fullName ?? 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-tv-ink">{review.author?.fullName ?? 'Khach hang'}</p>
            <p className="text-xs font-bold text-tv-ink-3">
              {formatDateVi(new Date(review.createdAt))}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={14}
              fill={i < review.rating ? '#f97316' : 'none'}
              className={i < review.rating ? 'text-[#f97316]' : 'text-tv-border'}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
      {review.title && <p className="mt-3 font-bold text-tv-ink">{review.title}</p>}
      <p className="mt-2 text-sm leading-6 text-tv-ink-3">{review.content}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Booking box
// ---------------------------------------------------------------------------

export function BookingBox({
  tour,
  futureDepartures,
  selectedDepartureId,
  onDepartureChange,
  guests,
  onGuestsChange,
  couponCode,
  onCouponChange,
  totalPrice,
  bookingUrl,
  hasSale,
  displayPrice,
}: {
  tour: Tour;
  futureDepartures: TourDeparture[];
  selectedDepartureId: string;
  onDepartureChange: (id: string) => void;
  guests: number;
  onGuestsChange: (n: number) => void;
  couponCode: string;
  onCouponChange: (code: string) => void;
  totalPrice: number;
  bookingUrl: string;
  hasSale: boolean;
  displayPrice: number;
}) {
  return (
    <CommerceSurface>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-tv-blue">Dat tour ngay</p>
      <div className="mt-2 flex items-baseline gap-2">
        {hasSale && (
          <span className="text-sm font-bold text-tv-ink-3 line-through">
            {formatVnd(tour.basePrice)}
          </span>
        )}
        <span className="text-2xl font-bold text-tv-orange">{formatVnd(displayPrice)}</span>
        <span className="text-xs font-bold text-tv-ink-3">/ nguoi</span>
      </div>

      <div className="mt-5 space-y-4">
        {/* Departure select */}
        <div>
          <label
            className="block text-xs font-bold uppercase tracking-[0.12em] text-tv-ink-3"
            htmlFor="departure-select"
          >
            Ngay khoi hanh
          </label>
          {futureDepartures.length === 0 ? (
            <p className="mt-2 text-sm font-bold text-tv-ink-3">Lien he de tu van lich khoi hanh</p>
          ) : (
            <select
              id="departure-select"
              value={selectedDepartureId}
              onChange={(e) => onDepartureChange(e.target.value)}
              className="mt-2 w-full rounded-tv-sm border border-tv-border bg-white px-3 py-2.5 text-sm font-bold text-tv-ink outline-none focus:border-tv-blue"
            >
              <option value="">-- Chon ngay khoi hanh --</option>
              {futureDepartures.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {formatDateVi(new Date(dep.departureDate))} — Con {dep.availableSlots} cho
                  {dep.priceOverride != null ? ` — ${formatVnd(dep.priceOverride)}` : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Guest count */}
        <div>
          <label
            className="block text-xs font-bold uppercase tracking-[0.12em] text-tv-ink-3"
            htmlFor="guest-count"
          >
            So khach
          </label>
          <div className="mt-2 flex items-center gap-3">
            <button
              onClick={() => onGuestsChange(Math.max(tour.minGuests, guests - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-tv-sm border border-tv-border bg-white font-bold text-tv-blue hover:bg-tv-blue-light"
              type="button"
              aria-label="Giam so khach"
            >
              -
            </button>
            <input
              id="guest-count"
              type="number"
              min={tour.minGuests}
              max={tour.maxGuests}
              value={guests}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val)) {
                  onGuestsChange(Math.min(tour.maxGuests, Math.max(tour.minGuests, val)));
                }
              }}
              className="w-16 rounded-tv-sm border border-tv-border bg-white px-3 py-2 text-center text-sm font-bold text-tv-ink outline-none focus:border-tv-blue"
            />
            <button
              onClick={() => onGuestsChange(Math.min(tour.maxGuests, guests + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-tv-sm border border-tv-border bg-white font-bold text-tv-blue hover:bg-tv-blue-light"
              type="button"
              aria-label="Tang so khach"
            >
              +
            </button>
            <span className="text-xs font-bold text-tv-ink-3">(toi da {tour.maxGuests})</span>
          </div>
        </div>

        {/* Coupon */}
        <div>
          <label
            className="block text-xs font-bold uppercase tracking-[0.12em] text-tv-ink-3"
            htmlFor="coupon-input"
          >
            Ma giam gia
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="coupon-input"
              type="text"
              value={couponCode}
              onChange={(e) => onCouponChange(e.target.value.toUpperCase())}
              className="flex-1 rounded-tv-sm border border-tv-border bg-white px-3 py-2.5 text-sm font-bold text-tv-ink outline-none focus:border-tv-blue"
              placeholder="Nhap ma..."
            />
            <button
              className="rounded-tv-sm border border-tv-border bg-white px-3 py-2.5 text-xs font-bold text-tv-blue hover:bg-tv-blue-light"
              type="button"
            >
              Ap dung
            </button>
          </div>
        </div>

        {/* Total */}
        <div className="rounded-tv bg-tv-bg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-tv-ink-3">
              {formatVnd(displayPrice)} x {guests} khach
            </span>
            <span className="font-bold text-tv-ink">{formatVnd(totalPrice)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-tv-border pt-2">
            <span className="font-bold text-tv-ink">Tong cong</span>
            <span className="text-xl font-bold text-tv-orange">{formatVnd(totalPrice)}</span>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={bookingUrl}
          className="inline-flex w-full items-center justify-center gap-2 rounded-tv bg-tv-orange px-4 py-4 font-bold text-white shadow-tv-card transition hover:bg-tv-orange-dark"
        >
          Dat tour
          <ArrowRight size={18} aria-hidden="true" />
        </Link>

        <p className="text-center text-xs font-bold text-[#b45309]">
          Thanh toan demo - khong phat sinh giao dich that
        </p>
      </div>
    </CommerceSurface>
  );
}

// ---------------------------------------------------------------------------
// Overview info cards row
// ---------------------------------------------------------------------------

export function TourOverviewCards({ tour, displayPrice }: { tour: Tour; displayPrice: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <InfoCard
        icon={Clock}
        title="Thoi gian"
        value={`${tour.durationDays} ngay ${tour.durationNights} dem`}
      />
      <InfoCard
        icon={Users}
        title="So khach"
        value={`${tour.minGuests}${tour.maxGuests !== tour.minGuests ? `–${tour.maxGuests}` : ''} nguoi`}
      />
      <InfoCard
        icon={ShieldCheck}
        title="Gia tu"
        value={formatVnd(displayPrice)}
        valueClass="text-tv-orange"
      />
    </div>
  );
}
