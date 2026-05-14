'use client';

import { Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const flashSaleItems = [
  {
    id: 'fs-1',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&h=400&fit=crop&q=80',
    name: 'Tour Đà Nẵng - Hội An 3N2Đ',
    originalPrice: 4_500_000,
    salePrice: 2_990_000,
    discount: 34,
    slug: 'central-vietnam-heritage-tour',
  },
  {
    id: 'fs-2',
    image: 'https://images.unsplash.com/photo-1573408301185-9519f94f4e8e?w=600&h=400&fit=crop&q=80',
    name: 'Sapa Trekking 2N1Đ',
    originalPrice: 3_200_000,
    salePrice: 1_990_000,
    discount: 38,
    slug: 'northern-vietnam-adventure',
  },
  {
    id: 'fs-3',
    image: 'https://images.unsplash.com/photo-1540202404-a2f29564651f?w=600&h=400&fit=crop&q=80',
    name: 'Phú Quốc Resort 4N3Đ',
    originalPrice: 8_500_000,
    salePrice: 5_900_000,
    discount: 31,
    slug: 'phu-quoc-beach-escape',
  },
  {
    id: 'fs-4',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=600&h=400&fit=crop&q=80',
    name: 'Du thuyền Hạ Long 2N1Đ',
    originalPrice: 5_000_000,
    salePrice: 3_500_000,
    discount: 30,
    slug: 'ha-long-bay',
  },
];

function formatPrice(n: number) {
  return n.toLocaleString('vi-VN') + 'đ';
}

function useCountdown(endTime: Date) {
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, endTime.getTime() - Date.now()));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(Math.max(0, endTime.getTime() - Date.now()));
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  const hours = Math.floor(timeLeft / 3_600_000);
  const minutes = Math.floor((timeLeft % 3_600_000) / 60_000);
  const seconds = Math.floor((timeLeft % 60_000) / 1_000);

  return { hours, minutes, seconds };
}

const FLASH_SALE_END = new Date(Date.now() + 6 * 60 * 60 * 1000);

export function FlashSaleSection() {
  const { hours, minutes, seconds } = useCountdown(FLASH_SALE_END);

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5">
            <Zap size={16} className="text-yellow-300" fill="currentColor" />
            <span className="text-sm font-extrabold text-white">Flash Sale</span>
          </div>
          <div className="flex items-center gap-1">
            <TimeBox value={hours} />
            <span className="text-lg font-bold text-red-500">:</span>
            <TimeBox value={minutes} />
            <span className="text-lg font-bold text-red-500">:</span>
            <TimeBox value={seconds} />
          </div>
        </div>
        <Link href="/tours" className="text-sm font-semibold text-[#0064D2] hover:underline">
          Xem tất cả →
        </Link>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {flashSaleItems.map((item) => (
          <Link
            key={item.id}
            href={`/tours/${item.slug}`}
            className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
          >
            <div className="relative h-36 overflow-hidden md:h-44">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span className="absolute left-2 top-2 rounded-md bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white">
                -{item.discount}%
              </span>
            </div>
            <div className="p-3">
              <p className="text-[13px] font-bold text-gray-800 line-clamp-2 group-hover:text-[#0064D2] transition-colors">
                {item.name}
              </p>
              <div className="mt-2">
                <p className="text-[11px] text-gray-400 line-through">
                  {formatPrice(item.originalPrice)}
                </p>
                <p className="text-[15px] font-extrabold text-[#FF6D00]">
                  {formatPrice(item.salePrice)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function TimeBox({ value }: { value: number }) {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-900 text-sm font-bold text-white">
      {String(value).padStart(2, '0')}
    </span>
  );
}
