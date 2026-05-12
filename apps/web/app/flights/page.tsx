import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, BriefcaseBusiness, CalendarDays, Clock3, Plane, Search, ShieldCheck, Users } from "lucide-react";
import { demoPaymentWarning, flightOffers } from "@vietwander/shared";
import { CommerceSurface, StatusPill, TrustBanner } from "@/components/commerce-primitives";
import { PageShell } from "@/components/page-shell";
import { formatVnd } from "@/lib/utils";
import { formatDateVi } from "@/lib/vietnamese";

export default function FlightsPage() {
  return (
    <PageShell eyebrow="Vé máy bay mẫu" title="Tìm chuyến bay demo rõ giá, dễ so sánh và không dùng dữ liệu real-time">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
        <section className="space-y-5">
          <CommerceSurface className="bg-tv-blue text-white">
            <form action="/flights" className="grid gap-3 rounded-tv bg-white p-3 text-tv-ink lg:grid-cols-[1fr_1fr_1fr_1fr_132px]">
              <FlightField label="Từ" value="Hà Nội" icon={Plane} />
              <FlightField label="Đến" value="Đà Nẵng" icon={Plane} />
              <FlightField label="Ngày đi" value={formatDateVi(new Date("2026-08-12"))} icon={CalendarDays} />
              <FlightField label="Hành khách" value="2 người lớn" icon={Users} />
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-tv bg-tv-orange px-4 py-3 text-sm font-bold text-white">
                <Search size={18} aria-hidden="true" />
                Tìm kiếm
              </button>
            </form>
            <p className="mt-4 text-sm font-bold text-white/88">Giá vé bay là dữ liệu mẫu/local để trình diễn UX booking. Hãy kiểm tra hãng bay hoặc nguồn chính thức cho dữ liệu thật.</p>
          </CommerceSurface>

          <CommerceSurface>
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-tv-blue">Kết quả chuyến bay</p>
                <h2 className="mt-2 text-2xl font-bold">3 lựa chọn demo cho tuyến phổ biến</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Bay thẳng", "Có hành lý", "Giá thấp trước"].map((item) => (
                  <StatusPill key={item}>{item}</StatusPill>
                ))}
              </div>
            </div>
          </CommerceSurface>

          <div className="space-y-4">
            {flightOffers.map((offer) => (
              <article key={offer.id} className="grid overflow-hidden rounded-tv border border-tv-border bg-white shadow-tv-card md:grid-cols-[minmax(0,1fr)_220px]">
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill tone="blue">{offer.airline}</StatusPill>
                    {offer.badges.map((badge) => (
                      <StatusPill key={badge} tone={badge.includes("Không") ? "orange" : "teal"}>
                        {badge}
                      </StatusPill>
                    ))}
                  </div>
                  <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
                    <FlightTime city={offer.from} time={offer.departTime} />
                    <div className="text-center">
                      <p className="text-sm font-bold text-tv-ink-3">{offer.duration}</p>
                      <div className="my-2 h-px w-full min-w-24 bg-tv-border" />
                      <p className="text-xs font-bold text-tv-ink-3">{offer.stops}</p>
                    </div>
                    <FlightTime city={offer.to} time={offer.arriveTime} align="right" />
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2 text-sm font-bold text-tv-ink-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-tv-bg px-3 py-1.5">
                      <BriefcaseBusiness size={16} className="text-tv-blue" aria-hidden="true" />
                      {offer.baggage}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#fff3e8] px-3 py-1.5 text-[#b45309]">
                      <ShieldCheck size={16} aria-hidden="true" />
                      Không có dữ liệu real-time
                    </span>
                  </div>
                </div>
                <aside className="flex flex-col justify-between border-t border-tv-border bg-tv-bg p-5 md:border-l md:border-t-0">
                  <div>
                    <p className="text-xs font-bold text-tv-ink-3">Giá mẫu từ</p>
                    <p className="mt-1 text-2xl font-bold text-tv-orange">{formatVnd(offer.price)}</p>
                    <p className="mt-1 text-xs font-bold text-tv-ink-3">mỗi khách, mock fare</p>
                  </div>
                  <Link href="/booking/demo" className="mt-5 inline-flex items-center justify-center gap-2 rounded-tv-sm bg-tv-orange px-4 py-3 text-sm font-bold text-white">
                    Chọn chuyến demo
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </aside>
              </article>
            ))}
          </div>
        </section>

        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <TrustBanner compact />
          <CommerceSurface>
            <h2 className="text-xl font-bold">Cam kết dữ liệu</h2>
            <div className="mt-4 space-y-3 text-sm font-bold leading-6 text-tv-ink-3">
              <p>ChillTravel không khẳng định giá vé, chỗ trống, chính sách hành lý hoặc lịch bay theo thời gian thực.</p>
              <p>{demoPaymentWarning}. Mã vé và QR chỉ là mock cho portfolio.</p>
            </div>
          </CommerceSurface>
        </aside>
      </div>
    </PageShell>
  );
}

function FlightField({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <label className="flex min-w-0 items-center gap-3 rounded-tv border border-tv-border bg-tv-bg px-4 py-3">
      <Icon size={18} className="shrink-0 text-tv-blue" aria-hidden="true" />
      <span className="min-w-0">
        <span className="block text-xs font-bold text-tv-ink-3">{label}</span>
        <input defaultValue={value} className="mt-1 w-full bg-transparent font-bold outline-none" />
      </span>
    </label>
  );
}

function FlightTime({ city, time, align = "left" }: { city: string; time: string; align?: "left" | "right" }) {
  return (
    <div className={align === "right" ? "text-left md:text-right" : ""}>
      <p className="flex items-center gap-2 text-2xl font-bold md:block">
        <Clock3 className="text-tv-blue md:hidden" size={18} aria-hidden="true" />
        {time}
      </p>
      <p className="mt-1 text-sm font-bold text-tv-ink-3">{city}</p>
    </div>
  );
}
