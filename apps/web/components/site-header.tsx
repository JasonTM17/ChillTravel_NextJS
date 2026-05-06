import Link from "next/link";
import { Compass, LayoutDashboard, Map, Plane, Route, WalletCards } from "lucide-react";

const nav = [
  ["Explore", "/explore", Compass],
  ["Planner", "/ai-planner", Route],
  ["Budget", "/budget", WalletCards],
  ["Map", "/map", Map],
  ["Booking", "/booking/demo", Plane],
  ["Admin", "/admin", LayoutDashboard]
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e9dfd0] bg-[#fdf9f0]/92 text-[#071827] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3" aria-label="Primary navigation">
        <Link href="/" className="flex items-center gap-3" aria-label="VietWander home">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#071827] text-sm font-black tracking-normal text-white">
            VW
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-black tracking-[0.18em]">VIETWANDER</span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#687983]">Travel intelligence</span>
          </span>
        </Link>
        <div className="hidden items-center gap-1 lg:flex">
          {nav.map(([label, href, Icon]) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#40515d] transition hover:bg-white hover:text-[#071827] focus:outline-none focus:ring-2 focus:ring-[#f97316]"
            >
              <Icon size={16} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </div>
        <Link
          href="/chat"
          className="hidden rounded-lg bg-[#0f766e] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#0a625c] focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 md:inline-flex"
        >
          Ask concierge
        </Link>
      </nav>
    </header>
  );
}
