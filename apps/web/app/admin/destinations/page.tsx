import { FeatureOverview } from "@/components/feature-overview";

export default function Page() {
  return (
    <FeatureOverview
      eyebrow="Admin destinations"
      title="Destination operations"
      summary="CRUD-ready destination management covers search, imports, image prompts, tags, seasons, budgets, and vector index rebuild triggers."
      destinationOffset={0}
    />
  );
}
