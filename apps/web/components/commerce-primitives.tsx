import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { demoPaymentWarning } from "@/lib/vietnamese";

/* ─── Surface card ──────────────────────────────────────────────────────────── */
export function CommerceSurface({
  children,
  className = "",
  ...props
}: React.ComponentPropsWithoutRef<"section">) {
  return (
    <section
      {...props}
      className={cn(
        "rounded-tv bg-white border border-tv-border shadow-tv-card p-5",
        className
      )}
    >
      {children}
    </section>
  );
}

/* ─── Demo payment trust banner ─────────────────────────────────────────────── */
export function TrustBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-tv border border-amber-200 bg-amber-50 text-amber-800",
        compact ? "p-3 text-tv-xs" : "p-4 text-tv-sm"
      )}
    >
      <div className="flex items-start gap-2.5">
        <ShieldCheck
          className="mt-0.5 shrink-0 text-amber-600"
          size={compact ? 14 : 18}
          aria-hidden="true"
        />
        <div>
          <p className="font-bold">{demoPaymentWarning}</p>
          {!compact && (
            <p className="mt-1 leading-5 text-amber-700">
              Không lưu thẻ thật, không phát sinh giao dịch thật.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Service action card ────────────────────────────────────────────────────── */
export function ServiceActionCard({
  icon: Icon,
  title,
  description,
  href,
  tone = "blue",
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  tone?: "blue" | "orange" | "teal";
}) {
  const tones = {
    blue: "bg-tv-blue-light text-tv-blue",
    orange: "bg-tv-orange-light text-tv-orange-dark",
    teal: "bg-emerald-50 text-emerald-700",
  } as const;

  return (
    <Link
      href={href}
      className="group tv-card block p-5 hover:shadow-tv-hover transition-all"
    >
      <div className={cn("inline-flex rounded-tv-sm p-3", tones[tone])}>
        <Icon size={22} aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-tv-md font-bold text-tv-ink group-hover:text-tv-blue transition-colors">
        {title}
      </h3>
      <p className="mt-1.5 text-tv-sm leading-relaxed text-tv-ink-3">{description}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-tv-sm font-bold text-tv-blue">
        Xem chi tiết
        <ArrowRight size={14} aria-hidden="true" />
      </span>
    </Link>
  );
}

/* ─── Metric card ────────────────────────────────────────────────────────────── */
export function CommerceMetric({
  label,
  value,
  helper,
  tone = "blue",
}: {
  label: string;
  value: string;
  helper: string;
  tone?: "blue" | "orange" | "teal";
}) {
  const color =
    tone === "orange"
      ? "text-tv-orange"
      : tone === "teal"
      ? "text-emerald-600"
      : "text-tv-blue";
  return (
    <div className="tv-card p-5">
      <p className="text-tv-xs font-bold uppercase tracking-widest text-tv-ink-3">{label}</p>
      <p className={cn("mt-2 text-3xl font-bold", color)}>{value}</p>
      <p className="mt-1.5 text-tv-sm leading-relaxed text-tv-ink-3">{helper}</p>
    </div>
  );
}

/* ─── Status pill ────────────────────────────────────────────────────────────── */
export function StatusPill({
  children,
  tone = "blue",
}: {
  children: React.ReactNode;
  tone?: "blue" | "orange" | "teal" | "gray";
}) {
  const tones = {
    blue: "bg-tv-blue-light text-tv-blue",
    orange: "bg-tv-orange-light text-tv-orange-dark",
    teal: "bg-emerald-50 text-emerald-700",
    gray: "bg-tv-bg text-tv-ink-3",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-tv-xs font-bold",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

/* ─── Ops table ──────────────────────────────────────────────────────────────── */
export function OpsTable({
  rows,
}: {
  rows: Array<{
    name: string;
    detail: string;
    status: string;
    owner: string;
    tone?: "blue" | "orange" | "teal" | "gray";
  }>;
}) {
  return (
    <div className="overflow-hidden rounded-tv border border-tv-border bg-white">
      <div className="hidden grid-cols-[1.4fr_1fr_1fr_0.9fr] gap-3 border-b border-tv-border bg-tv-bg px-4 py-3 text-tv-xs font-bold uppercase tracking-widest text-tv-ink-3 md:grid">
        <span>Hạng mục</span>
        <span>Trạng thái</span>
        <span>Phụ trách</span>
        <span>Hành động</span>
      </div>
      {rows.map((row) => (
        <div
          key={row.name}
          className="grid gap-3 border-b border-tv-border px-4 py-4 text-tv-sm last:border-b-0 md:grid-cols-[1.4fr_1fr_1fr_0.9fr]"
        >
          <div>
            <p className="font-bold text-tv-ink">{row.name}</p>
            <p className="mt-0.5 text-tv-ink-3">{row.detail}</p>
          </div>
          <div>
            <StatusPill tone={row.tone}>{row.status}</StatusPill>
          </div>
          <p className="text-tv-ink-2">
            <span className="text-tv-xs uppercase tracking-widest text-tv-ink-3 md:hidden">
              Phụ trách:{" "}
            </span>
            {row.owner}
          </p>
          <button
            type="button"
            className="w-full rounded-tv-sm border border-tv-border bg-white px-3 py-1.5 text-tv-xs font-bold text-tv-blue hover:bg-tv-blue-light transition-colors md:w-auto"
          >
            Mở
          </button>
        </div>
      ))}
    </div>
  );
}

/* ─── Boundary list ──────────────────────────────────────────────────────────── */
export function BoundaryList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-2.5 rounded-tv-sm bg-tv-bg p-3 text-tv-sm text-tv-ink-2"
        >
          <CheckCircle2
            className="mt-0.5 shrink-0 text-emerald-600"
            size={16}
            aria-hidden="true"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}
