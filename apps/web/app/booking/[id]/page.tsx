import { PageShell } from "@/components/page-shell";

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PageShell eyebrow="Mock Booking" title={"Booking " + id}>
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-lg font-bold text-sunset">Demo payment — no real transaction</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {["Mock Credit Card", "Mock Momo", "Mock VNPay", "Mock ZaloPay", "Mock PayPal", "Cash on arrival"].map((method) => (
            <button key={method} className="rounded-xl border border-navy/10 p-4 text-left font-semibold text-navy hover:border-teal">{method}</button>
          ))}
        </div>
        <div className="mt-6 rounded-xl bg-ivory p-5">
          <p className="font-semibold text-navy">QR ticket mock: VW-QR-{id}</p>
          <p className="mt-2 text-sm text-navy/65">No card number is stored. Provider token is simulated locally.</p>
        </div>
      </section>
    </PageShell>
  );
}
