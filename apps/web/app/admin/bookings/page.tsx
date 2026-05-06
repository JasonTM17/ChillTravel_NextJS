import { FeatureOverview } from "@/components/feature-overview";

export default function Page() {
  return (
    <FeatureOverview
      eyebrow="Admin bookings"
      title="Mock booking review"
      summary="Operations can inspect booking status, demo payment warnings, QR ticket mock data, cancellations, and refunded-mock states."
      destinationOffset={3}
    />
  );
}
