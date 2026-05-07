import { CommerceMetric, CommerceSurface, OpsTable, TrustBanner } from "@/components/commerce-primitives";
import { PageShell } from "@/components/page-shell";

const rows = [
  { name: "CT-DA-0826", detail: "Đà Nẵng 4 ngày, 2 khách, khách sạn gần biển", status: "Chờ xử lý", owner: "Thẻ mô phỏng", tone: "orange" as const },
  { name: "CT-PQ-0912", detail: "Phú Quốc gia đình, resort mẫu, vé QR", status: "Đã xác nhận", owner: "Momo demo", tone: "teal" as const },
  { name: "CT-HUE-1010", detail: "Tour ẩm thực Huế, hủy giữ chỗ demo", status: "Đã hủy", owner: "Trả khi đến", tone: "gray" as const },
  { name: "CT-SAPA-1102", detail: "Homestay Sapa, hoàn tiền mô phỏng đã ghi log", status: "Hoàn tiền demo", owner: "VNPay demo", tone: "blue" as const }
];

export default function Page() {
  return (
    <PageShell eyebrow="Quản lý đặt chỗ" title="Đặt chỗ demo và thanh toán mô phỏng">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <CommerceSurface>
          <div className="grid gap-4 md:grid-cols-3">
            <CommerceMetric label="Chờ xử lý" value="14" helper="Đặt chỗ đang chờ trong dữ liệu mẫu." tone="orange" />
            <CommerceMetric label="Đã xác nhận" value="92" helper="Vé QR mô phỏng sẵn sàng." tone="teal" />
            <CommerceMetric label="Hoàn tiền demo" value="7" helper="Chỉ ghi trạng thái mô phỏng." />
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
              {["Thẻ mô phỏng", "Momo demo", "VNPay demo", "ZaloPay demo", "PayPal thử nghiệm", "Chuyển khoản mẫu", "Thanh toán khi đến"].map((item) => (
                <span key={item} className="rounded-full bg-[#eef7ff] px-3 py-1.5">{item}</span>
              ))}
            </div>
          </CommerceSurface>
        </aside>
      </div>
    </PageShell>
  );
}
