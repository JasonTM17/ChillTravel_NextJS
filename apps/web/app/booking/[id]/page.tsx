import { CreditCard, Landmark, QrCode, ShieldCheck, Smartphone, WalletCards } from "lucide-react";
import { PageShell } from "@/components/page-shell";

const methods = [
  ["Mock Credit Card", CreditCard],
  ["Mock Momo", Smartphone],
  ["Mock VNPay", WalletCards],
  ["Mock ZaloPay", Smartphone],
  ["Mock PayPal", WalletCards],
  ["Cash on arrival", Landmark]
] as const;

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <PageShell eyebrow="Mock booking" title={`Booking dossier ${id}`}>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="rounded-[16px] border border-[#dfd3c1] bg-white p-6 shadow-[0_18px_54px_rgba(7,24,39,0.06)]">
          <div className="rounded-xl border border-[#fed7aa] bg-[#fff7ed] p-4">
            <p className="text-lg font-black text-[#b45309]">Demo payment - no real transaction</p>
            <p className="mt-2 text-sm leading-6 text-[#7c4a1d]">
              This flow never stores real card data, never charges money, and only returns local mock provider tokens.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {methods.map(([method, Icon]) => (
              <button
                key={method}
                className="rounded-xl border border-[#dfd3c1] bg-[#fdf9f0] p-4 text-left transition hover:border-[#0f766e] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#f97316]"
              >
                <Icon className="text-[#0f766e]" size={22} aria-hidden="true" />
                <span className="mt-4 block font-black text-[#071827]">{method}</span>
                <span className="mt-1 block text-sm text-[#687983]">Local sandbox provider</span>
              </button>
            ))}
          </div>
        </section>

        <aside className="rounded-[16px] border border-[#dfd3c1] bg-[#071827] p-6 text-white shadow-[0_18px_54px_rgba(7,24,39,0.14)]">
          <div className="grid h-36 place-items-center rounded-2xl border border-white/14 bg-white/8">
            <QrCode size={76} aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-2xl font-black">VW-QR-{id}</h2>
          <p className="mt-2 text-sm leading-6 text-white/68">Mock QR ticket for portfolio demo and booking status testing.</p>
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/14 bg-white/8 p-4">
            <ShieldCheck className="text-[#f7d7b7]" size={22} aria-hidden="true" />
            <p className="text-sm leading-6 text-white/74">Payment status can be pending, confirmed, cancelled, or refunded mock.</p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
