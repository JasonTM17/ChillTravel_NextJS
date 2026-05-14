'use client';

import { MapPin, Star } from 'lucide-react';
import Link from 'next/link';
import type { Destination } from '@/lib/api/destination.api';
import { getCountryName } from '@/lib/api/destination.api';
import type { Tour } from '@/lib/api/tour.api';
import { getDestinationImage } from '@/lib/destination-images';
import { formatVnd } from '@/lib/utils';

export function FeaturedTourCard({ tour }: { tour: Tour }) {
  const img =
    tour.imageUrl ??
    tour.images?.[0]?.imageUrl ??
    getDestinationImage(tour.destination?.slug ?? tour.slug);
  const price = tour.salePrice ?? tour.basePrice;
  const hasSale = tour.salePrice != null && tour.salePrice < tour.basePrice;

  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative h-44 overflow-hidden md:h-52">
        <img
          src={img}
          alt={tour.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/brand/logo-mark-islands.png';
            e.currentTarget.className = 'h-full w-full object-contain p-8 opacity-40';
          }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {tour.featured && (
          <span className="absolute left-3 top-3 rounded-md bg-[#FF6D00] px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
            Nổi bật
          </span>
        )}
        {hasSale && (
          <span className="absolute right-3 top-3 rounded-md bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
            Ưu đãi
          </span>
        )}
      </div>

      <div className="p-4">
        {tour.destination && (
          <div className="mb-1.5 flex items-center gap-1 text-[12px] text-gray-500">
            <MapPin size={12} />
            {tour.destination.city ?? tour.destination.name}
          </div>
        )}
        <h3 className="text-[14px] font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-[#0064D2] transition-colors">
          {tour.title}
        </h3>
        <p className="mt-1 text-[12px] text-gray-500">
          {tour.durationDays} ngày {tour.durationNights} đêm
        </p>

        <div className="mt-3 flex items-end justify-between border-t border-gray-50 pt-3">
          <div>
            {hasSale && (
              <p className="text-[11px] text-gray-400 line-through">{formatVnd(tour.basePrice)}</p>
            )}
            <p className="text-[16px] font-extrabold text-[#FF6D00]">
              {formatVnd(price)}
              <span className="text-[11px] font-normal text-gray-400">/người</span>
            </p>
          </div>
          {tour.ratingAvg != null && (
            <div className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1">
              <Star size={12} className="text-amber-500" fill="currentColor" />
              <span className="text-[12px] font-bold text-amber-700">
                {tour.ratingAvg.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export function DestinationCard({
  destination,
  compact = false,
}: {
  destination: Destination;
  compact?: boolean;
}) {
  const img = destination.imageUrl ?? getDestinationImage(destination.slug);

  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
    >
      <div className={`${compact ? 'h-32' : 'h-44'} overflow-hidden`}>
        <img
          src={img}
          alt={destination.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/brand/logo-mark-islands.png';
            e.currentTarget.className = 'h-full w-full object-contain p-8 opacity-40';
          }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-3">
        <p className="text-[13px] font-bold text-gray-800 truncate group-hover:text-[#0064D2] transition-colors">
          {destination.name}
        </p>
        <p className="text-[11px] text-gray-500 truncate">{getCountryName(destination)}</p>
        {destination.ratingAvg != null && (
          <div className="mt-1.5 flex items-center gap-1">
            <Star size={11} className="text-amber-500" fill="currentColor" />
            <span className="text-[11px] font-bold text-amber-700">
              {destination.ratingAvg.toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
