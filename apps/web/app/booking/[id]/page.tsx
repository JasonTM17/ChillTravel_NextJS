import Link from "next/link";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Landmark,
  LockKeyhole,
  Mail,
  Phone,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  UserRound,
  Users,
  WalletCards
} from "lucide-react";
import { destinations } from "@vietwander/shared";
import type { Destination } from "@vietwander/shared";
import { getDestinationCopy } from "@/lib/destination-copy";
import { getDestinationImage } from "@/lib/destination-images";
import { formatVnd } from "@/lib/utils";
import { demoPaymentWarning, formatDateVi } from "@/lib/vietnamese";

const checkoutSteps = ["Chọn gói", "Thông tin khách", "Thanh toán demo", "Vé QR"] as const;

const paymentMethods = [
  ["Thẻ demo", "Token giả lập, không nhập số thẻ thật", CreditCard, true],
  ["Momo demo", "Ví điện tử local/mock", Smartphone, false],
  ["VNPay demo", "Cổng thanh toán sandbox giả lập", WalletCards, false],
  ["ZaloPay demo", "Không gọi provider thật", QrCode, false],
  ["PayPal demo", "Xác nhận mẫu cho portfolio", WalletCards, false],
  ["Chuyển khoản demo", "Không tạo giao dịch ngân hàng", Building2, false],
  ["Tiền mặt khi đến", "Trạng thái xác nhận mẫu", Landmark, false]
] as const;

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const destination = destinations.find((item) => item.slug === id) ?? destinations.find((item) => item.slug === "da-nang") ?? destinations[0];
  const nights = 4;
  const roomTotal = destination.budgetMin * nights;
  const fees = Math.round(roomTotal * 0.1);
  const discount = 200000;
  const total = roomTotal + fees - discount;

  return (
    <main className="min-h-screen bg-[#f6fbff] text-[#071827]">
      <section className="border-b border-[#d9ecfb] bg-white">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-4 py-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0277d4]">Checkout VietWander</p>
            <h1 className="mt-1 text-2xl font-black md:text-3xl">Thanh toán & xác nhận đặt chỗ demo</h1>
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-[#eef7ff] px-4 py-2 text-sm font-black text-[#0277d4] md:inline-flex">
            <LockKeyhole size={18} aria-hidden="true" />
            Thanh toán an toàn
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 py-6">
        <WarningBanner />
        <CheckoutStepper />

        <div className="mt-6 grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
          <BookingDetailCard destination={destination} nights={nights} />
          <CheckoutForm />
          <PriceSummary destination={destination} roomTotal={roomTotal} fees={fees} discount={discount} total={total} />
        </div>
      </section>
    </main>
  );
}

function WarningBanner() {
  return (
    <div className="rounded-2xl border border-[#f0b3ad] bg-[#ffe4e1] p-4 text-[#9f1239] shadow-[0_10px_28px_rgba(159,18,57,0.08)]">
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 shrink-0" size={24} aria-hidden="true" />
        <div>
          <p className="text-lg font-black">{demoPaymentWarning}. Không nhập hoặc lưu thẻ thật.</p>
          <p className="mt-1 text-sm font-bold text-[#9f1239]/78">Mọi provider trong trang này là local/mock/sandbox. Không charge tiền thật, không lưu số thẻ, không bypass luật thanh toán.</p>
        </div>
      </div>
    </div>
  );
}

