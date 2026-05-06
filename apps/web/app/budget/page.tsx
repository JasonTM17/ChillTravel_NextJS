import { BudgetSimulator } from "@/components/ai/budget-simulator";
import { PageShell } from "@/components/page-shell";

export default function BudgetPage() {
  return (
    <PageShell eyebrow="Ngân sách thông minh" title="Mô phỏng chi phí lưu trú, ăn uống, di chuyển và hoạt động">
      <BudgetSimulator initialDestinationSlug="da-nang" />
    </PageShell>
  );
}
