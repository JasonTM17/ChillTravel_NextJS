import { FeatureOverview } from "@/components/feature-overview";

export default function Page() {
  return (
    <FeatureOverview
      eyebrow="Khám phá bản đồ"
      title="Duyệt điểm đến theo tuyến đường"
      summary="Bản đồ dùng marker mẫu dạng cụm, bộ lọc phong cách du lịch, xem trước tuyến và fallback đẹp khi chưa cấu hình map provider."
      destinationOffset={8}
    />
  );
}
