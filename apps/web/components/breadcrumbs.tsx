import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1 text-sm text-[#6f8594]"
    >
      <Link
        href="/"
        className="inline-flex items-center gap-1 hover:text-[#0277d4]"
        aria-label="Trang chủ"
      >
        <Home size={14} aria-hidden="true" />
      </Link>
      {items.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-1">
          <ChevronRight size={14} aria-hidden="true" />
          {item.href ? (
            <Link href={item.href} className="hover:text-[#0277d4] font-medium">
              {item.label}
            </Link>
          ) : (
            <span className="font-bold text-[#071827] dark:text-[#eaf7ff]">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
