'use client';

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
    imageUrl: '/generated/hotels/danang-golden-bay.jpg',
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
    imageUrl: '/generated/hotels/hoian-riverside.jpg',
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
    imageUrl: '/generated/hotels/saigon-central.jpg',
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
    imageUrl: '/generated/hotels/phuquoc-villa.jpg',
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
    imageUrl: '/generated/hotels/hanoi-hostel.jpg',
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
    imageUrl: '/generated/hotels/nhatrang-beach.jpg',
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
  const [filters, setFilters] = useState<HotelFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOption>('popularity_desc');

  const filteredHotels = useMemo(() => {
    const filtered = applyFilters(MOCK_HOTELS, filters);
    return applySort(filtered, sort);
  }, [filters, sort]);

  return (
    <PageShell
      eyebrow="Tìm nơi lưu trú"
      title="Khách sạn demo, giá rõ và không phát sinh giao dịch thật"
    >
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
