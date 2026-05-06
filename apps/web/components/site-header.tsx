import Link from "next/link";
import { BookOpenText, Compass, LayoutDashboard, Map, Route } from "lucide-react";

const nav = [
  ["Explore", "/explore", Compass],
  ["Planner", "/ai-planner", Route],
  ["Map", "/map", Map],
  ["Dossiers", "/destinations/da-nang", BookOpenText],
  ["Admin", "/admin", LayoutDashboard]
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e0c0b1]/70 bg-[#fdf9f0]/88 text-[#071827] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3 md:px-8" aria-label="Primary navigation">
        <Link href="/" className="flex items-center gap-3" aria-label="VietWander home">
          <span className="grid h-11 w-11 place-items-center rounded-xl border border-[#e0c0b1] bg-[#071827] font-editorial text-base font-black text-white">
            VW
          </span>
          <span className="leading-tight">
            <span className="block font-editorial text-lg font-black">VietWander</span>
            <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-[#584237]">Editorial travel intelligence</span>
          </span>
        </Link>
        <div className="hidden items-center gap-1 lg:flex">
          {nav.map(([label, href, Icon]) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-[#584237] transition hover:bg-white hover:text-[#071827] focus:outline-none focus:ring-2 focus:ring-[#f97316]"
            >
              <Icon size={16} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </div>
        <Link
          href="/chat"
          className="hidden rounded-xl bg-[#071827] px-4 py-2 text-sm font-black text-white transition hover:bg-[#0f2c3f] focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 md:inline-flex"
        >
          Open concierge
        </Link>
      </nav>
    </header>
  );
}
