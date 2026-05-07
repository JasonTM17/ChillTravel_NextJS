import { FeatureOverview } from "@/components/feature-overview";

export default function Page() {
  return (
    <FeatureOverview
      eyebrow="Khám phá bản đồ"
      title="Duyệt điểm đến theo tuyến đường"
      summary="Bản đồ dùng marker mẫu dạng cụm, bộ lọc phong cách du lịch, xem trước tuyến và hiển thị dự phòng đẹp khi chưa cấu hình bản đồ thật."
      destinationOffset={8}
    />
  );
}
