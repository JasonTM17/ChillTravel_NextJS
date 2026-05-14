'use client';

import { CalendarDays, MapPin, Search, Users } from 'lucide-react';
import Link from 'next/link';
import type { TranslationNamespace } from '@/lib/i18n/types';

const quickCities = ['Đà Nẵng', 'Phú Quốc', 'Hội An', 'Sapa', 'Hà Nội', 'Tokyo', 'Bangkok'];

export function HeroSearch({ t }: { t: TranslationNamespace }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0064D2] via-[#0052B0] to-[#003D85]">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/20" />
        <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-white/10" />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-4 pb-10 pt-8 md:pb-14 md:pt-12">
        <h1 className="mb-2 text-center text-2xl font-extrabold text-white md:text-4xl lg:text-[42px] lg:leading-tight">
          {t.home.heroTitle}
        </h1>
        <p className="mb-8 text-center text-sm text-white/70 md:text-base">
          Tìm kiếm khách sạn, tour, vé máy bay với giá tốt nhất
        </p>

        {/* Search card */}
        <div className="rounded-2xl bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.3)] md:p-6">
          <div className="grid gap-3 md:grid-cols-[1fr_160px_160px_140px_auto]">
            {/* Destination */}
            <div className="tv-search-field">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-tv-ink-3">
                {t.home.destination}
              </label>
              <div className="mt-1 flex items-center gap-2">
                <MapPin size={18} className="shrink-0 text-[#0064D2]" />
                <input
                  defaultValue="Đà Nẵng"
                  placeholder={t.home.searchPlaceholder}
                  className="w-full bg-transparent text-[15px] font-bold text-tv-ink outline-none placeholder:font-normal placeholder:text-tv-ink-4"
                />
              </div>
            </div>

            {/* Check-in */}
            <div className="tv-search-field">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-tv-ink-3">
                {t.home.checkIn}
              </label>
              <div className="mt-1 flex items-center gap-2">
                <CalendarDays size={16} className="shrink-0 text-[#0064D2]" />
                <span className="text-[15px] font-bold">12 thg 8</span>
              </div>
            </div>

            {/* Check-out */}
            <div className="tv-search-field">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-tv-ink-3">
                {t.home.checkOut}
              </label>
              <div className="mt-1 flex items-center gap-2">
                <CalendarDays size={16} className="shrink-0 text-[#0064D2]" />
                <span className="text-[15px] font-bold">16 thg 8</span>
              </div>
            </div>

            {/* Guests */}
            <div className="tv-search-field">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-tv-ink-3">
                {t.booking.guests}
              </label>
              <div className="mt-1 flex items-center gap-2">
                <Users size={16} className="shrink-0 text-[#0064D2]" />
                <span className="text-[15px] font-bold">{t.home.guests}</span>
              </div>
            </div>

            {/* Search button */}
            <Link
              href="/hotels?destination=Đà+Nẵng&checkIn=2026-08-12&checkOut=2026-08-16&rooms=1&guests=2"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#FF6D00] px-7 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:bg-[#E55A00] hover:shadow-xl hover:shadow-orange-500/40 active:scale-[0.98]"
            >
              <Search size={18} />
              <span className="hidden md:inline">{t.home.search}</span>
            </Link>
          </div>

          {/* Quick tags */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-medium text-tv-ink-3">{t.home.quickSearch}</span>
            {quickCities.map((city) => (
              <Link
                key={city}
                href={`/explore?keyword=${city}`}
                className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[12px] font-semibold text-tv-ink-2 transition-all hover:border-[#0064D2] hover:bg-blue-50 hover:text-[#0064D2]"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
