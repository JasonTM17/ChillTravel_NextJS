'use client';

import { MobileBottomNav } from './mobile-bottom-nav';

/* ─── Responsive Layout Component ─────────────────────────────────────────── */

/**
 * Main layout wrapper implementing responsive breakpoints:
 * - Mobile (<768px): single-column, bottom navigation bar, no sticky sidebar
 * - Tablet (768-1024px): single-column with full header visible
 * - Desktop (>1024px): multi-column layout with sticky trip cart sidebar
 *
 * Uses Tailwind responsive classes (md: for ≥768px, lg: for ≥1024px).
 *
 * @requirements 11.6, 13.1
 */

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  /** Optional sidebar content (e.g., trip cart) shown on desktop only */
  sidebar?: React.ReactNode;
  /** Whether to show the bottom navigation on mobile (default: true) */
  showBottomNav?: boolean;
  /** Additional CSS classes for the main content area */
  className?: string;
}

export function ResponsiveLayout({
  children,
  sidebar,
  showBottomNav = true,
  className = '',
}: ResponsiveLayoutProps) {
  return (
    <>
      {/* Main content area with responsive layout */}
      <div className={`mx-auto w-full max-w-[1200px] px-4 ${className}`}>
        {/* Desktop: multi-column with sidebar | Tablet & Mobile: single-column */}
        <div className="flex flex-col lg:flex-row lg:gap-6">
          {/* Primary content — full width on mobile/tablet, flex-1 on desktop */}
          <main className="min-w-0 flex-1">{children}</main>

          {/* Sidebar — hidden on mobile/tablet, sticky on desktop */}
          {sidebar && (
            <aside className="hidden lg:block lg:w-[340px] lg:shrink-0">
              <div className="sticky top-20">{sidebar}</div>
            </aside>
          )}
        </div>
      </div>

      {/* Bottom navigation — mobile only (<768px) */}
      {showBottomNav && <MobileBottomNav />}

      {/* Bottom padding spacer on mobile to prevent content from being hidden behind bottom nav */}
      {showBottomNav && <div className="h-14 md:hidden" aria-hidden="true" />}
    </>
  );
}
