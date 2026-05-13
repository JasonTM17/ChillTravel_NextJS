'use client';

import { Home, Search, CalendarDays, Heart, UserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/* ─── Navigation Item Definitions ─────────────────────────────────────────── */

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Trang chủ', icon: Home, href: '/' },
  { id: 'search', label: 'Tìm kiếm', icon: Search, href: '/hotels' },
  { id: 'bookings', label: 'Đặt chỗ', icon: CalendarDays, href: '/my-bookings' },
  { id: 'saved', label: 'Đã lưu', icon: Heart, href: '/wishlist' },
  { id: 'account', label: 'Tài khoản', icon: UserRound, href: '/profile' },
];

/* ─── Mobile Bottom Navigation Bar ────────────────────────────────────────── */

/**
 * Fixed bottom navigation bar visible only on mobile viewports (<768px).
 * Each icon tap target is at least 44×44 CSS pixels.
 * Bar height is at least 56px.
 * Active state uses booking blue (#0277D4).
 *
 * @requirements 11.6, 13.1
 */
export function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white md:hidden"
      aria-label="Điều hướng chính"
    >
      <div className="flex h-14 items-center justify-around">
        {NAV_ITEMS.map(({ id, label, icon: Icon, href }) => {
          const active = isActive(href);
          return (
            <Link
              key={id}
              href={href}
              className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 px-2 transition-colors
                ${active ? 'text-booking-blue' : 'text-muted-ink'}`}
              aria-current={active ? 'page' : undefined}
              aria-label={label}
            >
              <Icon size={22} className={active ? 'text-booking-blue' : 'text-muted-ink'} />
              <span className="text-[10px] font-medium leading-tight">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
