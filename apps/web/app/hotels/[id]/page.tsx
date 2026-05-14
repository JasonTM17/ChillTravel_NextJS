'use client';

import { getHotelPropertyBySlug } from '@vietwander/shared';
import { ChevronRight, MapPin, Star } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import { CommerceSurface } from '@/components/commerce-primitives';
import { useLocale } from '@/lib/i18n';
import {
  generateGalleryImages,
  generateMockReviews,
  PhotoGallery,
  AmenityGrid,
  RoomTypeList,
  LocationMap,
  GuestReviews,
  StickyPriceSummary,
  MobileBottomBar,
} from './_components/hotel-detail-widgets';

export default function HotelDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const hotel = getHotelPropertyBySlug(id);
  const { t } = useLocale();

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const galleryImages = useMemo(
    () => (hotel ? generateGalleryImages(hotel.destinationSlug, 30) : []),
    [hotel],
  );

  const reviews = useMemo(() => (hotel ? generateMockReviews(hotel.name, 25) : []), [hotel]);

  if (!hotel) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-sky-surface">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-ink">Không tìm thấy khách sạn</h1>
          <Link href="/hotels" className="mt-4 inline-block text-booking-blue hover:underline">
            ← Quay lại danh sách
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-sky-surface/30 text-ink">
      {/* Breadcrumb Header */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-[1180px] px-4 py-4">
          <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-muted-ink">
            <Link href="/hotels" className="text-booking-blue hover:underline">
              Khách sạn
            </Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span>{hotel.city}</span>
            <ChevronRight size={14} aria-hidden="true" />
            <span className="text-ink">{hotel.name}</span>
          </div>

          <div className="mt-4">
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="inline-flex items-center gap-1 text-sm font-bold text-orange-cta">
                <Star size={16} fill="currentColor" aria-hidden="true" />
                {hotel.rating.toFixed(1)} ({hotel.reviewCount} {t.hotel.reviews})
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-bold leading-tight md:text-4xl">{hotel.name}</h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted-ink">
              <MapPin size={16} className="text-booking-blue" aria-hidden="true" />
              {hotel.address}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-[1180px] px-4 py-6">
        <PhotoGallery images={galleryImages} />

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
          <div className="space-y-6">
            <CommerceSurface>
              <h2 className="text-xl font-bold">Vì sao nên ở đây?</h2>
              <p className="mt-3 leading-7 text-muted-ink">{hotel.summary}</p>
            </CommerceSurface>

            <AmenityGrid amenities={hotel.amenities} />

            <RoomTypeList
              rooms={hotel.rooms}
              selectedRoomId={selectedRoomId}
              onSelectRoom={setSelectedRoomId}
            />

            <LocationMap address={hotel.address} hotelName={hotel.name} />

            <GuestReviews reviews={reviews} />
          </div>

          <StickyPriceSummary
            rooms={hotel.rooms}
            selectedRoomId={selectedRoomId}
            hotelSlug={hotel.slug}
            destinationSlug={hotel.destinationSlug}
          />
        </div>
      </section>

      <MobileBottomBar
        rooms={hotel.rooms}
        selectedRoomId={selectedRoomId}
        hotelSlug={hotel.slug}
        destinationSlug={hotel.destinationSlug}
      />
    </main>
  );
}
