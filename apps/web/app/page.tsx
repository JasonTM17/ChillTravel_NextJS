import Link from "next/link";
import {
  ArrowRight,
  BadgePercent,
  CalendarDays,
  Car,
  CheckCircle2,
  Clock3,
  Hotel,
  Gift,
  Plane,
  Search,
  ShieldCheck,
  Sparkles,
  Ticket,
  Users,
  WalletCards
} from "lucide-react";
import { destinations } from "@vietwander/shared";
import { DestinationCard } from "@/components/destination-card";
import { getEditorialHeroImage, getExperienceDealImage, getStayDealImage } from "@/lib/destination-images";
import { formatVnd } from "@/lib/utils";
import { demoPaymentWarning, formatDateVi } from "@/lib/vietnamese";

const serviceTabs = [
  ["Khách sạn", "/hotels", Hotel, true],
  ["Chuyến bay", "/explore?q=Chuyen bay", Plane, false],
  ["Hoạt động", "/experiences", Ticket, false],
  ["Xe đưa đón", "/map", Car, false],
  ["Lập lịch trình AI", "/ai-planner", Sparkles, false]
] as const;

const quickSearches = ["Khách sạn Đà Nẵng", "Tour ẩm thực Hội An", "Phú Quốc cho gia đình", "Paris 5 ngày", "Homestay Sapa"];

export default function HomePage() {
  const vietnam = destinations.filter((item) => item.tags.includes("Vietnam")).slice(0, 6);
  const world = destinations.filter((item) => item.tags.includes("World")).slice(0, 4);

  return (
    <main className="booking-canvas min-h-screen text-[#071827]">
      <HeroSearch />
      <DealSection />
      <PromoStrip />
      <EnhanceTrip />
      <DestinationShelf title="Điểm đến Việt Nam đang được yêu thích" eyebrow="Phổ biến tại Việt Nam" items={vietnam} href="/explore?q=Vietnam" />
      <DestinationShelf title="Danh sách quốc tế cho chuyến đi sắp tới" eyebrow="Gợi ý thế giới" items={world} href="/explore?q=World" />
      <TrustSection />
    </main>
  );
}

function HeroSearch() {
  return (
    <section className="relative border-b border-[#d9ecfb] pb-16">
      <div
        className="booking-hero min-h-[420px] px-4 py-10 text-[#071827] md:px-8"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(234,247,255,0.96) 0%, rgba(234,247,255,0.72) 34%, rgba(234,247,255,0.08) 70%), url(${getEditorialHeroImage()})`
        }}
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-xl">
            <p className="inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[#0277d4]">
              Nền tảng đặt chuyến đi thông minh
            </p>
            <h1 className="mt-4 text-5xl font-black leading-[1.02] text-[#071827] md:text-6xl">
              Tìm, lên lịch trình và đặt chuyến đi trong vài phút.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-[#34566f]">
              VietWander gom khách sạn, hoạt động, ngân sách và lịch trình AI local-first vào một trải nghiệm booking tiếng Việt, rõ ràng và an toàn.
            </p>
          </div>
        </div>
      </div>

      <div className="relative mx-auto -mt-28 max-w-[1180px] px-4 md:px-8">
        <form action="/explore" className="booking-card-shadow rounded-2xl border border-[#d9ecfb] bg-white p-4 md:p-5">
          <div className="flex gap-2 overflow-x-auto pb-3">
            {serviceTabs.map(([label, href, Icon, active]) => (
              <Link
                key={label}
                href={href}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-3 text-sm font-black transition ${
                  active
                    ? "border-[#0277d4] bg-[#eef7ff] text-[#0277d4]"
                    : "border-[#e4eef6] bg-white text-[#476273] hover:border-[#0277d4] hover:text-[#0277d4]"
                }`}
              >
                <Icon size={18} aria-hidden="true" />
                {label}
              </Link>
            ))}
          </div>

          <div className="grid gap-3 border-t border-[#edf4fa] pt-4 lg:grid-cols-[1.25fr_1fr_1fr_1fr_auto]">
            <SearchField icon={Search} label="Bạn muốn đi đâu?" value="Đà Nẵng" name="q" />
            <StaticField icon={CalendarDays} label="Nhận phòng - Trả phòng" value={`${formatDateVi(new Date("2026-08-12"))} - ${formatDateVi(new Date("2026-08-16"))}`} />
            <StaticField icon={Users} label="Khách và phòng" value="2 người lớn, 1 phòng" />
            <StaticField icon={WalletCards} label="Ngân sách" value={`${formatVnd(4500000)} / ngày`} />
            <button className="rounded-xl bg-[#ff6d1a] px-6 py-4 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:bg-[#e95c0a] lg:min-w-[150px]">
              Tìm kiếm
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-[#edf4fa] pt-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {quickSearches.map((item) => (
                <Link key={item} href={`/explore?q=${encodeURIComponent(item)}`} className="rounded-full bg-[#f3f9ff] px-3 py-1.5 text-xs font-bold text-[#34566f] hover:text-[#0277d4]">
                  {item}
                </Link>
              ))}
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#fff3e8] px-3 py-1.5 text-xs font-black text-[#b45309]">
              <ShieldCheck size={14} aria-hidden="true" />
              {demoPaymentWarning}
            </span>
          </div>
        </form>
      </div>
    </section>
  );
}

