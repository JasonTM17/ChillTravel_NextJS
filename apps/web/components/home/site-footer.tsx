'use client';

import { Facebook, Instagram, ShieldCheck, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';
import type { TranslationNamespace } from '@/lib/i18n/types';

export function SiteFooter({ t }: { t: TranslationNamespace }) {
  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="mx-auto max-w-[1200px] px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-xl font-extrabold text-white">WanderViet</p>
            <p className="mt-2 text-[12px] leading-relaxed text-white/50">
              Nền tảng đặt tour du lịch Việt Nam & quốc tế. Tìm kiếm, so sánh và đặt chỗ dễ dàng.
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-[11px] text-white/40">
              <ShieldCheck size={12} />
              {t.home.safePaymentDesc}
            </div>
            <div className="mt-4 flex items-center gap-3">
              {[
                { icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
                { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
                { icon: Youtube, label: 'YouTube', href: 'https://youtube.com' },
                { icon: Twitter, label: 'Twitter', href: 'https://x.com' },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-[#0064D2] hover:text-white"
                  aria-label={label}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: t.home.services,
              links: [
                { label: 'Tour du lịch', href: '/tours' },
                { label: 'Khách sạn', href: '/hotels' },
                { label: 'Vé máy bay', href: '/flights' },
                { label: 'Trải nghiệm', href: '/experiences' },
                { label: 'AI Planner', href: '/ai-planner' },
              ],
            },
            {
              title: t.home.support,
              links: [
                { label: 'Trung tâm hỗ trợ', href: '/support' },
                { label: 'Chính sách hoàn tiền', href: '/support' },
                { label: 'Điều khoản sử dụng', href: '/support' },
                { label: 'Blog du lịch', href: '/blog' },
              ],
            },
            {
              title: t.home.account,
              links: [
                { label: t.nav.login, href: '/login' },
                { label: t.nav.register, href: '/register' },
                { label: t.nav.myBookings, href: '/my-bookings' },
                { label: t.nav.wishlist, href: '/wishlist' },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <p className="mb-4 text-[12px] font-bold uppercase tracking-wider text-white/70">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="text-[12px] text-white/45 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Download app */}
        <div className="mt-10 border-t border-white/10 pt-8">
          <p className="mb-3 text-[12px] font-bold uppercase tracking-wider text-white/70">
            {t.home.downloadApp}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 text-[12px] font-medium text-white/70 transition-colors hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              App Store
            </a>
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 text-[12px] font-medium text-white/70 transition-colors hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.3 2.3-8.636-8.632z" />
              </svg>
              Google Play
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-white/10 pt-6 flex flex-col items-center gap-2 md:flex-row md:justify-between">
          <p className="text-[11px] text-white/30">© 2026 WanderViet. All rights reserved.</p>
          <p className="text-[11px] text-white/30">
            Built with Next.js 16 · NestJS 11 · Prisma 7 · PostgreSQL
          </p>
        </div>
      </div>
    </footer>
  );
}
