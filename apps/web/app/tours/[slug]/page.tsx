'use client';

import {
  ArrowRight,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
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
import type { Tour } from '@/lib/api/tour.api';
import { wishlistApi } from '@/lib/api/wishlist.api';
import { useAuth } from '@/lib/auth/auth-context';
import { getDestinationImage } from '@/lib/destination-images';
import { formatVnd } from '@/lib/utils';
import {
  TourDetailSkeleton,
  TourOverviewCards,
  ItineraryAccordion,
  DepartureRow,
  ReviewCard,
  BookingBox,
} from './_components/tour-detail-widgets';

export default function TourDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [tour, setTour] = useState<Tour | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [wishlistId, setWishlistId] = useState<string | null>(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);

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

          const reviewRes = await reviewApi.listByTour(tourData.id, { page: 0, size: 20 });
          if (!cancelled && reviewRes.success) {
            const reviewData = reviewRes.data as { items: Review[] };
            setReviews(reviewData.items ?? []);
          }

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
          <TourOverviewCards tour={tour} displayPrice={displayPrice} />

          <CommerceSurface>
            <h2 className="text-2xl font-bold">Mo ta tour</h2>
            <p className="mt-3 leading-7 text-[tv-ink-3]">{tour.description}</p>
          </CommerceSurface>

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
