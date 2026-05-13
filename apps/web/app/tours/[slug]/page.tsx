'use client';

import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { use } from 'react';
import { CommerceSurface, StatusPill, TrustBanner } from '@/components/commerce-primitives';
import { reviewApi } from '@/lib/api/review.api';
import type { Review } from '@/lib/api/review.api';
import { tourApi } from '@/lib/api/tour.api';
import type { Tour, TourItinerary, TourDeparture } from '@/lib/api/tour.api';
import { wishlistApi } from '@/lib/api/wishlist.api';
import { useAuth } from '@/lib/auth/auth-context';
import { getDestinationImage } from '@/lib/destination-images';
import { formatVnd } from '@/lib/utils';
import { formatDateVi } from '@/lib/vietnamese';

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function TourDetailSkeleton() {
  return (
    <main className="min-h-screen bg-[tv-bg] text-[tv-ink] animate-pulse">
      <section className="border-b border-[tv-border] bg-white">
        <div className="mx-auto max-w-[1180px] px-4 py-6 md:px-6">
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-20 rounded-full bg-[tv-border]" />
            ))}
          </div>
          <div className="h-12 w-3/4 rounded bg-[tv-border] mb-4" />
          <div className="grid gap-3 lg:grid-cols-[1.45fr_0.75fr]">
            <div className="min-h-[320px] rounded-[28px] bg-[tv-border]" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="min-h-[154px] rounded-[24px] bg-[tv-border]" />
              <div className="min-h-[154px] rounded-[24px] bg-[tv-border]" />
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-[1180px] gap-6 px-4 py-8 md:px-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-tv border border-[tv-border] bg-white p-6 space-y-3">
              <div className="h-6 w-40 rounded bg-[tv-border]" />
              <div className="h-4 w-full rounded bg-[tv-border]" />
              <div className="h-4 w-3/4 rounded bg-[tv-border]" />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="rounded-tv border border-[tv-border] bg-white p-5 space-y-3">
            <div className="h-4 w-24 rounded bg-[tv-border]" />
            <div className="h-6 w-40 rounded bg-[tv-border]" />
            <div className="h-10 rounded-tv bg-[tv-border]" />
            <div className="h-10 rounded-tv bg-[tv-border]" />
          </div>
        </div>
      </section>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function TourDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [tour, setTour] = useState<Tour | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Wishlist state
  const [wishlistId, setWishlistId] = useState<string | null>(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Booking box state
  const [selectedDepartureId, setSelectedDepartureId] = useState<string>('');
  const [guests, setGuests] = useState(1);
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      setLoading(true);
      setError(null);
      setNotFoundError(false);
      try {
        const res = await tourApi.getBySlug(slug);
        if (cancelled) return;

        if (res.success) {
          const tourData = res.data as Tour;
          setTour(tourData);

          // Fetch reviews using tour id
          const reviewRes = await reviewApi.listByTour(tourData.id, { page: 0, size: 20 });
          if (!cancelled && reviewRes.success) {
            const reviewData = reviewRes.data as { items: Review[] };
            setReviews(reviewData.items ?? []);
          }

          // Check wishlist if authenticated
          if (isAuthenticated) {
            const wlRes = await wishlistApi.list();
            if (!cancelled && wlRes.success) {
              const entries = wlRes.data as Array<{ id: string; itemId: string; itemType: string }>;
              const entry = entries.find((e) => e.itemId === tourData.id && e.itemType === 'TOUR');
              if (entry) setWishlistId(entry.id);
            }
          }
        } else {
          const msg = (res as { message?: string }).message ?? '';
          if (msg.toLowerCase().includes('not found') || msg.includes('404')) {
            setNotFoundError(true);
          } else {
            setError(msg || 'Khong the tai thong tin tour.');
          }
        }
      } catch {
        if (!cancelled) setError('Loi ket noi. Vui long thu lai.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchAll();
    return () => {
      cancelled = true;
    };
  }, [slug, isAuthenticated]);

  async function handleWishlistToggle() {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!tour) return;
    setWishlistLoading(true);

    const prevId = wishlistId;
    if (wishlistId) {
      setWishlistId(null);
      try {
        await wishlistApi.remove(wishlistId);
      } catch {
        setWishlistId(prevId);
      }
    } else {
      setWishlistId('optimistic');
      try {
        const res = await wishlistApi.add({ itemId: tour.id, itemType: 'TOUR' });
        if (res.success) {
          const entry = res.data as { id: string };
          setWishlistId(entry.id);
        } else {
          setWishlistId(null);
        }
      } catch {
        setWishlistId(null);
      }
    }
    setWishlistLoading(false);
  }

  if (loading) return <TourDetailSkeleton />;
  if (notFoundError) notFound();
  if (error) {
    return (
      <main className="min-h-screen bg-[tv-bg] flex items-center justify-center">
        <div className="rounded-tv border border-dashed border-red-200 bg-red-50 p-10 text-center max-w-md">
          <p className="text-lg font-bold text-red-600">{error}</p>
          <Link
            href="/tours"
            className="mt-4 inline-flex rounded-tv-sm bg-[tv-blue] px-5 py-2.5 font-bold text-white hover:bg-[tv-blue-dark]"
          >
            Quay lai danh sach tour
          </Link>
        </div>
      </main>
    );
  }
  if (!tour) return null;

  const heroImage =
    tour.imageUrl ??
    tour.images?.[0]?.imageUrl ??
    getDestinationImage(tour.destination?.slug ?? tour.slug);

  const galleryImages = [
    heroImage,
    tour.images?.[1]?.imageUrl ?? heroImage,
    tour.images?.[2]?.imageUrl ?? heroImage,
  ];

  const displayPrice = tour.salePrice ?? tour.basePrice;
  const hasSale = tour.salePrice != null && tour.salePrice < tour.basePrice;

  const futureDepartures = (tour.departures ?? []).filter((d) => {
    return new Date(d.departureDate) > new Date() && d.availableSlots > 0;
  });

  const selectedDeparture = futureDepartures.find((d) => d.id === selectedDepartureId);
  const departurePrice = selectedDeparture?.priceOverride ?? displayPrice;
  const totalPrice = departurePrice * guests;

  const approvedReviews = reviews.filter((r) => r.status === 'APPROVED');
  const avgRating =
    approvedReviews.length > 0
      ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length
      : null;

  const bookingUrl = selectedDepartureId
    ? `/booking/new?tourId=${tour.id}&departureId=${selectedDepartureId}&guests=${guests}`
    : `/booking/new?tourId=${tour.id}&guests=${guests}`;

  return (
    <main className="min-h-screen bg-[tv-bg] text-[tv-ink]">
      {/* Hero */}
      <section className="border-b border-[tv-border] bg-white">
        <div className="mx-auto max-w-[1180px] px-4 py-6 md:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2">
                {tour.destination && (
                  <StatusPill>
                    <MapPin size={11} className="mr-1 inline" aria-hidden="true" />
                    {tour.destination.city ?? tour.destination.name}
                  </StatusPill>
                )}
                <StatusPill tone="gray">
                  <Clock size={11} className="mr-1 inline" aria-hidden="true" />
                  {tour.durationDays} ngay {tour.durationNights} dem
                </StatusPill>
                {tour.featured && (
                  <StatusPill tone="orange">
                    <Sparkles size={11} className="mr-1 inline" aria-hidden="true" />
                    Noi bat
                  </StatusPill>
                )}
              </div>
              <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">{tour.title}</h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[tv-ink-3]">
                {tour.shortDescription ?? tour.description}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                {avgRating != null && (
                  <span className="inline-flex items-center gap-1.5 font-bold text-[#b45309]">
                    <Star size={16} fill="currentColor" aria-hidden="true" />
                    {avgRating.toFixed(1)}
                    <span className="font-bold text-[tv-ink-3]">
                      ({approvedReviews.length} danh gia)
                    </span>
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 font-bold text-[tv-ink-3]">
                  <Users size={15} aria-hidden="true" />
                  Toi da {tour.maxGuests} khach
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => void handleWishlistToggle()}
                disabled={wishlistLoading}
                className={`inline-flex items-center gap-2 rounded-tv border px-4 py-3 text-sm font-bold transition ${
                  wishlistId
                    ? 'border-red-200 bg-red-50 text-red-500 hover:bg-red-100'
                    : 'border-[tv-border] bg-white text-[tv-ink-3] hover:border-red-200 hover:text-red-500'
                }`}
                aria-label={wishlistId ? 'Xoa khoi yeu thich' : 'Them vao yeu thich'}
                type="button"
              >
                <Heart size={18} fill={wishlistId ? 'currentColor' : 'none'} aria-hidden="true" />
                {wishlistId ? 'Da luu' : 'Luu'}
              </button>
              <Link
                href={`/ai-planner?tour=${tour.slug}`}
                className="inline-flex items-center gap-2 rounded-tv border border-[tv-border] bg-white px-4 py-3 text-sm font-bold text-[tv-blue] hover:bg-[tv-blue-light]"
              >
                <MessageCircle size={18} aria-hidden="true" />
                Hoi AI
              </Link>
            </div>
          </div>

          {/* Image gallery */}
          <div className="mt-6 grid gap-3 lg:grid-cols-[1.45fr_0.75fr]">
            <div
              className="min-h-[320px] rounded-[28px] bg-cover bg-center shadow-tv-hover"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(7,24,39,0.02), rgba(7,24,39,0.18)), url(${galleryImages[0]})`,
              }}
              aria-label={`Anh chinh ${tour.title}`}
            />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {galleryImages.slice(1).map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="min-h-[154px] rounded-[24px] bg-cover bg-center shadow-tv-card"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(7,24,39,0.02), rgba(7,24,39,0.12)), url(${image})`,
                  }}
                  aria-label={`Anh tour ${index + 2}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto grid max-w-[1180px] gap-6 px-4 py-8 md:px-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          {/* Overview cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <InfoCard
              icon={Clock}
              title="Thoi gian"
              value={`${tour.durationDays} ngay ${tour.durationNights} dem`}
            />
            <InfoCard
              icon={Users}
              title="So khach"
              value={`${tour.minGuests}${tour.maxGuests !== tour.minGuests ? `\u2013${tour.maxGuests}` : ''} nguoi`}
            />
            <InfoCard
              icon={ShieldCheck}
              title="Gia tu"
              value={formatVnd(displayPrice)}
              valueClass="text-[tv-orange]"
            />
          </div>

          {/* Description */}
          <CommerceSurface>
            <h2 className="text-2xl font-bold">Mo ta tour</h2>
            <p className="mt-3 leading-7 text-[tv-ink-3]">{tour.description}</p>
          </CommerceSurface>

          {/* Itinerary accordion */}
          {tour.itinerary && tour.itinerary.length > 0 && (
            <CommerceSurface>
              <h2 className="text-2xl font-bold">Lich trinh chi tiet</h2>
              <div className="mt-4 space-y-2">
                {tour.itinerary
                  .slice()
                  .sort((a, b) => a.dayNumber - b.dayNumber)
                  .map((item) => (
                    <ItineraryAccordion key={item.id} item={item} />
                  ))}
              </div>
            </CommerceSurface>
          )}

          {/* Departures */}
          <CommerceSurface>
            <h2 className="text-2xl font-bold">Lich khoi hanh</h2>
            {futureDepartures.length === 0 ? (
              <div className="mt-4 rounded-tv bg-[tv-bg] p-5 text-center">
                <p className="font-bold text-[tv-ink-3]">
                  Hien chua co lich khoi hanh. Vui long lien he de tu van.
                </p>
                <Link
                  href="/support"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-tv-sm bg-[tv-blue] px-4 py-2.5 text-sm font-bold text-white hover:bg-[tv-blue-dark]"
                >
                  Lien he tu van
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {futureDepartures.map((dep) => (
                  <DepartureRow
                    key={dep.id}
                    departure={dep}
                    basePrice={displayPrice}
                    selected={selectedDepartureId === dep.id}
                    onSelect={() =>
                      setSelectedDepartureId(selectedDepartureId === dep.id ? '' : dep.id)
                    }
                  />
                ))}
              </div>
            )}
          </CommerceSurface>

          {/* Reviews */}
          <CommerceSurface>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Danh gia</h2>
              {avgRating != null && (
                <div className="flex items-center gap-2">
                  <Star size={20} fill="#f97316" className="text-[#f97316]" aria-hidden="true" />
                  <span className="text-2xl font-bold">{avgRating.toFixed(1)}</span>
                  <span className="text-sm font-bold text-[tv-ink-3]">
                    / 5 ({approvedReviews.length} danh gia)
                  </span>
                </div>
              )}
            </div>
            {approvedReviews.length === 0 ? (
              <p className="mt-4 text-sm font-bold text-[tv-ink-3]">
                Chua co danh gia nao. Hay la nguoi dau tien!
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {approvedReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </CommerceSurface>
        </div>

        {/* Booking sidebar */}
        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <TrustBanner />
          <BookingBox
            tour={tour}
            futureDepartures={futureDepartures}
            selectedDepartureId={selectedDepartureId}
            onDepartureChange={setSelectedDepartureId}
            guests={guests}
            onGuestsChange={setGuests}
            couponCode={couponCode}
            onCouponChange={setCouponCode}
            totalPrice={totalPrice}
            bookingUrl={bookingUrl}
            hasSale={hasSale}
            displayPrice={displayPrice}
          />
        </aside>
      </section>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Itinerary accordion
// ---------------------------------------------------------------------------

function ItineraryAccordion({ item }: { item: TourItinerary }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-tv border border-[tv-border]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between bg-[tv-bg] px-5 py-4 text-left transition hover:bg-[tv-blue-light]"
        type="button"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[tv-blue] text-xs font-bold text-white">
            {item.dayNumber}
          </span>
          <span className="font-bold text-[tv-ink]">{item.title}</span>
        </div>
        {open ? (
          <ChevronUp size={18} className="shrink-0 text-[tv-blue]" aria-hidden="true" />
        ) : (
          <ChevronDown size={18} className="shrink-0 text-[tv-ink-3]" aria-hidden="true" />
        )}
      </button>

      {open && (
        <div className="border-t border-[tv-border] bg-white px-5 py-4 space-y-3 text-sm">
          {item.description && <p className="leading-6 text-[tv-ink-3]">{item.description}</p>}
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
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[tv-ink-3]">{label}</p>
      <p className="mt-1 font-bold text-[tv-ink]">{value}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Departure row
// ---------------------------------------------------------------------------

function DepartureRow({
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
          ? 'border-[tv-blue] bg-[tv-blue-light]'
          : 'border-[tv-border] bg-white hover:border-[tv-blue] hover:bg-[tv-bg]'
      }`}
      type="button"
      aria-pressed={selected}
    >
      <div className="flex items-center gap-3">
        <CalendarDays
          size={18}
          className={selected ? 'text-[tv-blue]' : 'text-[tv-ink-3]'}
          aria-hidden="true"
        />
        <div>
          <p className="font-bold text-[tv-ink]">{formatDateVi(date)}</p>
          <p className="text-xs font-bold text-[tv-ink-3]">Con {departure.availableSlots} cho</p>
        </div>
      </div>
      <div className="text-right">
        {departure.priceOverride != null && departure.priceOverride !== basePrice && (
          <p className="text-xs font-bold text-[tv-ink-3] line-through">{formatVnd(basePrice)}</p>
        )}
        <p className="font-bold text-[tv-orange]">{formatVnd(price)}</p>
        <p className="text-xs font-bold text-[tv-ink-3]">/ nguoi</p>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Review card
