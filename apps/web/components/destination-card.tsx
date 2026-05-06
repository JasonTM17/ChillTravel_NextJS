import Link from "next/link";
import { Heart, Sparkles, Star } from "lucide-react";
import type { Destination } from "@vietwander/shared";
import { formatVnd } from "@/lib/utils";

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-glow">
      <div className="cinematic h-44 p-4 text-white">
        <div className="flex justify-between">
          <span className="rounded-full bg-white/18 px-3 py-1 text-xs backdrop-blur">{destination.country}</span>
          <button aria-label={"Save " + destination.name} className="rounded-full bg-white/18 p-2 backdrop-blur">
            <Heart size={16} />
          </button>
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <Link href={"/destinations/" + destination.slug} className="text-xl font-bold text-navy">
            {destination.name}
          </Link>
          <p className="mt-2 line-clamp-2 text-sm text-navy/70">{destination.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {destination.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-mist px-3 py-1 text-xs font-medium text-navy">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-1 font-semibold text-navy">
            <Star size={16} className="fill-sunset text-sunset" /> {destination.ratingAvg}
          </span>
          <span className="font-semibold text-teal">{formatVnd(destination.budgetMin)}+</span>
        </div>
        <Link href={"/ai-planner?destination=" + destination.slug} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-4 py-3 text-sm font-semibold text-white">
          <Sparkles size={16} /> Quick itinerary
        </Link>
      </div>
    </article>
  );
}
