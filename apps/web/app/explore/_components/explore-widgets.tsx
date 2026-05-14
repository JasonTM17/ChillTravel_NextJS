import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Hotel,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Users,
  WalletCards,
  Wifi,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { getCountryName, getCityName } from '@/lib/api/destination.api';
import type { Destination } from '@/lib/api/destination.api';
import { getDestinationImage } from '@/lib/destination-images';
import { demoPaymentWarning, formatDateVi } from '@/lib/vietnamese';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const sortOptions = [
  { label: 'Phù hợp nhất', value: '' },
  { label: 'Đánh giá cao', value: 'ratingAvg,desc' },
  { label: 'Tên A-Z', value: 'name,asc' },
  { label: 'Mới nhất', value: 'createdAt,desc' },
];

export const categoryOptions = ['Biển', 'Văn hóa', 'Ẩm thực', 'Núi', 'Nghỉ dưỡng', 'Phố cổ'];

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

export function SearchResultSkeleton() {
  return (
    <div className="grid overflow-hidden rounded-tv border border-tv-border bg-white shadow-tv-card md:grid-cols-[220px_minmax(0,1fr)_210px] animate-pulse">
      <div className="min-h-[210px] tv-skeleton" />
      <div className="min-w-0 p-5 space-y-3">
        <div className="flex gap-2">
          <div className="h-6 w-20 rounded-full tv-skeleton" />
          <div className="h-6 w-12 rounded-full tv-skeleton" />
        </div>
        <div className="h-6 w-48 rounded tv-skeleton" />
        <div className="h-3 w-full rounded tv-skeleton" />
        <div className="h-3 w-3/4 rounded tv-skeleton" />
        <div className="flex gap-2 mt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-6 w-20 rounded-full tv-skeleton" />
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-between border-t border-tv-border bg-tv-bg p-5 md:border-l md:border-t-0">
        <div className="space-y-2">
          <div className="h-3 w-12 rounded tv-skeleton" />
          <div className="h-7 w-28 rounded tv-skeleton" />
          <div className="h-3 w-20 rounded tv-skeleton" />
        </div>
        <div className="mt-5 space-y-2">
          <div className="h-10 rounded-tv-sm tv-skeleton" />
          <div className="h-10 rounded-tv-sm tv-skeleton" />
        </div>
      </div>
    </div>
  );
}

export function ExplorePageSkeleton() {
  return (
    <main className="min-h-screen bg-tv-bg text-tv-ink">
      <section className="border-b border-tv-border bg-white">
        <div className="mx-auto max-w-[1180px] px-4 py-5">
          <div className="rounded-[26px] bg-tv-blue p-3 h-24 animate-pulse" />
        </div>
      </section>
      <section className="mx-auto grid max-w-[1180px] gap-5 px-4 py-6 lg:grid-cols-[260px_minmax(0,1fr)_300px]">
        <div className="h-96 rounded-tv border border-tv-border bg-white animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <SearchResultSkeleton key={i} />
          ))}
        </div>
        <div className="h-64 rounded-tv border border-tv-border bg-white animate-pulse" />
      </section>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Error / Empty states
// ---------------------------------------------------------------------------

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-tv border border-dashed border-red-200 bg-red-50 p-8 text-center">
      <p className="text-lg font-bold text-red-600">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex rounded-tv-sm bg-tv-blue px-5 py-2.5 font-bold text-white hover:bg-tv-blue-dark"
          type="button"
        >
          Thử lại
        </button>
      )}
    </div>
  );
}

