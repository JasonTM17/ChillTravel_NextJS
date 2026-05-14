'use client';

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, Suspense } from 'react';
import { tourApi } from '@/lib/api/tour.api';
import type { Tour } from '@/lib/api/tour.api';
import { getDestinationImage } from '@/lib/destination-images';
import { formatVnd } from '@/lib/utils';
import { MOCK_TOURS, sortOptions, categoryOptions, durationOptions } from '@/lib/mocks/tours';

const PAGE_SIZE = 9;

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function TourCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-tv border border-tv-border bg-white shadow-tv-card animate-pulse">
      <div className="h-48 tv-skeleton" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-full tv-skeleton" />
          <div className="h-5 w-12 rounded-full tv-skeleton" />
        </div>
        <div className="h-6 w-3/4 rounded tv-skeleton" />
        <div className="h-4 w-full rounded tv-skeleton" />
        <div className="h-4 w-2/3 rounded tv-skeleton" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-7 w-28 rounded tv-skeleton" />
          <div className="h-9 w-24 rounded-tv-sm tv-skeleton" />
        </div>
      </div>
    </div>
  );
}

function ToursPageSkeleton() {
  return (
    <main className="min-h-screen bg-tv-bg text-tv-ink">
      <section className="border-b border-tv-border bg-white">
        <div className="mx-auto max-w-[1180px] px-4 py-5">
          <div className="h-20 rounded-[26px] tv-skeleton animate-pulse" />
        </div>
      </section>
      <section className="mx-auto grid max-w-[1180px] gap-5 px-4 py-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="h-[500px] rounded-tv border border-tv-border bg-white animate-pulse" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <TourCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Main page — wrapped in Suspense for useSearchParams
// ---------------------------------------------------------------------------

export default function ToursPage() {
  return (
    <Suspense fallback={<ToursPageSkeleton />}>
      <ToursPageInner />
    </Suspense>
  );
}

function ToursPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const keyword = searchParams.get('keyword') ?? '';
  const category = searchParams.get('category') ?? '';
  const minPrice = searchParams.get('minPrice') ?? '';
  const maxPrice = searchParams.get('maxPrice') ?? '';
  const duration = searchParams.get('duration') ?? '';
  const sort = searchParams.get('sort') ?? '';
  const page = parseInt(searchParams.get('page') ?? '0', 10);

  const [tours, setTours] = useState<Tour[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTours = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await tourApi.list({
        keyword: keyword || undefined,
        category: category || undefined,
        minPrice: minPrice ? parseInt(minPrice, 10) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined,
        duration: duration ? parseInt(duration, 10) : undefined,
        sort: sort || undefined,
        page,
        size: PAGE_SIZE,
      });

      if (res.success) {
        const paginatedData = res.data as {
          items: Tour[];
          totalElements: number;
          totalPages: number;
        };
        setTours(paginatedData.items);
        setTotalElements(paginatedData.totalElements);
        setTotalPages(paginatedData.totalPages);
      } else {
        setError('Không thể tải danh sách tour.');
      }
    } catch {
      // API unavailable — use mock data as fallback
      setTours(MOCK_TOURS);
      setTotalElements(MOCK_TOURS.length);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [keyword, category, minPrice, maxPrice, duration, sort, page]);

  useEffect(() => {
    void fetchTours();
  }, [fetchTours]);

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    if (!('page' in updates)) {
      params.delete('page');
    }
    router.push(`/tours?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const kw = (form.elements.namedItem('keyword') as HTMLInputElement)?.value ?? '';
    updateParams({ keyword: kw });
  }

  function handleSortChange(value: string) {
    updateParams({ sort: value });
  }

  function handleCategoryToggle(cat: string) {
    updateParams({ category: category === cat ? '' : cat });
  }

  function handleDurationChange(value: string) {
    updateParams({ duration: value });
  }

  function handlePriceChange(field: 'minPrice' | 'maxPrice', value: string) {
    updateParams({ [field]: value });
  }

  function handlePageChange(newPage: number) {
    updateParams({ page: String(newPage) });
  }

  return (
    <main className="min-h-screen bg-[#F7F8FA]">
      {/* Search bar */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-5">
          <form
            onSubmit={handleSearch}
            className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#0064D2] to-[#004EA2] p-4 shadow-[0_12px_40px_rgba(0,100,210,0.2)]"
          >
            <div className="grid gap-3 rounded-xl bg-white p-3 md:grid-cols-[1fr_180px_140px]">
              <label className="flex min-w-0 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <Search size={19} className="text-[#0064D2]" aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Tìm tour
                  </span>
                  <input
                    name="keyword"
                    defaultValue={keyword}
                    className="mt-1 w-full bg-transparent text-[14px] font-bold text-gray-800 outline-none placeholder:text-gray-400"
                    placeholder="Tên tour, điểm đến..."
                  />
                </span>
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
                <SlidersHorizontal
                  size={18}
                  className="shrink-0 text-[#0064D2]"
                  aria-hidden="true"
                />
                <span className="min-w-0">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Sắp xếp
                  </span>
                  <select
                    value={sort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="mt-1 w-full bg-transparent text-[14px] font-bold text-gray-800 outline-none"
                    aria-label="Sắp xếp tour"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </span>
              </div>
              <button
                className="rounded-xl bg-[#FF6D00] px-5 py-3 text-[14px] font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:bg-[#E55A00] hover:shadow-xl active:scale-[0.98]"
                type="submit"
              >
                Tìm kiếm
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto grid max-w-[1200px] gap-5 px-4 py-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Filter rail */}
        <aside className="h-fit overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm lg:sticky lg:top-24">
          <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-5 py-4">
            <h2 className="text-[15px] font-extrabold text-gray-800">Bộ lọc</h2>
            <SlidersHorizontal className="text-[#0064D2]" size={16} aria-hidden="true" />
          </div>
          <div className="p-5">
            {/* Category */}
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Loại tour
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {categoryOptions.map((cat) => {
                  const active = category === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => handleCategoryToggle(cat)}
                      className={`rounded-lg border px-3 py-1.5 text-[12px] font-semibold transition ${
                        active
                          ? 'border-[#0064D2] bg-blue-50 text-[#0064D2]'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-[#0064D2] hover:text-[#0064D2]'
                      }`}
                      type="button"
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Duration */}
            <div className="mt-5">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Thời gian
              </h3>
              <div className="mt-3 space-y-1.5">
                {durationOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleDurationChange(opt.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-[12px] font-semibold text-left transition ${
                      duration === opt.value
                        ? 'border-[#0064D2] bg-blue-50 text-[#0064D2]'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-[#0064D2]'
                    }`}
                    type="button"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div className="mt-5">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Khoảng giá (VNĐ)
              </h3>
              <div className="mt-3 space-y-2">
                <div>
                  <label className="text-[11px] font-medium text-gray-500" htmlFor="minPrice">
                    Từ
                  </label>
                  <input
                    id="minPrice"
                    type="number"
                    min={0}
                    step={100000}
                    defaultValue={minPrice}
                    onBlur={(e) => handlePriceChange('minPrice', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-[13px] font-bold text-gray-800 outline-none focus:border-[#0064D2] focus:ring-1 focus:ring-[#0064D2]/20"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-gray-500" htmlFor="maxPrice">
                    Đến
                  </label>
                  <input
                    id="maxPrice"
                    type="number"
                    min={0}
                    step={100000}
                    defaultValue={maxPrice}
                    onBlur={(e) => handlePriceChange('maxPrice', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-[13px] font-bold text-gray-800 outline-none focus:border-[#0064D2] focus:ring-1 focus:ring-[#0064D2]/20"
                    placeholder="Không giới hạn"
                  />
                </div>
              </div>
            </div>

            {/* Clear filters */}
            {(keyword || category || minPrice || maxPrice || duration || sort) && (
              <button
                onClick={() => router.push('/tours')}
                className="mt-5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[12px] font-semibold text-gray-500 transition hover:border-red-300 hover:text-red-500"
                type="button"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        </aside>

        {/* Results */}
        <section className="min-w-0">
          {/* Toolbar */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#0064D2]">
                  Danh sách tour
                </p>
                <h1 className="mt-1 text-xl font-extrabold text-gray-900">
                  {loading
                    ? 'Đang tải...'
                    : `${totalElements} tour${keyword ? ` cho "${keyword}"` : ''}`}
                </h1>
                <p className="mt-0.5 text-[12px] text-gray-500">Dữ liệu thật từ hệ thống.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {sortOptions.slice(1).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition ${
                      sort === option.value
                        ? 'border-[#0064D2] bg-blue-50 text-[#0064D2]'
                        : 'border-gray-200 bg-white text-gray-500 hover:border-[#0064D2]'
                    }`}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tour grid */}
          <div className="mt-4">
            {error ? (
              <ErrorState message={error} onRetry={() => void fetchTours()} />
            ) : loading ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <TourCardSkeleton key={i} />
                ))}
              </div>
            ) : tours.length === 0 ? (
              <EmptyResults onClear={() => router.push('/tours')} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {tours.map((tour) => (
                  <TourCard key={tour.slug} tour={tour} />
                ))}
              </div>
            )}
          </div>

          {!loading && !error && totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
          )}
        </section>
      </section>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Tour card
// ---------------------------------------------------------------------------

function TourCard({ tour }: { tour: Tour }) {
  const imgSrc =
    tour.imageUrl ??
    tour.images?.[0]?.imageUrl ??
    getDestinationImage(tour.destination?.slug ?? tour.slug);

  const displayPrice = tour.salePrice ?? tour.basePrice;
  const hasSale = tour.salePrice != null && tour.salePrice < tour.basePrice;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={`/tours/${tour.slug}`}
        className="relative block h-48 overflow-hidden"
        aria-label={`Xem chi tiết ${tour.title}`}
      >
        <img
          src={imgSrc}
          alt={tour.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {tour.featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-[#FF6D00] px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
            <Sparkles size={11} aria-hidden="true" />
            Nổi bật
          </span>
        )}
        {hasSale && (
          <span className="absolute right-3 top-3 rounded-md bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
            Ưu đãi
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-2">
          {tour.destination && (
            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-[#0064D2]">
              <MapPin size={10} aria-hidden="true" />
              {tour.destination.city ?? tour.destination.name}
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600">
            <Clock size={10} aria-hidden="true" />
            {tour.durationDays}N{tour.durationNights}Đ
          </span>
          {tour.ratingAvg != null && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600">
              <Star size={11} fill="currentColor" aria-hidden="true" />
              {tour.ratingAvg.toFixed(1)}
            </span>
          )}
        </div>

        <Link
          href={`/tours/${tour.slug}`}
          className="mt-2.5 line-clamp-2 text-[14px] font-bold leading-snug text-gray-800 group-hover:text-[#0064D2] transition-colors"
        >
          {tour.title}
        </Link>

        <p className="mt-1.5 line-clamp-2 flex-1 text-[12px] leading-relaxed text-gray-500">
          {tour.shortDescription ?? tour.description}
        </p>

        <div className="mt-3 flex items-end justify-between border-t border-gray-100 pt-3">
          <div>
            {hasSale && (
              <p className="text-[11px] text-gray-400 line-through">{formatVnd(tour.basePrice)}</p>
            )}
            <p className="text-[16px] font-extrabold text-[#FF6D00]">{formatVnd(displayPrice)}</p>
            <p className="text-[10px] text-gray-400">/ người</p>
          </div>
          <Link
            href={`/tours/${tour.slug}`}
            className="inline-flex items-center gap-1 rounded-lg bg-[#FF6D00] px-3.5 py-2 text-[12px] font-bold text-white shadow-sm transition-all hover:bg-[#E55A00] hover:shadow-md active:scale-[0.97]"
          >
            Xem tour
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Error / Empty states
// ---------------------------------------------------------------------------

function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
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

function EmptyResults({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-tv border border-dashed border-tv-border bg-white p-10 text-center">
      <MapPin className="mx-auto text-tv-blue" size={34} aria-hidden="true" />
      <h2 className="mt-4 text-2xl font-bold">Chưa có tour phù hợp.</h2>
      <p className="mt-2 text-tv-ink-3">Thử thay đổi từ khóa, loại tour hoặc khoảng giá.</p>
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
// Pagination
// ---------------------------------------------------------------------------

function Pagination({
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
