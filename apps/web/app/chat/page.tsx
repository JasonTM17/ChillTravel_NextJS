import { localAiAnswer } from "@vietwander/shared";
import { PageShell } from "@/components/page-shell";

const sampleQuestion = "Da Nang for 3 days: what should I eat and plan?";

export default function ChatPage() {
  const answer = localAiAnswer(sampleQuestion);

  return (
    <PageShell eyebrow="Local concierge" title="Ask the travel desk for a grounded answer">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-[16px] border border-[#dfd3c1] bg-white p-5 shadow-[0_18px_54px_rgba(7,24,39,0.06)]">
          <div className="rounded-2xl border border-[#eadfce] bg-[#fdf9f0] p-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">Traveler note</p>
            <p className="mt-2 text-[#40515d]">{sampleQuestion}</p>
          </div>
          <div className="mt-4 rounded-2xl bg-[#071827] p-5 text-white">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f7d7b7]">VietWander concierge</p>
            <h2 className="font-editorial mt-2 text-3xl font-black">Balanced food-first route</h2>
            <p className="mt-3 leading-7 text-white/82">
              Start with a seafood evening near My Khe, use the next morning for Son Tra or Marble Mountains, then keep a
              half day for Hoi An if the pace is balanced. For food, prioritize mi Quang, banh trang cuon thit heo, and
              a seafood dinner. This is local sample data, not live availability.
            </p>
            <p className="mt-4 text-sm text-white/62">Citation: {answer.citations[0]?.sourceId}</p>
          </div>
          <form className="mt-6 flex flex-col gap-3 md:flex-row">
            <input
              className="flex-1 rounded-lg border border-[#dfd3c1] bg-[#fdf9f0] px-4 py-3 outline-none focus:border-[#0f766e]"
              placeholder="Ask about budget, food, culture, packing..."
            />
            <button className="rounded-lg bg-[#0f766e] px-5 py-3 font-black text-white">Send</button>
          </form>
        </section>
        <aside className="rounded-[16px] border border-[#dfd3c1] bg-white p-5 shadow-[0_18px_54px_rgba(7,24,39,0.06)]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">Action tray</p>
          <h2 className="font-editorial mt-2 text-2xl font-black text-[#071827]">Turn the answer into a trip</h2>
          {["Save answer", "Convert to itinerary", "Add destination", "Estimate budget"].map((item) => (
            <button key={item} className="mt-3 w-full rounded-lg bg-[#f8f1e6] px-4 py-3 text-left font-bold text-[#071827]">
              {item}
            </button>
          ))}
        </aside>
      </div>
    </PageShell>
  );
}
