import { FeatureOverview } from "@/components/feature-overview";

export default function Page() {
  return (
    <FeatureOverview
      eyebrow="Knowledge Studio"
      title="Quản lý nguồn RAG"
      summary="Upload markdown hoặc JSON mẫu, reindex Qdrant, xem tài liệu được truy xuất và rà soát nhật ký hallucination guard."
      destinationOffset={6}
    />
  );
}
