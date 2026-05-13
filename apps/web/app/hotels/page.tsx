'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import { HotelCard, type Hotel } from '@/components/listing/hotel-card';
import {
  HotelFilterPanel,
  DEFAULT_FILTERS,
  type HotelFilters,
} from '@/components/listing/hotel-filter-panel';
import { HotelSortControls, type SortOption } from '@/components/listing/hotel-sort-controls';
import { PageShell } from '@/components/page-shell';

/* ─── Mock hotel data (API will provide real data later) ───────────────────── */
const MOCK_HOTELS: Hotel[] = [
  {
    id: 'hotel-danang-beach',
    name: 'Danang Golden Bay Hotel',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop',
    starRating: 5,
    reviewScore: 8.7,
    reviewCount: 1243,
    location: 'Đà Nẵng, Việt Nam',
    amenities: ['wifi', 'pool', 'restaurant', 'spa'],
    nightlyPrice: 2_500_000,
    distanceFromCenter: 2.1,
    propertyType: 'hotel',
  },
  {
    id: 'hotel-hoi-an-resort',
    name: 'Hội An Riverside Resort & Spa',
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop',
    starRating: 4,
    reviewScore: 9.1,
    reviewCount: 876,
    location: 'Hội An, Quảng Nam',
    amenities: ['wifi', 'pool', 'parking', 'spa'],
    nightlyPrice: 3_200_000,
    distanceFromCenter: 1.5,
    propertyType: 'resort',
  },
  {
    id: 'hotel-saigon-central',
    name: 'Saigon Central Hotel',
    imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop',
    starRating: 3,
    reviewScore: 7.5,
    reviewCount: 542,
    location: 'Quận 1, TP. Hồ Chí Minh',
    amenities: ['wifi', 'restaurant', 'gym'],
    nightlyPrice: 1_200_000,
    distanceFromCenter: 0.5,
    propertyType: 'hotel',
  },
  {
    id: 'hotel-phuquoc-villa',
    name: 'Phú Quốc Sunset Villa',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop',
    starRating: 5,
    reviewScore: 9.4,
    reviewCount: 328,
    location: 'Phú Quốc, Kiên Giang',
    amenities: ['wifi', 'pool', 'parking', 'restaurant', 'spa'],
    nightlyPrice: 5_800_000,
    distanceFromCenter: 8.0,
    propertyType: 'villa',
  },
  {
    id: 'hotel-hanoi-old-quarter',
    name: 'Hanoi Old Quarter Hostel',
    imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop',
    starRating: 2,
    reviewScore: 7.8,
    reviewCount: 1102,
    location: 'Hoàn Kiếm, Hà Nội',
    amenities: ['wifi'],
    nightlyPrice: 450_000,
    distanceFromCenter: 0.3,
    propertyType: 'hostel',
  },
  {
    id: 'hotel-nhatrang-beach',
    name: 'Nha Trang Beach Front Hotel',
    imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop',
    starRating: 4,
    reviewScore: 8.2,
    reviewCount: 654,
    location: 'Nha Trang, Khánh Hòa',
    amenities: ['wifi', 'pool', 'restaurant', 'gym'],
    nightlyPrice: 1_800_000,
    distanceFromCenter: 1.2,
    propertyType: 'hotel',
  },
];

/* ─── Filtering & Sorting Logic ────────────────────────────────────────────── */

function applyFilters(hotels: Hotel[], filters: HotelFilters): Hotel[] {
  return hotels.filter((hotel) => {
    if (hotel.nightlyPrice < filters.priceMin || hotel.nightlyPrice > filters.priceMax)
      return false;
    if (filters.starRatings.length > 0 && !filters.starRatings.includes(hotel.starRating))
      return false;
    if (
      filters.amenities.length > 0 &&
      !filters.amenities.every((a) => hotel.amenities.includes(a))
    )
      return false;
    if (
      filters.propertyTypes.length > 0 &&
      hotel.propertyType &&
      !filters.propertyTypes.includes(hotel.propertyType)
    )
      return false;
    if (hotel.distanceFromCenter != null && hotel.distanceFromCenter > filters.maxDistance)
      return false;
    return true;
  });
}

function applySort(hotels: Hotel[], sort: SortOption): Hotel[] {
  const sorted = [...hotels];
  switch (sort) {
    case 'price_asc':
      return sorted.sort((a, b) => a.nightlyPrice - b.nightlyPrice);
    case 'price_desc':
      return sorted.sort((a, b) => b.nightlyPrice - a.nightlyPrice);
    case 'rating_desc':
      return sorted.sort((a, b) => b.reviewScore - a.reviewScore);
    case 'popularity_desc':
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    case 'distance_asc':
      return sorted.sort((a, b) => (a.distanceFromCenter ?? 99) - (b.distanceFromCenter ?? 99));
    default:
      return sorted;
  }
}

/* ─── Page Component ───────────────────────────────────────────────────────── */

export default function HotelsPage() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<HotelFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOption>('popularity_desc');

  // Read search params from URL (passed from search panel)
  const destination = searchParams.get('destination') ?? '';
  const checkIn = searchParams.get('checkIn') ?? '';
  const checkOut = searchParams.get('checkOut') ?? '';
  const rooms = searchParams.get('rooms') ?? '1';
  const guests = searchParams.get('guests') ?? '2';

  const filteredHotels = useMemo(() => {
    let hotels = MOCK_HOTELS;

    // Filter by destination if provided from search params
    if (destination) {
      const destLower = destination.toLowerCase();
      hotels = hotels.filter(
        (h) =>
          h.location.toLowerCase().includes(destLower) || h.name.toLowerCase().includes(destLower),
      );
      // If no match, show all (fallback)
      if (hotels.length === 0) hotels = MOCK_HOTELS;
    }

    const filtered = applyFilters(hotels, filters);
    return applySort(filtered, sort);
  }, [filters, sort, destination]);

  const searchSummary = destination
    ? `${destination}${checkIn ? ` · ${checkIn}` : ''}${checkOut ? ` → ${checkOut}` : ''} · ${rooms} phòng · ${guests} khách`
    : '';

  return (
    <PageShell
      eyebrow="Tìm nơi lưu trú"
      title="Khách sạn demo, giá rõ và không phát sinh giao dịch thật"
    >
      {/* Search summary from URL params */}
      {searchSummary && (
        <div className="mb-4 rounded-tv border border-tv-border bg-sky-surface/50 px-4 py-3 text-sm text-muted-ink">
          <span className="font-semibold text-ink">Tìm kiếm:</span> {searchSummary}
        </div>
      )}

      <div className="flex gap-6">
        {/* Filter sidebar */}
        <HotelFilterPanel
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(DEFAULT_FILTERS)}
        />

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Sort controls */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-tv-ink-3">{filteredHotels.length} khách sạn</p>
            <HotelSortControls activeSort={sort} onChange={setSort} />
          </div>

          {/* Hotel cards */}
          {filteredHotels.length === 0 ? (
            <div className="rounded-tv border border-tv-border bg-white p-8 text-center">
              <p className="text-tv-ink-3">Không tìm thấy khách sạn phù hợp.</p>
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="mt-3 text-sm font-semibold text-tv-blue hover:underline"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
