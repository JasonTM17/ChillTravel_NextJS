import { CompareConsole } from "@/components/ai/compare-console";
import { PageShell } from "@/components/page-shell";

export default function ComparePage() {
  return (
    <PageShell eyebrow="So sánh thông minh" title="So sánh điểm đến theo ngân sách, mùa đẹp, an toàn, ẩm thực và độ phù hợp">
      <CompareConsole />
    </PageShell>
  );
}
