import { BudgetSimulator } from "@/components/ai/budget-simulator";
import { PageShell } from "@/components/page-shell";

export default function BudgetPage() {
  return (
    <PageShell eyebrow="Smart Budget" title="Simulate hotel, food, transport, and activity tradeoffs">
      <BudgetSimulator initialDestinationSlug="da-nang" />
    </PageShell>
  );
}
