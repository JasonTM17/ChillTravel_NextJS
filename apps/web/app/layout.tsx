import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { SiteHeader } from '@/components/site-header';
import { AuthProvider } from '@/lib/auth/auth-context';
import { LocaleProvider } from '@/lib/i18n';

/* ─── Load Be Vietnam Pro via next/font (self-hosted, no FOUT) ─────────────── */
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-be-vietnam-pro',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'WanderViet — Đặt tour du lịch Việt Nam & Quốc tế',
  description:
    'Nền tảng đặt tour du lịch Việt Nam và quốc tế. Tìm kiếm, so sánh và đặt chỗ dễ dàng với thanh toán demo an toàn.',
  metadataBase: new URL('https://wanderviet.local'),
  icons: {
    icon: '/brand/logo-mark-islands.png',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body>
        <AuthProvider>
          <LocaleProvider>
            <SiteHeader />
            {children}
            <MobileBottomNav />
          </LocaleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