function SearchField({ icon: Icon, label, value, name }: { icon: typeof Search; label: string; value: string; name: string }) {
  return (
    <label className="flex min-w-0 items-center gap-3 rounded-xl border border-[#d9ecfb] bg-[#f7fbff] px-4 py-3">
      <Icon size={19} className="shrink-0 text-[#0277d4]" aria-hidden="true" />
      <span className="min-w-0">
        <span className="block text-xs font-bold text-[#6f8594]">{label}</span>
        <input name={name} defaultValue={value} className="mt-1 w-full bg-transparent font-black text-[#071827] outline-none" />
      </span>
    </label>
  );
}

function StaticField({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-[#d9ecfb] bg-[#f7fbff] px-4 py-3">
      <Icon size={19} className="shrink-0 text-[#0277d4]" aria-hidden="true" />
      <span className="min-w-0">
        <span className="block text-xs font-bold text-[#6f8594]">{label}</span>
        <span className="mt-1 block truncate font-black text-[#071827]">{value}</span>
      </span>
    </div>
  );
}

function DealSection() {
  const deals = [
    {
      title: "Ưu đãi nghỉ biển",
      subtitle: "Combo khách sạn demo cho Đà Nẵng và Phú Quốc",
      image: getStayDealImage(),
      href: "/hotels",
      cta: "Tìm nơi lưu trú",
      badge: "Demo đến 18%"
    },
    {
      title: "Trải nghiệm Hội An",
      subtitle: "Tour ẩm thực đi bộ, đêm đèn lồng và chợ thủ công địa phương",
      image: getExperienceDealImage(),
      href: "/experiences",
      cta: "Xem hoạt động",
      badge: "Đánh giá cao"
    },
    {
      title: "Gói lịch trình AI",
      subtitle: "Khách sạn, món ăn, văn hóa và ngân sách trong một kế hoạch",
      image: getEditorialHeroImage(),
      href: "/ai-planner?destination=da-nang",
      cta: "Tạo lịch trình",
      badge: "AI chạy local"
    }
  ];

  return (
    <section className="px-4 py-12 md:px-8">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeader eyebrow="Ưu đãi và ý tưởng" title="Tìm nhanh nơi ở, hoạt động và trải nghiệm địa phương." href="/booking/demo" />
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {deals.map((deal) => (
            <Link key={deal.title} href={deal.href} className="group overflow-hidden rounded-2xl border border-[#d9ecfb] bg-white booking-card-shadow">
              <div
                className="relative min-h-[220px] bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(7,24,39,0.02), rgba(7,24,39,0.62)), url(${deal.image})`
                }}
              >
                <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-black text-[#0277d4]">{deal.badge}</span>
              </div>
              <div className="p-5">
                <h3 className="text-2xl font-black">{deal.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#476273]">{deal.subtitle}</p>
                <span className="mt-4 inline-flex items-center gap-2 font-black text-[#0277d4]">
                  {deal.cta}
                  <ArrowRight size={17} aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function PromoStrip() {
  const promos = [
    ["VWD-HOTEL", "Mã khách sạn demo", "Giảm mô phỏng 12% cho nơi lưu trú"],
    ["LOCALFOOD", "Gói trải nghiệm", "Tour ẩm thực đi bộ và tuyến văn hóa địa phương"],
    ["AIPLAN", "Tăng tốc lịch trình", "Biến tìm kiếm thành kế hoạch từng ngày"]
  ] as const;

  return (
    <section className="px-4 pb-12 md:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-4 lg:grid-cols-[280px_1fr] lg:items-stretch">
          <div className="rounded-2xl bg-[#0277d4] p-5 text-white shadow-[0_18px_44px_rgba(2,68,120,0.18)]">
            <Gift size={26} aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-black">Mã ưu đãi cho bản demo portfolio</h2>
            <p className="mt-2 text-sm leading-6 text-white/75">Không giảm giá thật, không thanh toán thật, chỉ mô phỏng luồng đặt chỗ an toàn.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {promos.map(([code, title, description]) => (
              <Link key={code} href="/booking/demo" className="rounded-2xl border border-[#d9ecfb] bg-white p-5 transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(2,68,120,0.12)]">
                <p className="w-fit rounded-lg bg-[#fff3e8] px-3 py-1 text-xs font-black text-[#b45309]">{code}</p>
                <h3 className="mt-4 font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#476273]">{description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function EnhanceTrip() {
  const items = [
    [Ticket, "Tour và điểm tham quan", "Vé, hướng dẫn địa phương và tour ẩm thực đi bộ."],
    [Car, "Xe đưa đón sân bay", "Tuyến xe demo với giá mô phỏng cố định."],
    [Sparkles, "Lịch trình AI", "Trình lập lịch trình chạy local, không cần OpenAI key khi dùng chatbot."],
    [BadgePercent, "Đặt trước, trả sau", "Chỉ là demo portfolio, không phát sinh giao dịch."]
  ] as const;

  return (
    <section className="border-y border-[#d9ecfb] bg-white px-4 py-10 md:px-8">
      <div className="mx-auto max-w-[1440px]">
        <h2 className="text-2xl font-black">Bổ sung dịch vụ theo cách bạn muốn đi</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {items.map(([Icon, title, text]) => (
            <Link key={title} href="/explore" className="rounded-2xl border border-[#d9ecfb] bg-[#f7fbff] p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_40px_rgba(2,68,120,0.12)]">
              <Icon size={24} className="text-[#0277d4]" aria-hidden="true" />
              <h3 className="mt-4 font-black">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#476273]">{text}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function DestinationShelf({ title, eyebrow, items, href }: { title: string; eyebrow: string; items: typeof destinations; href: string }) {
  return (
    <section className="px-4 py-12 md:px-8">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeader eyebrow={eyebrow} title={title} href={href} />
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((destination) => (
            <DestinationCard key={destination.slug} destination={destination} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, href }: { eyebrow: string; title: string; href: string }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0277d4]">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-black text-[#071827] md:text-4xl">{title}</h2>
      </div>
      <Link href={href} className="inline-flex items-center gap-2 rounded-xl border border-[#d9ecfb] bg-white px-4 py-3 text-sm font-black text-[#0277d4] transition hover:bg-[#eef7ff]">
        Xem tất cả
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </div>
  );
}

function TrustSection() {
  const trust = [
    [CheckCircle2, "Dữ liệu mẫu local", "Seed data Việt Nam và thế giới đủ giàu, có giới hạn real-time rõ ràng."],
    [ShieldCheck, "Thanh toán mock an toàn", "Thẻ, Momo, VNPay, ZaloPay, PayPal, ngân hàng và tiền mặt đều chỉ là demo."],
    [Sparkles, "Trợ lý AI local", "Chatbot runtime dùng provider local và RAG, không phụ thuộc OpenAI key."],
    [Clock3, "Luồng đi nhanh", "Tìm kiếm, lên kế hoạch, lưu yêu thích, đặt chỗ mock và xuất lịch trình."]
  ] as const;

  return (
    <section className="bg-[#071827] px-4 py-12 text-white md:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8ed6ff]">Vì sao chọn VietWander</p>
            <h2 className="mt-3 text-4xl font-black">Trải nghiệm đặt chuyến đi rõ ràng, có ranh giới AI trung thực.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {trust.map(([Icon, title, text]) => (
              <div key={title} className="rounded-2xl border border-white/12 bg-white/8 p-5">
                <Icon size={22} className="text-[#8ed6ff]" aria-hidden="true" />
                <h3 className="mt-4 font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/68">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
