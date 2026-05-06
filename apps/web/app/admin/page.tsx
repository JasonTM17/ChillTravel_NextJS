import { PageShell } from "@/components/page-shell";
import { destinations } from "@vietwander/shared";
import { DestinationCard } from "@/components/destination-card";

export default function Page() {
  return (
    <PageShell eyebrow="Operations" title="Admin dashboard">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-[16px] border border-[#dfd3c1] bg-white p-6 shadow-[0_18px_54px_rgba(7,24,39,0.06)]">
          <p className="text-lg leading-8 text-[#40515d]">
            Analytics, bookings, destinations, chatbot logs, moderation, and knowledge studio controls.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {destinations.slice(0, 4).map((destination) => (
              <DestinationCard key={destination.slug} destination={destination} />
            ))}
          </div>
        </section>
        <aside className="rounded-[16px] bg-[#071827] p-6 text-white">
          <h2 className="text-xl font-black">Portfolio-ready details</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-white/75">
            <li>Local/sample travel data only</li>
            <li>Mock payment - no real transaction</li>
            <li>Local AI RAG runtime, no OpenAI key required</li>
            <li>Responsive, accessible, and mobile-aligned UI</li>
          </ul>
        </aside>
      </div>
    </PageShell>
  );
}
