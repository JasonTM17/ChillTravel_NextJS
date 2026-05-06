import { FeatureOverview } from "@/components/feature-overview";

export default function Page() {
  return (
    <FeatureOverview
      eyebrow="Quản trị điểm đến"
      title="Vận hành dữ liệu destination"
      summary="Bề mặt quản lý điểm đến sẵn sàng CRUD, gồm tìm kiếm, import dữ liệu, prompt hình ảnh, tags, mùa đẹp, ngân sách và trigger rebuild vector index."
      destinationOffset={0}
    />
  );
}
