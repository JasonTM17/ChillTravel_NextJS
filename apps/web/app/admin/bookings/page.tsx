import { CommerceMetric, CommerceSurface, OpsTable, TrustBanner } from "@/components/commerce-primitives";
import { PageShell } from "@/components/page-shell";

const rows = [
  { name: "CT-DA-0826", detail: "Đà Nẵng 4 ngày, 2 khách, khách sạn gần biển", status: "pending", owner: "Card mock", tone: "orange" as const },
  { name: "CT-PQ-0912", detail: "Phú Quốc gia đình, resort mẫu, QR ticket", status: "confirmed", owner: "Momo mock", tone: "teal" as const },
  { name: "CT-HUE-1010", detail: "Tour ẩm thực Huế, hủy giữ chỗ demo", status: "cancelled", owner: "Cash demo", tone: "gray" as const },
  { name: "CT-SAPA-1102", detail: "Homestay Sapa, refund mock đã ghi log", status: "refunded mock", owner: "VNPay mock", tone: "blue" as const }
];

export default function Page() {
  return (
    <PageShell eyebrow="Quản lý đặt chỗ" title="Booking demo và thanh toán mock">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <CommerceSurface>
          <div className="grid gap-4 md:grid-cols-3">
            <CommerceMetric label="Chờ xử lý" value="14" helper="Booking pending trong dữ liệu mẫu." tone="orange" />
            <CommerceMetric label="Đã xác nhận" value="92" helper="QR ticket mock sẵn sàng." tone="teal" />
            <CommerceMetric label="Hoàn tiền mock" value="7" helper="Chỉ ghi trạng thái demo." />
          </div>
          <div className="mt-6">
            <OpsTable rows={rows} />
          </div>
        </CommerceSurface>
        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <TrustBanner />
          <CommerceSurface>
            <h2 className="text-xl font-black">Phương thức demo</h2>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-black text-[#0277d4]">
              {["Card mock", "Momo mock", "VNPay mock", "ZaloPay mock", "PayPal mock", "Chuyển khoản mẫu", "Thanh toán khi đến"].map((item) => (
                <span key={item} className="rounded-full bg-[#eef7ff] px-3 py-1.5">{item}</span>
              ))}
            </div>
          </CommerceSurface>
        </aside>
      </div>
    </PageShell>
  );
}
