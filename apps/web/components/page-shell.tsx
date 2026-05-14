import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

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
    <main className="min-h-screen bg-[#F7F8FA]">
      {/* Page header */}
      <section className="border-b border-gray-100 bg-white px-4 py-6 md:px-6 md:py-8">
        <div className="mx-auto max-w-[1200px]">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav
              aria-label="Breadcrumb"
              className="mb-3 flex items-center gap-1 text-[11px] text-gray-500"
            >
              <Link href="/" className="hover:text-[#0064D2] transition-colors">
                Trang chủ
              </Link>
              {breadcrumbs.map((item, i) => (
                <span key={i} className="flex items-center gap-1">
                  <ChevronRight size={11} />
                  {item.href ? (
                    <Link href={item.href} className="hover:text-[#0064D2] transition-colors">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="font-semibold text-gray-700">{item.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#0064D2]">
            {eyebrow}
          </p>
          <h1 className="mt-1.5 text-xl font-extrabold text-gray-900 md:text-2xl">{title}</h1>
        </div>
      </section>

      {/* Page content */}
      <section className="mx-auto max-w-[1200px] px-4 py-6 md:px-6 md:py-8">{children}</section>
    </main>
  );
}
