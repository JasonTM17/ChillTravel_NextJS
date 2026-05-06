import { destinations } from "@vietwander/shared";
import { MoodSearchPanel } from "@/components/ai/mood-search-panel";
import { DestinationCard } from "@/components/destination-card";

export default function ExplorePage({ searchParams }: { searchParams: Promise<{ q?: string; style?: string }> }) {
  return searchParams.then(({ q = "", style = "" }) => {
    const query = (q + " " + style).trim().toLowerCase();
    const filtered = query
      ? destinations.filter((item) => [item.name, item.country, item.city, item.tags.join(" "), item.travelStyles.join(" ")].join(" ").toLowerCase().includes(query))
      : destinations;
    return (
      <main className="min-h-screen bg-ivory px-4 py-10">
        <section className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-black text-navy md:text-6xl">Explore Vietnam and the world</h1>
          <form className="mt-6 grid gap-3 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_160px]">
            <input name="q" defaultValue={q} placeholder="Mood search: yên bình, biển, food..." className="rounded-lg border border-navy/15 px-4 py-3" />
            <select name="style" defaultValue={style} className="rounded-lg border border-navy/15 px-4 py-3">
              <option value="">All styles</option>
              <option value="food">Food</option>
              <option value="beach">Beach</option>
              <option value="culture">Culture</option>
              <option value="family">Family</option>
            </select>
            <button className="rounded-lg bg-teal px-4 py-3 font-bold text-white">Filter</button>
          </form>
          <div className="mt-8">
            <MoodSearchPanel />
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {filtered.map((destination) => <DestinationCard key={destination.slug} destination={destination} />)}
          </div>
        </section>
      </main>
    );
  });
}
