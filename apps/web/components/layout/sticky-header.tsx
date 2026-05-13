'use client';

import { Building2, Plane, Map, Sparkles, HelpCircle, UserRound } from 'lucide-react';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';

/* ─── Service Tab Definitions ─────────────────────────────────────────────── */

export type ServiceTab = 'hotels' | 'flights' | 'tours' | 'experiences';

interface TabDefinition {
  id: ServiceTab;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  href: string;
}

const SERVICE_TABS: TabDefinition[] = [
  { id: 'hotels', label: 'Khách sạn', icon: Building2, href: '/hotels' },
  { id: 'flights', label: 'Vé máy bay', icon: Plane, href: '/flights' },
  { id: 'tours', label: 'Tour du lịch', icon: Map, href: '/tours' },
  { id: 'experiences', label: 'Trải nghiệm', icon: Sparkles, href: '/experiences' },
];

/* ─── Component Props ─────────────────────────────────────────────────────── */

interface StickyHeaderProps {
  activeTab?: ServiceTab;
  onTabChange?: (tab: ServiceTab) => void;
  className?: string;
}

/* ─── Sticky Header Component ─────────────────────────────────────────────── */

export function StickyHeader({
  activeTab = 'hotels',
  onTabChange,
  className = '',
}: StickyHeaderProps) {
  const handleTabClick = (tab: ServiceTab) => {
    onTabChange?.(tab);
  };

  return (
    <header className={`sticky top-0 z-50 border-b border-border bg-white ${className}`}>
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4">
        {/* ── Left: Logo/Brand ──────────────────────────────────────────── */}
        <div className="flex shrink-0 items-center">
          <BrandLogo />
        </div>

        {/* ── Center: Service Tabs ──────────────────────────────────────── */}
        <nav
          className="hidden flex-1 items-center justify-center gap-1 md:flex"
          aria-label="Dịch vụ"
        >
          {SERVICE_TABS.map(({ id, label, icon: Icon, href }) => {
            const isActive = activeTab === id;
            return (
              <Link
                key={id}
                href={href}
                onClick={() => handleTabClick(id)}
                className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors
                  ${
                    isActive
                      ? 'bg-sky-surface text-booking-blue'
                      : 'text-muted-ink hover:bg-sky-surface hover:text-booking-blue'
                  }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={18} className={isActive ? 'text-booking-blue' : 'text-muted-ink'} />
                <span>{label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] rounded-t bg-booking-blue" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Right: User Actions ──────────────────────────────────────── */}
        <div className="flex shrink-0 items-center gap-4">
          <Link
            href="/support"
            className="hidden items-center gap-1.5 text-sm font-medium text-muted-ink transition-colors hover:text-booking-blue md:flex"
          >
            <HelpCircle size={16} />
            <span>Hỗ trợ</span>
          </Link>
          <Link
            href="/account"
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-booking-blue hover:text-booking-blue"
          >
            <UserRound size={16} />
            <span className="hidden sm:inline">Tài khoản</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
