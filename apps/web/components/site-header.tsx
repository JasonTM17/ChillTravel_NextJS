import Link from "next/link";
import { BadgePercent, Bell, Bookmark, CalendarCheck2, HelpCircle, LogIn, Menu } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

const utilityNav = [
  ["Ưu đãi", "/", BadgePercent],
  ["Đặt chỗ", "/booking/demo", CalendarCheck2],
  ["Đã lưu", "/wishlist", Bookmark],
  ["Hỗ trợ", "/chat", HelpCircle]
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e4eef6] bg-white text-[#071827]">
      <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between gap-4 px-4 md:px-6">
        <BrandLogo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Điều hướng chính">
          {utilityNav.map(([label, href, Icon]) => (
            <Link key={href} href={href} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-[#334e60] transition hover:bg-[#eef7ff] hover:text-[#0277d4]">
              <Icon size={17} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/profile" className="hidden rounded-xl border border-[#d9ecfb] p-2 text-[#476273] transition hover:bg-[#eef7ff] hover:text-[#0277d4] md:inline-flex" aria-label="Thông báo">
            <Bell size={18} aria-hidden="true" />
          </Link>
          <Link href="/login" className="hidden items-center gap-2 rounded-xl bg-[#0277d4] px-4 py-2.5 text-sm font-black text-white shadow-[0_10px_24px_rgba(2,119,212,0.22)] transition hover:bg-[#005ea8] md:inline-flex">
            <LogIn size={17} aria-hidden="true" />
            Đăng nhập
          </Link>
          <Link href="/register" className="hidden rounded-xl border border-[#d9ecfb] px-4 py-2.5 text-sm font-black text-[#0277d4] transition hover:bg-[#eef7ff] md:inline-flex">
            Đăng ký
          </Link>
          <button className="inline-flex rounded-xl border border-[#d9ecfb] p-2 text-[#476273] md:hidden" type="button" aria-label="Mở menu">
            <Menu size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
