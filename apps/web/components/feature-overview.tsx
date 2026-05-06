import { destinations } from "@vietwander/shared";
import { DestinationCard } from "@/components/destination-card";
import { PageShell } from "@/components/page-shell";

interface FeatureOverviewProps {
  eyebrow: string;
  title: string;
  summary: string;
  details?: string[];
  destinationOffset?: number;
}

const defaultDetails = [
  "Local/sample travel data only",
  "Mock payment - no real transaction",
  "Local RAG runtime; no OpenAI key required",
  "Responsive, accessible, and mobile-aligned"
];

export function FeatureOverview({ eyebrow, title, summary, details = defaultDetails, destinationOffset = 0 }: FeatureOverviewProps) {
  const cards = destinations.slice(destinationOffset, destinationOffset + 4);

  return (
    <PageShell eyebrow={eyebrow} title={title}>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-[16px] border border-[#dfd3c1] bg-white p-6 shadow-[0_18px_54px_rgba(7,24,39,0.06)]">
          <p className="max-w-3xl text-lg leading-8 text-[#40515d]">{summary}</p>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {cards.map((destination) => (
              <DestinationCard key={destination.slug} destination={destination} />
            ))}
          </div>
        </section>
        <aside className="h-fit rounded-[16px] bg-[#071827] p-6 text-white shadow-[0_18px_54px_rgba(7,24,39,0.14)]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f7d7b7]">Demo boundaries</p>
          <h2 className="mt-3 text-2xl font-black">Production-minded, locally safe</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-white/76">
            {details.map((detail) => (
              <li key={detail} className="rounded-xl border border-white/12 bg-white/8 px-4 py-3">
                {detail}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </PageShell>
  );
}
