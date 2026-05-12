import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageShellProps {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export function PageShell({ title, eyebrow, children, breadcrumbs }: PageShellProps) {
  return (
    <main className="min-h-screen bg-tv-bg text-tv-ink">
      {/* Page header */}
      <section className="border-b border-tv-border bg-white px-4 py-6 md:px-6 md:py-8">
        <div className="mx-auto max-w-[1200px]">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1 text-tv-xs text-tv-ink-3">
              <Link href="/" className="hover:text-tv-blue transition-colors">Trang chủ</Link>
              {breadcrumbs.map((item, i) => (
                <span key={i} className="flex items-center gap-1">
                  <ChevronRight size={12} />
                  {item.href ? (
                    <Link href={item.href} className="hover:text-tv-blue transition-colors">{item.label}</Link>
                  ) : (
                    <span className="text-tv-ink-2 font-semibold">{item.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          <p className="text-tv-xs font-bold uppercase tracking-widest text-tv-blue">{eyebrow}</p>
          <h1 className="mt-1.5 text-2xl font-bold text-tv-ink md:text-3xl">{title}</h1>
        </div>
      </section>

      {/* Page content */}
      <section className="mx-auto max-w-[1200px] px-4 py-6 md:px-6 md:py-8">
        {children}
      </section>
    </main>
  );
}
