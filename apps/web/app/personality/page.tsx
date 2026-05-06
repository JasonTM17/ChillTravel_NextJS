import { PersonalityQuiz } from "@/components/ai/personality-quiz";
import { PageShell } from "@/components/page-shell";

export default function PersonalityPage() {
  return (
    <PageShell eyebrow="Phong cách du lịch" title="Để VietWander hiểu cách bạn thật sự muốn đi">
      <PersonalityQuiz />
    </PageShell>
  );
}