function CheckoutStepper() {
  return (
    <ol className="mt-7 grid gap-3 md:grid-cols-4" aria-label="Tiến trình đặt chỗ demo">
      {checkoutSteps.map((step, index) => {
        const active = index === 2;
        const done = index < 2;
        return (
          <li key={step} className="flex items-center gap-3 rounded-2xl border border-[#d9ecfb] bg-white p-3">
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-black ${active ? "bg-[#0277d4] text-white ring-4 ring-[#b8ddff]" : done ? "bg-[#0277d4] text-white" : "bg-[#edf4fa] text-[#8b99a7]"}`}>
              {done ? <CheckCircle2 size={18} aria-hidden="true" /> : index + 1}
            </span>
            <span className={`text-sm font-black ${active ? "text-[#0277d4]" : done ? "text-[#071827]" : "text-[#8b99a7]"}`}>{step}</span>
          </li>
        );
      })}
    </ol>
  );
}

function BookingDetailCard({ destination, nights }: { destination: Destination; nights: number }) {
  const copy = getDestinationCopy(destination);
  return (
    <aside className="overflow-hidden rounded-2xl border border-[#d9ecfb] bg-white shadow-[0_14px_34px_rgba(2,68,120,0.08)]">
      <div className="h-44 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(180deg, rgba(7,24,39,0.02), rgba(7,24,39,0.24)), url(${getDestinationImage(destination.slug)})` }} />
      <div className="p-5">
        <p className="inline-flex rounded-full bg-[#eef7ff] px-3 py-1 text-xs font-black text-[#0277d4]">Gói lưu trú demo</p>
        <h2 className="mt-3 text-2xl font-black">{copy.name}</h2>
        <p className="mt-2 text-sm leading-6 text-[#476273]">{copy.summary}</p>
        <div className="mt-5 space-y-3 text-sm font-bold text-[#476273]">
          <DetailRow icon={CalendarDays} label={`${formatDateVi(new Date("2026-08-12"))} - ${formatDateVi(new Date("2026-08-16"))} (${nights} đêm)`} />
          <DetailRow icon={Users} label="2 người lớn, 1 phòng" />
          <DetailRow icon={BadgeCheck} label="Xác nhận tức thì trong bản demo" />
        </div>
        <div className="mt-5 rounded-2xl bg-[#eef7ff] p-4">
          <h3 className="font-black">Chính sách hủy phòng demo</h3>
          <p className="mt-2 text-sm leading-6 text-[#476273]">Hủy miễn phí trước 20:00 ngày 10/08/2026. Sau thời điểm này, hệ thống chỉ mô phỏng phí hủy 50%.</p>
        </div>
      </div>
    </aside>
  );
}

function DetailRow({ icon: Icon, label }: { icon: typeof CalendarDays; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={18} className="text-[#0277d4]" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

function CheckoutForm() {
  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-[#d9ecfb] bg-white p-5 shadow-[0_14px_34px_rgba(2,68,120,0.08)]">
        <h2 className="text-2xl font-black">Thông tin liên hệ</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <FormField icon={UserRound} label="Họ và tên" value="Nguyen Van A" wide />
          <FormField icon={Mail} label="Email" value="nguyenvana@example.com" />
          <FormField icon={Phone} label="Số điện thoại" value="0901234567" />
        </div>
      </div>

      <div className="rounded-2xl border border-[#d9ecfb] bg-white p-5 shadow-[0_14px_34px_rgba(2,68,120,0.08)]">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-black">Phương thức thanh toán</h2>
            <p className="mt-1 text-sm text-[#476273]">Chọn provider demo. Không nhập số thẻ thật.</p>
          </div>
          <span className="rounded-full bg-[#e7f8f5] px-3 py-1 text-xs font-black text-[#0f8b7b]">Local/Sandbox/Mock</span>
        </div>
        <div className="mt-5 grid gap-3">
          {paymentMethods.map(([name, description, Icon, active]) => (
            <button key={name} type="button" className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${active ? "border-[#0277d4] bg-[#eef7ff] ring-2 ring-[#0277d4]/10" : "border-[#d9ecfb] bg-white hover:border-[#0277d4]"}`}>
              <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${active ? "border-[#0277d4] bg-[#0277d4]" : "border-[#8b99a7]"}`}>
                {active ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
              </span>
              <Icon size={24} className={active ? "text-[#0277d4]" : "text-[#476273]"} aria-hidden="true" />
              <span className="min-w-0">
                <span className="block font-black">{name}</span>
                <span className="mt-0.5 block text-sm text-[#6f8594]">{description}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function FormField({ icon: Icon, label, value, wide = false }: { icon: typeof UserRound; label: string; value: string; wide?: boolean }) {
  return (
    <label className={wide ? "md:col-span-2" : ""}>
      <span className="mb-2 flex items-center gap-2 text-sm font-black text-[#476273]">
        <Icon size={16} className="text-[#0277d4]" aria-hidden="true" />
        {label}
      </span>
      <input defaultValue={value} className="w-full rounded-2xl border border-[#c8d5e3] bg-[#f7fbff] px-4 py-3 font-bold text-[#071827] outline-none transition focus:border-[#0277d4] focus:ring-2 focus:ring-[#0277d4]/15" />
    </label>
  );
}

function PriceSummary({ destination, roomTotal, fees, discount, total }: { destination: Destination; roomTotal: number; fees: number; discount: number; total: number }) {
  return (
    <aside className="h-fit space-y-5 lg:sticky lg:top-24">
      <div className="rounded-2xl border border-[#d9ecfb] bg-white p-5 shadow-[0_14px_34px_rgba(2,68,120,0.08)]">
        <h2 className="text-2xl font-black">Tóm tắt giá</h2>
        <div className="mt-5 space-y-3 text-sm">
          <SummaryRow label="Giá phòng (4 đêm)" value={formatVnd(roomTotal)} />
          <SummaryRow label="Thuế & phí (sample)" value={formatVnd(fees)} />
          <SummaryRow label="Giảm giá hội viên demo" value={`- ${formatVnd(discount)}`} positive />
        </div>
        <div className="mt-5 border-t border-[#d9ecfb] pt-5">
          <div className="flex items-end justify-between gap-4">
            <span className="text-xl font-black">Tổng cộng</span>
            <span className="text-2xl font-black text-[#071827]">{formatVnd(total)}</span>
          </div>
          <p className="mt-1 text-xs font-bold text-[#6f8594]">Mọi con số là dữ liệu mẫu local.</p>
        </div>
        <Link href={`/booking/${destination.slug}?confirmed=mock`} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ff6d1a] px-4 py-4 font-black text-white shadow-[0_14px_28px_rgba(255,109,26,0.22)] transition hover:bg-[#e95c0a]">
          <LockKeyhole size={19} aria-hidden="true" />
          Xác nhận đặt chỗ demo
          <ChevronRight size={18} aria-hidden="true" />
        </Link>
        <div className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#e7f8f5] px-3 py-2 text-sm font-black text-[#0f8b7b]">
          <ShieldCheck size={18} aria-hidden="true" />
          Thanh toán an toàn
        </div>
      </div>

      <div className="rounded-2xl border border-[#d9ecfb] bg-[#eef7ff] p-5 text-center">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-2xl bg-white text-[#0277d4]">
          <QrCode size={58} aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-lg font-black">Xem trước vé QR</h3>
        <p className="mt-2 text-sm leading-6 text-[#476273]">Vé điện tử demo sẽ được tạo sau khi xác nhận. Mã đặt chỗ mẫu: VW-QR-{destination.slug.toUpperCase()}.</p>
      </div>
    </aside>
  );
}

function SummaryRow({ label, value, positive = false }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[#476273]">{label}</span>
      <span className={`text-right font-black ${positive ? "text-[#0f8b7b]" : "text-[#071827]"}`}>{value}</span>
    </div>
  );
}