export function EmptyResults({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-tv border border-dashed border-tv-border bg-white p-10 text-center">
      <MapPin className="mx-auto text-tv-blue" size={34} aria-hidden="true" />
      <h2 className="mt-4 text-2xl font-bold">Chưa có lựa chọn phù hợp.</h2>
      <p className="mt-2 text-tv-ink-3">
        Thử nhập thành phố, phong cách du lịch hoặc thay đổi bộ lọc.
      </p>
      <button
        onClick={onClear}
        className="mt-5 inline-flex rounded-tv-sm bg-tv-blue px-5 py-3 font-bold text-white"
        type="button"
      >
        Xóa bộ lọc
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Search bar
// ---------------------------------------------------------------------------

export function ExploreSearch({
  keyword,
  onSearch,
}: {
  keyword: string;
  onSearch: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <section className="border-b border-tv-border bg-white">
      <div className="mx-auto max-w-[1180px] px-4 py-5">
        <form
          onSubmit={onSearch}
          className="rounded-[26px] bg-tv-blue p-3 shadow-[0_18px_42px_rgba(2,119,212,0.18)]"
        >
          <div className="grid gap-3 rounded-[20px] bg-white p-3 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.9fr_0.9fr_0.95fr_148px]">
            <label className="flex min-w-0 items-center gap-3 rounded-tv border border-tv-border bg-tv-bg px-4 py-3">
              <Search size={19} className="text-tv-blue" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold text-tv-ink-3">Bạn muốn đi đâu?</span>
                <input
                  name="keyword"
                  defaultValue={keyword}
                  className="mt-1 w-full bg-transparent font-bold text-tv-ink outline-none"
                  placeholder="Tên điểm đến, quốc gia..."
                />
              </span>
            </label>
            <CompactField
              icon={CalendarDays}
              label="Nhận phòng"
              value={formatDateVi(new Date('2026-08-12'))}
            />
            <CompactField
              icon={CalendarDays}
              label="Trả phòng"
              value={formatDateVi(new Date('2026-08-16'))}
            />
            <CompactField icon={Users} label="Khách/phòng" value="2 khách, 1 phòng" />
            <button
              className="rounded-tv bg-tv-orange px-5 py-3 text-sm font-bold text-white transition hover:bg-tv-orange-dark"
              type="submit"
            >
              Tìm kiếm
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function CompactField({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-tv border border-tv-border bg-white px-4 py-3">
      <Icon size={18} className="shrink-0 text-tv-blue" aria-hidden="true" />
      <span className="min-w-0">
        <span className="block text-xs font-bold text-tv-ink-3">{label}</span>
        <span className="mt-1 block truncate font-bold">{value}</span>
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Results toolbar
// ---------------------------------------------------------------------------

export function ResultsToolbar({
  count,
  keyword,
  sort,
  onSortChange,
}: {
  count: number;
  keyword: string;
  sort: string;
  onSortChange: (value: string) => void;
}) {
  return (
    <div className="rounded-tv border border-tv-border bg-white p-4 shadow-tv-card">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-tv-blue">
            Kết quả tìm kiếm
          </p>
          <h1 className="mt-1 text-2xl font-bold">
            {count} điểm đến{keyword ? ` cho "${keyword}"` : ''}
          </h1>
          <p className="mt-1 text-sm text-tv-ink-3">Dữ liệu thật từ hệ thống.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`rounded-full border px-3 py-2 text-xs font-bold ${
                sort === option.value
                  ? 'border-tv-blue bg-tv-blue-light text-tv-blue'
                  : 'border-tv-border bg-white text-tv-ink-3'
              }`}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Filter rail
// ---------------------------------------------------------------------------

export function FilterRail({
  selectedCategory,
  selectedSort,
  onCategoryToggle,
  onSortChange,
}: {
  selectedCategory: string;
  selectedSort: string;
  onCategoryToggle: (cat: string) => void;
  onSortChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <aside className="h-fit rounded-tv border border-tv-border bg-white shadow-tv-card lg:sticky lg:top-24">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-5 lg:pointer-events-none"
        type="button"
        aria-expanded={open}
      >
        <h2 className="text-xl font-bold">Bộ lọc</h2>
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="text-tv-blue" size={18} aria-hidden="true" />
          <ChevronDown
            size={18}
            className={`text-tv-ink-3 transition-transform lg:hidden ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </span>
      </button>

      <div className={`border-t border-tv-border px-5 pb-5 ${open ? 'block' : 'hidden lg:block'}`}>
        <div className="mt-5">
          <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-tv-ink-3">
            Phong cách
          </h3>
          <div className="mt-3 grid gap-2">
            {categoryOptions.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onCategoryToggle(cat)}
                  className={`flex items-center justify-between rounded-tv-sm border px-3 py-2 text-sm font-bold transition text-left ${
                    active
                      ? 'border-tv-blue bg-tv-blue-light text-tv-blue'
                      : 'border-tv-border bg-white text-tv-ink-3 hover:border-tv-blue hover:text-tv-blue'
                  }`}
                  type="button"
                >
                  <span>{cat}</span>
                  {active ? <CheckCircle2 size={16} aria-hidden="true" /> : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 rounded-tv bg-tv-bg p-4">
          <div className="flex items-center gap-2 text-sm font-bold">
            <WalletCards size={17} className="text-tv-blue" aria-hidden="true" />
            Sắp xếp
          </div>
          <div className="mt-3 grid gap-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={`rounded-tv-sm border px-3 py-2 text-xs font-bold text-left transition ${
                  selectedSort === option.value
                    ? 'border-tv-blue bg-tv-blue-light text-tv-blue'
                    : 'border-tv-border bg-white text-tv-ink-3 hover:border-tv-blue'
                }`}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Search result card
// ---------------------------------------------------------------------------

export function SearchResultCard({ destination }: { destination: Destination }) {
  const imgSrc = destination.imageUrl ?? getDestinationImage(destination.slug);
  return (
    <article className="grid overflow-hidden rounded-tv border border-tv-border bg-white shadow-tv-card md:grid-cols-[220px_minmax(0,1fr)_210px]">
      <Link
        href={`/destinations/${destination.slug}`}
        className="min-h-[210px] bg-cover bg-center"
        style={{ backgroundImage: `url(${imgSrc})` }}
        aria-label={`Xem chi tiết ${destination.name}`}
      />
      <div className="min-w-0 p-5">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full bg-tv-blue-light px-3 py-1 font-bold text-tv-blue">
            {getCountryName(destination)}
          </span>
          {destination.ratingAvg != null && (
            <span className="inline-flex items-center gap-1 font-bold text-[#b45309]">
              <Star size={15} fill="currentColor" aria-hidden="true" />
              {destination.ratingAvg.toFixed(1)}
            </span>
          )}
          {destination.reviewCount != null && (
            <span className="text-tv-ink-3">({destination.reviewCount} đánh giá)</span>
          )}
        </div>
        <Link
          href={`/destinations/${destination.slug}`}
          className="mt-3 block text-2xl font-bold hover:text-tv-blue"
        >
          {destination.name}
        </Link>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-tv-ink-3">
          {destination.shortDescription ?? destination.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-tv-ink-3">
          <Amenity icon={Hotel} label="Nơi ở" />
          {destination.city && <Amenity icon={MapPin} label={getCityName(destination) ?? ''} />}
          {destination.category && <Amenity icon={Coffee} label={destination.category} />}
          <Amenity icon={ShieldCheck} label="An toàn" />
          <Amenity icon={Wifi} label="Gói offline" />
        </div>
      </div>
      <aside className="flex flex-col justify-between border-t border-tv-border bg-tv-bg p-5 md:border-l md:border-t-0">
        <div>
          <p className="text-xs font-bold text-tv-ink-3">Khám phá</p>
          <p className="mt-1 text-2xl font-bold text-tv-orange">
            {getCityName(destination) ?? getCountryName(destination)}
          </p>
          <p className="mt-1 text-xs font-bold text-tv-ink-3">
            {destination.bestTimeToVisit ?? 'Quanh năm'}
          </p>
          <p className="mt-4 rounded-full bg-[#fff3e8] px-3 py-1 text-center text-xs font-bold text-[#b45309]">
            Chỉ thanh toán demo
          </p>
        </div>
        <div className="mt-5 grid gap-2">
          <Link
            href={`/destinations/${destination.slug}`}
            className="inline-flex items-center justify-center gap-2 rounded-tv-sm bg-tv-orange px-4 py-3 text-sm font-bold text-white hover:bg-tv-orange-dark"
          >
            Xem chi tiết
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link
            href={`/ai-planner?destination=${destination.slug}`}
            className="inline-flex items-center justify-center gap-2 rounded-tv-sm border border-tv-border bg-white px-4 py-3 text-sm font-bold text-tv-blue hover:bg-tv-blue-light"
          >
            Lập lịch trình thông minh
            <Sparkles size={16} aria-hidden="true" />
          </Link>
        </div>
      </aside>
    </article>
  );
}

function Amenity({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-tv-bg px-3 py-1">
      <Icon size={14} className="text-tv-blue" aria-hidden="true" />
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className="inline-flex items-center gap-1 rounded-tv-sm border border-tv-border bg-white px-4 py-2 text-sm font-bold text-tv-blue disabled:opacity-40 hover:bg-tv-blue-light"
        type="button"
        aria-label="Trang trước"
      >
        <ChevronLeft size={16} aria-hidden="true" />
        Trước
      </button>

      <div className="flex gap-1">
        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
          const pageNum = totalPages <= 7 ? i : Math.max(0, Math.min(page - 3, totalPages - 7)) + i;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`h-9 w-9 rounded-tv-sm text-sm font-bold transition ${
                pageNum === page
                  ? 'bg-tv-blue text-white'
                  : 'border border-tv-border bg-white text-tv-ink-3 hover:bg-tv-blue-light'
              }`}
              type="button"
              aria-label={`Trang ${pageNum + 1}`}
              aria-current={pageNum === page ? 'page' : undefined}
            >
              {pageNum + 1}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
        className="inline-flex items-center gap-1 rounded-tv-sm border border-tv-border bg-white px-4 py-2 text-sm font-bold text-tv-blue disabled:opacity-40 hover:bg-tv-blue-light"
        type="button"
        aria-label="Trang sau"
      >
        Sau
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Trip side panel
// ---------------------------------------------------------------------------

export function TripSidePanel({ destination }: { destination: Destination }) {
  return (
    <aside className="h-fit rounded-tv border border-tv-border bg-white p-5 shadow-tv-card lg:sticky lg:top-24">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-tv-blue">
        Tóm tắt chuyến đi
      </p>
      <h2 className="mt-2 text-2xl font-bold">{destination.name}</h2>
      <div className="mt-5 space-y-3 text-sm">
        <CartRow label="Quốc gia" value={getCountryName(destination)} />
        {getCityName(destination) && (
          <CartRow label="Thành phố" value={getCityName(destination)!} />
        )}
        {destination.bestTimeToVisit && (
          <CartRow label="Mùa đẹp" value={destination.bestTimeToVisit} />
        )}
        {destination.ratingAvg != null && (
          <CartRow label="Đánh giá" value={`${destination.ratingAvg.toFixed(1)} / 5`} />
        )}
      </div>
      {destination.shortDescription && (
        <div className="mt-5 rounded-tv bg-tv-bg p-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-tv-ink-3">Mô tả ngắn</p>
          <p className="mt-2 text-sm leading-6 text-[#34566f]">{destination.shortDescription}</p>
        </div>
      )}
      <Link
        href={`/destinations/${destination.slug}`}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-tv-sm bg-tv-blue px-4 py-3 text-sm font-bold text-white hover:bg-tv-blue-dark"
      >
        Xem chi tiết
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
      <p className="mt-3 text-center text-xs font-bold text-[#b45309]">{demoPaymentWarning}</p>
    </aside>
  );
}

function CartRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-tv-border pb-3">
      <span className="font-bold text-tv-ink-3">{label}</span>
      <span className="text-right font-bold">{value}</span>
    </div>
  );
}
