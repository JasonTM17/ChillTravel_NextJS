import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { demoPaymentWarning } from "@/lib/vietnamese";

export function CommerceSurface({ children, className = "", ...props }: React.ComponentPropsWithoutRef<"section">) {
  return (
    <section {...props} className={cn("rounded-2xl border border-[#d9ecfb] bg-white p-5 shadow-[0_16px_42px_rgba(2,68,120,0.08)]", className)}>
      {children}
    </section>
  );
}

export function TrustBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("rounded-2xl border border-[#ffd9bd] bg-[#fff7ed] text-[#9a3412]", compact ? "p-3 text-xs" : "p-4 text-sm")}>
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 shrink-0" size={compact ? 16 : 20} aria-hidden="true" />
        <div>
          <p className="font-black">{demoPaymentWarning}</p>
          {!compact ? <p className="mt-1 font-bold leading-6">Không lưu thẻ thật, không phát sinh giao dịch thật, dữ liệu giá/chỗ trống là mẫu local.</p> : null}
        </div>
      </div>
    </div>
  );
}

export function ServiceActionCard({ icon: Icon, title, description, href, tone = "blue" }: { icon: LucideIcon; title: string; description: string; href: string; tone?: "blue" | "orange" | "teal" }) {
  const tones = {
    blue: "bg-[#eef7ff] text-[#0277d4]",
    orange: "bg-[#fff3e8] text-[#b45309]",
    teal: "bg-[#e8fbf6] text-[#0f766e]"
  } as const;

  return (
    <Link href={href} className="group rounded-2xl border border-[#d9ecfb] bg-white p-5 shadow-[0_12px_30px_rgba(2,68,120,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(2,68,120,0.12)]">
      <div className={cn("inline-flex rounded-2xl p-3", tones[tone])}>
        <Icon size={22} aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-lg font-black text-[#071827] group-hover:text-[#0277d4]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#476273]">{description}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-black text-[#0277d4]">
        Xem chi tiết
        <ArrowRight size={15} aria-hidden="true" />
      </span>
    </Link>
  );
}

export function CommerceMetric({ label, value, helper, tone = "blue" }: { label: string; value: string; helper: string; tone?: "blue" | "orange" | "teal" }) {
  const color = tone === "orange" ? "text-[#f97316]" : tone === "teal" ? "text-[#0f8b7b]" : "text-[#0277d4]";
  return (
    <div className="rounded-2xl border border-[#d9ecfb] bg-white p-5 shadow-[0_12px_30px_rgba(2,68,120,0.06)]">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6f8594]">{label}</p>
      <p className={cn("mt-2 text-3xl font-black", color)}>{value}</p>
      <p className="mt-2 text-sm font-bold leading-6 text-[#476273]">{helper}</p>
    </div>
  );
}

export function StatusPill({ children, tone = "blue" }: { children: React.ReactNode; tone?: "blue" | "orange" | "teal" | "gray" }) {
  const tones = {
    blue: "bg-[#eef7ff] text-[#0277d4]",
    orange: "bg-[#fff3e8] text-[#b45309]",
    teal: "bg-[#e8fbf6] text-[#0f766e]",
    gray: "bg-[#f3f7fb] text-[#476273]"
  } as const;
  return <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-black", tones[tone])}>{children}</span>;
}

export function OpsTable({ rows }: { rows: Array<{ name: string; detail: string; status: string; owner: string; tone?: "blue" | "orange" | "teal" | "gray" }> }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#d9ecfb] bg-white">
      <div className="hidden grid-cols-[1.4fr_1fr_1fr_0.9fr] gap-3 border-b border-[#edf4fa] bg-[#f7fbff] px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-[#6f8594] md:grid">
        <span>Hạng mục</span>
        <span>Trạng thái</span>
        <span>Phụ trách</span>
        <span>Hành động</span>
      </div>
      {rows.map((row) => (
        <div key={row.name} className="grid gap-3 border-b border-[#edf4fa] px-4 py-4 text-sm last:border-b-0 md:grid-cols-[1.4fr_1fr_1fr_0.9fr]">
          <div>
            <p className="font-black text-[#071827]">{row.name}</p>
            <p className="mt-1 leading-5 text-[#476273]">{row.detail}</p>
          </div>
          <div>
            <StatusPill tone={row.tone}>{row.status}</StatusPill>
          </div>
          <p className="font-bold text-[#476273]">
            <span className="text-xs uppercase tracking-[0.12em] text-[#6f8594] md:hidden">Phụ trách: </span>
            {row.owner}
          </p>
          <button type="button" className="w-full rounded-xl border border-[#d9ecfb] bg-white px-3 py-2 text-xs font-black text-[#0277d4] transition hover:bg-[#eef7ff] md:w-auto">
            Mở
          </button>
        </div>
      ))}
    </div>
  );
}

export function BoundaryList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 rounded-xl bg-[#f7fbff] p-3 text-sm font-bold leading-6 text-[#34566f]">
          <CheckCircle2 className="mt-0.5 shrink-0 text-[#0f8b7b]" size={17} aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}
