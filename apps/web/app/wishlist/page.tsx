import { FeatureOverview } from "@/components/feature-overview";

export default function Page() {
  return (
    <FeatureOverview
      eyebrow="Điểm đã lưu"
      title="Danh sách yêu thích"
      summary="Lưu điểm đến, nơi ở và trải nghiệm vào từng nhóm chuyến đi để biến thành bộ sưu tập chia sẻ hoặc gói offline."
      destinationOffset={2}
    />
  );
}
