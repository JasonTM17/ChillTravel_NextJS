import { FeatureOverview } from "@/components/feature-overview";

export default function Page() {
  return (
    <FeatureOverview
      eyebrow="Knowledge studio"
      title="RAG source management"
      summary="Upload markdown or JSON samples, reindex Qdrant, inspect retrieved documents, and review hallucination guard logs."
      destinationOffset={6}
    />
  );
}
