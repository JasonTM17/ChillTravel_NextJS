import { LocalChatConcierge } from "@/components/local-chat-concierge";
import { PageShell } from "@/components/page-shell";
import { getStructuredChatAnswer } from "@/lib/local-ai";

const sampleQuestion = "Đà Nẵng 3 ngày nên ăn gì và đi theo lịch trình nào?";

export default async function ChatPage() {
  const answer = await getStructuredChatAnswer(sampleQuestion, "da-nang");

  return (
    <PageShell eyebrow="Trợ lý chuyến đi" title="Hỏi ChillTravel để nhận câu trả lời có nguồn, có lịch trình và ranh giới rõ ràng">
      <LocalChatConcierge initialAnswer={answer} />
    </PageShell>
  );
}
