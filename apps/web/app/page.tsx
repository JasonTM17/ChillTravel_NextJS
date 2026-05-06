import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BadgePercent,
  Bus,
  CalendarDays,
  Car,
  CheckCircle2,
  ChevronRight,
  Hotel,
  MapPin,
  Plane,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Ticket,
  Users,
  WalletCards
} from "lucide-react";
import { destinations } from "@vietwander/shared";
import type { Destination } from "@vietwander/shared";
import { getDestinationCopy } from "@/lib/destination-copy";
import { getDestinationImage } from "@/lib/destination-images";
import { formatVnd } from "@/lib/utils";
import { demoPaymentWarning, formatDateVi } from "@/lib/vietnamese";

const serviceTabs = [
  ["Khách sạn", "/hotels", Hotel, true],
  ["Chuyến bay", "/explore?q=Chuyen bay", Plane, false],
  ["Hoạt động", "/experiences", Ticket, false],
  ["Xe đưa đón", "/map", Bus, false],
  ["Thuê xe", "/map", Car, false],
  ["Lập lịch trình thông minh", "/ai-planner", Sparkles, false]
] as const;

const coupons = [
  ["VWD-DANANG", "Đà Nẵng cuối tuần", "Ưu đãi demo cho khách sạn gần biển", "Giảm mẫu 12%"],
  ["FOOD-HOIAN", "Hội An ăn gì", "Gợi ý tour ẩm thực và phố cổ", "Bán chạy"],
  ["FAMILY-PQ", "Phú Quốc gia đình", "Lịch trình nhẹ, resort và bãi biển", "Gói mẫu"],
  ["SAPA-VIEW", "Sapa săn mây", "Homestay, ruộng bậc thang, trekking", "Đề xuất"]
] as const;

export default function HomePage() {
  const vietnam = destinations.filter((item) => item.tags.includes("Vietnam")).slice(0, 6);
  const world = destinations.filter((item) => item.tags.includes("World")).slice(0, 4);
  const featured = [destinations.find((item) => item.slug === "da-nang"), destinations.find((item) => item.slug === "phu-quoc"), destinations.find((item) => item.slug === "hoi-an")].filter(Boolean) as Destination[];

  return (
    <main className="min-h-screen bg-[#f6fbff] text-[#071827]">
      <BookingHero />
      <CouponStrip />
      <section className="mx-auto grid max-w-[1180px] gap-6 px-4 py-8 lg:grid-cols-[1fr_330px]">
        <div className="space-y-8">
          <DestinationGrid title="Điểm đến đang thịnh hành" subtitle="Ảnh thật, thông tin mẫu local, phù hợp để demo flow booking." items={vietnam.slice(0, 3)} />
          <DealRows title="Gợi ý lưu trú và trải nghiệm" items={featured} />
          <DestinationGrid title="Bạn có thể thích" subtitle="Các tuyến quốc tế dùng dữ liệu mẫu, không thay thế nguồn chính thức." items={world} compact />
        </div>
        <TripPlannerPanel />
      </section>
      <TrustBand />
    </main>
  );
}

