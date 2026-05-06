import { FeatureOverview } from "@/components/feature-overview";

export default function Page() {
  return (
    <FeatureOverview
      eyebrow="Chuyến đi"
      title="Chuyến đi đã lưu có thể chia sẻ"
      summary="Lịch trình đã lưu được chia theo buổi sáng, chiều và tối để kế hoạch đọc như một câu chuyện du lịch thay vì bảng tính."
      destinationOffset={4}
    />
  );
}
