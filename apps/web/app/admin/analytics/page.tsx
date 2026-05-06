import { FeatureOverview } from "@/components/feature-overview";

export default function Page() {
  return (
    <FeatureOverview
      eyebrow="Admin analytics"
      title="Searches, bookings, and concierge categories"
      summary="Analytics surfaces top searched destinations, conversion funnel mock, booking trends, question categories, and travel styles."
      destinationOffset={9}
    />
  );
}