function BookingHero() {
  return (
    <section className="border-b border-[#d9ecfb] bg-white">
      <div className="mx-auto max-w-[1180px] px-4 pb-10 pt-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-[#eef7ff] px-3 py-1 text-xs font-black text-[#0277d4]">
              <ShieldCheck size={14} aria-hidden="true" />
              Nền tảng du lịch Việt hóa, thanh toán demo an toàn
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight md:text-5xl">
              Tìm chuyến đi, so sánh lựa chọn và đặt chỗ demo trong một luồng rõ ràng.
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#476273]">
              ChillTravel gom điểm đến, khách sạn mẫu, hoạt động, ngân sách và lịch trình thông minh local vào một giao diện đặt chuyến quen tay cho người Việt.
            </p>
          </div>
          <div className="hidden rounded-[28px] bg-[#eaf7ff] p-3 lg:block">
            <div className="min-h-[220px] rounded-[22px] bg-cover bg-center shadow-[0_20px_46px_rgba(2,68,120,0.18)]" style={{ backgroundImage: `linear-gradient(180deg, rgba(7,24,39,0.04), rgba(7,24,39,0.2)), url(${getDestinationImage("da-nang")})` }} />
          </div>
        </div>

        <div className="relative z-10 mt-7 rounded-[28px] bg-[#1f9be0] p-4 shadow-[0_22px_54px_rgba(2,119,212,0.24)]">
          <div className="flex gap-2 overflow-x-auto pb-4">
            {serviceTabs.map(([label, href, Icon, active]) => (
              <Link
                key={label}
                href={href}
                className={`inline-flex shrink-0 items-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition ${
                  active ? "bg-white text-[#0277d4] shadow-sm" : "bg-[#0c83c9] text-white/92 hover:bg-white/16"
                }`}
              >
                <Icon size={18} aria-hidden="true" />
                {label}
              </Link>
            ))}
          </div>

          <form action="/explore" className="grid gap-3 rounded-[22px] bg-white p-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_64px]">
            <SearchInput />
            <HeroField icon={CalendarDays} label="Nhận phòng" value={formatDateVi(new Date("2026-08-12"))} />
            <HeroField icon={CalendarDays} label="Trả phòng" value={formatDateVi(new Date("2026-08-16"))} />
            <HeroField icon={Users} label="Khách và phòng" value="2 khách, 1 phòng" />
            <button className="flex min-h-14 items-center justify-center rounded-2xl bg-[#ff6d1a] text-white transition hover:bg-[#e95c0a]" type="submit" aria-label="Tìm kiếm">
              <Search size={24} aria-hidden="true" />
            </button>
          </form>

          <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
            {["Đà Nẵng", "Phú Quốc", "Hội An", "Sapa", "Tokyo"].map((item) => (
              <Link key={item} href={`/explore?q=${encodeURIComponent(item)}`} className="rounded-full bg-white/16 px-3 py-1.5 text-white transition hover:bg-white hover:text-[#0277d4]">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SearchInput() {
  return (
    <label className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#d9ecfb] bg-[#f7fbff] px-4 py-3">
      <MapPin size={20} className="shrink-0 text-[#0277d4]" aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-bold text-[#6f8594]">Bạn muốn đi đâu?</span>
        <input name="q" defaultValue="Đà Nẵng" className="mt-1 w-full bg-transparent text-lg font-black text-[#071827] outline-none" />
      </span>
    </label>
  );
}

function HeroField({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#d9ecfb] bg-white px-4 py-3">
      <Icon size={20} className="shrink-0 text-[#0277d4]" aria-hidden="true" />
      <span className="min-w-0">
        <span className="block text-xs font-bold text-[#6f8594]">{label}</span>
        <span className="mt-1 block truncate font-black">{value}</span>
      </span>
    </div>
  );
}

function CouponStrip() {
  return (
    <section className="mx-auto max-w-[1180px] px-4 pt-7">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0277d4]">Ưu đãi mẫu</p>
          <h2 className="mt-1 text-2xl font-black">Mã demo cho chuyến đi phổ biến</h2>
        </div>
        <Link href="/booking/demo" className="hidden items-center gap-1 text-sm font-black text-[#0277d4] md:inline-flex">
          Xem ưu đãi
          <ChevronRight size={17} aria-hidden="true" />
        </Link>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {coupons.map(([code, title, description, badge]) => (
          <Link key={code} href="/booking/demo" className="rounded-2xl border border-[#d9ecfb] bg-white p-4 shadow-[0_12px_30px_rgba(2,68,120,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(2,68,120,0.12)]">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-xl bg-[#eef7ff] px-3 py-1 text-xs font-black text-[#0277d4]">{code}</span>
              <span className="rounded-full bg-[#fff3e8] px-2.5 py-1 text-[11px] font-black text-[#b45309]">{badge}</span>
            </div>
            <h3 className="mt-3 font-black">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-[#476273]">{description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function DestinationGrid({ title, subtitle, items, compact = false }: { title: string; subtitle: string; items: Destination[]; compact?: boolean }) {
  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black">{title}</h2>
          <p className="mt-1 text-sm text-[#476273]">{subtitle}</p>
        </div>
        <Link href="/explore" className="hidden rounded-xl border border-[#d9ecfb] bg-white px-4 py-2 text-sm font-black text-[#0277d4] md:inline-flex">
          Xem tất cả
        </Link>
      </div>
      <div className={`mt-4 grid gap-4 ${compact ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
        {items.map((destination) => (
          <DestinationTile key={destination.slug} destination={destination} compact={compact} />
        ))}
      </div>
    </section>
  );
}

function DestinationTile({ destination, compact }: { destination: Destination; compact?: boolean }) {
  const copy = getDestinationCopy(destination);
  return (
    <Link href={`/destinations/${destination.slug}`} className="group overflow-hidden rounded-2xl border border-[#d9ecfb] bg-white shadow-[0_14px_34px_rgba(2,68,120,0.08)] transition hover:-translate-y-1">
      <div className={`${compact ? "h-36" : "h-44"} bg-cover bg-center`} style={{ backgroundImage: `url(${getDestinationImage(destination.slug)})` }} />
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-black group-hover:text-[#0277d4]">{copy.name}</h3>
          <span className="inline-flex items-center gap-1 text-sm font-black text-[#b45309]">
            <Star size={14} fill="currentColor" aria-hidden="true" />
            {destination.ratingAvg.toFixed(1)}
          </span>
        </div>
        <p className="mt-1 text-sm text-[#476273]">{copy.country}</p>
      </div>
    </Link>
  );
}

function DealRows({ title, items }: { title: string; items: Destination[] }) {
  return (
    <section>
      <h2 className="text-2xl font-black">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.map((destination) => {
          const copy = getDestinationCopy(destination);
          return (
            <article key={destination.slug} className="grid overflow-hidden rounded-2xl border border-[#d9ecfb] bg-white shadow-[0_14px_34px_rgba(2,68,120,0.08)] md:grid-cols-[180px_minmax(0,1fr)_190px]">
              <div className="min-h-40 bg-cover bg-center" style={{ backgroundImage: `url(${getDestinationImage(destination.slug)})` }} />
              <div className="p-4">
                <p className="text-xs font-black text-[#0277d4]">Có thể đặt chỗ demo</p>
                <h3 className="mt-1 text-xl font-black">{copy.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#476273]">{copy.summary}</p>
                <p className="mt-2 text-xs font-bold text-[#0f8b7b]">Hủy demo miễn phí · Gói offline · tro ly lap lich local</p>
              </div>
              <div className="flex flex-col justify-between border-t border-[#edf4fa] bg-[#fbfdff] p-4 md:border-l md:border-t-0">
                <div>
                  <p className="text-xs font-bold text-[#6f8594]">Giá từ</p>
                  <p className="text-xl font-black text-[#ff5f12]">{formatVnd(destination.budgetMin)}</p>
                </div>
                <Link href={`/booking/${destination.slug}`} className="mt-3 inline-flex items-center justify-center rounded-xl bg-[#ff6d1a] px-4 py-2.5 text-sm font-black text-white">
                  Xem ưu đãi
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function TripPlannerPanel() {
  return (
    <aside className="h-fit rounded-3xl border border-[#d9ecfb] bg-white p-5 shadow-[0_16px_42px_rgba(2,68,120,0.1)] lg:sticky lg:top-24">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-[#eef7ff] p-3 text-[#0277d4]">
          <Sparkles size={24} aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[#0277d4]">Giỏ chuyến đi</p>
          <h2 className="text-xl font-black">Đà Nẵng 4 ngày</h2>
        </div>
      </div>
      <div className="mt-5 space-y-3 text-sm">
        <PanelRow label="Ngân sách/ngày" value={formatVnd(4500000)} />
        <PanelRow label="Lịch trình" value="Biển · Ẩm thực · Văn hóa" />
        <PanelRow label="Thanh toán" value="Demo local" />
      </div>
      <Link href="/ai-planner?destination=da-nang" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0277d4] px-4 py-3 font-black text-white">
        Lập lịch trình thông minh
        <ChevronRight size={18} aria-hidden="true" />
      </Link>
      <p className="mt-3 rounded-2xl bg-[#fff3e8] p-3 text-xs font-bold leading-5 text-[#b45309]">{demoPaymentWarning}</p>
    </aside>
  );
}

function PanelRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#edf4fa] pb-3">
      <span className="font-bold text-[#476273]">{label}</span>
      <span className="text-right font-black">{value}</span>
    </div>
  );
}

function TrustBand() {
  return (
    <section className="mt-8 border-t border-[#d9ecfb] bg-white px-4 py-8">
      <div className="mx-auto grid max-w-[1180px] gap-4 md:grid-cols-3">
        {[
          ["Thanh toán demo", "Không phát sinh giao dịch thật, không lưu thẻ thật."],
          ["Trợ lý local-first", "Chatbot runtime dùng local service/RAG, không yêu cầu khóa cloud."],
          ["Dữ liệu mẫu", "Không khẳng định vé bay, visa hoặc thời tiết real-time."]
        ].map(([title, text]) => (
          <div key={title} className="flex gap-3 rounded-2xl bg-[#f7fbff] p-4">
            <CheckCircle2 className="mt-0.5 shrink-0 text-[#0f8b7b]" size={20} aria-hidden="true" />
            <div>
              <h3 className="font-black">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-[#476273]">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
