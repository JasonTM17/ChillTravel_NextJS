import Link from "next/link";
import {
  BadgePercent,
  Car,
  HelpCircle,
  Hotel,
  LayoutDashboard,
  Map,
  Plane,
  Route,
  Sparkles,
  Ticket
} from "lucide-react";

const utilityNav = [
  ["Deals", "/"],
  ["Support", "/chat"],
  ["Bookings", "/booking/demo"]
] as const;

const productNav = [
  ["Hotels", "/hotels", Hotel],
  ["Flights", "/explore?q=flight", Plane],
  ["Things to Do", "/experiences", Ticket],
  ["Car Rental", "/map", Car],
  ["AI Planner", "/ai-planner", Route],
  ["Admin", "/admin", LayoutDashboard]
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#d9ecfb] bg-white/94 text-[#071827] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-2 text-xs font-bold text-[#476273] md:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="VietWander home">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#0277d4] font-black text-white">VW</span>
          <span className="font-black text-[#071827]">VIETWANDER AI</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Utility navigation">
          {utilityNav.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-lg px-3 py-2 transition hover:bg-[#eef7ff] hover:text-[#0277d4]">
              {label}
            </Link>
          ))}
          <Link href="/login" className="inline-flex items-center gap-1 rounded-lg px-3 py-2 transition hover:bg-[#eef7ff] hover:text-[#0277d4]">
            <HelpCircle size={14} aria-hidden="true" />
            Log In
          </Link>
          <Link href="/register" className="rounded-lg bg-[#0277d4] px-3 py-2 font-black text-white transition hover:bg-[#005ea8]">
            Register
          </Link>
        </nav>
      </div>
      <nav className="mx-auto flex max-w-[1440px] items-center gap-2 overflow-x-auto px-4 pb-3 md:px-8" aria-label="Product navigation">
        {productNav.map(([label, href, Icon]) => (
          <Link
            key={href}
            href={href}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#d9ecfb] bg-[#f7fbff] px-3 py-2 text-sm font-black text-[#16384f] transition hover:border-[#0277d4] hover:bg-white hover:text-[#0277d4] focus:outline-none focus:ring-2 focus:ring-[#0277d4]/30"
          >
            <Icon size={17} aria-hidden="true" />
            {label}
          </Link>
        ))}
        <Link
          href="/chat"
          className="ml-auto hidden shrink-0 items-center gap-2 rounded-xl bg-[#071827] px-4 py-2 text-sm font-black text-white transition hover:bg-[#0f2c3f] md:inline-flex"
        >
          <Sparkles size={16} aria-hidden="true" />
          Concierge
        </Link>
        <Link
          href="/booking/demo"
          className="hidden shrink-0 items-center gap-2 rounded-xl bg-[#fff3e8] px-4 py-2 text-sm font-black text-[#b45309] md:inline-flex"
        >
          <BadgePercent size={16} aria-hidden="true" />
          Mock deals
        </Link>
      </nav>
    </header>
  );
}
