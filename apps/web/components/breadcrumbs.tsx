import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-tv-ink-3">
      <Link
        href="/"
        className="inline-flex items-center gap-1 hover:text-tv-blue"
        aria-label="Trang chủ"
      >
        <Home size={14} aria-hidden="true" />
      </Link>
      {items.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-1">
          <ChevronRight size={14} aria-hidden="true" />
          {item.href ? (
            <Link href={item.href} className="hover:text-tv-blue font-medium">
              {item.label}
            </Link>
          ) : (
            <span className="font-bold text-tv-ink dark:text-[#eaf7ff]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
