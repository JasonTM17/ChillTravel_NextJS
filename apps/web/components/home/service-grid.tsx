'use client';

import { Bus, Car, Hotel, Plane, Sparkles, Ticket, Train, Zap } from 'lucide-react';
import Link from 'next/link';
import type { TranslationNamespace } from '@/lib/i18n/types';

const serviceItems = [
  { key: 'hotels' as const, href: '/hotels', icon: Hotel, color: '#0064D2' },
  { key: 'flights' as const, href: '/flights', icon: Plane, color: '#0064D2' },
  { key: 'tours' as const, href: '/tours', icon: Ticket, color: '#0064D2' },
  { key: 'train' as const, href: '/map', icon: Train, color: '#0064D2' },
  { key: 'shuttle' as const, href: '/map', icon: Bus, color: '#0064D2' },
  { key: 'carRental' as const, href: '/map', icon: Car, color: '#0064D2' },
  { key: 'activities' as const, href: '/experiences', icon: Zap, color: '#0064D2' },
  { key: 'aiPlanner' as const, href: '/ai-planner', icon: Sparkles, color: '#FF6D00' },
] as const;

export function ServiceGrid({ t }: { t: TranslationNamespace }) {
  return (
    <div className="border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="flex items-center justify-between overflow-x-auto py-1 scrollbar-hide">
          {serviceItems.map(({ key, href, icon: Icon, color }) => (
            <Link
              key={key}
              href={href}
              className="group flex flex-shrink-0 flex-col items-center gap-1.5 px-4 py-3 transition-all hover:bg-gray-50 rounded-lg"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full transition-transform group-hover:scale-110"
                style={{ backgroundColor: color + '12' }}
              >
                <Icon size={22} style={{ color }} strokeWidth={1.8} />
              </div>
              <span className="text-[11px] font-semibold text-gray-600 group-hover:text-[#0064D2] transition-colors whitespace-nowrap">
                {t.home[key]}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
