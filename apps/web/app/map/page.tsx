import { FeatureOverview } from "@/components/feature-overview";

export default function Page() {
  return (
    <FeatureOverview
      eyebrow="Map discovery"
      title="Route-first destination browsing"
      summary="Map discovery uses clustered sample markers, travel-style filters, route previews, and a polished fallback when no map provider is configured."
      destinationOffset={8}
    />
  );
}
