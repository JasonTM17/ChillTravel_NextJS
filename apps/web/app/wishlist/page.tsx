import { FeatureOverview } from "@/components/feature-overview";

export default function Page() {
  return (
    <FeatureOverview
      eyebrow="Saved places"
      title="Wishlist"
      summary="Save destinations, stays, and experiences into trip groups that can become shareable collections or offline travel packs."
      destinationOffset={2}
    />
  );
}
