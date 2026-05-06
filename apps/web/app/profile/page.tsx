import { FeatureOverview } from "@/components/feature-overview";

export default function Page() {
  return (
    <FeatureOverview
      eyebrow="Traveler profile"
      title="Preferences, bookings, and offline packs"
      summary="The profile surface collects travel style, demo bookings, reviews, language settings, and offline travel pack preferences."
      destinationOffset={6}
    />
  );
}
