import { PersonalityQuiz } from "@/components/ai/personality-quiz";
import { PageShell } from "@/components/page-shell";

export default function PersonalityPage() {
  return (
    <PageShell eyebrow="Travel Personality Engine" title="Let VietWander AI learn how you actually travel">
      <PersonalityQuiz />
    </PageShell>
  );
}
