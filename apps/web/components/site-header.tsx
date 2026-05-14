'use client';

import { Bell, ChevronDown, HelpCircle, LogIn, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { BrandLogo } from '@/components/brand-logo';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useAuth } from '@/lib/auth/auth-context';

const mainNav = [
  { label: 'Khách sạn', href: '/hotels' },
  { label: 'Vé máy bay', href: '/flights' },
  { label: 'Tour du lịch', href: '/tours' },
  { label: 'Hoạt động', href: '/experiences' },
  { label: 'Bản đồ', href: '/map' },
  { label: 'AI Planner', href: '/ai-planner' },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout: _logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      {/* Top bar */}
      <div className="border-b border-gray-100 bg-gray-50/80">
        <div className="mx-auto flex h-8 max-w-[1200px] items-center justify-between px-4">
          <span className="hidden text-[11px] text-gray-500 md:block">
            Nền tảng đặt tour du lịch Việt Nam & quốc tế
          </span>

          <div className="flex items-center gap-4 ml-auto">
            <Link
              href="/support"
              className="inline-flex items-center gap-1 text-[11px] text-gray-500 hover:text-[#0064D2] transition-colors"
            >
              <HelpCircle size={12} />
              Hỗ trợ
            </Link>

            <LanguageSwitcher />

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/notifications"
                  className="relative text-gray-500 hover:text-[#0064D2] transition-colors"
                >
                  <Bell size={15} />
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500" />
                </Link>
                <div className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-gray-700 hover:text-[#0064D2] transition-colors">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0064D2] text-[10px] font-bold text-white">
                    {(user?.fullName ?? user?.email ?? 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[80px] truncate hidden sm:inline">
                    {user?.fullName ?? user?.email}
                  </span>
                  <ChevronDown size={11} />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 rounded-lg border border-[#0064D2] px-3 py-1 text-[11px] font-bold text-[#0064D2] transition-colors hover:bg-blue-50"
                >
                  <LogIn size={11} />
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center rounded-lg bg-[#0064D2] px-3 py-1 text-[11px] font-bold text-white transition-colors hover:bg-[#004EA2]"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white">
        <div className="mx-auto flex h-12 max-w-[1200px] items-center gap-6 px-4">
          <BrandLogo />

          {/* Nav — desktop */}
          <nav className="hidden flex-1 items-center md:flex" aria-label="Điều hướng chính">
            {mainNav.map(({ label, href }) => {
              const active = pathname === href || pathname.startsWith(href + '/');
              return (
                <Link
                  key={label}
                  href={href}
                  className={`relative inline-flex h-12 items-center px-3 text-[13px] font-semibold transition-colors whitespace-nowrap
                    ${
                      active
                        ? 'text-[#0064D2] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-[2.5px] after:rounded-full after:bg-[#0064D2]'
                        : 'text-gray-600 hover:text-[#0064D2]'
                    }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white shadow-lg md:hidden">
          <nav className="flex flex-col py-2">
            {mainNav.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-4 py-3 text-[13px] font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#0064D2] transition-colors"
              >
                {label}
              </Link>
            ))}
            <hr className="my-2 border-gray-100" />
            {!isAuthenticated && (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-[13px] font-bold text-[#0064D2]"
                >
                  <LogIn size={15} /> Đăng nhập
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="mx-4 mb-2 flex items-center justify-center rounded-lg bg-[#0064D2] py-2.5 text-[13px] font-bold text-white"
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
