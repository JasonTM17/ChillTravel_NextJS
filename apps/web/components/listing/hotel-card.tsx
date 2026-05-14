'use client';

import { Star, Wifi, Car, UtensilsCrossed, Dumbbell, Sparkles, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from '@/lib/i18n';

export type AmenityType = 'wifi' | 'pool' | 'parking' | 'restaurant' | 'gym' | 'spa';

export interface Hotel {
  id: string;
  name: string;
  imageUrl: string;
  starRating: number;
  reviewScore: number;
  reviewCount: number;
  location: string;
  amenities: AmenityType[];
  nightlyPrice: number;
  distanceFromCenter?: number;
  propertyType?: string;
}

interface HotelCardProps {
  hotel: Hotel;
}

const AMENITY_ICONS: Record<
  AmenityType,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  wifi: Wifi,
  pool: Sparkles,
  parking: Car,
  restaurant: UtensilsCrossed,
  gym: Dumbbell,
  spa: Sparkles,
};

const AMENITY_LABELS: Record<AmenityType, string> = {
  wifi: 'Wi-Fi',
  pool: 'Hồ bơi',
  parking: 'Bãi đỗ xe',
  restaurant: 'Nhà hàng',
  gym: 'Phòng gym',
  spa: 'Spa',
};

function getScoreBadgeColor(score: number): string {
  if (score >= 8) return 'bg-emerald-600 text-white';
  if (score >= 6) return 'bg-amber-500 text-white';
  return 'bg-red-500 text-white';
}

export function HotelCard({ hotel }: HotelCardProps) {
  const { t, fmt } = useLocale();
  const displayedAmenities = hotel.amenities.slice(0, 4);

  return (
    <Link
      href={`/hotels/${hotel.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:flex-row"
      aria-label={hotel.name}
    >
      {/* Image */}
      <div className="relative aspect-video w-full shrink-0 overflow-hidden sm:aspect-[4/3] sm:w-64 md:w-72">
        <img
          src={hotel.imageUrl}
          alt={hotel.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {hotel.propertyType && (
          <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase text-gray-700 backdrop-blur-sm">
            {hotel.propertyType}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          {/* Stars */}
          <div className="mb-1.5 flex items-center gap-0.5">
            {Array.from({ length: hotel.starRating }, (_, i) => (
              <Star
                key={i}
                size={13}
                className="fill-amber-400 text-amber-400"
                aria-hidden="true"
              />
            ))}
          </div>

          {/* Name */}
          <h3 className="text-[15px] font-bold leading-tight text-gray-800 group-hover:text-[#0064D2] transition-colors sm:text-[16px]">
            {hotel.name}
          </h3>

          {/* Location */}
          <div className="mt-1.5 flex items-center gap-1 text-[12px] text-gray-500">
            <MapPin size={12} aria-hidden="true" className="shrink-0" />
            <span className="line-clamp-1">{hotel.location}</span>
            {hotel.distanceFromCenter != null && (
              <span className="text-gray-400">· {hotel.distanceFromCenter} km từ trung tâm</span>
            )}
          </div>

          {/* Amenities */}
          {displayedAmenities.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {displayedAmenities.map((amenity) => {
                const Icon = AMENITY_ICONS[amenity];
                return (
                  <span
                    key={amenity}
                    className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-[11px] font-semibold text-[#0064D2]"
                    title={AMENITY_LABELS[amenity]}
                  >
                    <Icon size={12} aria-hidden="true" />
                    <span className="hidden sm:inline">{AMENITY_LABELS[amenity]}</span>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom: Score + Price */}
        <div className="mt-4 flex items-end justify-between gap-3 border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-2 text-[13px] font-bold ${getScoreBadgeColor(hotel.reviewScore)}`}
            >
              {hotel.reviewScore.toFixed(1)}
            </span>
            <span className="text-[11px] text-gray-500">
              {hotel.reviewCount} {t.hotel.reviews}
            </span>
          </div>

          <div className="text-right">
            <p className="text-[17px] font-extrabold text-[#FF6D00] sm:text-[19px]">
              {fmt.formatCurrency(hotel.nightlyPrice)}
            </p>
            <p className="text-[11px] text-gray-400">{t.hotel.perNight}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
