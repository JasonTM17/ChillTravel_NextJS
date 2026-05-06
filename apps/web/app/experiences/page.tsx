import { PageShell } from "@/components/page-shell";
import { destinations } from "@vietwander/shared";
import { DestinationCard } from "@/components/destination-card";

export default function Page() {
  return (
    <PageShell eyebrow="VIETWANDER AI" title="Local Experiences">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-lg text-navy/75">Food walks, sunrise viewpoints, cultural routes, QR ticket mock, and guide profiles.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {destinations.slice(0, 4).map((destination) => <DestinationCard key={destination.slug} destination={destination} />)}
          </div>
        </section>
        <aside className="rounded-2xl bg-navy p-6 text-white">
          <h2 className="text-xl font-bold">Portfolio-ready details</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            <li>Local/sample travel data only</li>
            <li>Mock payment — no real transaction</li>
            <li>Local AI RAG runtime, no OpenAI key required</li>
            <li>Responsive, accessible, and mobile-aligned UI</li>
          </ul>
        </aside>
      </div>
    </PageShell>
  );
}
