import { CompareConsole } from "@/components/ai/compare-console";
import { PageShell } from "@/components/page-shell";

export default function ComparePage() {
  return (
    <PageShell eyebrow="AI Compare" title="Compare destinations with budget, season, safety, food, and AI fit">
      <CompareConsole />
    </PageShell>
  );
}
