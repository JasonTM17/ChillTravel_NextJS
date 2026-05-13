'use client';

import { Star, Wifi, Car, UtensilsCrossed, Dumbbell, Sparkles, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from '@/lib/i18n';

// ─── Types ───────────────────────────────────────────────────────────────────

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

// ─── Amenity Icon Map ────────────────────────────────────────────────────────

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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getScoreBadgeColor(score: number): string {
  if (score >= 8) return 'bg-green-600 text-white';
  if (score >= 6) return 'bg-yellow-500 text-white';
  return 'bg-red-500 text-white';
}

function truncateName(name: string, maxLength = 80): string {
  if (name.length <= maxLength) return name;
  return name.slice(0, maxLength).trimEnd() + '…';
}

// ─── Component ───────────────────────────────────────────────────────────────

export function HotelCard({ hotel }: HotelCardProps) {
  const { t, fmt } = useLocale();

  const displayedAmenities = hotel.amenities.slice(0, 4);

  return (
    <Link
      href={`/hotels/${hotel.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-lg sm:flex-row"
      aria-label={hotel.name}
    >
      {/* Image Section */}
      <div className="relative aspect-video w-full shrink-0 sm:aspect-[16/9] sm:w-64 md:w-72">
        <Image
          src={hotel.imageUrl}
          alt={hotel.name}
          fill
          sizes="(max-width: 640px) 100vw, 288px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        {/* Top: Name, Stars, Location */}
        <div>
          {/* Star Rating */}
          <div className="mb-1 flex items-center gap-0.5">
            {Array.from({ length: hotel.starRating }, (_, i) => (
              <Star
                key={i}
                size={14}
                className="fill-yellow-400 text-yellow-400"
                aria-hidden="true"
              />
            ))}
            {hotel.starRating > 0 && (
              <span className="sr-only">
                {hotel.starRating} {t.hotel.starRating}
              </span>
            )}
          </div>

          {/* Property Name */}
          <h3 className="text-base font-bold leading-tight text-ink sm:text-lg">
            {truncateName(hotel.name)}
          </h3>

          {/* Location */}
          <div className="mt-1 flex items-center gap-1 text-sm text-muted-ink">
            <MapPin size={14} aria-hidden="true" className="shrink-0" />
            <span className="line-clamp-1">{hotel.location}</span>
          </div>

          {/* Amenities */}
          {displayedAmenities.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {displayedAmenities.map((amenity) => {
                const Icon = AMENITY_ICONS[amenity];
                return (
                  <span
                    key={amenity}
                    className="inline-flex items-center gap-1 rounded-md bg-sky-surface px-2 py-1 text-xs font-medium text-booking-blue"
                    title={AMENITY_LABELS[amenity]}
                  >
                    <Icon size={13} aria-hidden="true" />
                    <span className="hidden sm:inline">{AMENITY_LABELS[amenity]}</span>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom: Review Score + Price */}
        <div className="mt-4 flex items-end justify-between gap-3">
          {/* Review Score Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md px-1.5 text-sm font-bold ${getScoreBadgeColor(hotel.reviewScore)}`}
            >
              {hotel.reviewScore.toFixed(1)}
            </span>
            <span className="text-xs text-muted-ink">
              {hotel.reviewCount} {t.hotel.reviews}
            </span>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-lg font-bold text-booking-blue sm:text-xl">
              {fmt.formatCurrency(hotel.nightlyPrice)}
            </p>
            <p className="text-xs text-muted-ink">{t.hotel.perNight}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