// ---------------------------------------------------------------------------

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="rounded-tv border border-[tv-border] bg-[tv-bg] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[tv-blue] text-sm font-bold text-white">
            {(review.author?.fullName ?? 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-[tv-ink]">{review.author?.fullName ?? 'Khach hang'}</p>
            <p className="text-xs font-bold text-[tv-ink-3]">
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
              className={i < review.rating ? 'text-[#f97316]' : 'text-[tv-border]'}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
      {review.title && <p className="mt-3 font-bold text-[tv-ink]">{review.title}</p>}
      <p className="mt-2 text-sm leading-6 text-[tv-ink-3]">{review.content}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Booking box
// ---------------------------------------------------------------------------

function BookingBox({
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
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[tv-blue]">Dat tour ngay</p>
      <div className="mt-2 flex items-baseline gap-2">
        {hasSale && (
          <span className="text-sm font-bold text-[tv-ink-3] line-through">
            {formatVnd(tour.basePrice)}
          </span>
        )}
        <span className="text-2xl font-bold text-[tv-orange]">{formatVnd(displayPrice)}</span>
        <span className="text-xs font-bold text-[tv-ink-3]">/ nguoi</span>
      </div>

      <div className="mt-5 space-y-4">
        {/* Departure select */}
        <div>
          <label
            className="block text-xs font-bold uppercase tracking-[0.12em] text-[tv-ink-3]"
            htmlFor="departure-select"
          >
            Ngay khoi hanh
          </label>
          {futureDepartures.length === 0 ? (
            <p className="mt-2 text-sm font-bold text-[tv-ink-3]">
              Lien he de tu van lich khoi hanh
            </p>
          ) : (
            <select
              id="departure-select"
              value={selectedDepartureId}
              onChange={(e) => onDepartureChange(e.target.value)}
              className="mt-2 w-full rounded-tv-sm border border-[tv-border] bg-white px-3 py-2.5 text-sm font-bold text-[tv-ink] outline-none focus:border-[tv-blue]"
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
            className="block text-xs font-bold uppercase tracking-[0.12em] text-[tv-ink-3]"
            htmlFor="guest-count"
          >
            So khach
          </label>
          <div className="mt-2 flex items-center gap-3">
            <button
              onClick={() => onGuestsChange(Math.max(tour.minGuests, guests - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-tv-sm border border-[tv-border] bg-white font-bold text-[tv-blue] hover:bg-[tv-blue-light]"
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
              className="w-16 rounded-tv-sm border border-[tv-border] bg-white px-3 py-2 text-center text-sm font-bold text-[tv-ink] outline-none focus:border-[tv-blue]"
            />
            <button
              onClick={() => onGuestsChange(Math.min(tour.maxGuests, guests + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-tv-sm border border-[tv-border] bg-white font-bold text-[tv-blue] hover:bg-[tv-blue-light]"
              type="button"
              aria-label="Tang so khach"
            >
              +
            </button>
            <span className="text-xs font-bold text-[tv-ink-3]">(toi da {tour.maxGuests})</span>
          </div>
        </div>

        {/* Coupon */}
        <div>
          <label
            className="block text-xs font-bold uppercase tracking-[0.12em] text-[tv-ink-3]"
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
              className="flex-1 rounded-tv-sm border border-[tv-border] bg-white px-3 py-2.5 text-sm font-bold text-[tv-ink] outline-none focus:border-[tv-blue]"
              placeholder="Nhap ma..."
            />
            <button
              className="rounded-tv-sm border border-[tv-border] bg-white px-3 py-2.5 text-xs font-bold text-[tv-blue] hover:bg-[tv-blue-light]"
              type="button"
            >
              Ap dung
            </button>
          </div>
        </div>

        {/* Total */}
        <div className="rounded-tv bg-[tv-bg] p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[tv-ink-3]">
              {formatVnd(displayPrice)} x {guests} khach
            </span>
            <span className="font-bold text-[tv-ink]">{formatVnd(totalPrice)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-[tv-border] pt-2">
            <span className="font-bold text-[tv-ink]">Tong cong</span>
            <span className="text-xl font-bold text-[tv-orange]">{formatVnd(totalPrice)}</span>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={bookingUrl}
          className="inline-flex w-full items-center justify-center gap-2 rounded-tv bg-[tv-orange] px-4 py-4 font-bold text-white shadow-tv-card transition hover:bg-[tv-orange-dark]"
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
// Sub-components
// ---------------------------------------------------------------------------

function InfoCard({
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
    <div className="rounded-tv border border-[tv-border] bg-white p-5 shadow-tv-card">
      <Icon className="text-[tv-blue]" size={20} aria-hidden="true" />
      <h2 className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-[tv-ink-3]">
        {title}
      </h2>
      <p className={`mt-2 text-lg font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}
