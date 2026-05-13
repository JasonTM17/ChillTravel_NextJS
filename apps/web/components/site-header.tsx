'use client';

import { Bell, ChevronDown, HelpCircle, LogIn, Menu, UserRound, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { BrandLogo } from '@/components/brand-logo';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useAuth } from '@/lib/auth/auth-context';

/* ─── Top utility bar (above main header) ─────────────────────────────────── */
const topLinks = [{ label: 'Hỗ trợ', href: '/support', icon: HelpCircle }] as const;

/* ─── Main navigation tabs ────────────────────────────────────────────────── */
const mainNav = [
  { label: 'Khách sạn', href: '/hotels' },
  { label: 'Vé máy bay', href: '/flights' },
  { label: 'Tour du lịch', href: '/tours' },
  { label: 'Hoạt động', href: '/experiences' },
  { label: 'Bản đồ', href: '/map' },
  { label: 'Ưu đãi', href: '/explore' },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout: _logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-tv-header">
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="border-b border-tv-border bg-white">
        <div className="mx-auto flex h-9 max-w-[1200px] items-center justify-between px-4">
          {/* Left: brand tagline */}
          <span className="hidden text-tv-xs text-tv-ink-3 md:block">
            Nền tảng đặt tour du lịch Việt Nam &amp; quốc tế
          </span>

          {/* Right: utility links */}
          <div className="flex items-center gap-4 ml-auto">
            {topLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="inline-flex items-center gap-1 text-tv-xs text-tv-ink-3 hover:text-tv-blue transition-colors"
              >
                <Icon size={13} />
                {label}
              </Link>
            ))}

            <LanguageSwitcher />

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link href="/notifications" className="relative text-tv-ink-3 hover:text-tv-blue">
                  <Bell size={16} />
                </Link>
                <div className="flex items-center gap-1 cursor-pointer text-tv-xs font-semibold text-tv-ink-2 hover:text-tv-blue">
                  <UserRound size={14} />
                  <span className="max-w-[100px] truncate">{user?.fullName ?? user?.email}</span>
                  <ChevronDown size={12} />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 rounded-tv-sm border border-tv-blue px-3 py-1 text-tv-xs font-bold text-tv-blue hover:bg-tv-blue-light transition-colors"
                >
                  <LogIn size={12} />
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center rounded-tv-sm bg-tv-blue px-3 py-1 text-tv-xs font-bold text-white hover:bg-tv-blue-dark transition-colors"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Main header ─────────────────────────────────────────────────── */}
      <div className="bg-white">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-6 px-4">
          {/* Logo */}
          <BrandLogo />

          {/* Nav tabs — desktop */}
          <nav className="hidden flex-1 items-center md:flex" aria-label="Điều hướng chính">
            {mainNav.map(({ label, href }) => {
              const active = pathname === href || pathname.startsWith(href + '/');
              return (
                <Link
                  key={label}
                  href={href}
                  className={`relative inline-flex h-14 items-center px-3 text-tv-base font-semibold transition-colors whitespace-nowrap
                    ${
                      active
                        ? 'text-tv-blue after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-tv-blue after:rounded-t'
                        : 'text-tv-ink-2 hover:text-tv-blue'
                    }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            className="ml-auto rounded-tv-sm border border-tv-border p-2 text-tv-ink-3 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ─────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="border-t border-tv-border bg-white shadow-tv-modal md:hidden">
          <nav className="flex flex-col py-2">
            {mainNav.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-4 py-3 text-tv-base font-semibold text-tv-ink-2 hover:bg-tv-blue-light hover:text-tv-blue"
              >
                {label}
              </Link>
            ))}
            <hr className="my-2 border-tv-border" />
            {!isAuthenticated && (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-tv-base font-bold text-tv-blue"
                >
                  <LogIn size={16} /> Đăng nhập
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="mx-4 mb-2 flex items-center justify-center rounded-tv bg-tv-blue py-2.5 text-tv-base font-bold text-white"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
