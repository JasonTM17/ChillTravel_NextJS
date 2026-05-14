'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

const banners = [
  {
    id: 'banner-1',
    image:
      'https://images.unsplash.com/photo-1528127269322-539801943592?w=1400&h=500&fit=crop&q=80',
    title: 'Vịnh Hạ Long — Kỳ quan thiên nhiên thế giới',
    subtitle: 'Tour du thuyền 5 sao giảm đến 40%',
    cta: 'Khám phá ngay',
    href: '/tours',
    gradient: 'from-black/60 via-black/30 to-transparent',
  },
  {
    id: 'banner-2',
    image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1400&h=500&fit=crop&q=80',
    title: 'Hội An — Phố cổ đèn lồng',
    subtitle: 'Đà Nẵng - Hội An 3N2Đ chỉ từ 2.990.000đ',
    cta: 'Đặt tour ngay',
    href: '/tours',
    gradient: 'from-black/60 via-black/30 to-transparent',
  },
  {
    id: 'banner-3',
    image: 'https://images.unsplash.com/photo-1540202404-a2f29564651f?w=1400&h=500&fit=crop&q=80',
    title: 'Phú Quốc — Đảo ngọc Việt Nam',
    subtitle: 'Resort 5 sao giá ưu đãi mùa hè',
    cta: 'Xem ưu đãi',
    href: '/hotels',
    gradient: 'from-black/60 via-black/30 to-transparent',
  },
  {
    id: 'banner-4',
    image:
      'https://images.unsplash.com/photo-1573408301185-9519f94f4e8e?w=1400&h=500&fit=crop&q=80',
    title: 'Sapa — Ruộng bậc thang mùa lúa chín',
    subtitle: 'Trekking & homestay từ 1.490.000đ',
    cta: 'Đặt ngay',
    href: '/tours',
    gradient: 'from-black/60 via-black/30 to-transparent',
  },
];

export function PromoBannerCarousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % banners.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + banners.length) % banners.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const banner = banners[current]!;

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-6">
      <div className="group relative overflow-hidden rounded-2xl">
        {/* Image */}
        <div className="relative h-[280px] md:h-[380px] transition-all duration-700">
          <img
            src={banner.image}
            alt={banner.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`} />
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:justify-center md:p-10">
          <h2 className="text-2xl font-extrabold text-white md:text-4xl drop-shadow-lg">
            {banner.title}
          </h2>
          <p className="mt-2 text-sm text-white/90 md:text-lg">{banner.subtitle}</p>
          <a
            href={banner.href}
            className="mt-4 inline-flex w-fit items-center gap-2 rounded-lg bg-[#FF6D00] px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#E55A00] hover:shadow-xl"
          >
            {banner.cta}
            <ChevronRight size={16} />
          </a>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {banners.map((b, i) => (
            <button
              key={b.id}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${
                i === current ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
