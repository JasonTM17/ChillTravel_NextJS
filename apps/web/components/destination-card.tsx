import type { Destination } from '@vietwander/shared';
import { ArrowUpRight, CalendarDays, Heart, MapPin, Star, WalletCards } from 'lucide-react';
import Link from 'next/link';
import { getDestinationCopy } from '@/lib/destination-copy';
import { getDestinationImage } from '@/lib/destination-images';
import { formatVnd } from '@/lib/utils';
import { safetyLabel, tagLabel } from '@/lib/vietnamese';

export function DestinationCard({ destination }: { destination: Destination }) {
  const copy = getDestinationCopy(destination);

  return (
    <article className="group overflow-hidden rounded-tv border border-tv-border bg-white shadow-tv-card transition duration-300 hover:-translate-y-1 hover:shadow-tv-hover">
      <div
        className="relative h-56 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(7, 24, 39, 0.08) 0%, rgba(7, 24, 39, 0.68) 100%), url(${getDestinationImage(destination.slug)})`,
        }}
      >
        <div className="absolute inset-x-4 top-4 flex items-center justify-between">
          <span className="rounded-full bg-white/92 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-tv-blue backdrop-blur">
            {copy.country}
          </span>
          <button
            aria-label={`Lưu ${copy.name}`}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-tv-ink backdrop-blur transition hover:bg-white"
          >
            <Heart size={18} />
          </button>
        </div>
        <div className="absolute inset-x-4 bottom-4 text-white">
          <div className="flex items-center gap-2 text-sm font-semibold text-white/88">
            <MapPin size={15} aria-hidden="true" />
            {copy.city}
          </div>
          <h3 className="mt-1 text-3xl font-bold leading-none">{copy.name}</h3>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#b45309]">
            <Star size={17} fill="currentColor" />
            {destination.ratingAvg.toFixed(1)}
            <span className="font-medium text-[#5c6b73]">({destination.reviewCount} đánh giá)</span>
          </div>
          <span className="rounded-full border border-tv-border bg-[#f3f9ff] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-tv-blue">
            {safetyLabel(destination.safetyLevel)}
          </span>
        </div>

        <p className="mt-4 min-h-[72px] text-sm leading-6 text-tv-ink-3">{copy.summary}</p>

        <div className="mt-5 grid grid-cols-2 gap-3 border-y border-[#eee7db] py-4 text-sm">
          <div className="flex items-start gap-2">
            <WalletCards className="mt-0.5 text-[#0f766e]" size={17} aria-hidden="true" />
            <div>
              <p className="font-bold text-tv-ink">{formatVnd(destination.budgetMin)}</p>
              <p className="text-xs text-[#687983]">ngân sách từ</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CalendarDays className="mt-0.5 text-[#0f766e]" size={17} aria-hidden="true" />
            <div>
              <p className="line-clamp-1 font-bold text-tv-ink">{copy.bestTimeToVisit}</p>
              <p className="text-xs text-[#687983]">mùa đẹp</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {destination.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#f5efe4] px-3 py-1 text-xs font-semibold text-tv-ink-3"
            >
              {tagLabel(tag)}
            </span>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
          <Link
            href={`/destinations/${destination.slug}`}
            className="inline-flex min-w-0 items-center justify-between rounded-lg bg-tv-blue px-4 py-3 text-sm font-bold text-white transition hover:bg-tv-blue-dark focus:outline-none focus:ring-2 focus:ring-tv-blue/30 focus:ring-offset-2"
          >
            <span className="truncate">Xem chi tiết</span>
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
          <Link
            href={`/ai-planner?destination=${destination.slug}`}
            className="inline-flex items-center rounded-lg border border-[#ffd5bd] bg-[#fff7f0] px-3 py-3 text-sm font-bold text-[#c24f05] transition hover:border-tv-orange hover:text-[#a84304] focus:outline-none focus:ring-2 focus:ring-tv-orange/30 focus:ring-offset-2"
          >
            Lên lịch
          </Link>
        </div>
      </div>
    </article>
  );
}
