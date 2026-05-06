import { FeatureOverview } from "@/components/feature-overview";

export default function Page() {
  return (
    <FeatureOverview
      eyebrow="Demo access"
      title="Login"
      summary="Use demo accounts for admin, traveler, host, and guide roles while keeping authentication flows local and portfolio-safe."
      details={[
        "admin@vietwander.ai / Admin123!",
        "user@vietwander.ai / User123!",
        "guide@vietwander.ai / Guide123!",
        "host@vietwander.ai / Host123!"
      ]}
      destinationOffset={0}
    />
  );
}
