import Link from "next/link";
import { Bot, Compass, LayoutDashboard, Map, Plane, Sparkles, WalletCards } from "lucide-react";

const nav = [
  ["Explore", "/explore", Compass],
  ["AI Planner", "/ai-planner", Bot],
  ["Personality", "/personality", Sparkles],
  ["Budget", "/budget", WalletCards],
  ["Map", "/map", Map],
  ["Booking", "/booking/demo", Plane],
  ["Admin", "/admin", LayoutDashboard]
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-navy/90 text-white backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3" aria-label="Primary navigation">
        <Link href="/" className="flex items-center gap-3 font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-teal">VW</span>
          <span>VIETWANDER AI</span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {nav.map(([label, href, Icon]) => (
            <Link key={href} href={href} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/82 hover:bg-white/10 hover:text-white">
              <Icon size={16} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
