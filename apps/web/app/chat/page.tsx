import { localAiAnswer } from "@vietwander/shared";
import { PageShell } from "@/components/page-shell";

export default function ChatPage() {
  const answer = localAiAnswer("Đà Nẵng đi 3 ngày ăn gì?");
  return (
    <PageShell eyebrow="Local AI Concierge" title="Chat with VietWander AI without an OpenAI runtime key">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="rounded-2xl bg-ivory p-4">
            <p className="font-semibold text-navy">User</p>
            <p>Đà Nẵng đi 3 ngày ăn gì?</p>
          </div>
          <div className="mt-4 rounded-2xl bg-navy p-5 text-white">
            <p className="font-semibold text-mist">VietWander AI</p>
            <p className="mt-2">{answer.answer}</p>
            <p className="mt-4 text-sm text-white/70">Citation: {answer.citations[0]?.sourceId}</p>
          </div>
          <form className="mt-6 flex gap-3">
            <input className="flex-1 rounded-lg border border-navy/15 px-4 py-3" placeholder="Ask about budget, food, culture, packing..." />
            <button className="rounded-lg bg-teal px-5 py-3 font-bold text-white">Send</button>
          </form>
        </section>
        <aside className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-navy">Quick actions</h2>
          {["Save answer", "Convert to itinerary", "Add destination", "Estimate budget"].map((item) => (
            <button key={item} className="mt-3 w-full rounded-lg bg-ivory px-4 py-3 text-left font-semibold text-navy">{item}</button>
          ))}
        </aside>
      </div>
    </PageShell>
  );
}
