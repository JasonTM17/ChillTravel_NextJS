import { BarChart3, PieChart, Search, Users } from "lucide-react";
import { CommerceMetric, CommerceSurface, ServiceActionCard } from "@/components/commerce-primitives";
import { PageShell } from "@/components/page-shell";

export default function Page() {
  return (
    <PageShell eyebrow="Quản trị thống kê" title="Tìm kiếm, đặt chỗ và nhóm câu hỏi trợ lý">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <CommerceMetric label="Tìm kiếm nổi bật" value="Đà Nẵng" helper="Biển, ẩm thực, Hội An là cụm từ đi kèm." />
          <CommerceMetric label="Phễu demo" value="18%" helper="Từ xem ưu đãi sang đặt chỗ mô phỏng." tone="orange" />
          <CommerceMetric label="Phong cách" value="Ẩm thực" helper="Nhóm người dùng mê ẩm thực cao nhất." tone="teal" />
          <CommerceMetric label="Cảnh báo" value="97%" helper="Câu hỏi theo thời gian thực được cảnh báo đúng." />
        </div>
        <CommerceSurface>
          <h2 className="text-2xl font-bold">Bảng đọc nhanh</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <ServiceActionCard icon={Search} title="Từ khóa nổi bật" description="Đà Nẵng, Phú Quốc, Hội An, Tokyo, gia đình, biển yên bình." href="/explore" />
            <ServiceActionCard icon={BarChart3} title="Xu hướng đặt chỗ" description="Luồng thanh toán demo có tỷ lệ tiếp tục cao nhất khi giá và cảnh báo rõ." href="/admin/bookings" tone="orange" />
            <ServiceActionCard icon={Users} title="Nhóm du khách" description="Food Hunter và Family Planner tạo nhiều lịch trình mẫu nhất." href="/personality" tone="teal" />
            <ServiceActionCard icon={PieChart} title="Câu hỏi trợ lý" description="Ẩm thực, ngân sách, thời tiết, visa và đường đi là các nhóm chính." href="/admin/ai-knowledge" />
          </div>
        </CommerceSurface>
      </div>
    </PageShell>
  );
}
