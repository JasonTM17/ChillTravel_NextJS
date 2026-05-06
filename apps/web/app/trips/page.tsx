import { FeatureOverview } from "@/components/feature-overview";

export default function Page() {
  return (
    <FeatureOverview
      eyebrow="Trip timeline"
      title="Public-share trip stories"
      summary="Saved itineraries are organized by morning, afternoon, and evening so a plan can read like a travel story rather than a spreadsheet."
      destinationOffset={4}
    />
  );
}
