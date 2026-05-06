import { CreditCard, Landmark, QrCode, ShieldCheck, Smartphone, WalletCards } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { destinations } from "@vietwander/shared";
import { getDestinationCopy } from "@/lib/destination-copy";
import { formatVnd } from "@/lib/utils";
import { demoPaymentWarning } from "@/lib/vietnamese";

const methods = [
  ["Thẻ demo", CreditCard],
  ["Momo demo", Smartphone],
  ["VNPay demo", WalletCards],
  ["ZaloPay demo", Smartphone],
  ["PayPal demo", WalletCards],
  ["Tiền mặt khi đến", Landmark]
] as const;

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const destination = destinations.find((item) => item.slug === id) ?? destinations.find((item) => item.slug === "da-nang") ?? destinations[0];
  const copy = getDestinationCopy(destination);

  return (
    <PageShell eyebrow="Đặt chỗ demo" title={`Xác nhận chuyến đi ${copy.name}`}>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="rounded-[16px] border border-[#d9ecfb] bg-white p-6 shadow-[0_18px_54px_rgba(2,68,120,0.08)]">
          <div className="rounded-xl border border-[#fed7aa] bg-[#fff7ed] p-4">
            <p className="text-lg font-black text-[#b45309]">{demoPaymentWarning}</p>
            <p className="mt-2 text-sm leading-6 text-[#7c4a1d]">
              Luồng này không lưu thẻ thật, không charge tiền thật và chỉ trả về token giả lập từ provider local.
            </p>
          </div>

          <div className="mt-6 grid gap-4 rounded-2xl border border-[#d9ecfb] bg-[#f7fbff] p-4 md:grid-cols-3">
            <SummaryItem label="Điểm đến" value={copy.name} />
            <SummaryItem label="Ngày đi" value="12/08/2026 - 16/08/2026" />
            <SummaryItem label="Tạm tính demo" value={formatVnd(destination.budgetMin * 4)} />
          </div>

          <h2 className="mt-6 text-xl font-black">Chọn phương thức thanh toán demo</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {methods.map(([method, Icon]) => (
              <button
                key={method}
                className="rounded-xl border border-[#d9ecfb] bg-[#f7fbff] p-4 text-left transition hover:border-[#0277d4] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6d1a]"
              >
                <Icon className="text-[#0277d4]" size={22} aria-hidden="true" />
                <span className="mt-4 block font-black text-[#071827]">{method}</span>
                <span className="mt-1 block text-sm text-[#687983]">Provider sandbox/local</span>
              </button>
            ))}
          </div>
        </section>

        <aside className="rounded-[16px] border border-[#dfd3c1] bg-[#071827] p-6 text-white shadow-[0_18px_54px_rgba(7,24,39,0.14)]">
          <div className="grid h-36 place-items-center rounded-2xl border border-white/14 bg-white/8">
            <QrCode size={76} aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-2xl font-black">VW-QR-{id}</h2>
          <p className="mt-2 text-sm leading-6 text-white/68">Vé QR demo dùng để kiểm thử trạng thái đặt chỗ trong portfolio.</p>
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/14 bg-white/8 p-4">
            <ShieldCheck className="text-[#f7d7b7]" size={22} aria-hidden="true" />
            <p className="text-sm leading-6 text-white/74">Trạng thái có thể là đang chờ, đã xác nhận, đã hủy hoặc hoàn tiền mô phỏng.</p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6f8594]">{label}</p>
      <p className="mt-1 font-black text-[#071827]">{value}</p>
    </div>
  );
}
